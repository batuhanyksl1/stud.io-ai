import { editingServices } from "@/components/data/homeData";
import {
  Animations,
  BorderRadius,
  ComponentTokens,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignTokens";
import { useContentCreation } from "@/hooks";
import { useTheme } from "@/hooks/useTheme";
import { pickImage } from "@/utils/pickImage";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
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
  } = useLocalSearchParams<{
    servicePrompt: string;
    aiRequestUrl: string;
    aiStatusUrl: string;
    aiResultUrl: string;
    hasMultipleInputImage: string;
    hasPreSelectedImage: string;
  }>();

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

    if (!servicePrompt) {
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
        servicePrompt,
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

  const promptDetails = useMemo(() => {
    if (!servicePrompt) {
      return "Talimat henüz oluşturulmadı.";
    }

    if (servicePrompt.length <= 160) {
      return servicePrompt;
    }

    return `${servicePrompt.slice(0, 157)}...`;
  }, [servicePrompt]);

  const exampleItems = useMemo(
    () =>
      editingServices.slice(0, 3).map((service) => ({
        id: service.id,
        title: service.title,
        subtitle: service.subtitle,
        beforeImage: service.image1,
        afterImage: service.image2,
      })),
    [],
  );

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
        Math.max(exampleItems.length - 1, 0),
      );
      setActiveExampleIndex(boundedIndex);
    },
    [screenWidth, exampleItems.length, setActiveExampleIndex],
  );

  const renderInitialView = () => (
    <ScrollView
      contentContainerStyle={styles.scrollArea}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          styles.heroCard,
          {
            backgroundColor: colors.surface,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text
          style={[
            styles.heroBadge,
            { color: colors.textOnPrimary, backgroundColor: colors.primary },
          ]}
        >
          Studio AI
        </Text>
        <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
          Hayalinizi saniyeler içinde hayata geçirin
        </Text>
        <Text style={[styles.heroDescription, { color: colors.textSecondary }]}>
          Referans görselinizi ekleyin, talimatınızı paylaşın ve Studio AI
          gerisini sizin için yönetsin.
        </Text>

        <View style={styles.heroMetaRow}>
          <View style={[styles.heroMetaItem, { borderColor: colors.border }]}>
            <Text
              style={[styles.heroMetaLabel, { color: colors.textTertiary }]}
            >
              Talimat
            </Text>
            <Text style={[styles.heroMetaValue, { color: colors.textPrimary }]}>
              {promptDetails}
            </Text>
          </View>
          {aiRequestUrl ? (
            <View style={[styles.heroMetaItem, { borderColor: colors.border }]}>
              <Text
                style={[styles.heroMetaLabel, { color: colors.textTertiary }]}
              >
                Araç
              </Text>
              <Text
                style={[styles.heroMetaValue, { color: colors.textPrimary }]}
              >
                {aiRequestUrl}
              </Text>
            </View>
          ) : null}
        </View>

        <Pressable
          style={[styles.buttonPrimary, { backgroundColor: colors.primary }]}
          onPress={handleSelectImage}
        >
          <Text
            style={[styles.buttonTextPrimary, { color: colors.textOnPrimary }]}
          >
            {hasMultipleInputImage === "true"
              ? "Galeriden görseller seç"
              : "Galeriden görsel seç"}
          </Text>
        </Pressable>
      </Animated.View>

      <View
        style={[
          styles.stepsCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Nasıl çalışıyor?
        </Text>

        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, { borderColor: colors.primary }]}>
            <Text style={[styles.stepNumberText, { color: colors.primary }]}>
              1
            </Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              Referans görselinizi yükleyin
            </Text>
            <Text
              style={[styles.stepSubtitle, { color: colors.textSecondary }]}
            >
              Yapay zekanın doğru bağlamı yakalaması için net bir görsel seçin.
            </Text>
          </View>
        </View>

        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, { borderColor: colors.primary }]}>
            <Text style={[styles.stepNumberText, { color: colors.primary }]}>
              2
            </Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              Studio AI talimatınızı uygulasın
            </Text>
            <Text
              style={[styles.stepSubtitle, { color: colors.textSecondary }]}
            >
              Platform, promptunuzu ve görseli eşleştirerek yeni versiyonu
              üretir.
            </Text>
          </View>
        </View>

        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, { borderColor: colors.primary }]}>
            <Text style={[styles.stepNumberText, { color: colors.primary }]}>
              3
            </Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              Sonucu gözden geçirip indirin
            </Text>
            <Text
              style={[styles.stepSubtitle, { color: colors.textSecondary }]}
            >
              Beğendiğiniz anda eseri kaydedebilir veya yeni bir deneme
              başlatabilirsiniz.
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.examplesCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Örnek çıktılar
        </Text>
        <Text
          style={[styles.examplesDescription, { color: colors.textSecondary }]}
        >
          Studio AI&apos;nin farklı araçlarıyla neler elde edebileceğinizi
          keşfedin.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.exampleList}
        >
          {exampleItems.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.exampleItem,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surfaceElevated,
                },
                index === exampleItems.length - 1 && styles.exampleItemLast,
              ]}
            >
              <Text
                style={[styles.exampleTitle, { color: colors.textPrimary }]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.exampleSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                {item.subtitle}
              </Text>

              <View style={styles.exampleImageRow}>
                <View style={styles.exampleImageWrapper}>
                  <Text
                    style={[
                      styles.exampleImageLabel,
                      { color: colors.textTertiary },
                    ]}
                  >
                    Önce
                  </Text>
                  <Image
                    source={item.beforeImage}
                    style={styles.exampleImage}
                  />
                </View>
                <Text style={[styles.exampleArrow, { color: colors.primary }]}>
                  →
                </Text>
                <View style={styles.exampleImageWrapper}>
                  <Text
                    style={[
                      styles.exampleImageLabel,
                      { color: colors.textTertiary },
                    ]}
                  >
                    Sonra
                  </Text>
                  <Image source={item.afterImage} style={styles.exampleImage} />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );

  const renderEditingView = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.keyboardContainer, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.sectionStack,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text
              style={[styles.sectionLabel, { color: colors.textSecondary }]}
            >
              Seçilen görsel
            </Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Her şey hazır
            </Text>

            {/* Çoklu görsel preview */}
            {hasMultipleInputImage === "true" &&
            localImageUris &&
            localImageUris.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.multipleImageContainer}
              >
                {localImageUris.map((uri, index) => (
                  <View key={index} style={styles.multipleImageItem}>
                    <Image
                      source={{ uri }}
                      style={styles.multipleImagePreview}
                    />
                    <Text
                      style={[
                        styles.multipleImageLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Image
                source={{ uri: localImageUri || "" }}
                style={styles.imagePreview}
              />
            )}

            <Text
              style={[styles.sectionHelper, { color: colors.textSecondary }]}
            >
              {hasMultipleInputImage === "true"
                ? "Profesyonel sonuçlar için yüksek çözünürlüklü ve iyi aydınlatılmış görseller öneriyoruz."
                : "Profesyonel sonuçlar için yüksek çözünürlüklü ve iyi aydınlatılmış görseller öneriyoruz."}
            </Text>
          </View>

          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text
              style={[styles.sectionLabel, { color: colors.textSecondary }]}
            >
              Talimat özeti
            </Text>
            <Text
              style={[styles.sectionContent, { color: colors.textPrimary }]}
            >
              {servicePrompt}
            </Text>
            {aiRequestUrl ? (
              <View
                style={[
                  styles.chip,
                  {
                    borderColor: colors.primary,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: colors.primary }]}>
                  {aiRequestUrl}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={[
                styles.buttonPrimary,
                styles.fullWidthButton,
                { backgroundColor: colors.primary },
                isGenerating && styles.buttonPrimaryDisabled,
              ]}
              onPress={handleGenerateImage}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <View style={styles.loadingInline}>
                  <ActivityIndicator color={colors.textOnPrimary} />
                  <Text
                    style={[
                      styles.buttonTextPrimary,
                      styles.loadingInlineText,
                      { color: colors.textOnPrimary },
                    ]}
                  >
                    Hazırlanıyor...
                  </Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.buttonTextPrimary,
                    { color: colors.textOnPrimary },
                  ]}
                >
                  Sihri başlat
                </Text>
              )}
            </Pressable>

            <Pressable
              style={[
                styles.buttonSecondary,
                styles.fullWidthButton,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
              onPress={handleSelectImage}
            >
              <Text
                style={[
                  styles.buttonTextSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                {hasMultipleInputImage === "true"
                  ? "Farklı görseller seç"
                  : "Farklı görsel seç"}
              </Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
              İpucu
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Daha farklı sonuçlar için yeni bir görsel seçebilir veya promptu
              güncelleyerek yeniden deneyebilirsiniz.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderResultView = () => (
    <ScrollView
      contentContainerStyle={styles.scrollArea}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          styles.sectionStack,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: colors.success }]}>
            Sonuç hazır
          </Text>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Studio AI talimatınızı tamamladı
          </Text>
          <Text style={[styles.sectionHelper, { color: colors.textSecondary }]}>
            Sonucu tam ekranda inceleyebilir, cihazınıza indirebilir veya yeni
            bir proje başlatabilirsiniz.
          </Text>

          <View style={styles.resultRow}>
            <View
              style={[
                styles.resultImageWrapper,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
            >
              <Text
                style={[styles.resultLabel, { color: colors.textSecondary }]}
              >
                Önce
              </Text>
              <Image
                source={{ uri: originalImageForResult || localImageUri || "" }}
                style={styles.resultImage}
              />
            </View>

            <View
              style={[
                styles.resultImageWrapper,
                {
                  borderColor: colors.primary,
                  backgroundColor: colors.background,
                },
              ]}
            >
              <View style={styles.resultLabelRow}>
                <Text style={[styles.resultLabel, { color: colors.primary }]}>
                  Sonuç
                </Text>
                <Pressable onPress={() => setImageViewerVisible(true)}>
                  <Text style={[styles.viewerLink, { color: colors.primary }]}>
                    Tam ekran
                  </Text>
                </Pressable>
              </View>
              <Image
                source={{ uri: createdImageUrl || "" }}
                style={styles.resultImage}
              />
            </View>
          </View>

          <View style={styles.resultActions}>
            <Pressable
              style={[
                styles.buttonPrimary,
                styles.fullWidthButton,
                styles.resultPrimaryAction,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleDownloadImage}
            >
              <Text
                style={[
                  styles.buttonTextPrimary,
                  { color: colors.textOnPrimary },
                ]}
              >
                Cihaza indir
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.buttonSecondary,
                styles.fullWidthButton,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
              onPress={handleStartNew}
            >
              <Text
                style={[
                  styles.buttonTextSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                Yeni proje başlat
              </Text>
            </Pressable>
          </View>
        </View>

        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
            Sonuçtan memnun değil misiniz?
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Farklı bir görsel veya revize edilmiş bir prompt ile kısa sürede
            yepyeni bir versiyon elde edebilirsiniz.
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );

  const renderImageViewer = () => (
    <Modal
      visible={isImageViewerVisible}
      transparent={false}
      animationType="slide"
      onRequestClose={() => setImageViewerVisible(false)}
    >
      <SafeAreaView
        style={[styles.viewerContainer, { backgroundColor: colors.background }]}
      >
        <ScrollView
          contentContainerStyle={styles.viewerScrollViewContent}
          maximumZoomScale={4}
          minimumZoomScale={1}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={{ uri: createdImageUrl || "" }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </ScrollView>

        <View
          style={[styles.viewerHeader, { backgroundColor: colors.overlay }]}
        >
          <Pressable
            style={[styles.viewerButton, { backgroundColor: colors.primary }]}
            onPress={handleDownloadImage}
          >
            <Text
              style={[styles.viewerButtonText, { color: colors.textOnPrimary }]}
            >
              İndir
            </Text>
          </Pressable>
          <Pressable
            style={[styles.viewerButton, { backgroundColor: colors.secondary }]}
            onPress={() => setImageViewerVisible(false)}
          >
            <Text
              style={[styles.viewerButtonText, { color: colors.textOnPrimary }]}
            >
              Kapat
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Modal
        visible={isExamplesModalVisible && exampleItems.length > 0}
        transparent
        animationType="fade"
        onRequestClose={() => setExamplesModalVisible(false)}
      >
        <View
          style={[
            styles.examplesModalOverlay,
            { backgroundColor: colors.overlay },
          ]}
        >
          <View
            style={[
              styles.examplesModalContainer,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text
              style={[styles.examplesModalTitle, { color: colors.textPrimary }]}
            >
              Studio AI ile neler mümkün?
            </Text>
            <Text
              style={[
                styles.examplesModalSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              Örnekleri kaydırarak farklı senaryoları inceleyin.
            </Text>

            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleExamplesMomentumEnd}
            >
              {exampleItems.map((item) => (
                <View
                  key={item.id}
                  style={[styles.examplesModalSlide, { width: screenWidth }]}
                >
                  <View
                    style={[
                      styles.examplesModalCard,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.examplesModalSlideTitle,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.examplesModalSlideSubtitle,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {item.subtitle}
                    </Text>

                    <View style={styles.examplesModalImageRow}>
                      <View style={styles.examplesModalImageWrapper}>
                        <Text
                          style={[
                            styles.examplesModalImageLabel,
                            { color: colors.textTertiary },
                          ]}
                        >
                          Önce
                        </Text>
                        <Image
                          source={item.beforeImage}
                          style={styles.examplesModalImage}
                        />
                      </View>
                      <Text
                        style={[
                          styles.examplesModalArrow,
                          { color: colors.primary },
                        ]}
                      >
                        →
                      </Text>
                      <View style={styles.examplesModalImageWrapper}>
                        <Text
                          style={[
                            styles.examplesModalImageLabel,
                            { color: colors.textTertiary },
                          ]}
                        >
                          Sonra
                        </Text>
                        <Image
                          source={item.afterImage}
                          style={styles.examplesModalImage}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.examplesModalIndicators}>
              {exampleItems.map((item, index) => (
                <View
                  key={`${item.id}-dot`}
                  style={[
                    styles.examplesModalDot,
                    { backgroundColor: colors.border },
                    index === activeExampleIndex && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              ))}
            </View>

            <Pressable
              style={[
                styles.examplesModalSkipButton,
                { borderColor: colors.border },
              ]}
              onPress={() => setExamplesModalVisible(false)}
            >
              <Text
                style={[
                  styles.examplesModalSkipText,
                  { color: colors.textSecondary },
                ]}
              >
                Geç / Skip
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={isGenerating}>
        <View
          style={[styles.modalContainer, { backgroundColor: colors.overlay }]}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <View
              style={[styles.loadingIcon, { backgroundColor: colors.primary }]}
            >
              <ActivityIndicator size="large" color={colors.textOnPrimary} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Studio AI çalışıyor
            </Text>
            <Text
              style={[styles.modalSubtitle, { color: colors.textSecondary }]}
            >
              Talimatınız uygulanıyor, lütfen birkaç saniye bekleyin.
            </Text>

            <View style={styles.modalTimeline}>
              <View style={styles.modalTimelineItem}>
                <View
                  style={[
                    styles.modalTimelineDot,
                    { backgroundColor: colors.primary },
                  ]}
                />
                <Text
                  style={[
                    styles.modalTimelineText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Görsel yükleniyor
                </Text>
              </View>
              <View style={styles.modalTimelineItem}>
                <View
                  style={[
                    styles.modalTimelineDot,
                    { backgroundColor: colors.primary },
                  ]}
                />
                <Text
                  style={[
                    styles.modalTimelineText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Yapay zeka sonucu hazırlıyor
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

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
  scrollArea: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxl,
  },
  heroCard: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xl,
    ...Shadows.lg,
  },
  heroBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: Typography.fontSize.xxxxxl,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.sm,
  },
  heroDescription: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
    marginBottom: Spacing.xl,
  },
  heroMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.xl,
  },
  heroMetaItem: {
    flexBasis: "48%",
    flexGrow: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  heroMetaLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: Typography.letterSpacing.wide,
  },
  heroMetaValue: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.primary,
  },
  stepsCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    borderWidth: 1,
    ...Shadows.sm,
  },
  examplesCard: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    marginTop: Spacing.xl,
    ...Shadows.none,
  },
  examplesDescription: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
    marginBottom: Spacing.xl,
  },
  exampleList: {
    paddingRight: Spacing.xl,
  },
  exampleItem: {
    width: 260,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginRight: Spacing.lg,
  },
  exampleItemLast: {
    marginRight: 0,
  },
  exampleTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: Spacing.xs,
  },
  exampleSubtitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.md,
  },
  exampleImageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exampleImageWrapper: {
    alignItems: "center",
    flex: 1,
  },
  exampleImageLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: Typography.letterSpacing.wide,
  },
  exampleArrow: {
    fontSize: Typography.fontSize.xxl,
    marginHorizontal: Spacing.md,
    fontFamily: Typography.fontFamily.semiBold,
  },
  exampleImage: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.md,
  },
  examplesModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  examplesModalContainer: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    ...Shadows.xl,
  },
  examplesModalTitle: {
    fontSize: Typography.fontSize.xxxl,
    fontFamily: Typography.fontFamily.bold,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  examplesModalSubtitle: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
  },
  examplesModalSlide: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  examplesModalCard: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.xxl,
  },
  examplesModalSlideTitle: {
    fontSize: Typography.fontSize.xxl,
    fontFamily: Typography.fontFamily.bold,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  examplesModalSlideSubtitle: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  examplesModalImageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  examplesModalImageWrapper: {
    alignItems: "center",
    flex: 1,
  },
  examplesModalImageLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    textTransform: "uppercase",
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: Spacing.xs,
  },
  examplesModalImage: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.lg,
  },
  examplesModalArrow: {
    fontSize: Typography.fontSize.xxxl,
    marginHorizontal: Spacing.lg,
    fontFamily: Typography.fontFamily.semiBold,
  },
  examplesModalIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  examplesModalDot: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
    marginHorizontal: Spacing.xs,
  },
  examplesModalSkipButton: {
    alignSelf: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  examplesModalSkipText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xxl,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.lg,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  stepNumberText: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: Spacing.xs,
  },
  stepSubtitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  buttonPrimary: {
    paddingVertical: ComponentTokens.button.padding.lg.vertical,
    paddingHorizontal: ComponentTokens.button.padding.lg.horizontal,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  buttonPrimaryDisabled: {
    opacity: 0.7,
  },
  buttonTextPrimary: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    textTransform: "uppercase",
    letterSpacing: Typography.letterSpacing.wide,
  },
  buttonSecondary: {
    paddingVertical: ComponentTokens.button.padding.md.vertical,
    paddingHorizontal: ComponentTokens.button.padding.md.horizontal,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
  },
  fullWidthButton: {
    width: "100%",
  },
  buttonTextSecondary: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
  },
  loadingInline: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingInlineText: {
    marginLeft: Spacing.sm,
  },
  keyboardContainer: {
    flex: 1,
  },
  sectionStack: {
    width: "100%",
  },
  sectionCard: {
    width: "100%",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    ...Shadows.sm,
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    textTransform: "uppercase",
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: Spacing.sm,
  },
  sectionHelper: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.primary,
    marginTop: Spacing.md,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  sectionContent: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
  },
  imagePreview: {
    width: "100%",
    height: 320,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
  },
  multipleImageContainer: {
    marginTop: Spacing.lg,
    maxHeight: 200,
  },
  multipleImageItem: {
    marginRight: Spacing.md,
    alignItems: "center",
  },
  multipleImagePreview: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  multipleImageLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginTop: Spacing.md,
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
  },
  actionRow: {
    marginTop: Spacing.xl,
    width: "100%",
    alignItems: "stretch",
  },
  infoCard: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    borderWidth: 1,
    ...Shadows.none,
    marginTop: Spacing.xl,
  },
  infoTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
  },
  resultRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: Spacing.xl,
  },
  resultImageWrapper: {
    flexBasis: "48%",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  resultLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  resultLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    textTransform: "uppercase",
    letterSpacing: Typography.letterSpacing.wide,
  },
  viewerLink: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    textTransform: "uppercase",
  },
  resultImage: {
    width: "100%",
    height: 220,
    borderRadius: BorderRadius.md,
  },
  resultPrimaryAction: {
    marginBottom: Spacing.md,
  },
  resultActions: {
    marginTop: Spacing.xl,
    width: "100%",
    alignItems: "stretch",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: "center",
    ...Shadows.xl,
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.fontSize.xxl,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.primary,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
  },
  modalTimeline: {
    width: "100%",
  },
  modalTimelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  modalTimelineDot: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.md,
  },
  modalTimelineText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.primary,
  },
  viewerContainer: {
    flex: 1,
  },
  viewerScrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  fullscreenImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  viewerHeader: {
    position: "absolute",
    top: 40,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  viewerButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 100,
    alignItems: "center",
  },
  viewerButtonText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
  },
});

export default ImageGeneratorScreen;
