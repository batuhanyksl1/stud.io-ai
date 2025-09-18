import { auth, storage } from "@/firebase.config";
import { AiToolResult } from "@/types";
import { fal } from "@fal-ai/client";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    console.log("📤 uploadImageToStorage - başladı");
    console.log("📤 uploadImageToStorage - fileUri:", fileUri);

    try {
      const rawName = fileUri.split("/").pop() || `file-${Date.now()}`;
      const ext = rawName.includes(".") ? rawName.split(".").pop() : "jpg";
      const fileName = `${Date.now()}.${ext}`;

      console.log("📤 uploadImageToStorage - rawName:", rawName);
      console.log("📤 uploadImageToStorage - ext:", ext);
      console.log("📤 uploadImageToStorage - fileName:", fileName);

      const currentUser = auth().currentUser;
      console.log("📤 uploadImageToStorage - currentUser:", currentUser?.uid);

      const reference = storage().ref(
        `${initialState.pathPrefix}/${currentUser?.uid}/${fileName}`,
      );

      console.log(
        "📤 uploadImageToStorage - reference path:",
        `${initialState.pathPrefix}/${currentUser?.uid}/${fileName}`,
      );

      // Ensure we pass a valid local path to RNFirebase Storage
      // RNFirebase expects a file system path (without the file:// scheme)
      const pathToFile = fileUri.startsWith("file://")
        ? fileUri.replace("file://", "")
        : fileUri;

      console.log("📤 uploadImageToStorage - pathToFile:", pathToFile);

      // Upload the file from local storage
      console.log("📤 uploadImageToStorage - dosya yükleniyor...");
      const task = reference.putFile(pathToFile);

      // Optionally, track progress with task.on('state_changed', ...)
      await task;
      console.log("📤 uploadImageToStorage - dosya yükleme tamamlandı");

      // Retrieve the public download URL
      console.log("📤 uploadImageToStorage - download URL alınıyor...");
      const downloadURL = await reference.getDownloadURL();
      console.log("📤 uploadImageToStorage - downloadURL:", downloadURL);

      return downloadURL;
    } catch (error) {
      console.error("❌ uploadImageToStorage - hata:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown storage error",
      );
    }
  },
);

// New thunk: startAIToolJob (enqueue job without waiting)
export const uploadImageToAITool = createAsyncThunk<
  {
    request_id?: string;
    status?: string;
    [k: string]: any;
    aiToolRequest: string;
    requestId: string;
  },
  {
    imageUrl: string;
    prompt: string;
    aiToolRequest: string;
    requestId: string;
  },
  { rejectValue: string }
