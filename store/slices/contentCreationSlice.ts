import { auth } from "@/firebase.auth.config";
import { storage } from "@/firebase.config";
import { AiToolResult } from "@/types";
import { fal } from "@fal-ai/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

fal.config({
  credentials: "YOUR_FAL_KEY",
});

// Types
export interface ContentCreationState {
  createdImageUrl: string | null;
  imageStorageUrl: string | null;
  storageUploadProcessingStatus: "idle" | "pending" | "fulfilled" | "failed";
  aiToolProcessingStatus: "idle" | "pending" | "fulfilled" | "failed";
  pollAiToolStatus: "idle" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  error: string | null;
  pathPrefix: string;
  status: "idle" | "pending" | "fulfilled" | "failed";
  activityIndicatorColor: string;
  requestId: string | null;
}

const initialState: ContentCreationState = {
  createdImageUrl: null,
  imageStorageUrl: null,
  storageUploadProcessingStatus: "idle",
  aiToolProcessingStatus: "idle",
  pollAiToolStatus: "idle",
  error: null,
  pathPrefix: "uploads",
  status: "idle",
  activityIndicatorColor: "#000000",
  requestId: null,
};

// Async thunks for image operations

export const uploadImageToStorage = createAsyncThunk<
  string,
  { fileUri: string },
  { rejectValue: string }
>(
  "contentCreation/uploadImageToStorage",
  async ({ fileUri }: { fileUri: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const rawName = fileUri.split("/").pop() || `file-${Date.now()}`;
      const ext = rawName.includes(".") ? rawName.split(".").pop() : "jpg";
      const fileName = `${Date.now()}.${ext}`;

      const reference = ref(
        storage,
        `${initialState.pathPrefix}/${auth.currentUser?.uid}/${fileName}`,
      );

      const task = uploadBytesResumable(reference, blob);

      await new Promise<void>((resolve, reject) => {
        task.on(
          "state_changed",
          undefined,
          (err) => reject(err),
          () => resolve(),
        );
      });

      const downloadURL = await getDownloadURL(reference);
      return downloadURL;
    } catch (error) {
      console.error("Storage upload error:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown storage error",
      );
    }
  },
);

// New thunk: startAIToolJob (enqueue job without waiting)
export const uploadImageToAITool = createAsyncThunk<
  { request_id?: string; status?: string; [k: string]: any },
  { imageUrl: string; prompt: string },
  { rejectValue: string }
>(
  "contentCreation/startAIToolJob",
  async ({ imageUrl, prompt }, { rejectWithValue }) => {
    try {
      const FAL_KEY = process.env.EXPO_PUBLIC_FAL_KEY || "YOUR_FAL_KEY";
      const res = await fetch("https://queue.fal.run/fal-ai/flux-pro/kontext", {
        method: "POST",
        headers: {
          Authorization: `Key ${FAL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          image_url: imageUrl,
          guidance_scale: 3.5,
          num_images: 1,
          output_format: "jpeg",
          safety_tolerance: "2",
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Fal queue start failed: ${res.status} ${text}`);
      }
      const data = (await res.json()) as any;
      // Some responses might already include images if synchronous; pass through.
      return data;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown AI enqueue error",
      );
    }
  },
);

// New thunk: poll AI tool status until completed
export const pollAiToolStatus = createAsyncThunk<
  AiToolResult,
  { requestId: string; maxAttempts?: number; intervalMs?: number }
>(
  "contentCreation/pollAiToolStatus",
  async (
    { requestId, maxAttempts = 60, intervalMs = 60000 },
    { rejectWithValue },
  ) => {
    try {
      const FAL_KEY = process.env.EXPO_PUBLIC_FAL_KEY || "YOUR_FAL_KEY";

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Check status
        const statusRes = await fetch(
          `https://queue.fal.run/fal-ai/flux-pro/requests/${requestId}/status`,
          {
            method: "GET",
            headers: {
              Authorization: `Key ${FAL_KEY}`,
            },
          },
        );

        if (!statusRes.ok) {
          const text = await statusRes.text();
          throw new Error(`Fal status failed: ${statusRes.status} ${text}`);
        }

        const statusData = (await statusRes.json()) as any;
        console.log(
          `🔄 Polling attempt ${attempt + 1}/${maxAttempts}, status:`,
          statusData.status,
        );

        // If completed, get the result
        if (statusData.status === "COMPLETED") {
          const resultRes = await fetch(
            `https://queue.fal.run/fal-ai/flux-pro/requests/${requestId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Key ${FAL_KEY}`,
              },
            },
          );

          if (!resultRes.ok) {
            const text = await resultRes.text();
            throw new Error(`Fal result failed: ${resultRes.status} ${text}`);
          }

          const resultData = (await resultRes.json()) as AiToolResult;
          console.log("✅ AI Tool completed, result:", resultData);
          return resultData;
        }

        // If failed, throw error
        if (statusData.status === "FAILED") {
          throw new Error(
            `AI Tool failed: ${statusData.error || "Unknown error"}`,
          );
        }

        // Wait before next attempt (except for last attempt)
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }
      }

      throw new Error(`AI Tool polling timeout after ${maxAttempts} attempts`);
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown AI polling error",
      );
    }
  },
);

