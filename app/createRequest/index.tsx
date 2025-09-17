import { ThemedButton, ThemedCard, ThemedText, ThemedView } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants/Colors";
import { useContentCreation } from "@/hooks";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

// ===== Component =====
export default function CreateRequestScreen() {
  const { error } = useContentCreation();

  // Geçici olarak selectedImage state'ini local olarak yönetelim
  const [selectedImage, setSelectedImage] = React.useState<any>(null);

  // Eksik fonksiyonları tanımlayalım
  const pickImage = async () => {
    // TODO: Image picker implementasyonu
    console.log("Galeri seçimi - henüz implement edilmedi");
  };

  const takePhoto = async () => {
    // TODO: Camera implementasyonu
    console.log("Kamera - henüz implement edilmedi");
  };

  const processImageWithFalAI = async (imageId: string) => {
    // TODO: FalAI işleme implementasyonu
    console.log("FalAI işleme - henüz implement edilmedi", imageId);
  };

  const handleStartProcessing = () => {
    if (selectedImage) {
      // processImageWithFalAI içinde otomatik olarak Firebase'e yükleme yapılacak
      processImageWithFalAI(selectedImage.id);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant="h2" weight="bold" style={styles.title}>
            AI Görsel İşleme
          </ThemedText>
          <ThemedText variant="body" style={styles.subtitle}>
            Görseli yükle • 3 servis paralel işlesin • Sonuçlar sırayla gelsin
          </ThemedText>
        </View>

        {/* Upload */}
        <ThemedCard style={styles.uploadCard} elevation="lg">
          {selectedImage ? (
            <ScrollView style={styles.previewWrap}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.preview}
              />
              <View style={styles.overlayButtons}>
                <ThemedButton
                  variant="outline"
                  size="sm"
                  onPress={() => setSelectedImage(null)}
                  style={styles.overlayBtn}
                >
                  <Ionicons name="refresh" size={16} color={Colors.primary} />
                  <ThemedText variant="caption" style={styles.overlayText}>
                    Değiştir
                  </ThemedText>
                </ThemedButton>
                <ThemedButton
                  size="sm"
                  onPress={handleStartProcessing}
                  disabled={
                    selectedImage.status === "uploading" ||
                    selectedImage.status === "processing"
                  }
                  style={styles.overlayBtnPrimary}
                >
                  <Ionicons name="rocket" size={16} color={Colors.white} />
                  <ThemedText
                    variant="caption"
                    style={{ color: Colors.white, marginLeft: 6 }}
                  >
                    {selectedImage.status === "uploading"
                      ? "Yükleniyor..."
                      : selectedImage.status === "processing"
                        ? "İşleniyor..."
                        : "İşleme Başlat"}
                  </ThemedText>
                </ThemedButton>
              </View>
            </ScrollView>
          ) : (
            // GÖRSEL SEÇİLMEMİŞSE
            <ScrollView style={styles.dropArea}>
              <Ionicons name="cloud-upload" size={32} color={Colors.primary} />
              <ThemedText
                variant="bodyLarge"
                weight="medium"
                style={{ marginTop: Spacing.sm }}
              >
                Görsel Yükle
              </ThemedText>
              <ThemedText
                variant="caption"
                style={{ color: Colors.textSecondary, marginTop: 2 }}
              >
                PNG • JPG • JPEG
              </ThemedText>
              <View style={styles.uploadActions}>
                <ThemedButton
                  variant="outline"
                  size="sm"
                  onPress={pickImage}
                  style={styles.actionBtn}
                >
                  <Ionicons name="images" size={16} color={Colors.primary} />
                  <ThemedText variant="caption" style={{ marginLeft: 6 }}>
                    Galeri
                  </ThemedText>
                </ThemedButton>
                <ThemedButton
                  variant="outline"
                  size="sm"
                  onPress={takePhoto}
                  style={styles.actionBtn}
                >
                  <Ionicons name="camera" size={16} color={Colors.primary} />
                  <ThemedText variant="caption" style={{ marginLeft: 6 }}>
                    Kamera
                  </ThemedText>
                </ThemedButton>
              </View>
            </ScrollView>
          )}
        </ThemedCard>

        {/* Error Display */}
        {error && (
          <ThemedCard
            style={
              [
                styles.uploadCard,
                { backgroundColor: Colors.error + "10" },
              ] as any
            }
          >
            <ThemedText variant="body" style={{ color: Colors.error }}>
              Hata: {error}
            </ThemedText>
          </ThemedCard>
        )}

        {/* Dashboard */}
        <View style={styles.historyHeader}>
          <ThemedText variant="h3" weight="semiBold">
            İşlem Geçmişi
          </ThemedText>
        </View>

        {!selectedImage ? (
          <ThemedCard
            elevation="sm"
            style={{ marginHorizontal: Spacing.lg, padding: Spacing.lg }}
          >
            <ThemedText variant="body">
              Henüz bir istek yok. Bir görsel yükleyip işleme başlat.
            </ThemedText>
          </ThemedCard>
        ) : (
          <View style={{ marginHorizontal: Spacing.lg }}>
            <ThemedCard elevation="sm" style={{ padding: Spacing.lg }}>
              <ThemedText variant="body" weight="medium">
                Seçili Görsel: {selectedImage.id}
              </ThemedText>
              <ThemedText variant="caption" style={{ marginTop: Spacing.xs }}>
                Durum: {selectedImage.status}
              </ThemedText>
              {selectedImage.progress !== undefined && (
                <ThemedText variant="caption" style={{ marginTop: 2 }}>
                  İlerleme: %{selectedImage.progress}
                </ThemedText>
              )}
              {selectedImage.downloadURL && (
                <ThemedText variant="caption" style={{ marginTop: 2 }}>
                  Firebase URL: {selectedImage.downloadURL.substring(0, 50)}...
                </ThemedText>
              )}
            </ThemedCard>
          </View>
        )}

        {/* Test için ek içerik - ScrollView'in çalışıp çalışmadığını test etmek için */}
        <View style={{ marginHorizontal: Spacing.lg, marginTop: Spacing.lg }}>
          <ThemedCard
            elevation="sm"
            style={{ padding: Spacing.lg, marginBottom: Spacing.md }}
          >
            <ThemedText
              variant="h4"
              weight="semiBold"
              style={{ marginBottom: Spacing.sm }}
            >
              Test İçeriği 1
            </ThemedText>
            <ThemedText variant="body">
              Bu bölüm ScrollView&apos;in çalışıp çalışmadığını test etmek için
              eklenmiştir.
            </ThemedText>
          </ThemedCard>

          <ThemedCard
            elevation="sm"
            style={{ padding: Spacing.lg, marginBottom: Spacing.md }}
          >
            <ThemedText
              variant="h4"
              weight="semiBold"
              style={{ marginBottom: Spacing.sm }}
            >
              Test İçeriği 2
            </ThemedText>
            <ThemedText variant="body">
              Eğer bu içerikleri görebiliyorsanız ve aşağı kaydırabiliyorsanız
              ScrollView çalışıyor demektir.
            </ThemedText>
          </ThemedCard>

          <ThemedCard
            elevation="sm"
            style={{ padding: Spacing.lg, marginBottom: Spacing.md }}
          >
            <ThemedText
              variant="h4"
              weight="semiBold"
              style={{ marginBottom: Spacing.sm }}
            >
              Test İçeriği 3
            </ThemedText>
            <ThemedText variant="body">
              ScrollView&apos;in düzgün çalışması için yeterli içerik olması
              gerekiyor.
            </ThemedText>
          </ThemedCard>

          <ThemedCard
            elevation="sm"
            style={{ padding: Spacing.lg, marginBottom: Spacing.md }}
          >
            <ThemedText
              variant="h4"
              weight="semiBold"
              style={{ marginBottom: Spacing.sm }}
            >
              Test İçeriği 4
            </ThemedText>
            <ThemedText variant="body">
              Bu son test kartı. Eğer buraya kadar scroll yapabiliyorsanız her
              şey yolunda!
            </ThemedText>
          </ThemedCard>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

// ===== Styles =====
const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    alignItems: "center",
  },
  title: { textAlign: "center", marginBottom: Spacing.xs },
  subtitle: { textAlign: "center", color: Colors.textSecondary },

  uploadCard: { margin: Spacing.lg, marginTop: Spacing.xl },
  dropArea: {
    borderWidth: 2,
    borderColor: Colors.gray200,
    borderStyle: "dashed",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    backgroundColor: Colors.gray50,
  },
  uploadActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  actionBtn: { flexDirection: "row", alignItems: "center" },

  previewWrap: { position: "relative" },
  preview: {
    width: "100%",
    height: 220,
    borderRadius: BorderRadius.lg,
    resizeMode: "cover",
  },
  overlayButtons: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    gap: Spacing.sm,
  },
  overlayBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white + "E6",
  },
  overlayBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  overlayText: { marginLeft: 6 },

  historyHeader: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    marginTop: -Spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
