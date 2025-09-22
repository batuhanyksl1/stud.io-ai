import { auth, storage } from "@/firebase.config";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Alert } from "react-native";

export type ProcessingStatus = "idle" | "pending" | "fulfilled" | "failed";
export type PollStatus = "idle" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export interface ContentCreationState {
  // Storage Upload
  pathPrefix: string;
  storageUploadProcessingStatus: ProcessingStatus;
  imageStorageUrl: string | null;
  imageStorageUrls: string[]; // Çoklu görsel için

  // AI Tool Processing
  aiToolProcessingStatus: ProcessingStatus;
  pollAiToolStatus: PollStatus;
  requestId: string | null;
  createdImageUrl: string | null;

  // UI State Management
  localImageUri: string | null;
  localImageUris: string[]; // Çoklu görsel URI'ları
  originalImageForResult: string | null;
  originalImagesForResult: string[]; // Çoklu görsel için
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
  imageStorageUrls: [], // Çoklu görsel için
  localImageUri: null,
  localImageUris: [], // Çoklu görsel URI'ları

  // AI Tool Processing
  aiToolProcessingStatus: "idle",
  pollAiToolStatus: "idle",
  requestId: null,
  createdImageUrl: null,

  // UI State Management
  originalImageForResult: null,
  originalImagesForResult: [], // Çoklu görsel için
  errorMessage: null,
  isImageViewerVisible: false,
  isExamplesModalVisible: true,
  activeExampleIndex: 0,

  // General
  error: null,
  status: "idle",
  activityIndicatorColor: "#000000",
};

/**
 * Complete image generation workflow - handles the entire process from image selection to result
 */
export const generateImage = createAsyncThunk<
  string,
  {
    localImageUri?: string;
    localImageUris?: string[];
    servicePrompt: string;
    aiRequestUrl: string;
    aiStatusUrl: string;
    aiResultUrl: string;
  },
  { rejectValue: string }
