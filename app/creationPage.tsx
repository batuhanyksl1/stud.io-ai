import {
  EditingView,
  ErrorBanner,
  ExamplesModal,
  ImageViewer,
  InitialView,
  LoadingModal,
  ResultView,
} from "@/components/creation";
import { useContentCreation } from "@/hooks/useContentCreation";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useImageGeneratorHandlers } from "@/hooks/useImageGeneratorHandlers";
import { useScreenAnimations } from "@/hooks/useScreenAnimations";
import { useTheme } from "@/hooks/useTheme";
import { useAppSelector } from "@/store/hooks";
import { parseGradient } from "@/utils/gradientParser";
import { calculateViewState } from "@/utils/viewState";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

const ImageGeneratorScreen = () => {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const {
    servicePrompt,
    aiRequestUrl,
    aiStatusUrl,
    aiResultUrl,
    hasMultipleInputImage,
    hasPreSelectedImage: _hasPreSelectedImage,
    gradient,
    title,
    token,
    serviceId,
    isCustomPrompt,
  } = useLocalSearchParams<{
    servicePrompt: string;
    aiRequestUrl: string;
    aiStatusUrl: string;
    aiResultUrl: string;
    hasMultipleInputImage: string;
    hasPreSelectedImage: string;
    gradient: string;
    title: string;
    token: string;
    serviceId: string;
    isCustomPrompt: string;
  }>();

  // Gradient renklerini parse et
  const gradientColors = useMemo(() => parseGradient(gradient), [gradient]);

  // Login kontrolü - eğer kullanıcı login değilse premium page'e yönlendir
  useEffect(() => {
    if (!isAuthenticated && serviceId) {
      // Ücretsiz servisler için login kontrolü yapma
      const freeServiceIds = ["profile-picture", "photo-enhancement"];
      const isFreeService = freeServiceIds.includes(serviceId);
      
      // Sadece premium servisler için login kontrolü yap
      if (!isFreeService) {
        router.replace("/premium");
      }
    } else if (!isAuthenticated && !serviceId) {
      // Eğer serviceId yoksa ve login değilse premium page'e yönlendir (güvenlik)
      router.replace("/premium");
    }
  }, [isAuthenticated, router, serviceId]);

  // Eğer login değilse ve premium servis ise hiçbir şey render etme (premium page'e yönlendiriliyor)
  if (!isAuthenticated && serviceId) {
    const freeServiceIds = ["profile-picture", "photo-enhancement"];
    const isFreeService = freeServiceIds.includes(serviceId);
    if (!isFreeService) {
      return null;
    }
  } else if (!isAuthenticated && !serviceId) {
    return null;
  }

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
    setErrorMessage,
    setImageViewerVisible,
    setExamplesModalVisible,
    setActiveExampleIndex,
  } = useContentCreation();

  const { colors } = useTheme();

  const [currentPrompt, setCurrentPrompt] = useState(servicePrompt);
  const [currentViewingImage, setCurrentViewingImage] = useState<string>("");

  // servicePrompt parametresi değiştiğinde currentPrompt'u güncelle
  useEffect(() => {
    if (servicePrompt) {
      setCurrentPrompt(servicePrompt);
    }
  }, [servicePrompt]);

  // View state hesaplamaları
  const viewState = useMemo(
    () =>
      calculateViewState(
        status,
        localImageUri,
        localImageUris,
        createdImageUrl,
      ),
    [status, localImageUri, localImageUris, createdImageUrl],
  );

  // Animasyonlar
  const { fadeAnim, scaleAnim } = useScreenAnimations(
    localImageUri,
    createdImageUrl,
  );

  // Image handler'ları
  const {
    handleSelectImage,
    handleGenerateImage,
    handleDownloadImage,
    handleStartNew,
    handleExamplesMomentumEnd,
    handleOpenImageViewer,
    removeLocalImageUri,
    setLocalImageUri,
  } = useImageGeneratorHandlers({
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
  });

  // Hata yönetimi
  const { shouldShowError } = useErrorHandler(errorMessage, setErrorMessage);

  // hasResult true olduğunda router parametrelerini temizle
  // hasMultipleInputImage parametresini koruyoruz çünkü ResultView'da referans görselleri göstermek için gerekli
  useEffect(() => {
    if (viewState.hasResult) {
      router.setParams({
        servicePrompt: undefined,
        aiRequestUrl: undefined,
        aiStatusUrl: undefined,
        aiResultUrl: undefined,
        hasPreSelectedImage: undefined,
        gradient: undefined,
        title: undefined,
        token: undefined,
        // hasMultipleInputImage parametresini koruyoruz
      });
    }
  }, [viewState.hasResult, router]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ExamplesModal
        visible={isExamplesModalVisible}
        activeExampleIndex={activeExampleIndex}
        onClose={() => setExamplesModalVisible(false)}
        onMomentumEnd={handleExamplesMomentumEnd}
      />

      <LoadingModal visible={viewState.isGenerating} />

      <ImageViewer
        visible={isImageViewerVisible}
        imageUrl={currentViewingImage || undefined}
        onClose={() => setImageViewerVisible(false)}
        onDownload={handleDownloadImage}
      />

      {viewState.isIdle && (
        <InitialView
          title={title}
          gradientColors={gradientColors}
          servicePrompt={servicePrompt}
          hasMultipleInputImage={hasMultipleInputImage}
          onSelectImage={handleSelectImage}
          fadeAnim={fadeAnim}
          scaleAnim={scaleAnim}
        />
      )}

      {viewState.isEditing && (
        <EditingView
          createdImageUrl={createdImageUrl || undefined}
          localImageUri={localImageUri || undefined}
          localImageUris={localImageUris}
          hasMultipleInputImage={hasMultipleInputImage}
          hasResult={viewState.hasResult}
          isGenerating={viewState.isGenerating}
          onSelectImage={handleSelectImage}
          onGenerateImage={handleGenerateImage}
          onRemoveImage={removeLocalImageUri}
          onRemoveSingleImage={() => setLocalImageUri(null)}
          fadeAnim={fadeAnim}
          scaleAnim={scaleAnim}
          isCustomPrompt={isCustomPrompt === "true"}
          currentPrompt={currentPrompt}
          onPromptChange={setCurrentPrompt}
        />
      )}

      {viewState.hasResult && (
        <ResultView
          createdImageUrl={createdImageUrl || undefined}
          originalImageForResult={originalImageForResult || undefined}
          localImageUri={localImageUri || undefined}
          localImageUris={localImageUris}
          hasMultipleInputImage={hasMultipleInputImage}
          onDownloadImage={handleDownloadImage}
          onStartNew={handleStartNew}
          onOpenImageViewer={handleOpenImageViewer}
          fadeAnim={fadeAnim}
          scaleAnim={scaleAnim}
        />
      )}

      {shouldShowError && <ErrorBanner errorMessage={errorMessage} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ImageGeneratorScreen;
