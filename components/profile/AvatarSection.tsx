import { ThemedCard, ThemedText } from "@/components";
import { useTheme } from "@/hooks/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

interface AvatarSectionProps {
  userPhotoURL?: string | null;
  onAvatarChange: () => void;
}

export const AvatarSection: React.FC<AvatarSectionProps> = ({
  userPhotoURL,
  onAvatarChange,
}) => {
  const { colors } = useTheme();

  const handleChangeAvatar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Avatar Değiştir",
      "Profil fotoğrafınızı nasıl değiştirmek istiyorsunuz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Kameradan Çek", onPress: () => console.log("Kamera") },
        { text: "Galeriden Seç", onPress: () => console.log("Galeri") },
      ],
    );
    onAvatarChange();
  };

  return (
    <ThemedCard style={styles.avatarCard} elevation="md">
      <View style={styles.avatarSection}>
        <TouchableOpacity
          style={[styles.avatarContainer, { borderColor: colors.primary }]}
          onPress={handleChangeAvatar}
        >
          <Image
            source={{
              uri:
                userPhotoURL ||
                "https://via.placeholder.com/120x120/0077B5/FFFFFF?text=U",
            }}
            style={styles.avatar}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
          />
          <View
            style={[
              styles.editAvatarButton,
              { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </TouchableOpacity>

        <View style={styles.avatarInfo}>
          <ThemedText variant="h3" weight="bold" style={styles.avatarTitle}>
            Profil Fotoğrafı
          </ThemedText>
          <ThemedText
            variant="caption"
            style={{ ...styles.avatarSubtitle, color: colors.textSecondary }}
          >
            Fotoğrafınızı değiştirmek için dokunun
          </ThemedText>
        </View>
      </View>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  avatarCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 20,
  },
  avatarSection: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  avatarInfo: {
    alignItems: "center",
  },
  avatarTitle: {
    marginBottom: 4,
  },
  avatarSubtitle: {
    opacity: 0.7,
  },
});
