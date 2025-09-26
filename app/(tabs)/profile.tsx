import { Header, ThemedCard, ThemedText, ThemedView } from "@/components";
import {
  BorderRadius,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignTokens";
import { useAuth, useTheme } from "@/hooks";
import auth, { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface UserImage {
  id: string;
  url: string;
  timestamp: number;
  filterName: string;
  isFavorite: boolean;
  downloads: number;
  fileName?: string;
  contentType?: string;
  fileSize?: number;
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  joinDate: Date;
  totalCreations: number;
  remainingTokens: number;
}

// Mock veriler kaldırıldı, artık Firestore'dan gerçek veriler kullanılıyor

// Components
const UserProfileCard = React.memo(
  ({ userProfile: _userProfile }: { userProfile: UserProfile }) => {
    const currentUser = getAuth().currentUser;

    const { colors } = useTheme();

    const formatJoinDate = useCallback((date: Date) => {
      return date.toLocaleDateString("tr-TR", {
        month: "long",
        year: "numeric",
      });
    }, []);

    return (
      <ThemedCard style={styles.userProfileCard} padding="lg" elevation="md">
        <View style={styles.userProfileContent}>
          {/* User Info */}
          <View style={styles.userInfo}>
            <ThemedText variant="h3" weight="bold" style={styles.userName}>
              {currentUser?.displayName || "Kullanıcı"}
            </ThemedText>
            <ThemedText
              variant="body"
              color="secondary"
              style={styles.userEmail}
            >
              {currentUser?.email || "Kullanıcı"}
            </ThemedText>
            <ThemedText
              variant="caption"
              color="tertiary"
              style={styles.joinDate}
            >
              {formatJoinDate(
                currentUser?.metadata?.creationTime
                  ? new Date(currentUser.metadata.creationTime)
                  : new Date(),
              )}{" "}
              tarihinde katıldı
            </ThemedText>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity
            style={[
              styles.editButton,
              { backgroundColor: colors.primarySubtle },
            ]}
            activeOpacity={0.8}
          >
            <ThemedText variant="caption" weight="semiBold" color="primary">
              Profili Düzenle
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedCard>
    );
  },
);

UserProfileCard.displayName = "UserProfileCard";

const ImageCard = React.memo(
  ({
    image,
    onToggleFavorite,
    onShare,
    onDelete,
  }: {
    image: UserImage;
    onToggleFavorite: (_id: string) => void;
    onShare: (_image: UserImage) => void;
    onDelete: (_id: string) => void;
  }) => {
    const { colors } = useTheme();

    const formatDate = useCallback((timestamp: number) => {
      const date = new Date(timestamp);
      return date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
      });
    }, []);

    return (
      <ThemedCard style={styles.imageCard} padding="sm" elevation="sm">
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.url }} style={styles.image} />
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              {
                backgroundColor: image.isFavorite
                  ? colors.errorSubtle
                  : colors.surface,
              },
            ]}
            onPress={() => onToggleFavorite(image.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.favoriteIcon}>
              {image.isFavorite ? "❤️" : "🤍"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageInfo}>
          <ThemedText variant="caption" weight="semiBold">
            {image.filterName}
          </ThemedText>
          <ThemedText variant="caption" color="tertiary">
            {formatDate(image.timestamp)}
          </ThemedText>
          <View style={styles.imageActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.primarySubtle },
              ]}
              onPress={() => onShare(image)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>↗️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.errorSubtle },
              ]}
              onPress={() => onDelete(image.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedCard>
    );
  },
);

ImageCard.displayName = "ImageCard";

