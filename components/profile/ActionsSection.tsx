import { ThemedCard, ThemedText } from "@/components";
import { useTheme } from "@/hooks/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ActionsSectionProps {
  onChangePassword: () => void;
  onDownloadData: () => void;
  onDeleteAccount: () => void;
}

export const ActionsSection: React.FC<ActionsSectionProps> = ({
  onChangePassword,
  onDownloadData,
  onDeleteAccount,
}) => {
  const { colors } = useTheme();

  const handleChangePassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChangePassword();
  };

  const handleDownloadData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDownloadData();
  };

  const handleDeleteAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onDeleteAccount();
  };

  return (
    <ThemedCard style={styles.actionsCard} elevation="sm">
      <ThemedText
        variant="caption"
        weight="semiBold"
        style={{ ...styles.sectionTitle, color: colors.textSecondary }}
      >
        HESAP İŞLEMLERİ
      </ThemedText>

      <TouchableOpacity
        style={[styles.actionItem, { borderBottomColor: colors.border }]}
        onPress={handleChangePassword}
      >
        <View
          style={[styles.actionIcon, { backgroundColor: colors.primarySubtle }]}
        >
          <Ionicons name="lock-closed" size={20} color={colors.primary} />
        </View>
        <View style={styles.actionContent}>
          <ThemedText variant="body" weight="medium" style={styles.actionTitle}>
            Şifre Değiştir
          </ThemedText>
          <ThemedText
            variant="caption"
            style={{ ...styles.actionSubtitle, color: colors.textSecondary }}
          >
            Hesap şifrenizi güncelleyin
          </ThemedText>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionItem, { borderBottomColor: colors.border }]}
        onPress={handleDownloadData}
      >
        <View
          style={[styles.actionIcon, { backgroundColor: colors.primarySubtle }]}
        >
          <Ionicons name="download" size={20} color={colors.primary} />
        </View>
        <View style={styles.actionContent}>
          <ThemedText variant="body" weight="medium" style={styles.actionTitle}>
            Verilerimi İndir
          </ThemedText>
          <ThemedText
            variant="caption"
            style={{ ...styles.actionSubtitle, color: colors.textSecondary }}
          >
            Hesap verilerinizi indirin
          </ThemedText>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionItem} onPress={handleDeleteAccount}>
        <View
          style={[styles.actionIcon, { backgroundColor: colors.errorSubtle }]}
        >
          <Ionicons name="trash" size={20} color={colors.error} />
        </View>
        <View style={styles.actionContent}>
          <ThemedText
            variant="body"
            weight="medium"
            style={{ ...styles.actionTitle, color: colors.error }}
          >
            Hesabı Sil
          </ThemedText>
          <ThemedText
            variant="caption"
            style={{ ...styles.actionSubtitle, color: colors.textSecondary }}
          >
            Hesabınızı kalıcı olarak silin
          </ThemedText>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    letterSpacing: 0.5,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    marginBottom: 2,
  },
  actionSubtitle: {
    opacity: 0.7,
  },
});
