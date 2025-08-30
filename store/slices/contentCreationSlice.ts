import { auth } from "@/firebase.auth.config";
import { storage } from "@/firebase.config";
import { fal } from "@fal-ai/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

fal.config({
  credentials: "YOUR_FAL_KEY",
});
// --- Types for AI tool payloads ---
type FalImageItem = { url?: string };
type FalResultData = { images?: FalImageItem[] } & Record<string, unknown>;

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

export const uploadImageToAITool = createAsyncThunk<
  FalResultData,
  { imageUrl: string; prompt: string },
  { rejectValue: string }
>(
  "contentCreation/uploadImageToAITool",
  async (
    { imageUrl, prompt }: { imageUrl: string; prompt: string },
    { rejectWithValue },
  ) => {
    try {
      console.log("🚀 AI Tool işlemi başlatılıyor...");
      console.log("📝 Prompt:", prompt);
      console.log("🖼️ Image URL:", imageUrl);

      const result = await fal.subscribe("fal-ai/flux-pro/kontext", {
        input: {
          prompt: prompt,
          image_url: imageUrl,
          guidance_scale: 3.5,
          num_images: 1,
          output_format: "jpeg",
          safety_tolerance: "2",
        },
        logs: true,
        onQueueUpdate: (update) => {
          console.log("📊 Queue durumu:", update.status);
          if (update.status === "IN_PROGRESS") {
            console.log("⚙️ İşlem devam ediyor...");
            update.logs
              .map((log) => {
                console.log("📋 AI Log:", log.message);
                return log.message;
              })
              .forEach(console.log);
          } else if (update.status === "COMPLETED") {
            console.log("✅ İşlem tamamlandı!");
          }
        },
      });

      console.log("🎉 AI Tool işlemi başarıyla tamamlandı!");
      console.log("📊 Sonuç verisi:", result.data);
      console.log("🆔 Request ID:", result.requestId);

      if (result.data?.images?.[0]?.url) {
        console.log("🖼️ Oluşturulan resim URL:", result.data.images[0].url);
      }

      return result.data as FalResultData;
    } catch (error) {
      console.error("💥 AI Tool işlemi hatası:", error);
      console.error("🔍 Hata detayları:", {
        message: error instanceof Error ? error.message : "Bilinmeyen hata",
        stack: error instanceof Error ? error.stack : undefined,
        error: error,
      });
      return rejectWithValue(error as string);
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
        console.log(
          "🖼️ Oluşturulan resim URL:",
          action.payload.images?.[0]?.url,
        );
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
