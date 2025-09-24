import {
  EditingView,
  ExamplesModal,
  ImageViewer,
  InitialView,
  LoadingModal,
  ResultView,
} from "@/components/creation";
import { Header } from "@/components/home/Header";
import {
  Animations,
  BorderRadius,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignTokens";
import { useContentCreation } from "@/hooks";
import { useTheme } from "@/hooks/useTheme";
import { pickImage } from "@/utils/pickImage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ImageGeneratorScreen = () => {
  const {
    servicePrompt,
    aiRequestUrl,
    aiStatusUrl,
    aiResultUrl,
    hasMultipleInputImage,
    hasPreSelectedImage: _hasPreSelectedImage,
    gradient,
    title,
  } = useLocalSearchParams<{
    servicePrompt: string;
    aiRequestUrl: string;
    aiStatusUrl: string;
    aiResultUrl: string;
    hasMultipleInputImage: string;
    hasPreSelectedImage: string;
    gradient: string;
    title: string;
  }>();

  // Gradient renklerini parse et
  const gradientColors = useMemo(() => {
    if (gradient) {
      try {
        return JSON.parse(gradient);
      } catch {
        return ["#0077B5", "#005885"]; // Parse hatası durumunda fallback
      }
    }
    return ["#0077B5", "#005885"]; // Gradient yoksa fallback
  }, [gradient]);

  const { colors } = useTheme();
  const {
    createdImageUrl,
    status,
    localImageUri,
    localImageUris,
    originalImageForResult,
    originalImagesForResult: _originalImagesForResult,
    errorMessage,
    isImageViewerVisible,
    isExamplesModalVisible,
    activeExampleIndex,
    clearAllImages,
    setLocalImageUri,
    setLocalImageUris,
    removeLocalImageUri,
    setOriginalImageForResult: _setOriginalImageForResult,
    setOriginalImagesForResult: _setOriginalImagesForResult,
    setErrorMessage,
    setImageViewerVisible,
    setExamplesModalVisible,
    setActiveExampleIndex,
    resetUIState,
    generateImage,
    downloadImage,
  } = useContentCreation();

  // Local state'ler artık slice'da yönetiliyor

  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [currentPrompt, setCurrentPrompt] = useState(servicePrompt);
  const [currentViewingImage, setCurrentViewingImage] = useState<string>("");
  const [autoSave, setAutoSave] = useState<boolean>(true);

  const isGenerating = status === "pending";
  const hasImages =
    localImageUri || (localImageUris && localImageUris.length > 0);
  const isIdle = !hasImages && !createdImageUrl;
  const isEditing = hasImages && !createdImageUrl;
  const hasResult = !!createdImageUrl;

  const screenWidth = useMemo(() => Dimensions.get("window").width, []);

  const resetState = useCallback(() => {
    resetUIState();
  }, [resetUIState]);

  // Otomatik kaydet ayarını yükle
  React.useEffect(() => {
    const loadAutoSaveSetting = async () => {
      try {
        const savedAutoSave = await AsyncStorage.getItem("autoSave");
        if (savedAutoSave !== null) {
          setAutoSave(JSON.parse(savedAutoSave));
        }
      } catch (error) {
        console.error("Otomatik kaydet ayarı yüklenirken hata:", error);
      }
    };
    loadAutoSaveSetting();
  }, []);

  // Sonuç geldiğinde otomatik kaydet
  React.useEffect(() => {
    if (createdImageUrl && autoSave) {
      console.log("🔄 Otomatik kaydet başlatılıyor...");
      handleDownloadImage();
    }
  }, [createdImageUrl, autoSave]);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: Animations.duration.normal,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 45,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();
  }, [localImageUri, createdImageUrl, fadeAnim, scaleAnim]);

  const handleSelectImage = async () => {
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
  };

  const handleGenerateImage = async () => {
    // console.log("✨ handleGenerateImage - başladı");
    // console.log("✨ handleGenerateImage - localImageUri:", localImageUri);
    // console.log("✨ handleGenerateImage - servicePrompt:", servicePrompt);
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
      await generateImage(
        currentPrompt,
        aiRequestUrl,
        aiStatusUrl,
        aiResultUrl,
      );
      console.log("✅ handleGenerateImage - işlem başarıyla tamamlandı");
    } catch (err: any) {
      console.error("❌ handleGenerateImage - hata yakalandı:", err);
      const message = err.message || "Beklenmeyen bir hata oluştu.";
      console.error("❌ handleGenerateImage - hata mesajı:", message);
      Alert.alert("İşlem başarısız", message);
    }
  };

  const handleDownloadImage = async () => {
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
  };

  const handleStartNew = useCallback(() => {
    clearAllImages();
    resetState();
  }, [clearAllImages, resetState]);

  const handleExamplesMomentumEnd = useCallback(
    (event: any) => {
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
    [screenWidth, setActiveExampleIndex],
  );

  const renderInitialView = () => (
    <InitialView
      title={title}
      gradientColors={gradientColors}
      servicePrompt={servicePrompt}
      hasMultipleInputImage={hasMultipleInputImage}
      onSelectImage={handleSelectImage}
      onPromptChange={setCurrentPrompt}
      fadeAnim={fadeAnim}
      scaleAnim={scaleAnim}
    />
  );

  const renderEditingView = () => (
    <EditingView
      createdImageUrl={createdImageUrl || undefined}
      localImageUri={localImageUri || undefined}
      localImageUris={localImageUris}
      hasMultipleInputImage={hasMultipleInputImage}
      hasResult={hasResult}
      isGenerating={isGenerating}
      onSelectImage={handleSelectImage}
      onGenerateImage={handleGenerateImage}
      onRemoveImage={removeLocalImageUri}
      onRemoveSingleImage={() => setLocalImageUri(null)}
      fadeAnim={fadeAnim}
      scaleAnim={scaleAnim}
    />
  );

  const renderResultView = () => (
    <ResultView
      createdImageUrl={createdImageUrl || undefined}
      originalImageForResult={originalImageForResult || undefined}
      localImageUri={localImageUri || undefined}
      localImageUris={localImageUris}
      hasMultipleInputImage={hasMultipleInputImage}
      autoSave={autoSave}
      onDownloadImage={handleDownloadImage}
      onStartNew={handleStartNew}
      onOpenImageViewer={(imageUrl) => {
        setCurrentViewingImage(imageUrl);
        setImageViewerVisible(true);
      }}
      fadeAnim={fadeAnim}
      scaleAnim={scaleAnim}
    />
  );

  const renderImageViewer = () => (
    <ImageViewer
      visible={isImageViewerVisible}
      imageUrl={currentViewingImage || undefined}
      onClose={() => setImageViewerVisible(false)}
      onDownload={handleDownloadImage}
    />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header leftIconType="arrow-back" rightIconType="settings" />
      <ExamplesModal
        visible={isExamplesModalVisible}
        activeExampleIndex={activeExampleIndex}
        onClose={() => setExamplesModalVisible(false)}
        onMomentumEnd={handleExamplesMomentumEnd}
      />

      <LoadingModal visible={isGenerating} />

      {renderImageViewer()}

      {isIdle && renderInitialView()}
      {isEditing && renderEditingView()}
      {hasResult && renderResultView()}

      {errorMessage && (
        <View
          style={[
            styles.errorBanner,
            { backgroundColor: colors.errorSubtle, borderColor: colors.error },
          ]}
        >
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errorMessage}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorBanner: {
    position: "absolute",
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Shadows.md,
  },
  errorText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
    textAlign: "center",
  },
});

export default ImageGeneratorScreen;
