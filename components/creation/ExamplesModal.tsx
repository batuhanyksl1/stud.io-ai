import { editingServices } from "@/components/data/homeData";
import {
  BorderRadius,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignTokens";
import { useTheme } from "@/hooks/useTheme";
import React, { useMemo } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ExamplesModalProps {
  visible: boolean;
  activeExampleIndex: number;
  onClose: () => void;
  onMomentumEnd: (event: any) => void;
}

export const ExamplesModal: React.FC<ExamplesModalProps> = ({
  visible,
  activeExampleIndex,
  onClose,
  onMomentumEnd,
}) => {
  const { colors } = useTheme();
  const screenWidth = useMemo(() => Dimensions.get("window").width, []);

  const exampleItems = useMemo(
    () =>
      editingServices.slice(0, 3).map((service) => ({
        id: service.id,
        title: service.title,
        subtitle: service.subtitle,
        beforeImage: service.image1,
        afterImage: service.image2,
      })),
    [],
  );

  return (
    <Modal
      visible={visible && exampleItems.length > 0}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.examplesModalOverlay,
          { backgroundColor: colors.overlay },
        ]}
      >
        <View
          style={[
            styles.examplesModalContainer,
            { backgroundColor: colors.surface },
          ]}
        >
          <Text
            style={[styles.examplesModalTitle, { color: colors.textPrimary }]}
          >
            Studio AI ile neler mümkün?
          </Text>
          <Text
            style={[
              styles.examplesModalSubtitle,
              { color: colors.textSecondary },
            ]}
          >
            Örnekleri kaydırarak farklı senaryoları inceleyin.
          </Text>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onMomentumEnd}
          >
            {exampleItems.map((item) => (
              <View
                key={item.id}
                style={[styles.examplesModalSlide, { width: screenWidth }]}
              >
                <View
                  style={[
                    styles.examplesModalCard,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.examplesModalSlideTitle,
                      { color: colors.textPrimary },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.examplesModalSlideSubtitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.subtitle}
                  </Text>

                  <View style={styles.examplesModalImageRow}>
                    <View style={styles.examplesModalImageWrapper}>
                      <Text
                        style={[
                          styles.examplesModalImageLabel,
                          { color: colors.textTertiary },
                        ]}
                      >
                        Önce
                      </Text>
                      <Image
                        source={item.beforeImage}
                        style={styles.examplesModalImage}
                      />
                    </View>
                    <Text
                      style={[
                        styles.examplesModalArrow,
                        { color: colors.primary },
                      ]}
                    >
                      →
                    </Text>
                    <View style={styles.examplesModalImageWrapper}>
                      <Text
                        style={[
                          styles.examplesModalImageLabel,
                          { color: colors.textTertiary },
                        ]}
                      >
                        Sonra
                      </Text>
                      <Image
                        source={item.afterImage}
                        style={styles.examplesModalImage}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.examplesModalIndicators}>
            {exampleItems.map((item, index) => (
              <View
                key={`${item.id}-dot`}
                style={[
                  styles.examplesModalDot,
                  { backgroundColor: colors.border },
                  index === activeExampleIndex && {
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            ))}
          </View>

          <Pressable
            style={[
              styles.examplesModalSkipButton,
              { borderColor: colors.border },
            ]}
            onPress={onClose}
          >
            <Text
              style={[
                styles.examplesModalSkipText,
                { color: colors.textSecondary },
              ]}
            >
              Geç / Skip
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  examplesModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  examplesModalContainer: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    ...Shadows.xl,
  },
  examplesModalTitle: {
    fontSize: Typography.fontSize.xxxl,
    fontFamily: Typography.fontFamily.bold,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  examplesModalSubtitle: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
  },
  examplesModalSlide: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  examplesModalCard: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.xxl,
  },
  examplesModalSlideTitle: {
    fontSize: Typography.fontSize.xxl,
    fontFamily: Typography.fontFamily.bold,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  examplesModalSlideSubtitle: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  examplesModalImageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  examplesModalImageWrapper: {
    alignItems: "center",
    flex: 1,
  },
  examplesModalImageLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    textTransform: "uppercase",
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: Spacing.xs,
  },
  examplesModalImage: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.lg,
  },
  examplesModalArrow: {
    fontSize: Typography.fontSize.xxxl,
    marginHorizontal: Spacing.lg,
    fontFamily: Typography.fontFamily.semiBold,
  },
  examplesModalIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  examplesModalDot: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
    marginHorizontal: Spacing.xs,
  },
  examplesModalSkipButton: {
    alignSelf: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  examplesModalSkipText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
  },
});
