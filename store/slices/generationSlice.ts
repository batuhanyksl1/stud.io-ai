import { storage } from "@/firebase.config";
import { RefImage } from "@/types";
// import { pickImage } from "@/utils/pickImage";
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
export interface GenerationState {
  images: RefImage[];
  selectedImageId: string | null;
  selectedImageUri: string | null;
  error: string | null;
}

const initialState: GenerationState = {
  images: [],
  selectedImageId: null,
  selectedImageUri: null,
  error: null,
};

// Async thunks for image operations

export const takePhoto = createAsyncThunk(
  "generation/takePhoto",
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

        const imageData: RefImage = {
          id: Date.now().toString(),
          uri: asset.uri,
          status: "idle",
          createdAt: new Date().toISOString(),
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
  "generation/uploadImageToStorage",
  async (imageId: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as any;
      const image = state.generation.images.find(
        (img: RefImage) => img.id === imageId,
      );

      if (!image) {
        throw new Error("Görsel bulunamadı");
      }

      // Status'u uploading olarak güncelle
      dispatch(
        updateImageStatus({ imageId, status: "uploading", progress: 0 }),
      );

      // Dosya adını oluştur
      const fileName = `image_${Date.now()}.jpg`;

      // Expo Firebase Storage referansı oluştur
      const storageRef = ref(storage, `images/${fileName}`);

      // URI'den blob oluştur ve yükle
      const response = await fetch(image.uri);
      const blob = await response.blob();

      // Upload bytes ile yükle
      const snapshot = await uploadBytes(storageRef, blob, {
        contentType: "image/jpeg",
      });

      // Progress'i güncelle
      dispatch(
        updateImageStatus({ imageId, status: "uploading", progress: 100 }),
      );

      // Download URL'ini al
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        imageId,
        downloadURL,
        fileName,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Görsel yüklenirken hata oluştu");
    }
  },
);

export const processImageWithFalAI = createAsyncThunk(
  "generation/processImageWithFalAI",
  async (imageId: string, { getState, rejectWithValue, dispatch }) => {
    try {
      console.log("🚀 processImageWithFalAI başlatıldı - Image ID:", imageId);

      // Firebase Storage bağlantısını test et
      console.log("🔥 Firebase Storage test ediliyor...");
      try {
        const testRef = ref(storage, "test/connection.txt");
        console.log("✅ Storage referansı oluşturuldu");
      } catch (storageError) {
        console.error("❌ Storage bağlantı hatası:", storageError);
      }

      const state = getState() as any;
      const image = state.generation.images.find(
        (img: RefImage) => img.id === imageId,
      );

      if (!image) {
        console.error("❌ Görsel bulunamadı - Image ID:", imageId);
        throw new Error("Görsel bulunamadı");
      }

      console.log("📸 Görsel bulundu:", {
        id: image.id,
        status: image.status,
        hasDownloadURL: !!image.downloadURL,
        uri: image.uri?.substring(0, 50) + "...",
      });

      // Eğer görsel henüz Firebase'e yüklenmemişse, önce yükle
      if (!image.downloadURL) {
        console.log("📤 Firebase'e yükleme başlatılıyor...1"); //--------------------------------

        // Status'u uploading olarak güncelle
        dispatch(
          updateImageStatus({ imageId, status: "uploading", progress: 0 }),
        );

        // Dosya adını oluştur
        const fileName = `image_${Date.now()}.jpg`;
        console.log("📁 Dosya adı:", fileName);

        // Expo Firebase Storage referansı oluştur
        const storageRef = ref(storage, `images/${fileName}`);
        console.log("🔥 Firebase Storage referansı oluşturuldu");
        console.log("📁 Storage path:", `images/${fileName}`);
        console.log("🔥 Storage bucket:", storage.app.options.storageBucket);

        // Expo Firebase ile URI'den blob oluştur ve yükle
        console.log("🔄 Expo Firebase ile yükleme başlatılıyor...");
        console.log("📊 Dosya bilgileri:", {
          uri: image.uri.substring(0, 50) + "...",
        });

        let downloadURL: string;

        try {
          // URI'den blob oluştur ve yükle
          console.log("⬆️ Firebase'e yükleme başlatılıyor...");
          const response = await fetch(image.uri);
          const blob = await response.blob();

          // Upload bytes ile yükle
          const snapshot = await uploadBytes(storageRef, blob, {
            contentType: "image/jpeg",
          });

          console.log("✅ Firebase'e yükleme tamamlandı");

          // Progress'i güncelle
          dispatch(
            updateImageStatus({ imageId, status: "uploading", progress: 100 }),
          );

          downloadURL = await getDownloadURL(snapshot.ref);
          console.log(
            "🔗 Download URL alındı:",
            downloadURL.substring(0, 50) + "...",
          );
        } catch (uploadError: any) {
          console.error("❌ Firebase upload hatası:", uploadError);
          console.error("❌ Hata kodu:", uploadError.code);
          console.error("❌ Hata detayları:", uploadError);
          throw new Error(`Firebase upload hatası: ${uploadError.message}`);
        }

        // State'i güncelle
        dispatch(
          updateImageStatus({
            imageId,
            status: "uploaded",
            progress: 100,
          }),
        );

        // Görseli güncelle
        image.downloadURL = downloadURL;
        image.fileName = fileName;
        console.log("💾 Görsel state'i güncellendi");
      } else {
        console.log(
          "✅ Görsel zaten Firebase'de yüklü, AI işleme geçiliyor...",
        );
      }

      // Status'u processing olarak güncelle
      dispatch(
        updateImageStatus({ imageId, status: "processing", progress: 0 }),
      );

      console.log("🤖 Fal AI işleme başlatılıyor...");
      console.log("📤 Fal AI'ye gönderilen URL:", image.downloadURL);

      // Fal AI servisine gönder
      const falAIResponse = await fetch("https://fal.run/fal-ai/fast-sdxl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${process.env.EXPO_PUBLIC_FAL_AI_KEY}`, // API key'i environment variable'dan al
        },
        body: JSON.stringify({
          input: {
            image_url: image.downloadURL,
            prompt:
              "Enhance this image with high quality and professional look",
            negative_prompt: "blurry, low quality, distorted",
            num_inference_steps: 20,
            guidance_scale: 7.5,
          },
        }),
      });

      console.log("📡 Fal AI yanıt durumu:", falAIResponse.status);

      if (!falAIResponse.ok) {
        console.error("❌ Fal AI servisi hatası:", falAIResponse.status);
        throw new Error(`Fal AI servisi hatası: ${falAIResponse.status}`);
      }

      const falAIResult = await falAIResponse.json();
      console.log("🎯 Fal AI sonucu alındı:", {
        hasImages: !!falAIResult.images,
        imageCount: falAIResult.images?.length || 0,
        processedUrl: falAIResult.images?.[0]?.url?.substring(0, 50) + "...",
      });

      // Progress'i güncelle
      dispatch(
        updateImageStatus({ imageId, status: "processing", progress: 100 }),
      );

      const result = {
        imageId,
        result: {
          processedImageUrl: falAIResult.images?.[0]?.url || image.downloadURL,
          metadata: {
            processingTime: "AI processed",
            model: "fal-ai/fast-sdxl",
            originalImage: image.downloadURL,
          },
        },
      };

      console.log("🎉 processImageWithFalAI tamamlandı:", {
        imageId: result.imageId,
        processedUrl: result.result.processedImageUrl.substring(0, 50) + "...",
      });

      return result;
    } catch (error: any) {
      console.error("💥 processImageWithFalAI hatası:", error);
      console.error("💥 Hata detayı:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      return rejectWithValue(error.message || "Görsel işlenirken hata oluştu");
    }
  },
);

