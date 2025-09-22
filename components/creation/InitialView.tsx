import { editingServices } from "@/components/data/homeData";
import {
  BorderRadius,
  ComponentTokens,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignTokens";
import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface InitialViewProps {
  title: string;
  gradientColors: string[];
  servicePrompt: string;
  aiRequestUrl?: string;
  hasMultipleInputImage: string;
  onSelectImage: () => void;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

export const InitialView: React.FC<InitialViewProps> = ({
  title,
  gradientColors,
  servicePrompt,
  aiRequestUrl,
  hasMultipleInputImage,
  onSelectImage,
  fadeAnim,
  scaleAnim,
}) => {
  const { colors } = useTheme();
  const screenWidth = useMemo(() => Dimensions.get("window").width, []);

  const promptDetails = useMemo(() => {
    if (!servicePrompt) {
      return "Talimat henüz oluşturulmadı.";
    }

    if (servicePrompt.length <= 160) {
      return servicePrompt;
    }

    return `${servicePrompt.slice(0, 157)}...`;
  }, [servicePrompt]);

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
    <ScrollView
      contentContainerStyle={styles.scrollArea}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          styles.heroCard,
          {
            backgroundColor: colors.surface,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={{ flexDirection: "row", gap: Spacing.sm }}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroBadge}
          >
            <Text
              style={[styles.heroBadgeText, { color: colors.textOnPrimary }]}
            >
              {title}
            </Text>
          </LinearGradient>
        </View>
        <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
          Hayalinizi saniyeler içinde hayata geçirin
        </Text>
        <Text style={[styles.heroDescription, { color: colors.textSecondary }]}>
          Referans görselinizi ekleyin, talimatınızı paylaşın ve Studio AI
          gerisini sizin için yönetsin.
        </Text>

        <View style={styles.heroMetaRow}>
          <View style={[styles.heroMetaItem, { borderColor: colors.border }]}>
            <Text
              style={[styles.heroMetaLabel, { color: colors.textTertiary }]}
            >
              Talimat
            </Text>
            <Text style={[styles.heroMetaValue, { color: colors.textPrimary }]}>
              {promptDetails}
            </Text>
          </View>
          {aiRequestUrl ? (
            <View style={[styles.heroMetaItem, { borderColor: colors.border }]}>
              <Text
                style={[styles.heroMetaLabel, { color: colors.textTertiary }]}
              >
                Araç
              </Text>
              <Text
                style={[styles.heroMetaValue, { color: colors.textPrimary }]}
              >
                {aiRequestUrl}
              </Text>
            </View>
          ) : null}
        </View>

        <Pressable
          style={[styles.buttonPrimary, { backgroundColor: colors.primary }]}
          onPress={onSelectImage}
        >
          <Text
            style={[styles.buttonTextPrimary, { color: colors.textOnPrimary }]}
          >
            {hasMultipleInputImage === "true"
              ? "Galeriden görseller seç"
              : "Galeriden görsel seç"}
          </Text>
        </Pressable>
      </Animated.View>

      <View
        style={[
          styles.stepsCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Nasıl çalışıyor?
        </Text>

        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, { borderColor: colors.primary }]}>
            <Text style={[styles.stepNumberText, { color: colors.primary }]}>
              1
            </Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              Referans görselinizi yükleyin
            </Text>
            <Text
              style={[styles.stepSubtitle, { color: colors.textSecondary }]}
            >
              Yapay zekanın doğru bağlamı yakalaması için net bir görsel seçin.
            </Text>
          </View>
        </View>

        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, { borderColor: colors.primary }]}>
            <Text style={[styles.stepNumberText, { color: colors.primary }]}>
              2
            </Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              Studio AI talimatınızı uygulasın
            </Text>
            <Text
              style={[styles.stepSubtitle, { color: colors.textSecondary }]}
            >
              Platform, promptunuzu ve görseli eşleştirerek yeni versiyonu
              üretir.
            </Text>
          </View>
        </View>

        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, { borderColor: colors.primary }]}>
            <Text style={[styles.stepNumberText, { color: colors.primary }]}>
              3
            </Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              Sonucu gözden geçirip indirin
            </Text>
            <Text
              style={[styles.stepSubtitle, { color: colors.textSecondary }]}
            >
              Beğendiğiniz anda eseri kaydedebilir veya yeni bir deneme
              başlatabilirsiniz.
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.examplesCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Örnek çıktılar
        </Text>
        <Text
          style={[styles.examplesDescription, { color: colors.textSecondary }]}
        >
          Studio AI&apos;nin farklı araçlarıyla neler elde edebileceğinizi
          keşfedin.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.exampleList}
        >
          {exampleItems.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.exampleItem,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surfaceElevated,
                },
                index === exampleItems.length - 1 && styles.exampleItemLast,
              ]}
            >
              <Text
                style={[styles.exampleTitle, { color: colors.textPrimary }]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.exampleSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                {item.subtitle}
              </Text>

              <View style={styles.exampleImageRow}>
                <View style={styles.exampleImageWrapper}>
                  <Text
                    style={[
                      styles.exampleImageLabel,
                      { color: colors.textTertiary },
                    ]}
                  >
                    Önce
                  </Text>
                  <Image
                    source={item.beforeImage}
                    style={styles.exampleImage}
                  />
                </View>
                <Text style={[styles.exampleArrow, { color: colors.primary }]}>
                  →
                </Text>
                <View style={styles.exampleImageWrapper}>
                  <Text
                    style={[
                      styles.exampleImageLabel,
                      { color: colors.textTertiary },
                    ]}
                  >
                    Sonra
                  </Text>
                  <Image source={item.afterImage} style={styles.exampleImage} />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollArea: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxl,
  },
  heroCard: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xl,
    ...Shadows.lg,
  },
  heroBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  heroBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.semiBold,
    textTransform: "uppercase",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: Typography.fontSize.xxxxxl,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.sm,
  },
  heroDescription: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
    marginBottom: Spacing.xl,
  },
  heroMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.xl,
  },
  heroMetaItem: {
    flexBasis: "48%",
    flexGrow: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  heroMetaLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: Typography.letterSpacing.wide,
  },
  heroMetaValue: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.primary,
  },
  stepsCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    borderWidth: 1,
    ...Shadows.sm,
  },
  examplesCard: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    marginTop: Spacing.xl,
    ...Shadows.none,
  },
  examplesDescription: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
    marginBottom: Spacing.xl,
  },
  exampleList: {
    paddingRight: Spacing.xl,
  },
  exampleItem: {
    width: 260,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginRight: Spacing.lg,
  },
  exampleItemLast: {
    marginRight: 0,
  },
  exampleTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: Spacing.xs,
  },
  exampleSubtitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.md,
  },
  exampleImageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exampleImageWrapper: {
    alignItems: "center",
    flex: 1,
  },
  exampleImageLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: Typography.letterSpacing.wide,
  },
  exampleArrow: {
    fontSize: Typography.fontSize.xxl,
    marginHorizontal: Spacing.md,
    fontFamily: Typography.fontFamily.semiBold,
  },
  exampleImage: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xxl,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.lg,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  stepNumberText: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: Spacing.xs,
  },
  stepSubtitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
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
});
