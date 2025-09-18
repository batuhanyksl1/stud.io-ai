import { ThemedButton, ThemedText, ThemedView } from "@/components";
import { Colors, Spacing } from "@/constants/Colors";
import { useContentCreation } from "@/hooks";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

// ===== Component =====
export default function CreateRequestScreen() {
  const { error } = useContentCreation();
  const [selectedImage, setSelectedImage] = React.useState<any>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Görsel seçme fonksiyonu
  const pickImage = async () => {
    console.log("Galeriden görsel seçimi başladı.");
    // Demo amaçlı örnek bir görsel URI'si
    setSelectedImage({
      uri: "https://images.unsplash.com/photo-1621243886407-937299a67789?q=80&w=2070&auto=format&fit=crop",
      id: "sample-image-2",
    });
  };

  // Kamera fonksiyonu
  const takePhoto = async () => {
    console.log("Kamera açıldı - henüz implement edilmedi.");
  };

  // İşleme başlama fonksiyonu
  const handleStartProcessing = () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    console.log(`İşleme başlanıyor: ${selectedImage.id}`);

    // Demo amaçlı işlem simülasyonu
    setTimeout(() => {
      setIsProcessing(false);
      console.log("İşlem tamamlandı.");
      // Sonuç görseli gösterebilirsiniz, şimdilik sadece işlemi bitiriyoruz.
    }, 3000);
  };

  // Ekranın üst kısmındaki dinamik başlık alanı
  const renderHeader = () => (
    <View style={styles.header}>
      <ThemedText variant="h1" weight="bold" style={styles.headerTitle}>
        AI Görsel İşleme
      </ThemedText>
      <ThemedText variant="body" style={styles.headerSubtitle}>
        Görselinizi yükleyin, yapay zekanın dönüştürmesini izleyin.
      </ThemedText>
    </View>
  );

  // Görselin seçilmediği durum
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="image-outline" size={64} color={Colors.gray400} />
      <ThemedText
        variant="h3"
        weight="semiBold"
        style={{ marginTop: Spacing.xl, color: Colors.text }}
      >
        Görsel Yükleyin
      </ThemedText>
      <ThemedText style={styles.emptyStateHint}>PNG, JPG, JPEG</ThemedText>

      <View style={styles.actionButtons}>
        <ThemedButton
          variant="default"
          size="lg"
          onPress={pickImage}
          style={styles.actionBtnPrimary}
        >
          <Ionicons name="images" size={18} color={Colors.white} />
          <ThemedText style={styles.actionBtnText}>Galeriden Seç</ThemedText>
        </ThemedButton>
        <ThemedButton
          variant="outline"
          size="lg"
          onPress={takePhoto}
          style={styles.actionBtnSecondary}
        >
          <Ionicons name="camera" size={18} color={Colors.text} />
          <ThemedText style={styles.actionBtnText}>Kamera</ThemedText>
        </ThemedButton>
      </View>
    </View>
  );

  // Görselin seçildiği ve gösterildiği durum
  const renderImagePreview = () => (
    <View style={styles.previewContainer}>
      <Image
        source={{ uri: selectedImage.uri }}
        style={styles.fullScreenImage}
        resizeMode="cover"
      />
      <View style={styles.previewOverlay}>
        <View style={styles.overlayTextContainer}>
          <ThemedText variant="h2" weight="bold" style={styles.overlayTitle}>
            Görsel Hazır
          </ThemedText>
          <ThemedText variant="body" style={styles.overlaySubtitle}>
            İşlemi başlatmak için butona dokunun.
          </ThemedText>
        </View>

        <View style={styles.overlayButtons}>
          <ThemedButton
            variant="default"
            size="lg"
            onPress={handleStartProcessing}
            disabled={isProcessing}
            style={styles.startButton}
          >
            <Ionicons name="rocket-outline" size={20} color={Colors.white} />
            <ThemedText style={styles.startBtnText}>
              {isProcessing ? "İşleniyor..." : "İşleme Başlat"}
            </ThemedText>
          </ThemedButton>
          <ThemedButton
            variant="ghost"
            size="sm"
            onPress={() => setSelectedImage(null)}
            style={styles.changeButton}
          >
            <ThemedText style={styles.changeBtnText}>Görseli Değiştir</ThemedText>
          </ThemedButton>
        </View>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {selectedImage ? renderImagePreview() : renderEmptyState()}

        {/* Hata Mesajı */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={20} color={Colors.error} />
            <ThemedText variant="body" style={styles.errorText}>
              {error}
            </ThemedText>
          </View>
        )}

        {/* İşlem Geçmişi veya Sonuçlar */}
        <View style={styles.historySection}>
          <ThemedText variant="h3" weight="semiBold" style={{ color: Colors.text }}>
            Son İşlemler
          </ThemedText>
          <ThemedText variant="body" style={styles.historyPlaceholder}>
            Henüz bir işlem yok. İşlem sonuçları burada listelenecek.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

// ===== Styles =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl * 2,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    alignItems: "center",
  },
  headerTitle: {
    textAlign: "center",
  },
  headerSubtitle: {
    textAlign: "center",
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  // Boş durum (görsel seçilmemiş)
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl * 2,
  },
  emptyStateHint: {
    color: Colors.gray400,
    marginTop: Spacing.xs,
  },
  actionButtons: {
    marginTop: Spacing.xl,
    width: "100%",
    gap: Spacing.md,
  },
  actionBtnPrimary: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnSecondary: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnText: {
    marginLeft: Spacing.sm,
    color: Colors.white,
  },

  // Görsel önizleme
  previewContainer: {
    width: "100%",
    height: 450, // Sabit yükseklik ile tam ekran hissi
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: Spacing.lg,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Yarı saydam siyah overlay
  },
  overlayTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTitle: {
    color: Colors.white,
    textAlign: "center",
  },
  overlaySubtitle: {
    color: Colors.white + "99",
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  overlayButtons: {
    width: "100%",
  },
  startButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  startBtnText: {
    marginLeft: Spacing.sm,
    color: Colors.white,
  },
  changeButton: {
    marginTop: Spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  changeBtnText: {
    color: Colors.white + "99",
    textDecorationLine: "underline",
  },

  // Hata Mesajı
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    backgroundColor: Colors.error + "10",
    borderRadius: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  errorText: {
    color: Colors.error,
    marginLeft: Spacing.sm,
  },

  // Geçmiş Alanı
  historySection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xxl,
  },
  historyPlaceholder: {
    color: Colors.gray400,
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});