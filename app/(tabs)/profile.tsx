import {
  Header,
  ScrollContainer,
  ThemedCard,
  ThemedText,
  ThemedView,
} from "@/components";
import { useAuth, useTheme } from "@/hooks";
import auth from "@react-native-firebase/auth";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
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

interface CreatedImage {
  id: string;
  uri: string;
  timestamp: number;
  filterName: string;
  isFavorite: boolean;
  downloads: number;
}

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

const mockCreatedImages: CreatedImage[] = [
  {
    id: "1",
    uri: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    timestamp: Date.now() - 86400000,
    filterName: "Profesyonel",
    isFavorite: true,
    downloads: 24,
  },
  {
    id: "2",
    uri: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    timestamp: Date.now() - 172800000,
    filterName: "Kurumsal",
    isFavorite: false,
    downloads: 18,
  },
  {
    id: "3",
    uri: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    timestamp: Date.now() - 259200000,
    filterName: "Yaratıcı",
    isFavorite: true,
    downloads: 31,
  },
  {
    id: "4",
    uri: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    timestamp: Date.now() - 345600000,
    filterName: "Modern",
    isFavorite: false,
    downloads: 15,
  },
  {
    id: "5",
    uri: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400",
    timestamp: Date.now() - 432000000,
    filterName: "Klasik",
    isFavorite: true,
    downloads: 22,
  },
  {
    id: "6",
    uri: "https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg?auto=compress&cs=tinysrgb&w=400",
    timestamp: Date.now() - 518400000,
    filterName: "Minimalist",
    isFavorite: false,
    downloads: 19,
  },
];

// Components
const UserProfileCard = React.memo(
  ({ userProfile }: { userProfile: UserProfile }) => {
    const formatJoinDate = useCallback((date: Date) => {
      return date.toLocaleDateString("tr-TR", {
        month: "long",
        year: "numeric",
      });
    }, []);

    return (
      <ThemedCard style={styles.userProfileCard} padding="lg" elevation="sm">
        <View style={styles.userInfo}>
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
    image: CreatedImage;
    onToggleFavorite: (_id: string) => void;
    onShare: (_image: CreatedImage) => void;
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
          <Image source={{ uri: image.uri }} style={styles.image} />
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
  const [createdImages, setCreatedImages] = useState<CreatedImage[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const { logout } = useAuth();
  useEffect(() => {
    setCreatedImages(mockCreatedImages);
  }, []);

  const createNewImage = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/");
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCreatedImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, isFavorite: !img.isFavorite } : img,
      ),
    );
  }, []);

  const shareImage = useCallback((_image: CreatedImage) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Share functionality would be implemented here
  }, []);

  const deleteImage = useCallback((id: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setCreatedImages((prev) => prev.filter((img) => img.id !== id));
    setUserProfile((prev) => ({
      ...prev,
      totalCreations: prev.totalCreations - 1,
    }));
  }, []);

  const renderImageCard = useCallback(
    ({ item }: { item: CreatedImage }) => (
      <ImageCard
        image={item}
        onToggleFavorite={toggleFavorite}
        onShare={shareImage}
        onDelete={deleteImage}
      />
    ),
    [toggleFavorite, shareImage, deleteImage],
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

          {createdImages.length > 0 ? (
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
    fontSize: 20,
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
    fontSize: 24,
    fontWeight: "bold",
  },
  createButtonText: {
    marginLeft: 8,
    fontSize: 16,
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
    fontSize: 14,
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
    fontSize: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    marginBottom: 8,
    fontSize: 18,
  },
  emptyStateDescription: {
    lineHeight: 24,
    textAlign: "center",
  },
});
