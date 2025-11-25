import { ThemedCard, ThemedText } from "@/components";
import {
  BorderRadius,
  Shadows,
  Spacing,
} from "@/constants/DesignTokens";
import { useTheme } from "@/hooks";
import { formatJoinDate } from "@/utils";
import { getAuth } from "@react-native-firebase/auth";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { UserProfile } from "@/types/profile";

interface UserProfileCardProps {
  userProfile: UserProfile;
}

export const UserProfileCard = React.memo<UserProfileCardProps>(
  ({ userProfile: _userProfile }) => {
    const currentUser = getAuth().currentUser;
    const { colors } = useTheme();

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
              {currentUser?.metadata?.creationTime
                ? formatJoinDate(new Date(currentUser.metadata.creationTime)) +
                  " tarihinde katıldı"
                : "Katılım tarihi bilinmiyor"}
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

const styles = StyleSheet.create({
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
});