>(
  "contentCreation/generateImage",
  async (
    {
      localImageUri,
      localImageUris,
      servicePrompt,
      aiRequestUrl,
      aiStatusUrl,
      aiResultUrl,
    },
    { rejectWithValue },
  ) => {
    console.log("✨ generateImage - başladı");
    console.log("✨ generateImage - localImageUri:", localImageUri);
    console.log("✨ generateImage - localImageUris:", localImageUris);
    console.log("✨ generateImage - servicePrompt:", servicePrompt);
    console.log("✨ generateImage - aiRequestUrl:", aiRequestUrl);
    console.log("✨ generateImage - aiStatusUrl:", aiStatusUrl);
    console.log("✨ generateImage - aiResultUrl:", aiResultUrl);

    // Tek veya çoklu görsel kontrolü
    const hasSingleImage = localImageUri && !localImageUris;
    const hasMultipleImages = localImageUris && localImageUris.length > 0;

    if (!hasSingleImage && !hasMultipleImages) {
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
      // 1. ADIM: Görsel(ler)i Firebase Storage'a yükle
      console.log("📤 generateImage - görsel(ler) storage'a yükleniyor...");

      // Kullanıcı bilgilerini al
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error("Kullanıcı giriş yapmamış");
      }

      let storageUrls: string[] = [];

      if (hasMultipleImages && localImageUris) {
        // Çoklu görsel yükleme
        console.log(
          `📤 generateImage - ${localImageUris.length} adet görsel yükleniyor...`,
        );

        for (let i = 0; i < localImageUris.length; i++) {
          const imageUri = localImageUris[i];

          // Dosya adını oluştur
          const rawName = imageUri.split("/").pop() || `file-${Date.now()}`;
          const ext = rawName.includes(".") ? rawName.split(".").pop() : "jpg";
          const fileName = `${Date.now()}-${i}.${ext}`;

          // Firebase Storage referansı oluştur
          const reference = storage().ref(
            `${initialState.pathPrefix}/${currentUser.uid}/${fileName}`,
          );

          // Dosya yolunu düzenle (file:// scheme'ini kaldır)
          const pathToFile = imageUri.startsWith("file://")
            ? imageUri.replace("file://", "")
            : imageUri;

          // Dosyayı yükle
          const task = reference.putFile(pathToFile);
          await task;

          // Download URL'ini al
          const storageUrl = await reference.getDownloadURL();
          storageUrls.push(storageUrl);
          console.log(
            `✅ generateImage - görsel ${i + 1}/${localImageUris.length} yüklendi:`,
            storageUrl,
          );
        }
      } else if (hasSingleImage && localImageUri) {
        // Tek görsel yükleme
        console.log("📤 generateImage - tek görsel yükleniyor...");

        // Dosya adını oluştur
        const rawName = localImageUri.split("/").pop() || `file-${Date.now()}`;
        const ext = rawName.includes(".") ? rawName.split(".").pop() : "jpg";
        const fileName = `${Date.now()}.${ext}`;

        // Firebase Storage referansı oluştur
        const reference = storage().ref(
          `${initialState.pathPrefix}/${currentUser.uid}/${fileName}`,
        );

        // Dosya yolunu düzenle (file:// scheme'ini kaldır)
        const pathToFile = localImageUri.startsWith("file://")
          ? localImageUri.replace("file://", "")
          : localImageUri;

        // Dosyayı yükle
        const task = reference.putFile(pathToFile);
        await task;

        // Download URL'ini al
        const storageUrl = await reference.getDownloadURL();
        storageUrls.push(storageUrl);
        console.log(
          "✅ generateImage - storage yükleme tamamlandı:",
          storageUrl,
        );
      }

      // 2. ADIM: Firebase Functions aiToolRequest servisine görsel(ler)i gönder
      console.log(
        "🤖 generateImage - Firebase Functions aiToolRequest'e görsel(ler) yükleniyor...",
      );

      // Firebase token'ını al
      const firebaseToken = await currentUser.getIdToken();
      if (!firebaseToken) {
        throw new Error("Firebase authentication token alınamadı");
      }

      // aiToolRequest servisine istek gönder
      const RequestUrl = "https://aitoolrequest-br4qccjs7a-ew.a.run.app";
      const requestBody = {
        prompt: servicePrompt,
        image_urls: storageUrls, // Her durumda array formatında gönder
        serviceUrl: aiRequestUrl, // FAL API endpoint
        extra: {
          strength: 0.8,
        },
      };
      console.log(
        "🔍 AŞLSDKFJAŞLSKDFJAŞLKSDJFŞALKSDJFŞLAKSDJFADFŞ ASLŞDKJFAŞLSKDJF     ASDFJAŞLKSDJF generateImage - requestBody:",
        requestBody,
      );
      const requestRes = await fetch(RequestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!requestRes.ok) {
        const text = await requestRes.text();
        console.error("❌ generateImage - aiToolRequest error:", text);
        throw new Error(`aiToolRequest failed: ${requestRes.status} ${text}`);
      }

      const requestData = (await requestRes.json()) as any;
      console.log("✅ generateImage - aiToolRequest response:", requestData);

      const requestId = requestData?.data?.request_id?.toString();
      if (!requestId) {
        throw new Error("aiToolRequest'den request_id alınamadı");
      }

      // 3. ADIM: aiToolStatus ile işlemin tamamlanmasını bekle
      console.log(
        "⏳ generateImage - aiToolStatus ile durum kontrol ediliyor...",
      );

      const maxAttempts = 60;
      const intervalMs = 3000;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        console.log(`⏳ generateImage - deneme ${attempt + 1}/${maxAttempts}`);

        // aiToolStatus servisine durum kontrolü yap
        const StatusUrl = "https://aitoolstatus-br4qccjs7a-ew.a.run.app";
        const statusBody = {
          requestId: requestId,
          serviceUrl: aiStatusUrl.replace("${requestId}", requestId), // FAL API endpoint
          extra: {},
        };
        const statusRes = await fetch(StatusUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`,
          },
          body: JSON.stringify(statusBody),
        });
        console.log("🔍 generateImage - aiToolStatus response:", statusRes);
        if (!statusRes.ok) {
          const text = await statusRes.text();
          console.log("🔍 generateImage - aiToolStatus error:", text);
          console.error("❌ generateImage - aiToolStatus error:", text);
          throw new Error(`aiToolStatus failed: ${statusRes.status} ${text}`);
        }

        const statusData = (await statusRes.json()) as any;
        console.log("🔍 generateImage - aiToolStatus data:", statusData);
        console.log(
          `🔄 Polling attempt ${attempt + 1}/${maxAttempts}, status:`,
          statusData?.data?.status,
        );

        // İşlem tamamlandıysa sonucu al
        if (statusData?.data?.status === "COMPLETED") {
          console.log("✅ generateImage - işlem tamamlandı, sonuç alınıyor...");

          // aiToolResult servisinden sonucu al
          const ResultUrl = "https://aitoolresult-br4qccjs7a-ew.a.run.app";
          const resultBody = {
            requestId: requestId,
            serviceUrl: aiResultUrl.replace("${requestId}", requestId), // FAL API endpoint
            extra: {},
          };
          const resultRes = await fetch(ResultUrl, {
            method: "POST", // Firebase Functions servisi POST bekliyor
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${firebaseToken}`,
            },
            body: JSON.stringify(resultBody),
          });

          if (!resultRes.ok) {
            const text = await resultRes.text();
            console.error("❌ generateImage - aiToolResult error:", text);
            throw new Error(`aiToolResult failed: ${resultRes.status} ${text}`);
          }

          const resultData = (await resultRes.json()) as any;
          const finalUrl = resultData?.data?.images?.[0]?.url;

          if (!finalUrl) {
            throw new Error("aiToolResult'dan geçerli bir sonuç alınamadı.");
          }

          console.log("✅ generateImage - işlem başarıyla tamamlandı");
          return finalUrl;
        }

        // İşlem başarısızsa hata fırlat
        if (statusData?.data?.status === "FAILED") {
          console.error(
            "❌ generateImage - AI Tool başarısız:",
            statusData?.data?.error,
          );
          throw new Error(
            `AI Tool failed: ${statusData?.data?.error || "Unknown error"}`,
          );
        }

        // Son deneme değilse bekle
        if (attempt < maxAttempts - 1) {
          console.log(`⏳ generateImage - ${intervalMs}ms bekleniyor...`);
          await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }
      }

      // Timeout hatası
      throw new Error(`AI Tool polling timeout after ${maxAttempts} attempts`);
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
    setImageStorageUrls: (state, action: PayloadAction<string[]>) => {
      state.imageStorageUrls = action.payload;
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
    setLocalImageUris: (state, action: PayloadAction<string[]>) => {
      state.localImageUris = action.payload;
    },
    removeLocalImageUri: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.localImageUris.length) {
        state.localImageUris.splice(index, 1);
      }
    },
    setOriginalImageForResult: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      state.originalImageForResult = action.payload;
    },
    setOriginalImagesForResult: (state, action: PayloadAction<string[]>) => {
      state.originalImagesForResult = action.payload;
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
      state.localImageUris = [];
      state.originalImageForResult = null;
      state.originalImagesForResult = [];
      state.errorMessage = null;
      state.isImageViewerVisible = false;
    },

    // Tüm verileri temizle
    clearAllImages: (state) => {
      state.imageStorageUrl = null;
      state.imageStorageUrls = [];
      state.createdImageUrl = null;
      state.error = null;
      state.localImageUri = null;
      state.localImageUris = [];
      state.originalImageForResult = null;
      state.originalImagesForResult = [];
      state.errorMessage = null;
      state.isImageViewerVisible = false;
      state.storageUploadProcessingStatus = "idle";
      state.aiToolProcessingStatus = "idle";
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // GENERATE IMAGE REDUCERS
      .addCase(generateImage.pending, (state) => {
        state.status = "pending";
        state.storageUploadProcessingStatus = "pending";
        state.aiToolProcessingStatus = "pending";
        state.pollAiToolStatus = "IN_PROGRESS";
        state.error = null;
        state.errorMessage = null;
        state.originalImageForResult = state.localImageUri;
        state.originalImagesForResult = state.localImageUris;
      })
      .addCase(generateImage.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.storageUploadProcessingStatus = "fulfilled";
        state.aiToolProcessingStatus = "fulfilled";
        state.pollAiToolStatus = "COMPLETED";
        state.createdImageUrl = action.payload;
        state.error = null;
        state.errorMessage = null;
      })
      .addCase(generateImage.rejected, (state, action) => {
        state.status = "failed";
        state.storageUploadProcessingStatus = "failed";
        state.aiToolProcessingStatus = "failed";
        state.pollAiToolStatus = "FAILED";
        state.error = action.payload as string;
        state.errorMessage = action.payload as string;
        state.originalImageForResult = null;
        state.originalImagesForResult = [];
        state.createdImageUrl = null;
        state.imageStorageUrl = null;
        state.imageStorageUrls = [];
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
  setImageStorageUrls,
  setActivityIndicatorColor,
  setStorageUploadProcessingStatus,
  setAiToolProcessingStatus,
  clearError,
  clearAllImages,
  // UI State Management
  setLocalImageUri,
  setLocalImageUris,
  removeLocalImageUri,
  setOriginalImageForResult,
  setOriginalImagesForResult,
  setErrorMessage,
  setImageViewerVisible,
  setExamplesModalVisible,
  setActiveExampleIndex,
  resetUIState,
} = contentCreationSlice.actions;

export default contentCreationSlice.reducer;
