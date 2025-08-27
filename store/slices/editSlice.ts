import { storage } from "@/firebase.config";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as ImagePicker from "expo-image-picker";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Platform } from "react-native";

// Types
export interface EditImage {
  id: string;
  uri: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadProgress?: number;
  downloadURL?: string;
  isUploaded: boolean;
  isProcessing: boolean;
  processingResult?: any;
  error?: string;
  createdAt: Date;
}

export interface EditState {
  images: EditImage[];
  selectedImageId: string | null;
  isImagePickerOpen: boolean;
  isUploading: boolean;
  isProcessing: boolean;
  error: string | null;
  uploadProgress: number;
}

const initialState: EditState = {
  images: [],
  selectedImageId: null,
  isImagePickerOpen: false,
  isUploading: false,
  isProcessing: false,
  error: null,
  uploadProgress: 0,
};

// Async thunks
export const pickImage = createAsyncThunk(
  "edit/pickImage",
  async (_, { rejectWithValue }) => {
    try {
      // İzinleri kontrol et
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Galeri erişim izni verilmedi");
        }
      }

      // Görsel seç
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // Dosya bilgilerini al
        const response = await fetch(asset.uri);
        const blob = await response.blob();

        const imageData: EditImage = {
          id: Date.now().toString(),
          uri: asset.uri,
          fileName: `image_${Date.now()}.jpg`,
          fileSize: blob.size,
          mimeType: blob.type,
          isUploaded: false,
          isProcessing: false,
          createdAt: new Date(),
        };

        return imageData;
      } else {
        throw new Error("Görsel seçilmedi");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Görsel seçilirken hata oluştu");
    }
  },
);

export const takePhoto = createAsyncThunk(
  "edit/takePhoto",
  async (_, { rejectWithValue }) => {
    try {
      // Kamera iznini kontrol et
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Kamera erişim izni verilmedi");
        }
      }

      // Fotoğraf çek
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // Dosya bilgilerini al
        const response = await fetch(asset.uri);
        const blob = await response.blob();

        const imageData: EditImage = {
          id: Date.now().toString(),
          uri: asset.uri,
          fileName: `photo_${Date.now()}.jpg`,
          fileSize: blob.size,
          mimeType: blob.type,
          isUploaded: false,
          isProcessing: false,
          createdAt: new Date(),
        };

        return imageData;
      } else {
        throw new Error("Fotoğraf çekilmedi");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Fotoğraf çekilirken hata oluştu",
      );
    }
  },
);

export const uploadImageToStorage = createAsyncThunk(
  "edit/uploadImageToStorage",
  async (imageId: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as any;
      const image = state.edit.images.find(
        (img: EditImage) => img.id === imageId,
      );

      if (!image) {
        throw new Error("Görsel bulunamadı");
      }

      // Upload progress'i güncelle
      dispatch(setUploadProgress(0));

      // URI'den blob oluştur
      const response = await fetch(image.uri);
      const blob = await response.blob();

      // Firebase Storage referansı oluştur
      const storageRef = ref(storage, `images/${image.fileName}`);

      // Dosyayı yükle
      const uploadTask = uploadBytes(storageRef, blob);

      // Upload tamamlandığında download URL'ini al
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        imageId,
        downloadURL,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Görsel yüklenirken hata oluştu");
    }
  },
);

export const processImageWithDummyService = createAsyncThunk(
  "edit/processImageWithDummyService",
  async (imageId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const image = state.edit.images.find(
        (img: EditImage) => img.id === imageId,
      );

      if (!image || !image.downloadURL) {
        throw new Error("Görsel veya download URL bulunamadı");
      }

      // Dummy servis çağrısı simülasyonu
      // Gerçek uygulamada burada API çağrısı yapılır
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 saniye bekle

      // Dummy sonuç
      const dummyResult = {
        processedImageUrl: image.downloadURL,
        processingTime: Date.now(),
        enhancements: {
          brightness: Math.random() * 0.3 + 0.85,
          contrast: Math.random() * 0.4 + 0.8,
          saturation: Math.random() * 0.5 + 0.75,
        },
        aiSuggestions: [
          "Görsel kalitesi artırıldı",
          "Renk dengesi optimize edildi",
          "Keskinlik iyileştirildi",
        ],
        tags: ["processed", "enhanced", "ai-improved"],
      };

      return {
        imageId,
        result: dummyResult,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Görsel işlenirken hata oluştu");
    }
  },
);

