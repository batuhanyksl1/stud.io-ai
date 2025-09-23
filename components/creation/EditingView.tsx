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
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface EditingViewProps {
  createdImageUrl?: string;
  localImageUri?: string;
  localImageUris?: string[];
  hasMultipleInputImage: string;
  hasResult: boolean;
  isGenerating: boolean;
  onSelectImage: () => void;
  onGenerateImage: () => void;
  onRemoveImage: (index: number) => void;
  onRemoveSingleImage: () => void;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

export const EditingView: React.FC<EditingViewProps> = ({
  createdImageUrl,
  localImageUri,
  localImageUris,
  hasMultipleInputImage,
  hasResult,
  isGenerating,
  onSelectImage,
  onGenerateImage,
  onRemoveImage,
  onRemoveSingleImage,
  fadeAnim,
  scaleAnim,
}) => {
  const { colors } = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.keyboardContainer, { backgroundColor: colors.background }]}
    >
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
          {/* Ana yaratım alanı - sadece yaratım sonrası göster */}
          {hasResult && (
            <View
              style={[
                styles.creationArea,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Image
                source={{ uri: createdImageUrl || "" }}
                style={styles.createdImagePreview}
              />
            </View>
          )}

          {/* Seçilen görseller */}
          {(localImageUri || (localImageUris && localImageUris.length > 0)) && (
            <View
              style={[
                styles.selectedImagesCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text
                style={[styles.sectionLabel, { color: colors.textSecondary }]}
              >
                Referans görseller
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.selectedImagesContainer}
              >
                {hasMultipleInputImage === "true" &&
                localImageUris &&
                localImageUris.length > 0 ? (
                  localImageUris.map((uri, index) => (
                    <View key={index} style={styles.selectedImageItem}>
                      <Image
                        source={{ uri }}
                        style={styles.selectedImagePreview}
                      />
                      {/* Çarpı işareti sadece editing aşamasında (yaratım yapılmamışken) */}
                      {!hasResult && (
                        <Pressable
                          style={[
                            styles.removeButton,
                            {
                              backgroundColor: colors.surface,
                              borderColor: colors.border,
                            },
                          ]}
                          onPress={() => onRemoveImage(index)}
                        >
                          <Text
                            style={[
                              styles.removeButtonText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            ×
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  ))
                ) : localImageUri ? (
                  <View style={styles.selectedImageItem}>
                    <Image
                      source={{ uri: localImageUri }}
                      style={styles.selectedImagePreview}
                    />
                    {/* Çarpı işareti sadece editing aşamasında (yaratım yapılmamışken) */}
                    {!hasResult && (
                      <Pressable
                        style={[
                          styles.removeButton,
                          {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                          },
                        ]}
                        onPress={onRemoveSingleImage}
                      >
                        <Text
                          style={[
                            styles.removeButtonText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          ×
                        </Text>
                      </Pressable>
                    )}
                  </View>
                ) : null}
              </ScrollView>
            </View>
          )}

          <View style={styles.actionRow}>
            <Pressable
              style={[
                styles.buttonPrimary,
                styles.fullWidthButton,
                { backgroundColor: colors.primary },
                isGenerating && styles.buttonPrimaryDisabled,
              ]}
              onPress={onGenerateImage}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <View style={styles.loadingInline}>
                  <ActivityIndicator color={colors.textOnPrimary} />
                  <Text
                    style={[
                      styles.buttonTextPrimary,
                      styles.loadingInlineText,
                      { color: colors.textOnPrimary },
                    ]}
                  >
                    Hazırlanıyor...
                  </Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.buttonTextPrimary,
                    { color: colors.textOnPrimary },
                  ]}
                >
                  oluştur
                </Text>
              )}
            </Pressable>

            <Pressable
              style={[
                styles.buttonSecondary,
                styles.fullWidthButton,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
              onPress={onSelectImage}
            >
              <Text
                style={[
                  styles.buttonTextSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                {hasMultipleInputImage === "true"
                  ? "Farklı görseller seç"
                  : "Farklı görsel seç"}
              </Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
              İpucu
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Daha farklı sonuçlar için yeni bir görsel seçebilir veya promptu
              güncelleyerek yeniden deneyebilirsiniz.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollArea: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxl,
  },
  sectionStack: {
    width: "100%",
  },
  creationArea: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  createdImagePreview: {
    width: "100%",
    height: 280,
    borderRadius: BorderRadius.md,
    resizeMode: "contain",
  },
  selectedImagesCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    textTransform: "uppercase",
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: Spacing.sm,
  },
  selectedImagesContainer: {
    marginTop: Spacing.md,
    overflow: "visible",
  },
  selectedImageItem: {
    marginRight: Spacing.md,
    position: "relative",
    overflow: "visible",
  },
  selectedImagePreview: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  removeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 18,
    textAlign: "center",
  },
  actionRow: {
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
  buttonPrimaryDisabled: {
    opacity: 0.7,
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
  loadingInline: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingInlineText: {
    marginLeft: Spacing.sm,
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
