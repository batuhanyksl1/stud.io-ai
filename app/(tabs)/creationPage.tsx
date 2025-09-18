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
import { useAppDispatch } from "@/store/hooks";
import { pickImage } from "@/utils/pickImage";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
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
import { pollAiToolStatus } from "../../store/slices/contentCreationSlice";

// Profesyonel ve kullanıcı dostu bir arayüz
const ImageGeneratorScreen = () => {
  const { servicePrompt, aiToolRequest, aiToolStatus, aiToolResult } =
    useLocalSearchParams<{
      servicePrompt: string;
      aiToolRequest: string;
      aiToolStatus: string;
      aiToolResult: string;
    }>();
  console.log("🔍 CreationPage - servicePrompt:", servicePrompt);
  console.log("🔍 CreationPage - aiToolRequest:", aiToolRequest);
  console.log("🔍 CreationPage - aiToolStatus:", aiToolStatus);
  console.log("🔍 CreationPage - aiToolResult:", aiToolResult);

  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { uploadImageToStorage, uploadImageToAITool, createdImageUrl, status } =
    useContentCreation();

  console.log("🔍 CreationPage - current status:", status);
  console.log("🔍 CreationPage - createdImageUrl:", createdImageUrl);

  // Component'e özel state'ler
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [originalImageForResult, setOriginalImageForResult] = useState<
    string | null
  >(null);
  const [isImageViewerVisible, setImageViewerVisible] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Animation states
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  // Başlangıç durumuna sıfırlama fonksiyonu
  const resetState = useCallback(() => {
    setLocalImageUri(null);
    setOriginalImageForResult(null);
    setErrorMessage(null);
    setImageViewerVisible(false);
  }, []);

  // Animation effects
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: Animations.duration.normal,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [localImageUri, createdImageUrl, fadeAnim, scaleAnim]);

  // Adım 1: Sadece galeriden görsel seçme
  const handleSelectImage = async () => {
    console.log("🖼️ handleSelectImage - başladı");
    try {
      const pickedImageUri = await pickImage();
      console.log("🖼️ handleSelectImage - pickedImageUri:", pickedImageUri);
      if (pickedImageUri) {
        resetState();
        setLocalImageUri(pickedImageUri);
        console.log("🖼️ handleSelectImage - görsel başarıyla seçildi");
      } else {
        console.log("🖼️ handleSelectImage - görsel seçilmedi");
      }
    } catch (error) {
      console.error("🖼️ handleSelectImage - hata:", error);
      setErrorMessage("Görsel seçilirken bir hata oluştu.");
    }
  };

  // Adım 2: Görseli işleme sürecini başlatma
  const handleGenerateImage = async () => {
    console.log("✨ handleGenerateImage - başladı");
    console.log("✨ handleGenerateImage - localImageUri:", localImageUri);
    console.log("✨ handleGenerateImage - servicePrompt:", servicePrompt);

    if (!localImageUri) {
      console.log("❌ handleGenerateImage - görsel seçilmemiş");
      setErrorMessage("Lütfen önce bir görsel seçin.");
      return;
    }
    if (!servicePrompt) {
      console.log("❌ handleGenerateImage - prompt yazılmamış");
      setErrorMessage("Lütfen bir prompt yazın.");
      return;
    }

    setErrorMessage(null);
    setOriginalImageForResult(localImageUri);
    console.log("✨ handleGenerateImage - işlem başlatılıyor...");

    try {
      console.log("📤 handleGenerateImage - görsel storage'a yükleniyor...");
      const imageUrl = await uploadImageToStorage(localImageUri);
      console.log("📤 handleGenerateImage - storage yanıtı:", imageUrl);

      if (!imageUrl) {
        console.error("❌ handleGenerateImage - storage yanıtı boş");
        throw new Error("Görsel sunucuya yüklenemedi.");
      }

      console.log("🤖 handleGenerateImage - AI Tool'a görsel yükleniyor...");
      console.log("🤖 handleGenerateImage - imageUrl:", imageUrl);
      console.log("🤖 handleGenerateImage - servicePrompt:", servicePrompt);
      console.log("🤖 handleGenerateImage - aiToolRequest:", aiToolRequest);

      // AI Tool'a görsel yükle
      const aiToolResponse = await uploadImageToAITool(
        imageUrl,
        servicePrompt || "",
        aiToolRequest || "",
        "", // requestId henüz yok, boş string olarak gönder
      );

      console.log("🤖 handleGenerateImage - AI Tool yanıtı:", aiToolResponse);

      // Type guard for request_id
      let generatedRequestId: string | undefined;
      if (typeof aiToolResponse === "string") {
        console.error(
          "❌ handleGenerateImage - beklenmeyen yanıt formatı:",
          typeof aiToolResponse,
        );
        throw new Error("Beklenmeyen yanıt formatı alındı.");
      } else {
        generatedRequestId = aiToolResponse?.request_id?.toString();
        console.log(
          "🆔 handleGenerateImage - generatedRequestId:",
          generatedRequestId,
        );
      }

      if (!generatedRequestId) {
        console.error("❌ handleGenerateImage - request_id alınamadı");
        throw new Error("Yapay zeka aracı başlatılamadı.");
      }

      console.log(
        "⏳ handleGenerateImage - AI Tool durumu kontrol ediliyor...",
      );
      const aiToolStatusResult = await dispatch(
        pollAiToolStatus({
          requestId: generatedRequestId,
          aiToolStatus: aiToolStatus || "",
          aiToolResult: aiToolResult || "",
        }),
      );

      console.log(
        "⏳ handleGenerateImage - pollAiToolStatus sonucu:",
        aiToolStatusResult,
      );

      if (aiToolStatusResult.meta.requestStatus === "rejected") {
        console.error(
          "❌ handleGenerateImage - AI Tool reddedildi:",
          aiToolStatusResult.meta,
        );
        throw new Error("Yapay zeka görseli işleyemedi.");
      }

      const resultPayload = aiToolStatusResult.payload as any;
      console.log("📊 handleGenerateImage - resultPayload:", resultPayload);

      const finalUrl = resultPayload?.images?.[0]?.url;
      console.log("🖼️ handleGenerateImage - finalUrl:", finalUrl);

      if (!finalUrl) {
        console.error("❌ handleGenerateImage - finalUrl bulunamadı");
        throw new Error("Yapay zekadan geçerli bir sonuç alınamadı.");
      }

      console.log("✅ handleGenerateImage - işlem başarıyla tamamlandı");
    } catch (err: any) {
      console.error("❌ handleGenerateImage - hata yakalandı:", err);
      const message = err.message || "Bilinmeyen bir hata oluştu.";
      console.error("❌ handleGenerateImage - hata mesajı:", message);
      Alert.alert("İşlem Başarısız", message);
      setErrorMessage(message);
      setOriginalImageForResult(null);
    }
  };

  // Görseli galeriye indirme fonksiyonu
  const handleDownloadImage = async () => {
    console.log("💾 handleDownloadImage - başladı");
    console.log("💾 handleDownloadImage - createdImageUrl:", createdImageUrl);

    if (!createdImageUrl) {
      console.log("❌ handleDownloadImage - createdImageUrl yok");
      return;
    }

    try {
      console.log("🔐 handleDownloadImage - izin isteniyor...");
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log("🔐 handleDownloadImage - izin durumu:", status);

      if (status !== "granted") {
        console.log("❌ handleDownloadImage - izin reddedildi");
        Alert.alert(
          "İzin Gerekli",
          "Görseli kaydetmek için film rulosuna erişim izni vermeniz gerekiyor.",
        );
        return;
      }

      console.log("💾 handleDownloadImage - görsel kaydediliyor...");
      await MediaLibrary.saveToLibraryAsync(createdImageUrl);
      console.log("✅ handleDownloadImage - görsel başarıyla kaydedildi");
      Alert.alert("Başarılı!", "Görsel galerinize kaydedildi.");
      setImageViewerVisible(false);
    } catch (error) {
      console.error("❌ handleDownloadImage - hata:", error);
      Alert.alert("Hata", "Görsel kaydedilirken bir sorun oluştu.");
    }
  };

  // Arayüzü duruma göre render eden fonksiyonlar
  const renderInitialView = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          styles.centeredContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View
          style={[styles.heroContainer, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.heroIcon, { color: colors.primary }]}>🎨</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Yapay Zeka Stüdyosuuuu
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Bir görsel seçin ve nasıl dönüştüreceğinizi hayal edin
          </Text>
          {/* <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {servicePrompt}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {aiToolRequest}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {aiToolStatus}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {aiToolResult}
          </Text> */}
        </View>

        <Pressable
          style={[styles.ctaButton, { backgroundColor: colors.primary }]}
          onPress={handleSelectImage}
        >
          <Text style={[styles.ctaButtonText, { color: colors.textOnPrimary }]}>
            🖼️ Galeriden Görsel Seç
          </Text>
        </Pressable>

        <View style={[styles.featureGrid, { backgroundColor: colors.surface }]}>
          <View style={styles.featureItem}>
            <Text style={[styles.featureIcon, { color: colors.primary }]}>
              ✨
            </Text>
            <Text style={[styles.featureText, { color: colors.textSecondary }]}>
              Hızlı Dönüştürme
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={[styles.featureIcon, { color: colors.primary }]}>
              ��
            </Text>
            <Text style={[styles.featureText, { color: colors.textSecondary }]}>
              Yüksek Kalite
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={[styles.featureIcon, { color: colors.primary }]}>
              💾
            </Text>
            <Text style={[styles.featureText, { color: colors.textSecondary }]}>
              Kolay İndirme
            </Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );

  const renderEditingView = () =>
    localImageUri && (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.editingContent,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View
              style={[styles.headerCard, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Görseliniz Hazır! 🎉
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Şimdi ne yapmak istediğinizi söyleyin
              </Text>
            </View>

            <View
              style={[styles.imageCard, { backgroundColor: colors.surface }]}
            >
              <Image
                source={{ uri: localImageUri }}
                style={styles.previewImage}
              />
            </View>

            {/* <View
              style={[styles.inputCard, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.promptLabel, { color: colors.textPrimary }]}>
                Bu görsele ne yapmak istersiniz?
              </Text>
              <TextInput
                style={[
                  styles.promptInput,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="Örn: Suluboya bir tabloya çevir, anime tarzında yap..."
                placeholderTextColor={colors.textTertiary}
                value={servicePrompt as string}
                onChangeText={() => {}}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View> */}

            <View style={styles.buttonGroup}>
              <Pressable
                style={[
                  styles.ctaButton,
                  { backgroundColor: colors.primary },
                  status === "pending" && {
                    backgroundColor: colors.interactiveDisabled,
                  },
                ]}
                onPress={handleGenerateImage}
                disabled={status === "pending"}
              >
                <Text
                  style={[
                    styles.ctaButtonText,
                    { color: colors.textOnPrimary },
                  ]}
                >
                  ✨ Dönüştür
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.secondaryButton,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  },
                ]}
                onPress={handleSelectImage}
              >
                <Text
                  style={[
                    styles.secondaryButtonText,
                    { color: colors.textSecondary },
                  ]}
                >
                  🔄 Görseli Değiştir
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    );

  const renderResultView = () =>
    createdImageUrl && (
      <Animated.View
        style={[
          styles.centeredContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View
          style={[styles.resultHeader, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            İşte Sonuç! 🎊
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Yapay zeka sihrini tamamladı
          </Text>
        </View>

        <View
          style={[styles.resultContainer, { backgroundColor: colors.surface }]}
        >
          <View style={styles.imageContainer}>
            <Text style={[styles.imageLabel, { color: colors.textSecondary }]}>
              ÖNCE
            </Text>
            <Image
              source={{ uri: originalImageForResult || "" }}
              style={styles.resultImage}
            />
          </View>

          <View style={styles.arrowContainer}>
            <Text style={[styles.arrowText, { color: colors.primary }]}>→</Text>
          </View>

          <Pressable
            style={styles.imageContainer}
            onPress={() => setImageViewerVisible(true)}
          >
            <Text style={[styles.imageLabel, { color: colors.textSecondary }]}>
              SONRA
            </Text>
            <Text style={[styles.tapToZoom, { color: colors.primary }]}>
              (Büyütmek için tıkla)
            </Text>
            <Image
              source={{ uri: createdImageUrl }}
              style={styles.resultImage}
            />
          </Pressable>
        </View>

        <View style={styles.resultActions}>
          <Pressable
            style={[styles.ctaButton, { backgroundColor: colors.primary }]}
            onPress={resetState}
          >
            <Text
              style={[styles.ctaButtonText, { color: colors.textOnPrimary }]}
            >
              🆕 Yeni Bir Tane Yap
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.secondaryButton,
              {
                borderColor: colors.border,
                backgroundColor: colors.surface,
              },
            ]}
            onPress={() => setImageViewerVisible(true)}
          >
            <Text
              style={[
                styles.secondaryButtonText,
                { color: colors.textSecondary },
              ]}
            >
              🔍 Detaylı Görüntüle
            </Text>
          </Pressable>
        </View>
      </Animated.View>
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
          centerContent={true}
          maximumZoomScale={4}
          minimumZoomScale={1}
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
            style={[styles.viewerButton, { backgroundColor: colors.success }]}
            onPress={handleDownloadImage}
          >
            <Text
              style={[styles.viewerButtonText, { color: colors.textOnPrimary }]}
            >
              💾 İndir
            </Text>
          </Pressable>

          <Pressable
            style={[styles.viewerButton, { backgroundColor: colors.error }]}
            onPress={() => setImageViewerVisible(false)}
          >
            <Text
              style={[styles.viewerButtonText, { color: colors.textOnPrimary }]}
            >
              ✕ Kapat
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
      {/* Yükleme Modalı */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={status === "pending"}
      >
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
            <Text style={[styles.modalText, { color: colors.textPrimary }]}>
              Yapay zeka sihrini yapıyor... ✨
            </Text>
            <Text
              style={[styles.modalSubText, { color: colors.textSecondary }]}
            >
              Bu işlem biraz zaman alabilir
            </Text>

            <View style={styles.loadingSteps}>
              <View style={styles.loadingStep}>
                <View
                  style={[styles.stepDot, { backgroundColor: colors.primary }]}
                />
                <Text
                  style={[styles.stepText, { color: colors.textSecondary }]}
                >
                  Görsel yükleniyor
                </Text>
              </View>
              <View style={styles.loadingStep}>
                <View
                  style={[styles.stepDot, { backgroundColor: colors.primary }]}
                />
                <Text
                  style={[styles.stepText, { color: colors.textSecondary }]}
                >
                  AI işleniyor
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Tam Ekran Görüntüleyici Modalı */}
      {renderImageViewer()}

      {/* Ana İçerik */}
      {!localImageUri && !createdImageUrl && renderInitialView()}
      {localImageUri && !createdImageUrl && renderEditingView()}
      {createdImageUrl && renderResultView()}

      {/* Hata Mesajı */}
      {errorMessage && (
        <View
          style={[
            styles.errorContainer,
            { backgroundColor: colors.errorSubtle },
          ]}
        >
          <Text style={[styles.errorText, { color: colors.error }]}>
            ⚠️ {errorMessage}
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
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  contentContainer: {
    flexGrow: 1,
    padding: Spacing.xl,
  },
  scrollContentContainer: {
    flexGrow: 1,
    padding: Spacing.xl,
  },
  editingContent: {
    alignItems: "center",
  },

  // Hero Section
  heroContainer: {
    padding: Spacing.xxl,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    marginBottom: Spacing.xl,
    ...Shadows.lg,
  },
  heroIcon: {
    fontSize: Typography.fontSize.xxxxxl,
    marginBottom: Spacing.md,
  },

  // Feature Grid
  featureGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.xl,
    ...Shadows.sm,
  },
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    fontSize: Typography.fontSize.xxl,
    marginBottom: Spacing.xs,
  },
  featureText: {
    fontSize: Typography.fontSize.sm,
    textAlign: "center",
    fontFamily: Typography.fontFamily.medium,
  },

  // Cards
  headerCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    marginBottom: Spacing.lg,
    width: "100%",
    ...Shadows.md,
  },
  imageCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  inputCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    width: "100%",
    ...Shadows.sm,
  },

  // Typography
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    textAlign: "center",
    marginBottom: Spacing.lg,
    fontFamily: Typography.fontFamily.medium,
  },

  // Buttons
  ctaButton: {
    paddingVertical: ComponentTokens.button.padding.lg.vertical,
    paddingHorizontal: ComponentTokens.button.padding.lg.horizontal,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
    marginTop: Spacing.md,
    width: "100%",
    alignItems: "center",
    height: ComponentTokens.button.height.lg,
    justifyContent: "center",
  },
  ctaButtonText: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
  },
  secondaryButton: {
    borderWidth: 1,
    paddingVertical: ComponentTokens.button.padding.md.vertical,
    paddingHorizontal: ComponentTokens.button.padding.md.horizontal,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
    width: "100%",
    alignItems: "center",
    height: ComponentTokens.button.height.md,
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
  },
  buttonGroup: {
    width: "100%",
    marginTop: Spacing.md,
  },

  // Images
  previewImage: {
    width: 280,
    height: 280,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  resultImage: {
    width: 150,
    height: 150,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },

  // Input
  promptLabel: {
    fontSize: Typography.fontSize.md,
    alignSelf: "flex-start",
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.semiBold,
  },
  promptInput: {
    width: "100%",
    minHeight: 80,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.md,
    borderWidth: 1,
    fontFamily: Typography.fontFamily.primary,
  },

  // Result View
  resultHeader: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    marginBottom: Spacing.lg,
    width: "100%",
    ...Shadows.md,
  },
  resultContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.lg,
    ...Shadows.sm,
  },
  imageContainer: {
    alignItems: "center",
    flex: 1,
  },
  arrowContainer: {
    alignItems: "center",
    paddingHorizontal: Spacing.md,
  },
  arrowText: {
    fontSize: Typography.fontSize.xxl,
    fontFamily: Typography.fontFamily.bold,
  },
  imageLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  tapToZoom: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.primary,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  resultActions: {
    width: "100%",
    marginTop: Spacing.lg,
  },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: Spacing.xxl,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    width: "80%",
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
  modalText: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  modalSubText: {
    fontSize: Typography.fontSize.md,
    textAlign: "center",
    marginBottom: Spacing.lg,
    fontFamily: Typography.fontFamily.primary,
  },
  loadingSteps: {
    width: "100%",
    marginTop: Spacing.md,
  },
  loadingStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  stepText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.primary,
  },

  // Error
  errorContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    margin: Spacing.md,
    alignItems: "center",
  },
  errorText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
    textAlign: "center",
  },

  // Viewer
  viewerContainer: {
    flex: 1,
  },
  viewerScrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  viewerHeader: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.lg,
  },
  viewerButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 80,
    alignItems: "center",
  },
  viewerButtonText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.md,
  },
});

export default ImageGeneratorScreen;
