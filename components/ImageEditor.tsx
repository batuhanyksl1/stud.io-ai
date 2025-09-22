import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearError,
  deleteImage,
  pickImage,
  processImageWithDummyService,
  setSelectedImage,
  takePhoto,
  uploadImageToStorage,
} from "@/store/slices/contentCreationSlice";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedButton } from "./ThemedButton";
import { ThemedCard } from "./ThemedCard";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { LoadingSpinner } from "./ui/LoadingSpinner";

export const ImageEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    images,
    selectedImageId,
    isUploading,
    isProcessing,
    error,
    uploadProgress,
  } = useAppSelector((state) => state.edit);

  const selectedImage = images.find((img) => img.id === selectedImageId);

  const handlePickImage = async () => {
    try {
      await dispatch(pickImage()).unwrap();
    } catch (error) {
      Alert.alert("Hata", error as string);
    }
  };

  const handleTakePhoto = async () => {
    try {
      await dispatch(takePhoto()).unwrap();
    } catch (error) {
      Alert.alert("Hata", error as string);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage) {
      Alert.alert("Hata", "Lütfen önce bir görsel seçin");
      return;
    }

    try {
      await dispatch(uploadImageToStorage(selectedImage.id)).unwrap();
      Alert.alert("Başarılı", "Görsel başarıyla yüklendi!");
    } catch (error) {
      Alert.alert("Hata", error as string);
    }
  };

  const handleProcessImage = async () => {
    if (!selectedImage || !selectedImage.isUploaded) {
      Alert.alert("Hata", "Lütfen önce görseli yükleyin");
      return;
    }

    try {
      await dispatch(processImageWithDummyService(selectedImage.id)).unwrap();
      Alert.alert("Başarılı", "Görsel başarıyla işlendi!");
    } catch (error) {
      Alert.alert("Hata", error as string);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    Alert.alert(
      "Görseli Sil",
      "Bu görseli silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deleteImage(imageId)).unwrap();
            } catch (error) {
              Alert.alert("Hata", error as string);
            }
          },
        },
      ],
    );
  };

  const handleImageSelect = (imageId: string) => {
    dispatch(setSelectedImage(imageId));
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Görsel Düzenleyici</ThemedText>
          <ThemedText style={styles.subtitle}>
            Görsellerinizi seçin, yükleyin ve işleyin
          </ThemedText>
        </View>

        {/* Error Display */}
        {error && (
          <ThemedCard style={styles.errorCard}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <TouchableOpacity
              onPress={clearErrorMessage}
              style={styles.clearError}
            >
              <ThemedText style={styles.clearErrorText}>✕</ThemedText>
            </TouchableOpacity>
          </ThemedCard>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <ThemedButton
            title="Galeriden Seç"
            onPress={handlePickImage}
            style={styles.actionButton}
            icon="📁"
          />
          <ThemedButton
            title="Fotoğraf Çek"
            onPress={handleTakePhoto}
            style={styles.actionButton}
            icon="📷"
          />
        </View>

        {/* Upload Progress */}
        {isUploading && (
          <ThemedCard style={styles.progressCard}>
            <ThemedText style={styles.progressText}>
              Yükleniyor... %{uploadProgress}
            </ThemedText>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${uploadProgress}%` }]}
              />
            </View>
          </ThemedCard>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <ThemedCard style={styles.processingCard}>
            <LoadingSpinner size="small" />
            <ThemedText style={styles.processingText}>
              Görsel işleniyor...
            </ThemedText>
          </ThemedCard>
        )}

        {/* Selected Image Actions */}
        {selectedImage && (
          <ThemedCard style={styles.selectedImageCard}>
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.selectedImage}
            />
            <View style={styles.imageInfo}>
              <ThemedText style={styles.imageName}>
                {selectedImage.fileName}
              </ThemedText>
              <ThemedText style={styles.imageSize}>
                {(selectedImage.fileSize / 1024 / 1024).toFixed(2)} MB
              </ThemedText>
            </View>
            <View style={styles.imageActions}>
              {!selectedImage.isUploaded && (
                <ThemedButton
                  title="Yükle"
                  onPress={handleUploadImage}
                  style={styles.actionButton}
                  disabled={isUploading}
                />
              )}
              {selectedImage.isUploaded && !selectedImage.isProcessing && (
                <ThemedButton
                  title="İşle"
                  onPress={handleProcessImage}
                  style={styles.actionButton}
                  disabled={isProcessing}
                />
              )}
              <ThemedButton
                title="Sil"
                onPress={() => handleDeleteImage(selectedImage.id)}
                style={[styles.actionButton, styles.deleteButton]}
                variant="destructive"
              />
            </View>
            {selectedImage.processingResult && (
              <View style={styles.processingResult}>
                <ThemedText style={styles.resultTitle}>
                  İşleme Sonucu:
                </ThemedText>
                <ThemedText style={styles.resultText}>
                  Parlaklık:{" "}
                  {(
                    selectedImage.processingResult.enhancements.brightness * 100
                  ).toFixed(0)}
                  %
                </ThemedText>
                <ThemedText style={styles.resultText}>
                  Kontrast:{" "}
                  {(
                    selectedImage.processingResult.enhancements.contrast * 100
                  ).toFixed(0)}
                  %
                </ThemedText>
                <ThemedText style={styles.resultText}>
                  Doygunluk:{" "}
                  {(
                    selectedImage.processingResult.enhancements.saturation * 100
                  ).toFixed(0)}
                  %
                </ThemedText>
              </View>
            )}
          </ThemedCard>
        )}

        {/* Image Gallery */}
        {images.length > 0 && (
          <View style={styles.gallery}>
            <ThemedText style={styles.galleryTitle}>Görsel Galerisi</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((image) => (
                <TouchableOpacity
                  key={image.id}
                  onPress={() => handleImageSelect(image.id)}
                  style={[
                    styles.galleryItem,
                    selectedImageId === image.id && styles.selectedGalleryItem,
                  ]}
                >
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.galleryImage}
                  />
                  {image.isUploaded && (
                    <View style={styles.uploadedBadge}>
                      <ThemedText style={styles.uploadedText}>✓</ThemedText>
                    </View>
                  )}
                  {image.isProcessing && (
                    <View style={styles.processingBadge}>
                      <LoadingSpinner size="tiny" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Empty State */}
        {images.length === 0 && (
          <ThemedCard style={styles.emptyCard}>
            <ThemedText style={styles.emptyText}>
              Henüz görsel seçilmedi
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Galeriden görsel seçin veya fotoğraf çekin
            </ThemedText>
          </ThemedCard>
        )}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  errorCard: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    color: "#d32f2f",
    flex: 1,
  },
  clearError: {
    padding: 8,
  },
  clearErrorText: {
    color: "#d32f2f",
    fontSize: 18,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
  progressCard: {
    marginBottom: 16,
  },
  progressText: {
    marginBottom: 8,
    textAlign: "center",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4caf50",
  },
  processingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    padding: 16,
  },
  processingText: {
    marginLeft: 12,
  },
  selectedImageCard: {
    marginBottom: 24,
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  imageInfo: {
    marginBottom: 12,
  },
  imageName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  imageSize: {
    fontSize: 14,
    opacity: 0.7,
  },
  imageActions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  processingResult: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 4,
  },
  gallery: {
    marginBottom: 24,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  galleryItem: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  selectedGalleryItem: {
    borderWidth: 3,
    borderColor: "#2196f3",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  uploadedBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#4caf50",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  processingBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#ff9800",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCard: {
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
});
