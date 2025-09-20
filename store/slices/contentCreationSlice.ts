import { auth, storage } from "@/firebase.config";
import { AiToolResult } from "@/types";
import { fal } from "@fal-ai/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Alert } from "react-native";

fal.config({
  credentials: "YOUR_FAL_KEY",
});

export type ProcessingStatus = "idle" | "pending" | "fulfilled" | "failed";
export type PollStatus = "idle" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export interface ContentCreationState {
  // Storage Upload
  pathPrefix: string;
  storageUploadProcessingStatus: ProcessingStatus;
  imageStorageUrl: string | null;

  // AI Tool Processing
  aiToolProcessingStatus: ProcessingStatus;
  pollAiToolStatus: PollStatus;
  requestId: string | null;
  createdImageUrl: string | null;

  // UI State Management
  localImageUri: string | null;
  originalImageForResult: string | null;
  errorMessage: string | null;
  isImageViewerVisible: boolean;
  isExamplesModalVisible: boolean;
  activeExampleIndex: number;

  // General
  error: string | null;
  status: ProcessingStatus;
  activityIndicatorColor: string;
}

const initialState: ContentCreationState = {
  // Storage Upload
  pathPrefix: "uploads",
  storageUploadProcessingStatus: "idle",
  imageStorageUrl: null,

  // AI Tool Processing
  aiToolProcessingStatus: "idle",
  pollAiToolStatus: "idle",
  requestId: null,
  createdImageUrl: null,

  // UI State Management
  localImageUri: null,
  originalImageForResult: null,
  errorMessage: null,
  isImageViewerVisible: false,
  isExamplesModalVisible: true,
  activeExampleIndex: 0,

  // General
  error: null,
  status: "idle",
  activityIndicatorColor: "#000000",
};

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
      // Dosya adını oluştur
      const rawName = fileUri.split("/").pop() || `file-${Date.now()}`;
      const ext = rawName.includes(".") ? rawName.split(".").pop() : "jpg";
      const fileName = `${Date.now()}.${ext}`;

      // Kullanıcı bilgilerini al
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error("Kullanıcı giriş yapmamış");
      }

      // Firebase Storage referansı oluştur
      const reference = storage().ref(
        `${initialState.pathPrefix}/${currentUser.uid}/${fileName}`,
      );

      // Dosya yolunu düzenle (file:// scheme'ini kaldır)
      const pathToFile = fileUri.startsWith("file://")
        ? fileUri.replace("file://", "")
        : fileUri;

      console.log("📤 uploadImageToStorage - dosya yükleniyor...");

      // Dosyayı yükle
      const task = reference.putFile(pathToFile);
      await task;

      console.log("📤 uploadImageToStorage - dosya yükleme tamamlandı");

      // Download URL'ini al
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

    try {
      // FAL API anahtarını al
      const FAL_KEY = process.env.EXPO_PUBLIC_FAL_KEY || "YOUR_FAL_KEY";
      if (!FAL_KEY || FAL_KEY === "YOUR_FAL_KEY") {
        throw new Error("FAL API anahtarı bulunamadı");
      }

      // Request URL'ini oluştur
      const requestUrl = aiToolRequest.replace("${requestId}", requestId);
      console.log("🤖 uploadImageToAITool - requestUrl:", requestUrl);

      // Request body'yi hazırla
      const requestBody = {
        prompt,
        image_urls: [imageUrl],
        guidance_scale: 3.5,
        num_images: 1,
        output_format: "jpeg",
        safety_tolerance: "2",
      };

      // API'ye istek gönder
      const res = await fetch(requestUrl, {
        method: "POST",
        headers: {
          Authorization: `Key ${FAL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ uploadImageToAITool - response error:", text);
        throw new Error(`Fal queue start failed: ${res.status} ${text}`);
      }

      const data = (await res.json()) as any;
      console.log("🤖 uploadImageToAITool - response data:", data);

      return data;
    } catch (err) {
      console.error("❌ uploadImageToAITool - hata:", err);
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown AI enqueue error",
      );
    }
  },
);

/**
 * AI Tool işleminin durumunu kontrol eder ve tamamlanana kadar bekler
 */
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
      intervalMs = 3000,
      aiToolStatus,
      aiToolResult,
    },
    { rejectWithValue },
  ) => {
    console.log("⏳ pollAiToolStatus - başladı");
    console.log("⏳ pollAiToolStatus - requestId:", requestId);

    try {
      // FAL API anahtarını al
      const FAL_KEY = process.env.EXPO_PUBLIC_FAL_KEY || "YOUR_FAL_KEY";
      if (!FAL_KEY || FAL_KEY === "YOUR_FAL_KEY") {
        throw new Error("FAL API anahtarı bulunamadı");
      }

      // Maksimum deneme sayısı kadar döngü
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        console.log(
          `⏳ pollAiToolStatus - deneme ${attempt + 1}/${maxAttempts}`,
        );

        // Durum kontrolü yap
        const statusUrl = aiToolStatus.replace("${requestId}", requestId);
        const statusRes = await fetch(statusUrl, {
          method: "GET",
          headers: {
            Authorization: `Key ${FAL_KEY}`,
          },
        });

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

        // İşlem tamamlandıysa sonucu al
        if (statusData.status === "COMPLETED") {
          console.log(
            "✅ pollAiToolStatus - işlem tamamlandı, sonuç alınıyor...",
          );

          const resultUrl = aiToolResult.replace("${requestId}", requestId);
          const resultRes = await fetch(resultUrl, {
            method: "GET",
            headers: {
              Authorization: `Key ${FAL_KEY}`,
            },
          });

          if (!resultRes.ok) {
            const text = await resultRes.text();
            console.error("❌ pollAiToolStatus - result error:", text);
            throw new Error(`Fal result failed: ${resultRes.status} ${text}`);
          }

          const resultData = (await resultRes.json()) as AiToolResult;
          console.log("✅ AI Tool completed, result:", resultData);
          return resultData;
        }

        // İşlem başarısızsa hata fırlat
        if (statusData.status === "FAILED") {
          console.error(
            "❌ pollAiToolStatus - AI Tool başarısız:",
            statusData.error,
          );
          throw new Error(
            `AI Tool failed: ${statusData.error || "Unknown error"}`,
          );
        }

        // Son deneme değilse bekle
        if (attempt < maxAttempts - 1) {
          console.log(`⏳ pollAiToolStatus - ${intervalMs}ms bekleniyor...`);
          await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }
      }

      // Timeout hatası
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

/**
 * Complete image generation workflow - handles the entire process from image selection to result
 */
export const generateImage = createAsyncThunk<
  string,
  {
    localImageUri: string;
    servicePrompt: string;
    aiToolRequest: string;
    aiToolStatus: string;
    aiToolResult: string;
  },
  { rejectValue: string }
>(
  "contentCreation/generateImage",
  async (
    { localImageUri, servicePrompt, aiToolRequest, aiToolStatus, aiToolResult },
    { dispatch, rejectWithValue },
  ) => {
    console.log("✨ generateImage - başladı");
    console.log("✨ generateImage - localImageUri:", localImageUri);
    console.log("✨ generateImage - servicePrompt:", servicePrompt);

    if (!localImageUri) {
      const error = "Devam etmek için önce bir görsel seçin.";
      console.log("❌ generateImage - görsel seçilmemiş");
      return rejectWithValue(error);
    }

    if (!servicePrompt) {
      const error = "Talimat bulunamadı. Lütfen ana ekrandan tekrar deneyin.";
      console.log("❌ generateImage - prompt yazılmamış");
      return rejectWithValue(error);
    }

    try {
      console.log("📤 generateImage - görsel storage'a yükleniyor...");
      const imageUrl = await dispatch(
        uploadImageToStorage({ fileUri: localImageUri }),
      );
      if (imageUrl.meta.requestStatus === "rejected") {
        console.error("❌ generateImage - storage yanıtı reddedildi");
        throw new Error("Görsel sunucuya yüklenemedi.");
      }

      const storageUrl = imageUrl.payload as string;
      if (!storageUrl) {
        console.error("❌ generateImage - storage yanıtı boş");
        throw new Error("Görsel sunucuya yüklenemedi.");
      }

      console.log("🤖 generateImage - AI Tool'a görsel yükleniyor...");
      const aiToolResponse = await dispatch(
        uploadImageToAITool({
          imageUrl: storageUrl,
          prompt: servicePrompt,
          aiToolRequest: aiToolRequest || "",
          requestId: "",
        }),
      );

      if (aiToolResponse.meta.requestStatus === "rejected") {
        console.error("❌ generateImage - AI Tool reddedildi");
        throw new Error("Yapay zeka aracı başlatılamadı.");
      }

      const aiToolPayload = aiToolResponse.payload as any;
      const generatedRequestId = aiToolPayload?.request_id?.toString();

      if (!generatedRequestId) {
        console.error("❌ generateImage - request_id alınamadı");
        throw new Error("Yapay zeka aracı başlatılamadı.");
      }

      console.log("⏳ generateImage - AI Tool durumu kontrol ediliyor...");
      const aiToolStatusResult = await dispatch(
        pollAiToolStatus({
          requestId: generatedRequestId,
          aiToolStatus: aiToolStatus || "",
          aiToolResult: aiToolResult || "",
        }),
      );

      if (aiToolStatusResult.meta.requestStatus === "rejected") {
        console.error("❌ generateImage - AI Tool reddedildi");
        throw new Error("Yapay zeka görseli işleyemedi.");
      }

      const resultPayload = aiToolStatusResult.payload as any;
      const finalUrl = resultPayload?.images?.[0]?.url;

      if (!finalUrl) {
        console.error("❌ generateImage - finalUrl bulunamadı");
        throw new Error("Yapay zekadan geçerli bir sonuç alınamadı.");
      }

      console.log("✅ generateImage - işlem başarıyla tamamlandı");
      return finalUrl;
    } catch (err: any) {
      console.error("❌ generateImage - hata yakalandı:", err);
      const message = err.message || "Beklenmeyen bir hata oluştu.";
      console.error("❌ generateImage - hata mesajı:", message);
      return rejectWithValue(message);
    }
  },
);

/**
 * Download image to device
 */
export const downloadImage = createAsyncThunk<
  void,
  { imageUrl: string },
  { rejectValue: string }
>(
  "contentCreation/downloadImage",
  async ({ imageUrl }, { rejectWithValue }) => {
    console.log("💾 downloadImage - başladı");
    console.log("💾 downloadImage - imageUrl:", imageUrl);

    if (!imageUrl) {
      console.log("❌ downloadImage - imageUrl yok");
      return rejectWithValue("İndirilecek görsel bulunamadı.");
    }

    try {
      const MediaLibrary = await import("expo-media-library");

      console.log("🔐 downloadImage - izin isteniyor...");
      const { status: permissionStatus } =
        await MediaLibrary.requestPermissionsAsync();
      console.log("🔐 downloadImage - izin durumu:", permissionStatus);

      if (permissionStatus !== "granted") {
        console.log("❌ downloadImage - izin reddedildi");
        Alert.alert(
          "İzin gerekli",
          "Görseli kaydetmek için film rulosuna erişim izni vermeniz gerekiyor.",
        );
        return rejectWithValue("İzin reddedildi");
      }

      console.log("💾 downloadImage - görsel kaydediliyor...");
      await MediaLibrary.saveToLibraryAsync(imageUrl);
      console.log("✅ downloadImage - görsel başarıyla kaydedildi");
      Alert.alert("Başarılı", "Görsel galerinize kaydedildi.");
    } catch (error) {
      console.error("❌ downloadImage - hata:", error);
      Alert.alert("Hata", "Görsel kaydedilirken bir sorun oluştu.");
      return rejectWithValue("Görsel kaydedilemedi");
    }
  },
);

const contentCreationSlice = createSlice({
  name: "contentCreation",
  initialState,
  reducers: {
    // Resim URL'lerini yönet
    setCreatedImageUrl: (state, action: PayloadAction<string | null>) => {
      state.createdImageUrl = action.payload;
    },
    setImageStorageUrl: (state, action: PayloadAction<string | null>) => {
      state.imageStorageUrl = action.payload;
    },

    // UI durumlarını yönet
    setActivityIndicatorColor: (state, action: PayloadAction<string>) => {
      state.activityIndicatorColor = action.payload;
    },

    // İşlem durumlarını yönet
    setStorageUploadProcessingStatus: (
      state,
      action: PayloadAction<ProcessingStatus>,
    ) => {
      state.storageUploadProcessingStatus = action.payload;
    },
    setAiToolProcessingStatus: (
      state,
      action: PayloadAction<ProcessingStatus>,
    ) => {
      state.aiToolProcessingStatus = action.payload;
    },

    // Hata yönetimi
    clearError: (state) => {
      state.error = null;
    },

    // UI State Management
    setLocalImageUri: (state, action: PayloadAction<string | null>) => {
      state.localImageUri = action.payload;
    },
    setOriginalImageForResult: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      state.originalImageForResult = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    setImageViewerVisible: (state, action: PayloadAction<boolean>) => {
      state.isImageViewerVisible = action.payload;
    },
    setExamplesModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isExamplesModalVisible = action.payload;
    },
    setActiveExampleIndex: (state, action: PayloadAction<number>) => {
      state.activeExampleIndex = action.payload;
    },
    resetUIState: (state) => {
      state.localImageUri = null;
      state.originalImageForResult = null;
      state.errorMessage = null;
      state.isImageViewerVisible = false;
    },

    // Tüm verileri temizle
    clearAllImages: (state) => {
      state.imageStorageUrl = null;
      state.createdImageUrl = null;
      state.error = null;
      state.localImageUri = null;
      state.originalImageForResult = null;
      state.errorMessage = null;
      state.isImageViewerVisible = false;
      state.storageUploadProcessingStatus = "idle";
      state.aiToolProcessingStatus = "idle";
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    // STORAGE UPLOAD REDUCERS
    builder
      .addCase(uploadImageToStorage.pending, (state) => {
        state.storageUploadProcessingStatus = "pending";
        state.error = null;
        state.status = "pending";
      })
      .addCase(uploadImageToStorage.fulfilled, (state, action) => {
        state.imageStorageUrl = action.payload; // Download URL
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
      // AI TOOL UPLOAD REDUCERS
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

      // AI TOOL POLLING REDUCERS
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
      })

      // GENERATE IMAGE REDUCERS
      .addCase(generateImage.pending, (state) => {
        state.status = "pending";
        state.error = null;
        state.errorMessage = null;
        state.originalImageForResult = state.localImageUri;
      })
      .addCase(generateImage.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.createdImageUrl = action.payload;
        state.error = null;
        state.errorMessage = null;
      })
      .addCase(generateImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.errorMessage = action.payload as string;
        state.originalImageForResult = null;
      })

      // DOWNLOAD IMAGE REDUCERS
      .addCase(downloadImage.pending, (_state) => {
        // Download işlemi için özel bir status gerekmez
      })
      .addCase(downloadImage.fulfilled, (state) => {
        state.isImageViewerVisible = false;
      })
      .addCase(downloadImage.rejected, (state, action) => {
        state.errorMessage = action.payload as string;
      });
  },
});

// EXPORTS

export const {
  setCreatedImageUrl,
  setImageStorageUrl,
  setActivityIndicatorColor,
  setStorageUploadProcessingStatus,
  setAiToolProcessingStatus,
  clearError,
  clearAllImages,
  // UI State Management
  setLocalImageUri,
  setOriginalImageForResult,
  setErrorMessage,
  setImageViewerVisible,
  setExamplesModalVisible,
  setActiveExampleIndex,
  resetUIState,
} = contentCreationSlice.actions;

export default contentCreationSlice.reducer;
