import { editingServices } from "@/components/data/homeData";
import {
  BorderRadius,
  ComponentTokens,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignTokens";
import { useDeviceDimensions, useTheme } from "@/hooks";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { Header } from "../home/Header";

interface InitialViewProps {
  title: string;
  gradientColors: string[];
  servicePrompt: string;
  hasMultipleInputImage: string;
  onSelectImage: () => void;
  onPromptChange?: (_prompt: string) => void;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

export const InitialView: React.FC<InitialViewProps> = ({
  title,
  gradientColors,
  servicePrompt,
  hasMultipleInputImage,
  onSelectImage,
  onPromptChange,
  fadeAnim,
  scaleAnim,
}) => {
  const { colors } = useTheme();
  const { isTablet, isSmallDevice } = useDeviceDimensions();
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [currentExamplePage, setCurrentExamplePage] = useState(0);
  const examplePagerRef = useRef<PagerView>(null);
  const autoScrollInterval = useRef<number | null>(null);

  const handleCustomPromptChange = (text: string) => {
    setCustomPrompt(text);
    onPromptChange?.(text);
  };

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

  // Otomatik kaydırma için useEffect
  useEffect(() => {
    autoScrollInterval.current = setInterval(() => {
      const nextPage = (currentExamplePage + 1) % exampleItems.length;
      setCurrentExamplePage(nextPage);
      examplePagerRef.current?.setPage(nextPage);
    }, 5000); // 5 saniyede bir değişir

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [currentExamplePage, exampleItems.length]);

  // Sayfa değiştiğinde
  const onExamplePageSelected = (e: any) => {
    const newPage = e.nativeEvent.position;
    setCurrentExamplePage(newPage);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollArea,
        { paddingHorizontal: isTablet ? 8 : isSmallDevice ? 4 : 6 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Header leftIconType="arrow-back" rightIconType="settings" />

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
            colors={gradientColors as [string, string, ...string[]]}
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
        <Text
          style={[
            styles.heroTitle,
            {
              color: colors.textPrimary,
              fontSize: isTablet ? 28 : isSmallDevice ? 20 : 24,
            },
          ]}
        >
          Fotoğraflarınızı saniyeler içinde düzenleyin
        </Text>
        <Text
          style={[
            styles.heroDescription,
            {
              color: colors.textSecondary,
              fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
            },
          ]}
        >
          Referans görselinizi ekleyin, talimatınızı paylaşın yada Studio
          AI&apos;ın sizin için düzenlesin.
        </Text>

        {/* Custom Prompt Section */}
        {showCustomPrompt ? (
          <View
            style={[styles.customPromptSection, { borderColor: colors.border }]}
          >
            <Text
              style={[
                styles.customPromptLabel,
                {
                  color: colors.textSecondary,
                  fontSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
                },
              ]}
            >
              Kendi talimatınızı yazın
            </Text>
            <TextInput
              style={[
                styles.customPromptInput,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surfaceElevated,
                  color: colors.textPrimary,
                  fontSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
                },
              ]}
              value={customPrompt}
              onChangeText={handleCustomPromptChange}
              placeholder="Özel talimatınızı buraya yazın..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <Pressable
              style={[
                styles.customPromptCancelButton,
                { borderColor: colors.border },
              ]}
              onPress={() => {
                setShowCustomPrompt(false);
                setCustomPrompt("");
                onPromptChange?.(servicePrompt);
              }}
            >
              <Text
                style={[
                  styles.customPromptCancelText,
                  {
                    color: colors.textSecondary,
                    fontSize: isTablet ? 14 : isSmallDevice ? 10 : 12,
                  },
                ]}
              >
                Varsayılan talimatı kullan
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={[styles.customPromptButton, { borderColor: colors.border }]}
            onPress={() => setShowCustomPrompt(true)}
          >
            <Text
              style={[
                styles.customPromptButtonText,
                {
                  color: colors.textTertiary,
                  fontSize: isTablet ? 14 : isSmallDevice ? 10 : 12,
                },
              ]}
            >
              Kendi talimatını ekle
            </Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.buttonPrimary, { backgroundColor: colors.primary }]}
          onPress={onSelectImage}
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
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontSize: isTablet ? 24 : isSmallDevice ? 18 : 20,
            },
          ]}
        >
          Nasıl çalışıyor?
        </Text>

        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, { borderColor: colors.primary }]}>
            <Text style={[styles.stepNumberText, { color: colors.primary }]}>
              1
            </Text>
          </View>
          <View style={styles.stepContent}>
            <Text
              style={[
                styles.stepTitle,
                {
                  color: colors.textPrimary,
                  fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
                },
              ]}
            >
              Referans görselinizi yükleyin
            </Text>
            <Text
              style={[
                styles.stepSubtitle,
                {
                  color: colors.textSecondary,
                  fontSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
                },
              ]}
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
            <Text
              style={[
                styles.stepTitle,
                {
                  color: colors.textPrimary,
                  fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
                },
              ]}
            >
              Studio AI talimatınızı uygulasın
            </Text>
            <Text
              style={[
                styles.stepSubtitle,
                {
                  color: colors.textSecondary,
                  fontSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
                },
              ]}
            >
              Platform, varsayılan promptu kullanır veya özel talimatınızı
              uygulayarak yeni versiyonu üretir.
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
            <Text
              style={[
                styles.stepTitle,
                {
                  color: colors.textPrimary,
                  fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
                },
              ]}
            >
              Sonucu gözden geçirip indirin
            </Text>
            <Text
              style={[
                styles.stepSubtitle,
                {
                  color: colors.textSecondary,
                  fontSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
                },
              ]}
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
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontSize: isTablet ? 24 : isSmallDevice ? 18 : 20,
            },
          ]}
        >
          Örnek çıktılar
        </Text>
        <Text
          style={[
            styles.examplesDescription,
            {
              color: colors.textSecondary,
              fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
            },
          ]}
        >
          Studio AI&apos;nin farklı araçlarıyla neler elde edebileceğinizi
          keşfedin.
        </Text>

        <View style={styles.carouselContainer}>
          <PagerView
            ref={examplePagerRef}
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={onExamplePageSelected}
          >
            {exampleItems.map((item) => (
              <View key={item.id} style={styles.pageContainer}>
                <View
                  style={[
                    styles.exampleItem,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.surfaceElevated,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.exampleTitle,
                      {
                        color: colors.textPrimary,
                        fontSize: isTablet ? 20 : isSmallDevice ? 16 : 18,
                      },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.exampleSubtitle,
                      {
                        color: colors.textSecondary,
                        fontSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
                      },
                    ]}
                  >
                    {item.subtitle}
                  </Text>

                  <View style={styles.exampleImageRow}>
                    <View style={styles.exampleImageWrapper}>
                      <Text
                        style={[
                          styles.exampleImageLabel,
                          {
                            color: colors.textTertiary,
                            fontSize: isTablet ? 14 : isSmallDevice ? 10 : 12,
                          },
                        ]}
                      >
                        Önce
                      </Text>
                      <Image
                        source={item.beforeImage}
                        style={styles.exampleImage}
                      />
                    </View>
                    <Text
                      style={[
                        styles.exampleArrow,
                        {
                          color: colors.primary,
                          fontSize: isTablet ? 20 : isSmallDevice ? 16 : 18,
                        },
                      ]}
                    >
                      →
                    </Text>
                    <View style={styles.exampleImageWrapper}>
                      <Text
                        style={[
                          styles.exampleImageLabel,
                          {
                            color: colors.textTertiary,
                            fontSize: isTablet ? 14 : isSmallDevice ? 10 : 12,
                          },
                        ]}
                      >
                        Sonra
                      </Text>
                      <Image
                        source={item.afterImage}
                        style={styles.exampleImage}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </PagerView>

          {/* Sayfa göstergeleri */}
          <View style={styles.pagination}>
            {exampleItems.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor:
                      index === currentExamplePage
                        ? colors.primary
                        : colors.border,
                    width: index === currentExamplePage ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollArea: {},
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
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    marginTop: Spacing.lg,
    ...Shadows.none,
  },
  examplesDescription: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
    marginBottom: Spacing.xl,
  },
  carouselContainer: {
    height: 320,
    marginBottom: Spacing.lg,
  },
  pagerView: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
  },
  exampleItem: {
    width: "100%",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    height: 280,
    justifyContent: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
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
  customPromptButton: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  customPromptButtonText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    //textDecorationLine: "underline",
  },
  customPromptSection: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  customPromptLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: Spacing.sm,
  },
  customPromptInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.primary,
    minHeight: 80,
    marginBottom: Spacing.sm,
  },
  customPromptCancelButton: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  customPromptCancelText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
  },
});