export const deleteImage = createAsyncThunk(
  "generation/deleteImage",
  async (imageId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const image = state.generation.images.find(
        (img: RefImage) => img.id === imageId,
      );

      if (!image) {
        throw new Error("Görsel bulunamadı");
      }

      // Eğer Firebase Storage'da yüklüyse, oradan da sil
      if (image.downloadURL && image.fileName) {
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
const generationSlice = createSlice({
  name: "generation",
  initialState,
  reducers: {
    setSelectedImage: (state, action: PayloadAction<string | null>) => {
      state.selectedImageId = action.payload;
    },
    setSelectedImageUri: (state, action: PayloadAction<string | null>) => {
      state.selectedImageUri = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAllImages: (state) => {
      state.images = [];
      state.selectedImageId = null;
    },
    updateImageStatus: (
      state,
      action: PayloadAction<{
        imageId: string;
        status: RefImage["status"];
        progress?: number;
        error?: string;
      }>,
    ) => {
      const image = state.images.find(
        (img) => img.id === action.payload.imageId,
      );
      if (image) {
        image.status = action.payload.status;
        if (action.payload.progress !== undefined) {
          image.progress = action.payload.progress;
        }
        if (action.payload.error !== undefined) {
          image.error = action.payload.error;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Pick Image
    // builder
    //   .addCase(pickImage.fulfilled, (state, action) => {
    //     state.images.push(action.payload);
    //     state.selectedImageId = action.payload.id;
    //     state.error = null;
    //   })
    //   .addCase(pickImage.rejected, (state, action) => {
    //     state.error = action.payload as string;
    //   });

    // Take Photo
    builder
      .addCase(takePhoto.fulfilled, (state, action) => {
        state.images.push(action.payload);
        state.selectedImageId = action.payload.id;
        state.error = null;
      })
      .addCase(takePhoto.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Upload Image
    builder
      .addCase(uploadImageToStorage.fulfilled, (state, action) => {
        const image = state.images.find(
          (img) => img.id === action.payload.imageId,
        );
        if (image) {
          image.downloadURL = action.payload.downloadURL;
          image.fileName = action.payload.fileName;
          image.status = "uploaded";
          image.progress = 100;
        }
        state.error = null;
      })
      .addCase(uploadImageToStorage.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Process Image with Fal AI
    builder
      .addCase(processImageWithFalAI.fulfilled, (state, action) => {
        const image = state.images.find(
          (img) => img.id === action.payload.imageId,
        );
        if (image) {
          image.processingResult = action.payload.result;
          image.status = "completed";
          image.progress = 100;
        }
        state.error = null;
      })
      .addCase(processImageWithFalAI.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Delete Image
    builder
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.images = state.images.filter((img) => img.id !== action.payload);
        if (state.selectedImageId === action.payload) {
          state.selectedImageId =
            state.images.length > 0 ? state.images[0].id : null;
        }
        state.error = null;
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedImage,
  setSelectedImageUri,
  clearError,
  clearAllImages,
  updateImageStatus,
} = generationSlice.actions;

export default generationSlice.reducer;
