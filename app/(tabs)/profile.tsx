import {
  Header,
  ScrollContainer,
  ThemedCard,
  ThemedText,
  ThemedView,
} from "@/components";
import { Typography } from "@/constants/DesignTokens";
import { useAuth, useTheme, useUserImages } from "@/hooks";
import { UserImage } from "@/hooks/useUserImages";
import auth from "@react-native-firebase/auth";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// CreatedImage interface'i artık UserImage ile değiştirildi

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  joinDate: Date;
  totalCreations: number;
}

// Mock Data
const mockUserProfile: UserProfile = {
  name: auth().currentUser?.displayName || "",
  email: auth().currentUser?.email || "",
  avatar:
    "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
  joinDate: new Date("2024-01-15"),
  totalCreations: 12,
};

// Mock veriler kaldırıldı, artık Firestore'dan gerçek veriler kullanılıyor

// Components
const UserProfileCard = React.memo(
  ({ userProfile: _userProfile }: { userProfile: UserProfile }) => {
    const { colors: _colors } = useTheme();
    const _formatJoinDate = useCallback((_date: Date) => {
      return _date.toLocaleDateString("tr-TR", {
        month: "long",
        year: "numeric",
      });
    }, []);

    return (
      <ThemedCard style={styles.userProfileCard} padding="lg" elevation="sm">
        {/* <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
          </View>
          <View style={styles.userDetails}>
            <ThemedText variant="h3" weight="bold">
              {userProfile.name}
            </ThemedText>
            <ThemedText variant="body" color="secondary">
              {userProfile.email}
            </ThemedText>
            <ThemedText variant="caption" color="tertiary">
              {formatJoinDate(userProfile.joinDate)} tarihinde katıldı
            </ThemedText>
          </View>
        </View>
        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <ThemedText variant="h4" weight="bold" color="primary">
              {userProfile.totalCreations}
            </ThemedText>
            <ThemedText variant="caption" color="secondary">
              Yaratılan Görsel
            </ThemedText>
          </View>
        </View> */}
        <ThemedText
          variant="body"
          weight="bold"
          align="center"
          style={styles.userProfileCardText}
        >
          GELİŞTİRME BEKLİYOR
        </ThemedText>
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
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const { logout, user } = useAuth();
  console.log("Profile'da user bilgisi:", user);
  const {
    images: createdImages,
    loading: imagesLoading,
    error: imagesError,
    toggleFavorite,
    deleteImage,
  } = useUserImages();

  console.log("Profile'da hook sonuçları:", {
    createdImages,
    imagesLoading,
    imagesError,
    createdImagesLength: createdImages.length,
  });

  const createNewImage = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/");
  }, []);

  const handleToggleFavorite = useCallback(
    (id: string) => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      toggleFavorite(id);
    },
    [toggleFavorite],
  );

  const shareImage = useCallback((_image: UserImage) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Share functionality would be implemented here
  }, []);

  const handleDeleteImage = useCallback(
    (id: string) => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      deleteImage(id);
      setUserProfile((prev) => ({
        ...prev,
        totalCreations: prev.totalCreations - 1,
      }));
    },
    [deleteImage],
  );

  const renderImageCard = useCallback(
    ({ item }: { item: UserImage }) => (
      <ImageCard
        image={item}
        onToggleFavorite={handleToggleFavorite}
        onShare={shareImage}
        onDelete={handleDeleteImage}
      />
    ),
    [handleToggleFavorite, shareImage, handleDeleteImage],
  );

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

      <ScrollContainer>
        {/* User Profile Card */}
        <UserProfileCard userProfile={userProfile} />

        {/* Create New Button */}
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={createNewImage}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.createButtonIcon, { color: colors.textOnPrimary }]}
          >
            +
          </Text>
          <ThemedText
            variant="body"
            weight="semiBold"
            color="onPrimary"
            style={styles.createButtonText}
          >
            Yeni Görsel Oluştur
          </ThemedText>
        </TouchableOpacity>

        {/* Images Section */}
        <View style={styles.imagesSection}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="h4" weight="semiBold">
              Yaratılan Görseller
            </ThemedText>
            <ThemedText variant="caption" color="secondary">
              {createdImages.length} görsel
            </ThemedText>
          </View>

          {imagesLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <ThemedText
                variant="body"
                color="secondary"
                style={styles.loadingText}
              >
                Görseller yükleniyor...
              </ThemedText>
            </View>
          ) : imagesError ? (
            <View style={styles.errorState}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <ThemedText
                variant="bodyLarge"
                weight="semiBold"
                align="center"
                style={styles.errorTitle}
              >
                Hata Oluştu
              </ThemedText>
              <ThemedText
                variant="body"
                color="secondary"
                align="center"
                style={styles.errorDescription}
              >
                {imagesError}
              </ThemedText>
            </View>
          ) : createdImages.length > 0 ? (
            <FlatList
              data={createdImages}
              renderItem={renderImageCard}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={styles.imagesGrid}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🎨</Text>
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
        <Button title="Logout" onPress={logout} />
      </ScrollContainer>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  userProfileCard: {
    margin: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userProfileCardText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.bold,
    textAlign: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userDetails: {
    flex: 1,
  },
  userStats: {
    flexDirection: "row",
    justifyContent: "center",
  },
  statItem: {
    alignItems: "center",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#0077B5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    fontSize: Typography.fontSize.xxxxxl,
    marginBottom: 16,
  },
  emptyStateTitle: {
    marginBottom: 8,
    fontSize: Typography.fontSize.lg,
  },
  emptyStateDescription: {
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.md,
    textAlign: "center",
  },
  loadingState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    textAlign: "center",
  },
  errorState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: Typography.fontSize.xxxxxl,
    marginBottom: 16,
  },
  errorTitle: {
    marginBottom: 8,
    fontSize: Typography.fontSize.lg,
  },
  errorDescription: {
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.md,
    textAlign: "center",
  },
});