>(
  "contentCreation/startAIToolJob",
  async (
    { imageUrl, prompt, aiToolRequest, requestId },
    { rejectWithValue },
  ) => {
    console.log("🤖 uploadImageToAITool - başladı");
    console.log("🤖 uploadImageToAITool - imageUrl:", imageUrl);
    console.log("🤖 uploadImageToAITool - prompt:", prompt);
    console.log("🤖 uploadImageToAITool - aiToolRequest:", aiToolRequest);
    console.log("🤖 uploadImageToAITool - requestId:", requestId);

    try {
      const FAL_KEY = process.env.EXPO_PUBLIC_FAL_KEY || "YOUR_FAL_KEY";
      console.log("🤖 uploadImageToAITool - FAL_KEY var mı:", !!FAL_KEY);

      const requestUrl = aiToolRequest.replace("${requestId}", requestId);
      console.log("🤖 uploadImageToAITool - requestUrl:", requestUrl);

      const requestBody = {
        prompt,
        image_urls: [imageUrl], // API image_urls (çoğul) bekliyor
        guidance_scale: 3.5,
        num_images: 1,
        output_format: "jpeg",
        safety_tolerance: "2",
      };
      console.log("🤖 uploadImageToAITool - requestBody:", requestBody);

      const res = await fetch(requestUrl, {
        method: "POST",
        headers: {
          Authorization: `Key ${FAL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("🤖 uploadImageToAITool - response status:", res.status);
      console.log("🤖 uploadImageToAITool - response ok:", res.ok);

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ uploadImageToAITool - response error:", text);
        throw new Error(`Fal queue start failed: ${res.status} ${text}`);
      }

      const data = (await res.json()) as any;
      console.log("🤖 uploadImageToAITool - response data:", data);

      // Some responses might already include images if synchronous; pass through.
      return data;
    } catch (err) {
      console.error("❌ uploadImageToAITool - hata:", err);
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown AI enqueue error",
      );
    }
  },
);

// New thunk: poll AI tool status until completed
export const pollAiToolStatus = createAsyncThunk<
  AiToolResult,
  {
    requestId: string;
    maxAttempts?: number;
    intervalMs?: number;
    aiToolStatus: string;
    aiToolResult: string;
  }
>(
  "contentCreation/pollAiToolStatus",
  async (
    {
      requestId,
      maxAttempts = 60,
      intervalMs = 60000,
      aiToolStatus,
      aiToolResult,
    },
    { rejectWithValue },
  ) => {
    console.log("⏳ pollAiToolStatus - başladı");
    console.log("⏳ pollAiToolStatus - requestId:", requestId);
    console.log("⏳ pollAiToolStatus - maxAttempts:", maxAttempts);
    console.log("⏳ pollAiToolStatus - intervalMs:", intervalMs);
    console.log("⏳ pollAiToolStatus - aiToolStatus:", aiToolStatus);
    console.log("⏳ pollAiToolStatus - aiToolResult:", aiToolResult);

    try {
      const FAL_KEY = process.env.EXPO_PUBLIC_FAL_KEY || "YOUR_FAL_KEY";
      console.log("⏳ pollAiToolStatus - FAL_KEY var mı:", !!FAL_KEY);

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        console.log(
          `⏳ pollAiToolStatus - deneme ${attempt + 1}/${maxAttempts}`,
        );

        // Check status
        const statusUrl = aiToolStatus.replace("${requestId}", requestId);
        console.log("⏳ pollAiToolStatus - statusUrl:", statusUrl);

        const statusRes = await fetch(statusUrl, {
          method: "GET",
          headers: {
            Authorization: `Key ${FAL_KEY}`,
          },
        });

        console.log("⏳ pollAiToolStatus - statusRes.ok:", statusRes.ok);
        console.log(
          "⏳ pollAiToolStatus - statusRes.status:",
          statusRes.status,
        );

        if (!statusRes.ok) {
          const text = await statusRes.text();
          console.error("❌ pollAiToolStatus - status error:", text);
          throw new Error(`Fal status failed: ${statusRes.status} ${text}`);
        }

        const statusData = (await statusRes.json()) as any;
        console.log(
          `🔄 Polling attempt ${attempt + 1}/${maxAttempts}, status:`,
          statusData.status,
        );
        console.log("⏳ pollAiToolStatus - statusData:", statusData);

        // If completed, get the result
        if (statusData.status === "COMPLETED") {
          console.log(
            "✅ pollAiToolStatus - işlem tamamlandı, sonuç alınıyor...",
          );

          const resultUrl = aiToolResult.replace("${requestId}", requestId);
          console.log("⏳ pollAiToolStatus - resultUrl:", resultUrl);

          const resultRes = await fetch(resultUrl, {
            method: "GET",
            headers: {
              Authorization: `Key ${FAL_KEY}`,
            },
          });

          console.log("⏳ pollAiToolStatus - resultRes.ok:", resultRes.ok);
          console.log(
            "⏳ pollAiToolStatus - resultRes.status:",
            resultRes.status,
          );

          if (!resultRes.ok) {
            const text = await resultRes.text();
            console.error("❌ pollAiToolStatus - result error:", text);
            throw new Error(`Fal result failed: ${resultRes.status} ${text}`);
          }

          const resultData = (await resultRes.json()) as AiToolResult;
          console.log("✅ AI Tool completed, result:", resultData);
          return resultData;
        }

        // If failed, throw error
        if (statusData.status === "FAILED") {
          console.error(
            "❌ pollAiToolStatus - AI Tool başarısız:",
            statusData.error,
          );
          throw new Error(
            `AI Tool failed: ${statusData.error || "Unknown error"}`,
          );
        }

        // Wait before next attempt (except for last attempt)
        if (attempt < maxAttempts - 1) {
          console.log(`⏳ pollAiToolStatus - ${intervalMs}ms bekleniyor...`);
          await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }
      }

      console.error(
        `❌ pollAiToolStatus - timeout after ${maxAttempts} attempts`,
      );
      throw new Error(`AI Tool polling timeout after ${maxAttempts} attempts`);
    } catch (err) {
      console.error("❌ pollAiToolStatus - hata:", err);
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
