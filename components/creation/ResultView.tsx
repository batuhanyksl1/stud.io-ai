import {
  BorderRadius,
  ComponentTokens,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignTokens";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ResultViewProps {
  createdImageUrl?: string;
  originalImageForResult?: string;
  localImageUri?: string;
  onDownloadImage: () => void;
  onStartNew: () => void;
  onOpenImageViewer: () => void;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

export const ResultView: React.FC<ResultViewProps> = ({
  createdImageUrl,
  originalImageForResult,
  localImageUri,
  onDownloadImage,
  onStartNew,
  onOpenImageViewer,
  fadeAnim,
  scaleAnim,
}) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollArea}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          styles.sectionStack,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: colors.success }]}>
            Sonuç hazır
          </Text>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Studio AI talimatınızı tamamladı
          </Text>
          <Text style={[styles.sectionHelper, { color: colors.textSecondary }]}>
            Sonucu tam ekranda inceleyebilir, cihazınıza indirebilir veya yeni
            bir proje başlatabilirsiniz.
          </Text>

          <View style={styles.resultRow}>
            <View
              style={[
                styles.resultImageWrapper,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
            >
              <Text
                style={[styles.resultLabel, { color: colors.textSecondary }]}
              >
                Önce
              </Text>
              <Image
                source={{ uri: originalImageForResult || localImageUri || "" }}
                style={styles.resultImage}
              />
            </View>

            <View
              style={[
                styles.resultImageWrapper,
                {
                  borderColor: colors.primary,
                  backgroundColor: colors.background,
                },
              ]}
            >
              <View style={styles.resultLabelRow}>
                <Text style={[styles.resultLabel, { color: colors.primary }]}>
                  Sonuç
                </Text>
                <Pressable onPress={onOpenImageViewer}>
                  <Text style={[styles.viewerLink, { color: colors.primary }]}>
                    Tam ekran
                  </Text>
                </Pressable>
              </View>
              <Image
                source={{ uri: createdImageUrl || "" }}
                style={styles.resultImage}
              />
            </View>
          </View>

          <View style={styles.resultActions}>
            <Pressable
              style={[
                styles.buttonPrimary,
                styles.fullWidthButton,
                styles.resultPrimaryAction,
                { backgroundColor: colors.primary },
              ]}
              onPress={onDownloadImage}
            >
              <Text
                style={[
                  styles.buttonTextPrimary,
                  { color: colors.textOnPrimary },
                ]}
              >
                Cihaza indir
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.buttonSecondary,
                styles.fullWidthButton,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
              onPress={onStartNew}
            >
              <Text
                style={[
                  styles.buttonTextSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                Yeni proje başlat
              </Text>
            </Pressable>
          </View>
        </View>

        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
            Sonuçtan memnun değil misiniz?
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Farklı bir görsel veya revize edilmiş bir prompt ile kısa sürede
            yepyeni bir versiyon elde edebilirsiniz.
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollArea: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxl,
  },
  sectionStack: {
    width: "100%",
  },
  sectionCard: {
    width: "100%",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    ...Shadows.sm,
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    textTransform: "uppercase",
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xxl,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.sm,
  },
  sectionHelper: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.primary,
    marginTop: Spacing.md,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  resultRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: Spacing.xl,
  },
  resultImageWrapper: {
    flexBasis: "48%",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  resultLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  resultLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    textTransform: "uppercase",
    letterSpacing: Typography.letterSpacing.wide,
  },
  viewerLink: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    textTransform: "uppercase",
  },
  resultImage: {
    width: "100%",
    height: 220,
    borderRadius: BorderRadius.md,
  },
  resultPrimaryAction: {
    marginBottom: Spacing.md,
  },
  resultActions: {
    marginTop: Spacing.xl,
    width: "100%",
    alignItems: "stretch",
  },
  buttonPrimary: {
    paddingVertical: ComponentTokens.button.padding.lg.vertical,
    paddingHorizontal: ComponentTokens.button.padding.lg.horizontal,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  buttonTextPrimary: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    textTransform: "uppercase",
    letterSpacing: Typography.letterSpacing.wide,
  },
  buttonSecondary: {
    paddingVertical: ComponentTokens.button.padding.md.vertical,
    paddingHorizontal: ComponentTokens.button.padding.md.horizontal,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
  },
  fullWidthButton: {
    width: "100%",
  },
  buttonTextSecondary: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
  },
  infoCard: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    borderWidth: 1,
    ...Shadows.none,
    marginTop: Spacing.xl,
  },
  infoTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
  },
});
