import { auth, storage } from "@/firebase.config";
import { AiToolResult } from "@/types";
import { fal } from "@fal-ai/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      intervalMs = 60000,
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

    // Tüm verileri temizle
    clearAllImages: (state) => {
      state.imageStorageUrl = null;
      state.createdImageUrl = null;
      state.error = null;
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
} = contentCreationSlice.actions;

export default contentCreationSlice.reducer;
