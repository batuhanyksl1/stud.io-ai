import { auth } from "@/firebase.auth.config";
import { storage } from "@/firebase.config";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// Types
export interface ContentCreationState {
  refImageUrl: string | null;
  createdImageUrl: string | null;
  storageUploadStatus:
    | "idle"
    | "uploadingToStorage"
    | "uploadedToStorage"
    | "uploadingToAITool"
    | "uploadedToAITool"
    | "processing"
    | "completed"
    | "failed";

  aiToolProcessingStatus:
    | "idle"
    | "uploadingToAITool"
    | "uploadedToAITool"
    | "processing"
    | "completed"
    | "failed";
  progress: number | null;
  error: string | null;
  pathPrefix: string;
}

const initialState: ContentCreationState = {
  refImageUrl: null,
  createdImageUrl: null,
  storageUploadStatus: "idle",
  aiToolProcessingStatus: "idle",
  progress: null,
  error: null,
  pathPrefix: "uploads",
};

// Async thunks for image operations

export const uploadImageToStorage = createAsyncThunk(
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
      return rejectWithValue(error as string);
    }
  },
);

// Slice
const contentCreationSlice = createSlice({
  name: "contentCreation",
  initialState,
  reducers: {
    setRefImageUrl: (state, action: PayloadAction<string | null>) => {
      state.refImageUrl = action.payload;
    },
    setCreatedImageUrl: (state, action: PayloadAction<string | null>) => {
      state.createdImageUrl = action.payload;
    },
    setStorageUploadStatus: (
      state,
      action: PayloadAction<
        | "idle"
        | "uploadingToStorage"
        | "uploadedToStorage"
        | "uploadingToAITool"
        | "uploadedToAITool"
        | "processing"
        | "completed"
        | "failed"
      >,
    ) => {
      state.storageUploadStatus = action.payload;
    },
    setAiToolProcessingStatus: (
      state,
      action: PayloadAction<
        | "idle"
        | "uploadingToAITool"
        | "uploadedToAITool"
        | "processing"
        | "completed"
        | "failed"
      >,
    ) => {
      state.aiToolProcessingStatus = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAllImages: (state) => {
      state.refImageUrl = null;
      state.createdImageUrl = null;
    },
  },
  extraReducers: (builder) => {
    // Upload Image
    builder
      .addCase(uploadImageToStorage.pending, (state) => {
        state.storageUploadStatus = "uploadingToStorage";
        state.progress = 0;
        state.error = null;
      })
      .addCase(uploadImageToStorage.fulfilled, (state, action) => {
        state.createdImageUrl = action.payload;
        state.storageUploadStatus = "uploadedToStorage";
        state.progress = 10;
        state.error = null;
      })
      .addCase(uploadImageToStorage.rejected, (state, action) => {
        state.error = action.payload as string;
        state.storageUploadStatus = "failed";
      });
  },
});

export const {
  setRefImageUrl,
  clearError,
  clearAllImages,
  setStorageUploadStatus,
  setAiToolProcessingStatus,
  setProgress,
  setError,
} = contentCreationSlice.actions;

export default contentCreationSlice.reducer;
