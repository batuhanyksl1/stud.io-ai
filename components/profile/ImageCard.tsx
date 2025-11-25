import { ThemedCard, ThemedText } from "@/components";
import {
  BorderRadius,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignTokens";
import { useAccount, useTheme } from "@/hooks";
import { formatDate } from "@/utils";
import { Dimensions } from "react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UserImage } from "@/types/profile";

const { width } = Dimensions.get("window");

interface ImageCardProps {
  image: UserImage;
  onToggleFavorite: (id: string) => void;
  onShare: (image: UserImage) => void;
  onDelete: (id: string) => void;
}

export const ImageCard = React.memo<ImageCardProps>(
  ({ image, onToggleFavorite, onShare, onDelete }) => {
    const { colors } = useTheme();
    const { data: account } = useAccount();
    console.log("account bilgisi miiiiiiii", account);

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

const styles = StyleSheet.create({
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
});