export const deleteImage = createAsyncThunk(
  "edit/deleteImage",
  async (imageId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const image = state.edit.images.find(
        (img: EditImage) => img.id === imageId,
      );

      if (!image) {
        throw new Error("Görsel bulunamadı");
      }

      // Eğer Firebase Storage'da yüklüyse, oradan da sil
      if (image.downloadURL) {
        try {
          const storageRef = ref(storage, `images/${image.fileName}`);
          await deleteObject(storageRef);
        } catch (storageError) {
          console.warn("Storage'dan silme hatası:", storageError);
          // Storage hatası olsa bile devam et
        }
      }

      return imageId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Görsel silinirken hata oluştu");
    }
  },
);

// Slice
const editSlice = createSlice({
  name: "edit",
  initialState,
  reducers: {
    setSelectedImage: (state, action: PayloadAction<string | null>) => {
      state.selectedImageId = action.payload;
    },
    setImagePickerOpen: (state, action: PayloadAction<boolean>) => {
      state.isImagePickerOpen = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAllImages: (state) => {
      state.images = [];
      state.selectedImageId = null;
      state.uploadProgress = 0;
    },
    updateImageProgress: (
      state,
      action: PayloadAction<{ imageId: string; progress: number }>,
    ) => {
      const image = state.images.find(
        (img) => img.id === action.payload.imageId,
      );
      if (image) {
        image.uploadProgress = action.payload.progress;
      }
    },
  },
  extraReducers: (builder) => {
    // Pick Image
    builder
      .addCase(pickImage.pending, (state) => {
        state.isImagePickerOpen = true;
        state.error = null;
      })
      .addCase(pickImage.fulfilled, (state, action) => {
        state.isImagePickerOpen = false;
        state.images.push(action.payload);
        state.selectedImageId = action.payload.id;
      })
      .addCase(pickImage.rejected, (state, action) => {
        state.isImagePickerOpen = false;
        state.error = action.payload as string;
      });

    // Take Photo
    builder
      .addCase(takePhoto.pending, (state) => {
        state.isImagePickerOpen = true;
        state.error = null;
      })
      .addCase(takePhoto.fulfilled, (state, action) => {
        state.isImagePickerOpen = false;
        state.images.push(action.payload);
        state.selectedImageId = action.payload.id;
      })
      .addCase(takePhoto.rejected, (state, action) => {
        state.isImagePickerOpen = false;
        state.error = action.payload as string;
      });

    // Upload Image
    builder
      .addCase(uploadImageToStorage.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadImageToStorage.fulfilled, (state, action) => {
        state.isUploading = false;
        const image = state.images.find(
          (img) => img.id === action.payload.imageId,
        );
        if (image) {
          image.downloadURL = action.payload.downloadURL;
          image.isUploaded = true;
          image.uploadProgress = 100;
        }
      })
      .addCase(uploadImageToStorage.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      });

    // Process Image
    builder
      .addCase(processImageWithDummyService.pending, (state, action) => {
        state.isProcessing = true;
        state.error = null;
        const image = state.images.find((img) => img.id === action.meta.arg);
        if (image) {
          image.isProcessing = true;
        }
      })
      .addCase(processImageWithDummyService.fulfilled, (state, action) => {
        state.isProcessing = false;
        const image = state.images.find(
          (img) => img.id === action.payload.imageId,
        );
        if (image) {
          image.isProcessing = false;
          image.processingResult = action.payload.result;
        }
      })
      .addCase(processImageWithDummyService.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
        const image = state.images.find((img) => img.id === action.meta.arg);
        if (image) {
          image.isProcessing = false;
          image.error = action.payload as string;
        }
      });

    // Delete Image
    builder
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.images = state.images.filter((img) => img.id !== action.payload);
        if (state.selectedImageId === action.payload) {
          state.selectedImageId =
            state.images.length > 0 ? state.images[0].id : null;
        }
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedImage,
  setImagePickerOpen,
  setUploadProgress,
  clearError,
  clearAllImages,
  updateImageProgress,
} = editSlice.actions;

export default editSlice.reducer;