export default function ProfileTab() {
  const { colors, colorScheme } = useTheme();
  const { user } = useAuth();

  // Kullanıcı profil bilgilerini currentUser'dan al
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: user?.displayName || "",
    email: user?.email || "",
    avatar: user?.photoURL || undefined,
    joinDate: user?.metadata?.creationTime
      ? new Date(user.metadata.creationTime)
      : new Date(),
    totalCreations: 0,
    remainingTokens: 100, // Varsayılan token sayısı
  });

  // Firebase verileri için state'ler
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentToken, setCurrentToken] = useState<number | null>(null);

  // Token bilgisini Firestore'dan çek
  const fetchUserToken = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.log("Kullanıcı giriş yapmamış, token çekilemiyor");
        return;
      }

      const userDoc = await firestore()
        .collection("Account")
        .doc(currentUser.uid)
        .get();

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const token = userData?.currentToken;
        console.log("📊 Firestore'dan gelen token:", token);
        console.log("📊 userData:", userData);
        setCurrentToken(typeof token === "number" ? token : null);
        console.log("✅ Token state güncellendi:", token);
      } else {
        console.log("❌ Kullanıcı dokümanı bulunamadı");
        setCurrentToken(null); // Yüklenene kadar gösterme
      }
    } catch (error) {
      console.error("Token çekme hatası:", error);
      setCurrentToken(null); // Hata durumunda gösterme
    }
  };

  // Firebase sorgusu - firebase-test.tsx'deki gibi
  const fetchUserDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔄 Kullanıcı dokümanları çekiliyor...");

      // Kullanıcı giriş yapmış mı kontrol et
      const currentUser = auth().currentUser;
      if (!currentUser) {
        setError("Kullanıcı giriş yapmamış!");
        setDocuments([]);
        return;
      }

      console.log("👤 Kullanıcı UID:", currentUser.uid);

      // aiToolRequests koleksiyonundan kullanıcının dokümanlarını çek
      const querySnapshot = await firestore()
        .collection("aiToolRequests")
        .where("userId", "==", currentUser.uid)
        .get();

      console.log("📊 Sorgu sonucu:", querySnapshot.docs.length, "doküman");

      if (querySnapshot.docs.length === 0) {
        setError("Bu kullanıcı için doküman bulunamadı!");
        setDocuments([]);
      } else {
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDocuments(docs);
        console.log("✅ Kullanıcı dokümanları yüklendi:", docs.length);
        console.log("📋 TÜM DOKÜMANLAR:");
        docs.forEach((doc, index) => {
          console.log(`📄 Doküman #${index + 1}:`, doc);
        });
      }
    } catch (err: any) {
      console.error("❌ Veri çekme hatası:", err);
      setError(`Hata: ${err.message}`);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı bilgilerini güncelle
  useEffect(() => {
    if (user) {
      console.log("🔄 userProfile güncelleniyor, currentToken:", currentToken);
      setUserProfile({
        name: user.displayName || "",
        email: user.email || "",
        avatar: user.photoURL || undefined,
        joinDate: user.metadata?.creationTime
          ? new Date(user.metadata.creationTime)
          : new Date(),
        totalCreations: 0,
        remainingTokens: typeof currentToken === "number" ? currentToken : 0, // UI'da kullanılmıyor
      });
    }
  }, [user, currentToken]);

  // Refresh fonksiyonu
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await Promise.all([fetchUserDocuments(), fetchUserToken()]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Component mount olduğunda veriyi çek
  useEffect(() => {
    fetchUserDocuments();
    fetchUserToken();
  }, [user?.uid]);

  const _createNewImage = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/");
  }, []);

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      {/* <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerContent}>
          <ThemedText variant="h2" weight="bold">
            Profilim
          </ThemedText>
          <ThemedText variant="body" color="secondary">
            Yaratılan görsellerinizi yönetin
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[
            styles.settingsButton,
            { backgroundColor: colors.secondarySubtle },
          ]}
          activeOpacity={0.7}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View> */}
      <Header leftIconType="home" rightIconType="settings" />
      <StatusBar style={colorScheme === "dark" ? "dark" : "light"} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeaderSection}>
          <UserProfileCard userProfile={userProfile} />
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statsSection}>
            <View
              style={[styles.statCard, { backgroundColor: colors.surface }]}
            >
              <ThemedText
                weight="bold"
                color="primary"
                style={styles.statNumber}
              >
                {
                  documents.filter(
                    (doc) => doc.result?.data?.images?.length > 0,
                  ).length
                }
              </ThemedText>
              <ThemedText
                variant="caption"
                color="secondary"
                style={styles.statLabel}
              >
                Yaratım
              </ThemedText>
            </View>

            <View
              style={[styles.statCard, { backgroundColor: colors.surface }]}
            >
              <ThemedText
                weight="bold"
                color="primary"
                style={styles.statNumber}
              >
                {documents.reduce((total, doc) => {
                  return total + (doc.result?.data?.images?.length || 0);
                }, 0)}
              </ThemedText>
              <ThemedText
                variant="caption"
                color="secondary"
                style={styles.statLabel}
              >
                Toplam Görsel
              </ThemedText>
            </View>

            <View
              style={[styles.statCard, { backgroundColor: colors.surface }]}
            >
              <ThemedText
                variant="body"
                weight="bold"
                color="primary"
                style={styles.statNumber}
              >
                {currentToken ?? ""}
              </ThemedText>
              <ThemedText
                variant="caption"
                color="secondary"
                style={styles.statLabel}
              >
                Kalan Token
              </ThemedText>
            </View>
          </View>
        </View>
        {/* Gallery Section */}
        <View style={styles.imagesSection}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="h4" weight="semiBold">
              Galerim
            </ThemedText>
            <ThemedText variant="caption" color="secondary">
              {
                documents.filter((doc) => doc.result?.data?.images?.length > 0)
                  .length
              }{" "}
              yaratım
            </ThemedText>
          </View>

          {loading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <ThemedText
                variant="body"
                color="secondary"
                style={styles.loadingText}
              >
                Galeri yükleniyor...
              </ThemedText>
            </View>
          ) : error ? (
            <View style={styles.errorState}>
              <ThemedText
                variant="bodyLarge"
                weight="semiBold"
                align="center"
                style={styles.errorTitle}
              >
                Galeri Yüklenemedi
              </ThemedText>
              <ThemedText
                variant="body"
                color="secondary"
                align="center"
                style={styles.errorDescription}
              >
                {error}
              </ThemedText>
              <TouchableOpacity
                style={[
                  styles.retryButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={fetchUserDocuments}
                activeOpacity={0.7}
              >
                <ThemedText
                  variant="body"
                  weight="semiBold"
                  color="onPrimary"
                  style={styles.retryButtonText}
                >
                  Tekrar Dene
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : documents.length > 0 ? (
            <View style={styles.galleryGrid}>
              {documents
                .filter((doc) => doc.result?.data?.images?.length > 0)
                .map((doc, _index) => {
                  // Sadece result.data.images'den ilk görseli kapak fotoğrafı olarak kullan
                  const coverImageUrl = doc.result?.data?.images?.[0]?.url;

                  return (
                    <TouchableOpacity
                      key={doc.id}
                      style={styles.galleryItem}
                      activeOpacity={0.8}
                      onPress={() => {
                        // Detay sayfasına yönlen
                        router.push({
                          pathname: "/gallery/[id]",
                          params: { id: doc.id },
                        });
                      }}
                    >
                      <View style={styles.galleryImageContainer}>
                        <Image
                          source={{ uri: coverImageUrl }}
                          style={styles.galleryImage}
                          resizeMode="cover"
                        />

                        {/* Gradient Overlay */}
                        <View style={styles.galleryGradient} />
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <ThemedText
                variant="bodyLarge"
                weight="semiBold"
                align="center"
                style={styles.emptyStateTitle}
              >
                Henüz Görsel Yok
              </ThemedText>
              <ThemedText
                variant="body"
                color="secondary"
                align="center"
                style={styles.emptyStateDescription}
              >
                İlk görselinizi oluşturmak için yukarıdaki butona tıklayın
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerContent: {
    flex: 1,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsIcon: {
    fontSize: Typography.fontSize.xl,
  },
  // Yeni profil kartı stilleri
  userProfileCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
  },
  userProfileContent: {
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  userName: {
    marginBottom: 4,
  },
  userEmail: {
    marginBottom: 2,
  },
  joinDate: {
    marginBottom: Spacing.xs,
  },
  editButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.xl,
    ...Shadows.xl,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  createButtonIcon: {
    fontSize: Typography.fontSize.xxl,
    fontFamily: Typography.fontFamily.bold,
  },
  createButtonText: {
    marginLeft: 8,
    fontSize: Typography.fontSize.md,
  },
  imagesSection: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
    paddingHorizontal: 0,
  },
  imagesGrid: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  imageCard: {
    width: (width - 48) / 2,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    fontSize: Typography.fontSize.sm,
  },
  imageInfo: {
    paddingHorizontal: 4,
  },
  imageActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    fontSize: Typography.fontSize.xs,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 0,
    ...Shadows.sm,
  },
  emptyStateTitle: {
    marginBottom: Spacing.sm,
    fontSize: Typography.fontSize.lg,
  },
  emptyStateDescription: {
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.md,
    textAlign: "center",
  },
  loadingState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 0,
    ...Shadows.sm,
  },
  loadingText: {
    marginTop: Spacing.lg,
    textAlign: "center",
  },
  errorState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 0,
    ...Shadows.sm,
  },
  errorTitle: {
    marginBottom: Spacing.sm,
    fontSize: Typography.fontSize.lg,
  },
  errorDescription: {
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.md,
    textAlign: "center",
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignSelf: "center",
    ...Shadows.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  retryButtonText: {
    fontSize: Typography.fontSize.md,
  },
  profileHeaderSection: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  statsContainer: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.xs,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
  },
  statNumber: {
    marginBottom: 2,
  },
  statLabel: {
    textAlign: "center",
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  galleryItem: {
    width: (width - Spacing.sm * 2 - Spacing.xs) / 2,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  galleryImageContainer: {
    position: "relative",
    width: "100%",
    height: 120,
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  galleryGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  galleryOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  galleryInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  galleryTitle: {
    fontSize: Typography.fontSize.sm,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  galleryStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  galleryStatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backdropFilter: "blur(15px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  galleryStatText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "600",
  },
});
