import { Header, ThemedText, ThemedView } from "@/components";
import { UserProfileCard } from "@/components/profile";
import {
  BorderRadius,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignTokens";
import { useAccount, useAuth, useTheme, useUserImages } from "@/hooks";
import { UserProfile } from "@/types";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProfileTab() {
  const { colors, colorScheme } = useTheme();
  const { user } = useAuth();
  const { documents, loading, error, refetch } = useUserImages();
  const { data: accountData, refetch: refetchAccount } = useAccount();

  // accountData'dan türetilen değerler (local state DEĞİL artık)
  const tokenBalance =
    accountData?.currentTokenBalance ?? accountData?.currentTokenBalance ?? 0;

  const userPlan = accountData?.premiumPlan ?? accountData?.plan ?? "free";

  // Dokümanlardan türetilen metrikler
  const creationsCount = documents.filter(
    (doc) => doc.result?.data?.images?.length > 0,
  ).length;

  const totalImages = documents.reduce((total, doc) => {
    return total + (doc.result?.data?.images?.length || 0);
  }, 0);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: user?.displayName || "",
    email: user?.email || "",
    avatar: user?.photoURL || undefined,
    joinDate: user?.metadata?.creationTime
      ? new Date(user.metadata.creationTime)
      : new Date(),
    totalCreations: 0, // istersen buraya creationsCount da yazabiliriz
    remainingTokens: tokenBalance,
  });

  const [refreshing, setRefreshing] = useState(false);

  // accountData değiştikçe sadece remainingTokens'ı güncelle
  useEffect(() => {
    setUserProfile((prev) => ({
      ...prev,
      remainingTokens: tokenBalance,
    }));
  }, [tokenBalance]);

  // user değişince profil bilgilerini sync et
  useEffect(() => {
    if (user) {
      setUserProfile((prev) => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
        avatar: user.photoURL || undefined,
        joinDate: user.metadata?.creationTime
          ? new Date(user.metadata.creationTime)
          : new Date(),
        totalCreations: 0,
      }));
    }
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await Promise.all([refetch(), refetchAccount()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetch, refetchAccount]);

  return (
    <ThemedView style={styles.container}>
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
                  {creationsCount}
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
                  {totalImages}
                </ThemedText>
                <ThemedText
                  variant="caption"
                  color="secondary"
                  style={styles.statLabel}
                >
                  Toplam Görsel
                </ThemedText>
              </View>

              <TouchableOpacity
                style={[styles.statCard, { backgroundColor: colors.surface }]}
                activeOpacity={0.7}
                onPress={() => router.push("/premium")}
              >
                <ThemedText
                  variant="body"
                  weight="bold"
                  color="primary"
                  style={styles.statNumber}
                >
                  {tokenBalance}
                </ThemedText>
                <ThemedText
                  variant="caption"
                  color="secondary"
                  style={styles.statLabel}
                >
                  Kalan Kredi
                </ThemedText>
                {userPlan !== "free" && (
                  <ThemedText
                    variant="caption"
                    color="tertiary"
                    style={styles.planBadge}
                  >
                    {userPlan === "starter"
                      ? "Starter"
                      : userPlan === "pro"
                        ? "Pro"
                        : userPlan === "pro_yearly"
                          ? "Pro Yıllık"
                          : ""}
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Gallery Section */}
          <View style={styles.imagesSection}>
            <View style={styles.sectionHeader}>
              <ThemedText variant="h4" weight="semiBold">
                Galerim
              </ThemedText>
              <ThemedText variant="caption" color="secondary">
                {creationsCount} yaratım
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
                  onPress={refetch}
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
                  .sort((a, b) => {
                    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
                    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
                    return dateB - dateA;
                  })
                  .map((doc) => {
                    const coverImageUrl = doc.result?.data?.images?.[0]?.url;

                    return (
                      <TouchableOpacity
                        key={doc.id}
                        style={styles.galleryItem}
                        activeOpacity={0.8}
                        onPress={() => {
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
  planBadge: {
    marginTop: 4,
    fontSize: Typography.fontSize.xs,
    textTransform: "capitalize",
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: Spacing.xs,
    paddingHorizontal: 0,
  },
  galleryItem: {
    width: (width - Spacing.sm * 2 - Spacing.xs * 2) / 3,
    marginBottom: Spacing.xs,
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
    aspectRatio: 1,
  },
  galleryImageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
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
