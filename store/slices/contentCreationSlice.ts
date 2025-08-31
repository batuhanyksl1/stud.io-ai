import { auth } from "@/firebase.auth.config";
import { storage } from "@/firebase.config";
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

export const getAiToolStatus = createAsyncThunk<
  { status?: string; [k: string]: any },
  { requestId: string },
  { rejectValue: string }
>(
  "contentCreation/getAiToolStatus",
  async ({ requestId }, { rejectWithValue }) => {
    try {
      const FAL_KEY = process.env.EXPO_PUBLIC_FAL_KEY || "YOUR_FAL_KEY";
      const res = await fetch(
        `https://queue.fal.run/fal-ai/flux-pro/requests/${requestId}/status`,
        {
          method: "GET",
          headers: {
            Authorization: `Key ${FAL_KEY}`,
          },
        },
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Fal status failed: ${res.status} ${text}`);
      }
      const data = (await res.json()) as any;
      return data;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown AI poll error",
      );
    }
  },
);

// New thunk: checkAIToolStatus (poll job status)
export const getAiToolResult = createAsyncThunk<
  { status?: string; [k: string]: any },
  { requestId: string },
  { rejectValue: string }
>(
  "contentCreation/getAiToolResult",
  async ({ requestId }, { rejectWithValue }) => {
    try {
      const FAL_KEY = process.env.EXPO_PUBLIC_FAL_KEY || "YOUR_FAL_KEY";
      const res = await fetch(`https://queue.fal.run/requests/${requestId}`, {
        method: "GET",
        headers: {
          Authorization: `Key ${FAL_KEY}`,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Fal status failed: ${res.status} ${text}`);
      }
      const data = (await res.json()) as any;
      return data as { status?: string; [k: string]: any };
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown AI status error",
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
        state.status = "fulfilled";
        state.requestId = action.payload.request_id || null;
        console.log("🆔 Request ID:", state.requestId);
      })
      .addCase(uploadImageToAITool.rejected, (state, action) => {
        state.error = action.payload as string;
        state.aiToolProcessingStatus = "failed";
        state.status = "failed";
        state.createdImageUrl = null;
        state.imageStorageUrl = null;
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
