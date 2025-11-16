import { useContentCreation } from "@/hooks/useContentCreation";
import { pickImage } from "@/utils/pickImage";
import { router } from "expo-router";
import { useCallback } from "react";
import { Alert, Dimensions } from "react-native";

interface UseImageGeneratorHandlersParams {
  hasMultipleInputImage: string;
  servicePrompt: string;
  currentPrompt: string;
  aiRequestUrl: string;
  aiStatusUrl: string;
  aiResultUrl: string;
  token?: string;
  localImageUri: string | null;
  localImageUris: string[] | null;
  createdImageUrl: string | null;
  setCurrentPrompt: (prompt: string) => void;
  setCurrentViewingImage: (imageUrl: string) => void;
  setImageViewerVisible: (visible: boolean) => void;
  setActiveExampleIndex: (index: number) => void;
}

/**
 * Image generator için tüm handler fonksiyonlarını içeren hook
 */
export function useImageGeneratorHandlers({
  hasMultipleInputImage,
  servicePrompt,
  currentPrompt,
  aiRequestUrl,
  aiStatusUrl,
  aiResultUrl,
  token,
  localImageUri,
  localImageUris,
  createdImageUrl,
  setCurrentPrompt,
  setCurrentViewingImage,
  setImageViewerVisible,
  setActiveExampleIndex,
}: UseImageGeneratorHandlersParams) {
  const {
    clearAllImages,
    setLocalImageUri,
    setLocalImageUris,
    removeLocalImageUri,
    setErrorMessage,
    resetUIState,
    generateImage,
    downloadImage,
  } = useContentCreation();

  const resetState = useCallback(() => {
    resetUIState();
  }, [resetUIState]);

  const handleSelectImage = useCallback(async () => {
    console.log("🖼️ handleSelectImage - başladı");
    try {
      const allowMultiple = hasMultipleInputImage === "true";
      const pickedImages = await pickImage(allowMultiple);
      console.log("🖼️ handleSelectImage - pickedImages:", pickedImages);

      if (pickedImages) {
        clearAllImages();
        resetState();

        if (allowMultiple && Array.isArray(pickedImages)) {
          setLocalImageUris(pickedImages);
          console.log(
            "🖼️ handleSelectImage - çoklu görsel başarıyla seçildi:",
            pickedImages.length,
            "adet",
          );
        } else if (!allowMultiple && typeof pickedImages === "string") {
          setLocalImageUri(pickedImages);
          console.log("🖼️ handleSelectImage - tek görsel başarıyla seçildi");
        } else {
          console.log("🖼️ handleSelectImage - görsel seçilmedi");
        }
      } else {
        console.log("🖼️ handleSelectImage - görsel seçilmedi");
      }
    } catch (error) {
      console.error("🖼️ handleSelectImage - hata:", error);
      setErrorMessage(
        "Görsel seçilirken bir sorun oluştu. Lütfen tekrar deneyin.",
      );
    }
  }, [
    hasMultipleInputImage,
    clearAllImages,
    resetState,
    setLocalImageUris,
    setLocalImageUri,
    setErrorMessage,
  ]);

  const handleGenerateImage = useCallback(async () => {
    console.log("✨ handleGenerateImage - aiRequestUrl:", aiRequestUrl);
    console.log("✨ handleGenerateImage - aiStatusUrl:", aiStatusUrl);
    console.log("✨ handleGenerateImage - aiResultUrl:", aiResultUrl);
    console.log("✨ handleGenerateImage - localImageUri:", localImageUri);
    console.log("✨ handleGenerateImage - localImageUris:", localImageUris);

    if (!localImageUri && (!localImageUris || localImageUris.length === 0)) {
      setErrorMessage("Devam etmek için önce bir görsel seçin.");
      return;
    }

    if (!currentPrompt) {
      setErrorMessage(
        "Talimat bulunamadı. Lütfen ana ekrandan tekrar deneyin.",
      );
      return;
    }
    if (!aiRequestUrl) {
      setErrorMessage("Araç bulunamadı. Lütfen ana ekrandan tekrar deneyin.");
      return;
    }
    if (!aiStatusUrl) {
      setErrorMessage(
        "Durum URL'i bulunamadı. Lütfen ana ekrandan tekrar deneyin.",
      );
      return;
    }
    if (!aiResultUrl) {
      setErrorMessage(
        "Sonuç URL'i bulunamadı. Lütfen ana ekrandan tekrar deneyin.",
      );
      return;
    }

    setErrorMessage(null);
    console.log("✨ handleGenerateImage - işlem başlatılıyor...");

    try {
      const numericToken = token ? Number(token) : undefined;
      const validToken =
        typeof numericToken === "number" &&
        Number.isFinite(numericToken) &&
        numericToken > 0
          ? numericToken
          : undefined;
      const hasCustomPrompt =
        typeof currentPrompt === "string" &&
        typeof servicePrompt === "string" &&
        currentPrompt.trim() !== (servicePrompt || "").trim();
      await generateImage(
        currentPrompt,
        aiRequestUrl,
        aiStatusUrl,
        aiResultUrl,
        validToken,
        hasCustomPrompt,
      );
      console.log("✅ handleGenerateImage - işlem başarıyla tamamlandı");
    } catch (err: any) {
      console.error("❌ handleGenerateImage - hata yakalandı:", err);
      const message = err.message || "Beklenmeyen bir hata oluştu.";
      console.error("❌ handleGenerateImage - hata mesajı:", message);
      Alert.alert("İşlem başarısız", message);
    }
  }, [
    localImageUri,
    localImageUris,
    currentPrompt,
    servicePrompt,
    aiRequestUrl,
    aiStatusUrl,
    aiResultUrl,
    token,
    setErrorMessage,
    generateImage,
  ]);

  const handleDownloadImage = useCallback(async () => {
    console.log("💾 handleDownloadImage - başladı");
    console.log("💾 handleDownloadImage - createdImageUrl:", createdImageUrl);

    if (!createdImageUrl) {
      console.log("❌ handleDownloadImage - createdImageUrl yok");
      return;
    }

    try {
      await downloadImage();
      console.log("✅ handleDownloadImage - görsel başarıyla kaydedildi");
    } catch (error) {
      console.error("❌ handleDownloadImage - hata:", error);
    }
  }, [createdImageUrl, downloadImage]);

  const handleStartNew = useCallback(() => {
    clearAllImages();
    resetState();
  }, [clearAllImages, resetState]);

  const handleExamplesMomentumEnd = useCallback(
    (event: any) => {
      const screenWidth = Dimensions.get("window").width;
      const offsetX = event?.nativeEvent?.contentOffset?.x || 0;
      const slideWidth = screenWidth;
      if (!slideWidth) {
        return;
      }
      const index = Math.round(offsetX / slideWidth);
      const boundedIndex = Math.min(
        Math.max(index, 0),
        2, // editingServices.slice(0, 3) olduğu için 3 öğe var
      );
      setActiveExampleIndex(boundedIndex);
    },
    [setActiveExampleIndex],
  );

  const handleOpenImageViewer = useCallback(
    (imageUrl: string) => {
      setCurrentViewingImage(imageUrl);
      setImageViewerVisible(true);
    },
    [setCurrentViewingImage, setImageViewerVisible],
  );

  return {
    handleSelectImage,
    handleGenerateImage,
    handleDownloadImage,
    handleStartNew,
    handleExamplesMomentumEnd,
    handleOpenImageViewer,
    removeLocalImageUri,
    setLocalImageUri,
  };
}

