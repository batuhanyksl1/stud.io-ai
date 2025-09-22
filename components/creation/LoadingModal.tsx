import {
  BorderRadius,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignTokens";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

interface LoadingModalProps {
  visible: boolean;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ visible }) => {
  const { colors } = useTheme();

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View
        style={[styles.modalContainer, { backgroundColor: colors.overlay }]}
      >
        <View
          style={[styles.modalContent, { backgroundColor: colors.surface }]}
        >
          <View
            style={[styles.loadingIcon, { backgroundColor: colors.primary }]}
          >
            <ActivityIndicator size="large" color={colors.textOnPrimary} />
          </View>
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
            Studio AI çalışıyor
          </Text>
          <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
            Talimatınız uygulanıyor, lütfen birkaç saniye bekleyin.
          </Text>

          <View style={styles.modalTimeline}>
            <View style={styles.modalTimelineItem}>
              <View
                style={[
                  styles.modalTimelineDot,
                  { backgroundColor: colors.primary },
                ]}
              />
              <Text
                style={[
                  styles.modalTimelineText,
                  { color: colors.textSecondary },
                ]}
              >
                Görsel yükleniyor
              </Text>
            </View>
            <View style={styles.modalTimelineItem}>
              <View
                style={[
                  styles.modalTimelineDot,
                  { backgroundColor: colors.primary },
                ]}
              />
              <Text
                style={[
                  styles.modalTimelineText,
                  { color: colors.textSecondary },
                ]}
              >
                Yapay zeka sonucu hazırlıyor
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: "center",
    ...Shadows.xl,
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.fontSize.xxl,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.primary,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
  },
  modalTimeline: {
    width: "100%",
  },
  modalTimelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  modalTimelineDot: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.md,
  },
  modalTimelineText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.primary,
  },
});