// Slice
const contentCreationSlice = createSlice({
  name: "contentCreation",
  initialState,
  reducers: {
    setCreatedImageUrl: (state, action: PayloadAction<string | null>) => {
      state.createdImageUrl = action.payload;
    },
    setActivityIndicatorColor: (state, action: PayloadAction<string>) => {
      state.activityIndicatorColor = action.payload;
    },
    setStorageUploadProcessingStatus: (
      state,
      action: PayloadAction<"idle" | "pending" | "fulfilled" | "failed">,
    ) => {
      state.storageUploadProcessingStatus = action.payload;
    },
    setAiToolProcessingStatus: (
      state,
      action: PayloadAction<"idle" | "pending" | "fulfilled" | "failed">,
    ) => {
      state.aiToolProcessingStatus = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAllImages: (state) => {
      state.imageStorageUrl = null;
      state.createdImageUrl = null;
      state.error = null;
      state.storageUploadProcessingStatus = "idle";
      state.aiToolProcessingStatus = "idle";
      state.status = "idle";
    },
    setImageStorageUrl: (state, action: PayloadAction<string | null>) => {
      state.imageStorageUrl = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Upload Image to Storage
    builder
      .addCase(uploadImageToStorage.pending, (state) => {
        state.storageUploadProcessingStatus = "pending";
        state.error = null;
        state.status = "pending";
      })
      .addCase(uploadImageToStorage.fulfilled, (state, action) => {
        state.imageStorageUrl = action.payload; // payload is the download URL (string)
        state.storageUploadProcessingStatus = "fulfilled";
        state.error = null;
        state.status = "pending";
      })
      .addCase(uploadImageToStorage.rejected, (state, action) => {
        state.imageStorageUrl = null;
        state.error = action.payload as string;
        state.storageUploadProcessingStatus = "failed";
        state.status = "failed";
      })
      // Upload Image to AI Tool
      .addCase(uploadImageToAITool.pending, (state) => {
        state.aiToolProcessingStatus = "pending";
        state.error = null;
        state.status = "pending";
      })
      .addCase(uploadImageToAITool.fulfilled, (state, action) => {
        state.aiToolProcessingStatus = "fulfilled";
        state.error = null;
        state.createdImageUrl = action.payload.images?.[0]?.url || null;
        state.requestId = action.payload.request_id || null;
        console.log("🆔 Request ID:", state.requestId);
      })
      .addCase(uploadImageToAITool.rejected, (state, action) => {
        state.error = action.payload as string;
        state.aiToolProcessingStatus = "failed";
        state.status = "failed";
        state.createdImageUrl = null;
        state.imageStorageUrl = null;
      })
      // Poll AI Tool Status
      .addCase(pollAiToolStatus.pending, (state) => {
        state.pollAiToolStatus = "IN_PROGRESS";
      })
      .addCase(pollAiToolStatus.fulfilled, (state, action) => {
        state.pollAiToolStatus = "COMPLETED";
        state.status = "fulfilled";
        state.createdImageUrl = action.payload.images?.[0]?.url || null;
      })
      .addCase(pollAiToolStatus.rejected, (state, action) => {
        state.pollAiToolStatus = "FAILED";
        state.status = "failed";
        state.createdImageUrl = null;
        state.imageStorageUrl = null;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCreatedImageUrl,
  clearError,
  clearAllImages,
  setStorageUploadProcessingStatus,
  setAiToolProcessingStatus,
  setActivityIndicatorColor,
  setImageStorageUrl,
} = contentCreationSlice.actions;

export default contentCreationSlice.reducer;
