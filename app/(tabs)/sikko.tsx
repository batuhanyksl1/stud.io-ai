import { useContentCreation } from "@/hooks";
import { useAppDispatch } from "@/store/hooks";
import { pickImage } from "@/utils/pickImage";
import * as MediaLibrary from "expo-media-library";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  TextInput,
  View,
} from "react-native";
import { pollAiToolStatus } from "../../store/slices/contentCreationSlice";

// Profesyonel ve kullanıcı dostu bir arayüz
const ImageGeneratorScreen = () => {
  const dispatch = useAppDispatch();
  const {
    uploadImageToStorage,
    uploadImageToAITool,
    createdImageUrl,
    status,
    error,
  } = useContentCreation();

  // Component'e özel state'ler
  const [localImageUri, setLocalImageUri] = useState<string | null>(null); // Galeriden seçilen görselin yerel adresi
  const [originalImageForResult, setOriginalImageForResult] = useState<
    string | null
  >(null); // Sonuç ekranındaki "önce" görseli için
  const [isImageViewerVisible, setImageViewerVisible] =
    useState<boolean>(false); // Tam ekran resim görüntüleyici
  const [prompt, setPrompt] = useState<string>(""); // Kullanıcının girdiği metin
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Başlangıç durumuna sıfırlama fonksiyonu
  const resetState = useCallback(() => {
    setLocalImageUri(null);
    setOriginalImageForResult(null);
    setPrompt("");
    setErrorMessage(null);
    setImageViewerVisible(false);
    // Gerekirse Redux state'ini de temizlemek için bir action dispatch edilebilir.
  }, []);

  // Adım 1: Sadece galeriden görsel seçme
  const handleSelectImage = async () => {
    try {
      const pickedImageUri = await pickImage();
      if (pickedImageUri) {
        resetState(); // Yeni görsel seçildiğinde eski sonuçları temizle
        setLocalImageUri(pickedImageUri);
      }
    } catch (e) {
      setErrorMessage("Görsel seçilirken bir hata oluştu.");
    }
  };

  // Adım 2: Görseli işleme sürecini başlatma
  const handleGenerateImage = async () => {
    if (!localImageUri) {
      setErrorMessage("Lütfen önce bir görsel seçin.");
      return;
    }
    if (!prompt.trim()) {
      setErrorMessage("Lütfen görsele ne yapmak istediğinizi yazın.");
      return;
    }

    setErrorMessage(null);
    setOriginalImageForResult(localImageUri); // "Önce" görselini sonuç ekranı için sakla

    try {
      // Zincirleme işlemleri daha okunabilir hale getirelim
      const imageUrl = await uploadImageToStorage(localImageUri);
      if (!imageUrl) throw new Error("Görsel sunucuya yüklenemedi.");

      const aiToolRequest = await uploadImageToAITool(imageUrl, prompt);
      const requestId = aiToolRequest?.request_id?.toString();
      if (!requestId) throw new Error("Yapay zeka aracı başlatılamadı.");

      const aiToolStatusResult = await dispatch(
        pollAiToolStatus({ requestId }),
      );
      if (aiToolStatusResult.meta.requestStatus === "rejected") {
        throw new Error("Yapay zeka görseli işleyemedi.");
      }

      const resultPayload = aiToolStatusResult.payload as any;
      const finalUrl = resultPayload?.images?.[0]?.url;

      if (!finalUrl) {
        throw new Error("Yapay zekadan geçerli bir sonuç alınamadı.");
      }

      // `createdImageUrl` hook tarafından güncellendiği için ek bir state'e gerek yok.
      // Başarılı olunca `localImageUri`'yi `null` yapabiliriz ki sonuç ekranı görünsün.
    } catch (err: any) {
      const message = err.message || "Bilinmeyen bir hata oluştu.";
      Alert.alert("İşlem Başarısız", message);
      setErrorMessage(message);
      setOriginalImageForResult(null); // Hata durumunda "önce" görselini temizle
    }
  };

  // Görseli galeriye indirme fonksiyonu
  const handleDownloadImage = async () => {
    if (!createdImageUrl) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "İzin Gerekli",
          "Görseli kaydetmek için film rulosuna erişim izni vermeniz gerekiyor.",
        );
        return;
      }

      await MediaLibrary.saveToLibraryAsync(createdImageUrl);
      Alert.alert("Başarılı!", "Görsel galerinize kaydedildi.");
      setImageViewerVisible(false); // İndirdikten sonra görüntüleyiciyi kapat
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Görsel kaydedilirken bir sorun oluştu.");
    }
  };

  // Arayüzü duruma göre render eden fonksiyonlar
  const renderInitialView = () => (
    <View style={styles.centeredContainer}>
      <Text style={styles.title}>Yapay Zeka Stüdyosu</Text>
      <Text style={styles.subtitle}>
        Bir görsel seçin ve nasıl dönüştüreceğinizi hayal edin.
      </Text>
      <Pressable style={styles.ctaButton} onPress={handleSelectImage}>
        <Text style={styles.ctaButtonText}>🖼️ Galeriden Görsel Seç</Text>
      </Pressable>
    </View>
  );

  const renderEditingView = () =>
    localImageUri && (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Görseliniz Hazır!</Text>
          <Image source={{ uri: localImageUri }} style={styles.previewImage} />
          <Text style={styles.promptLabel}>
            Bu görsele ne yapmak istersiniz?
          </Text>
          <TextInput
            style={styles.promptInput}
            placeholder="Örn: Suluboya bir tabloya çevir"
            value={prompt}
            onChangeText={setPrompt}
          />
          <Pressable
            style={styles.ctaButton}
            onPress={handleGenerateImage}
            disabled={status === "pending"}
          >
            <Text style={styles.ctaButtonText}>✨ Dönüştür</Text>
          </Pressable>
          <Pressable
            style={[styles.ctaButton, styles.secondaryButton]}
            onPress={handleSelectImage}
          >
            <Text style={[styles.ctaButtonText, styles.secondaryButtonText]}>
              Görseli Değiştir
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );

  const renderResultView = () =>
    createdImageUrl && (
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>İşte Sonuç!</Text>
        <View style={styles.resultContainer}>
          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>ÖNCE</Text>
            <Image
              source={{ uri: originalImageForResult || "" }}
              style={styles.resultImage}
            />
          </View>
          <Pressable
            style={styles.imageContainer}
            onPress={() => setImageViewerVisible(true)}
          >
            <Text style={styles.imageLabel}>SONRA (Büyütmek için tıkla)</Text>
            <Image
              source={{ uri: createdImageUrl }}
              style={styles.resultImage}
            />
          </Pressable>
        </View>
        <Pressable style={styles.ctaButton} onPress={resetState}>
          <Text style={styles.ctaButtonText}>Yeni Bir Tane Yap</Text>
        </Pressable>
      </View>
    );

  const renderImageViewer = () => (
    <Modal
      visible={isImageViewerVisible}
      transparent={false}
      animationType="slide"
      onRequestClose={() => setImageViewerVisible(false)}
    >
      <SafeAreaView style={styles.viewerContainer}>
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
        <View style={styles.viewerHeader}>
          <Pressable
            style={[styles.viewerButton, styles.downloadButton]}
            onPress={handleDownloadImage}
          >
            <Text style={styles.viewerButtonText}>İndir</Text>
          </Pressable>
          <Pressable
            style={styles.viewerButton}
            onPress={() => setImageViewerVisible(false)}
          >
            <Text style={styles.viewerButtonText}>Kapat</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Yükleme Modalı */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={status === "pending"}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#5A67D8" />
            <Text style={styles.modalText}>Yapay zeka sihrini yapıyor...</Text>
            <Text style={styles.modalSubText}>
              Bu işlem biraz zaman alabilir.
            </Text>
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
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    marginBottom: 40,
  },
  ctaButton: {
    backgroundColor: "#5A67D8",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  ctaButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#A0AEC0",
    elevation: 0,
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "#4A5568",
  },
  previewImage: {
    width: 280,
    height: 280,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  promptLabel: {
    fontSize: 16,
    color: "#4A5568",
    alignSelf: "flex-start",
    marginBottom: 10,
    fontWeight: "500",
  },
  promptInput: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#CBD5E0",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    color: "#2D3748",
  },
  modalSubText: {
    fontSize: 14,
    color: "#718096",
    marginTop: 5,
  },
  resultContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 20,
  },
  imageContainer: {
    alignItems: "center",
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#A0AEC0",
    marginBottom: 5,
    textAlign: "center",
  },
  resultImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  errorText: {
    color: "#E53E3E",
    textAlign: "center",
    padding: 10,
    fontWeight: "bold",
  },
  // Viewer Styles
  viewerContainer: {
    flex: 1,
    backgroundColor: "#000",
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
    paddingHorizontal: 20,
  },
  viewerButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  downloadButton: {
    backgroundColor: "#4299E1",
  },
  viewerButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ImageGeneratorScreen;
