import {
  BorderRadius,
  ComponentTokens,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignTokens";
import { useDeviceDimensions, useTheme } from "@/hooks";
import { Image } from "expo-image";
import React from "react";
import {
  Animated,
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
  localImageUris?: string[];
  hasMultipleInputImage: string;
  onDownloadImage: () => void;
  onStartNew: () => void;
  onOpenImageViewer: (_imageUrl: string) => void;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

export const ResultView: React.FC<ResultViewProps> = ({
  createdImageUrl,
  originalImageForResult,
  localImageUri,
  localImageUris,
  hasMultipleInputImage,
  onDownloadImage,
  onStartNew,
  onOpenImageViewer,
  fadeAnim,
  scaleAnim,
}) => {
  const { colors } = useTheme();
  const { isTablet, isSmallDevice } = useDeviceDimensions();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollArea,
        { paddingHorizontal: isTablet ? 8 : isSmallDevice ? 4 : 6 },
      ]}
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
          <Text
            style={[
              styles.sectionLabel,
              {
                color: colors.success,
                fontSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
              },
            ]}
          >
            Sonuç hazır
          </Text>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
                fontSize: isTablet ? 24 : isSmallDevice ? 18 : 20,
              },
            ]}
          >
            Studio AI talimatınızı tamamladı
          </Text>
          <Text
            style={[
              styles.sectionHelper,
              {
                color: colors.textSecondary,
                fontSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
              },
            ]}
          >
            Sonucu tam ekranda inceleyebilir, cihazınıza indirebilir veya yeni
            bir proje başlatabilirsiniz.
          </Text>

          {/* Ana Sonuç Görseli - Ortada Büyük */}
          <View style={styles.mainResultContainer}>
            <View style={styles.mainResultLabelRow}>
              <Text
                style={[
                  styles.mainResultLabel,
                  {
                    color: colors.primary,
                    fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
                  },
                ]}
              >
                Sonuç
              </Text>
              <Pressable
                onPress={() => onOpenImageViewer(createdImageUrl || "")}
              >
                <Text
                  style={[
                    styles.viewerLink,
                    {
                      color: colors.primary,
                      fontSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
                    },
                  ]}
                >
                  Tam ekran
                </Text>
              </Pressable>
            </View>
            <Pressable
              style={[
                styles.mainResultImageWrapper,
                {
                  borderColor: colors.primary,
                  backgroundColor: colors.background,
                },
              ]}
              onPress={() => onOpenImageViewer(createdImageUrl || "")}
            >
              <Image
                source={{ uri: createdImageUrl || "" }}
                style={styles.mainResultImage}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            </Pressable>
          </View>

          {/* Referans Görseller - Alt Kısımda Küçük */}
          <View style={styles.referenceImagesContainer}>
            <Text
              style={[
                styles.referenceLabel,
                {
                  color: colors.textSecondary,
                  fontSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
                },
              ]}
            >
              Referans görseller
            </Text>
            <View style={styles.referenceImagesRow}>
              {hasMultipleInputImage === "true" &&
              localImageUris &&
              localImageUris.length > 0 ? (
                localImageUris.map((uri, index) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.referenceImageWrapper,
                      {
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                      },
                    ]}
                    onPress={() => onOpenImageViewer(uri)}
                  >
                    <Image
                      source={{ uri }}
                      style={styles.referenceImage}
                      contentFit="cover"
                      cachePolicy="memory-disk"
                    />
                  </Pressable>
                ))
              ) : (
                <Pressable
                  style={[
                    styles.referenceImageWrapper,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                    },
                  ]}
                  onPress={() =>
                    onOpenImageViewer(
                      originalImageForResult || localImageUri || "",
                    )
                  }
                >
                  <Image
                    source={{
                      uri: originalImageForResult || localImageUri || "",
                    }}
                    style={styles.referenceImage}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                </Pressable>
              )}
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
                  {
                    color: colors.textOnPrimary,
                    fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
                  },
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
                  {
                    color: colors.textSecondary,
                    fontSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
                  },
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
          <Text
            style={[
              styles.infoTitle,
              {
                color: colors.textPrimary,
                fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
              },
            ]}
          >
            Sonuçtan memnun değil misiniz?
          </Text>
          <Text
            style={[
              styles.infoText,
              {
                color: colors.textSecondary,
                fontSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
              },
            ]}
          >
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
  // Ana sonuç görseli stilleri
  mainResultContainer: {
    marginTop: Spacing.xl,
    alignItems: "center",
  },
  mainResultLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: Spacing.sm,
  },
  mainResultLabel: {
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
  mainResultImageWrapper: {
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    padding: Spacing.sm,
    width: "100%",
    maxWidth: 400,
    aspectRatio: 1,
  },
  mainResultImage: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.lg,
  },
  // Referans görseller stilleri
  referenceImagesContainer: {
    marginTop: Spacing.xl,
  },
  referenceLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    textTransform: "uppercase",
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: Spacing.sm,
  },
  referenceImagesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  referenceImageWrapper: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.xs,
    width: 80,
    height: 80,
  },
  referenceImage: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.sm,
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
