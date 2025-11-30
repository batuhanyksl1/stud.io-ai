import { Button } from "@/components";
import { RC_ENTITLEMENT_ID } from "@/constants";
import { BorderRadius, Typography } from "@/constants/DesignTokens";
import { useDeviceDimensions, useTheme } from "@/hooks";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Crown,
  Gift,
  Infinity,
  Shield,
  Sparkles,
  Star,
  Wand2,
  X,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
} from "react-native-purchases";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Floating Particle Component
const FloatingParticle: React.FC<{
  delay: number;
  size: number;
  color: string;
  startX: number;
}> = ({ delay, size, color, startX }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(0, { duration: 1000 }),
        ),
        -1,
        false,
      ),
    );

    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-150, { duration: 2000, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      ),
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000 }),
          withTiming(0.5, { duration: 1000 }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          left: startX,
          bottom: 0,
        },
      ]}
    />
  );
};

// Animated Crown Component
const AnimatedCrown: React.FC = () => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });

    rotation.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 }),
      ),
      -1,
      true,
    );
  }, [glowOpacity, rotation, scale]);

  const crownStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: interpolate(glowOpacity.value, [0.3, 1], [1, 1.3]) }],
  }));

  return (
    <View style={styles.crownWrapper}>
      {/* Glow Effect */}
      <Animated.View style={[styles.crownGlow, glowStyle]}>
        <LinearGradient
          colors={["rgba(251, 191, 36, 0.4)", "transparent"]}
          style={styles.crownGlowGradient}
        />
      </Animated.View>

      {/* Crown */}
      <Animated.View style={crownStyle}>
        <LinearGradient
          colors={["#fbbf24", "#f59e0b", "#d97706"]}
          style={styles.crownContainer}
        >
          <Crown size={52} color="white" strokeWidth={1.5} />
        </LinearGradient>
      </Animated.View>

      {/* Sparkles */}
      <Animated.View
        style={[styles.sparkle, styles.sparkle1]}
        entering={FadeIn.delay(500)}
      >
        <Sparkles size={16} color="#fbbf24" />
      </Animated.View>
      <Animated.View
        style={[styles.sparkle, styles.sparkle2]}
        entering={FadeIn.delay(700)}
      >
        <Star size={12} color="#fbbf24" fill="#fbbf24" />
      </Animated.View>
      <Animated.View
        style={[styles.sparkle, styles.sparkle3]}
        entering={FadeIn.delay(900)}
      >
        <Sparkles size={14} color="#f59e0b" />
      </Animated.View>
    </View>
  );
};

// Feature Item Component
const FeatureItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  gradient: [string, string];
}> = ({ icon, title, description, delay, gradient }) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(500).springify()}
      style={styles.featureItem}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featureIconContainer}
      >
        {icon}
      </LinearGradient>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
      <View style={styles.featureCheck}>
        <Check size={18} color="#10B981" strokeWidth={3} />
      </View>
    </Animated.View>
  );
};

// Pricing Card Component
const PricingCard: React.FC<{
  pack: PurchasesPackage;
  isSelected: boolean;
  isPopular: boolean;
  isBestValue: boolean;
  monthlyPrice?: number;
  onSelect: () => void;
  delay: number;
}> = ({
  pack,
  isSelected,
  isPopular,
  isBestValue,
  monthlyPrice,
  onSelect,
  delay,
}) => {
  const scale = useSharedValue(1);
  const borderGlow = useSharedValue(0);
  useEffect(() => {
    console.log("pack", pack);
  }, [pack]);

  useEffect(() => {
    if (isSelected) {
      borderGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.5, { duration: 1000 }),
        ),
        -1,
        true,
      );
    }
  }, [borderGlow, isSelected]);

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: borderGlow.value,
  }));

  const formatPeriod = (period?: string | null): string => {
    if (!period) return "";
    switch (period) {
      case "P1W":
        return "hafta";
      case "P1M":
        return "ay";
      case "P3M":
        return "3 ay";
      case "P6M":
        return "6 ay";
      case "P1Y":
        return "yıl";
      default:
        return "";
    }
  };

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onSelect();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={cardStyle}>
          {/* Badge */}
          {(isPopular || isBestValue) && (
            <View style={styles.popularBadge}>
              <LinearGradient
                colors={
                  isBestValue ? ["#10B981", "#059669"] : ["#ef4444", "#dc2626"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.popularGradient}
              >
                <Text style={styles.popularText}>
                  {isBestValue ? "💎 En Avantajlı" : "🔥 En Popüler"}
                </Text>
              </LinearGradient>
            </View>
          )}

          {/* Card */}
          <View
            style={[
              styles.pricingCard,
              isSelected && styles.pricingCardSelected,
              isBestValue && styles.pricingCardBestValue,
            ]}
          >
            {/* Selection Glow */}
            {isSelected && (
              <Animated.View style={[styles.selectionGlow, glowStyle]}>
                <LinearGradient
                  colors={["rgba(124, 58, 237, 0.3)", "transparent"]}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            )}

            <View style={styles.pricingCardContent}>
              {/* Left: Info */}
              <View style={styles.pricingInfo}>
                {/* Title & Description */}
                <Text
                  style={[
                    styles.pricingName,
                    isSelected && styles.pricingNameSelected,
                  ]}
                >
                  {pack.product.title.replace(" (Stud.io AI)", "")}
                </Text>

                {/* Product Description (200 Görsel Üretme Şansı vb.) */}
                <Text
                  style={[
                    styles.pricingDescription,
                    isSelected && styles.pricingDescriptionSelected,
                  ]}
                >
                  {pack.product.description}
                </Text>

                {/* Price */}
                <View style={styles.priceRow}>
                  <Text
                    style={[
                      styles.pricingPrice,
                      isSelected && styles.pricingPriceSelected,
                    ]}
                  >
                    {pack.product.priceString}
                  </Text>
                  <Text
                    style={[
                      styles.pricingPeriod,
                      isSelected && styles.pricingPeriodSelected,
                    ]}
                  >
                    /{formatPeriod(pack.product.subscriptionPeriod)}
                  </Text>
                </View>
              </View>

              {/* Right: Selection indicator */}
              <View
                style={[
                  styles.selectionIndicator,
                  isSelected && styles.selectionIndicatorSelected,
                ]}
              >
                {isSelected && <Check size={20} color="#FFF" strokeWidth={3} />}
              </View>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

// CTA Button Component
const CTAButton: React.FC<{
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}> = ({ onPress, loading, disabled }) => {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.5, { duration: 1500 }),
      ),
      -1,
      true,
    );
  }, [glowOpacity]);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: interpolate(glowOpacity.value, [0.5, 1], [1, 1.05]) }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(800).springify()}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
      >
        <View style={styles.ctaWrapper}>
          {/* Glow Effect */}
          <Animated.View style={[styles.ctaGlow, glowStyle]}>
            <LinearGradient
              colors={["rgba(124, 58, 237, 0.5)", "rgba(219, 39, 119, 0.5)"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>

          {/* Button */}
          <Animated.View style={buttonStyle}>
            <LinearGradient
              colors={
                disabled
                  ? ["#6B7280", "#4B5563"]
                  : ["#7c3aed", "#db2777", "#f59e0b"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Zap size={24} color="#FFF" fill="#FFF" />
                  <Text style={styles.ctaText}>Premium&apos;a Geç</Text>
                </>
              )}
            </LinearGradient>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function PremiumScreen() {
  const { t } = useTranslation();
  const _theme = useTheme();
  const _dimensions = useDeviceDimensions();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [showDevTools, setShowDevTools] = useState(false);

  const features = useMemo(
    () => [
      {
        icon: <Infinity size={24} color="#FFF" />,
        title: "Sınırsız Düzenleme",
        description: "İstediğin kadar fotoğraf düzenle",
        gradient: ["#7c3aed", "#a855f7"] as [string, string],
      },
      {
        icon: <Wand2 size={24} color="#FFF" />,
        title: "Tüm AI Araçları",
        description: "Premium filtreler ve efektler",
        gradient: ["#db2777", "#ec4899"] as [string, string],
      },
      {
        icon: <Shield size={24} color="#FFF" />,
        title: "Öncelikli Destek",
        description: "7/24 hızlı destek hattı",
        gradient: ["#0ea5e9", "#38bdf8"] as [string, string],
      },
      {
        icon: <Sparkles size={24} color="#FFF" />,
        title: "Yeni Özellikler",
        description: "İlk sen dene, ilk sen kullan",
        gradient: ["#f59e0b", "#fbbf24"] as [string, string],
      },
    ],
    [],
  );

  const fetchOfferings = useCallback(async () => {
    try {
      setFetching(true);
      const offerings = await Purchases.getOfferings();
      const available = offerings.current?.availablePackages ?? [];
      // Fiyata göre büyükten küçüğe sırala
      const sorted = [...available].sort(
        (a, b) => b.product.price - a.product.price,
      );
      setPackages(sorted);
      if (sorted.length > 0) {
        // Varsayılan olarak en pahalı olanı seç (sıralamadan sonra ilk sıradaki)
        setSelectedPackageId(sorted[0].identifier);
      }
    } catch (error: any) {
      console.error("Paketler alınırken hata:", error);
    } finally {
      setFetching(false);
    }
  }, []);

  const fetchCustomerInfo = useCallback(async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (_error) {
      console.error("Customer info hatası:", _error);
    }
  }, []);

  useEffect(() => {
    fetchOfferings();
    fetchCustomerInfo();
  }, [fetchOfferings, fetchCustomerInfo]);

  const selectedPackage = useMemo(
    () => packages.find((p) => p.identifier === selectedPackageId) ?? null,
    [packages, selectedPackageId],
  );

  const isPremiumActive = useMemo(() => {
    if (!customerInfo) return false;
    const activeEntitlements = Object.values(
      customerInfo.entitlements.active ?? {},
    );
    return activeEntitlements.some((ent) => ent.isActive);
  }, [customerInfo]);

  const handleSubscribe = async () => {
    if (!selectedPackage) {
      Alert.alert(t("common.error"), "Lütfen bir plan seçin.");
      return;
    }

    setLoading(true);
    try {
      const { customerInfo: purchaseInfo } =
        await Purchases.purchasePackage(selectedPackage);
      setCustomerInfo(purchaseInfo);

      const isActive = Boolean(
        purchaseInfo.entitlements.active[RC_ENTITLEMENT_ID],
      );

      if (isActive) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          "🎉 Hoş Geldin!",
          "Premium'a başarıyla geçtin! Tüm özellikler artık senin.",
          [{ text: "Harika!", onPress: () => router.back() }],
        );
      }
    } catch (e: any) {
      if (e?.userCancelled) return;
      Alert.alert(t("common.error"), "Satın alma işlemi başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const restoredInfo = await Purchases.restorePurchases();
      setCustomerInfo(restoredInfo);

      const isActive = Boolean(
        restoredInfo.entitlements.active[RC_ENTITLEMENT_ID],
      );

      if (isActive) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("✅ Başarılı", "Satın alımlarınız geri yüklendi!", [
          { text: "Tamam", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Bilgi", "Aktif bir satın alma bulunamadı.");
      }
    } catch (_error) {
      Alert.alert(t("common.error"), "Geri yükleme başarısız oldu.");
    }
  };

  const handleManageSubscription = useCallback(() => {
    const url = customerInfo?.managementURL;
    if (url) {
      Linking.openURL(url);
    } else {
      Alert.alert("Bilgi", "Yönetim bağlantısı mevcut değil.");
    }
  }, [customerInfo]);

  // Zaten premium ise farklı bir görünüm göster
  if (isPremiumActive) {
    return (
      <LinearGradient
        colors={["#0f0f23", "#1a1a2e", "#0f0f23"]}
        style={styles.container}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={20}
          >
            <ArrowLeft size={24} color="#FFF" />
          </Pressable>
        </View>

        <View style={styles.premiumActiveContainer}>
          <AnimatedCrown />

          <Animated.Text
            entering={FadeInUp.delay(300)}
            style={styles.premiumActiveTitle}
          >
            Premium Üyesin! 🎉
          </Animated.Text>

          <Animated.Text
            entering={FadeInUp.delay(400)}
            style={styles.premiumActiveSubtitle}
          >
            Tüm özelliklerin kilidi açık
          </Animated.Text>

          <Animated.View
            entering={FadeInUp.delay(600)}
            style={styles.premiumActiveActions}
          >
            <Button
              title="Aboneliği Yönet"
              onPress={handleManageSubscription}
              variant="outline"
              size="md"
            />
            <Button
              title="Geri Dön"
              onPress={() => router.back()}
              variant="primary"
              size="md"
            />
          </Animated.View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0f0f23", "#1a1a2e", "#0f0f23"]}
      style={styles.container}
    >
      {/* Float ing Particles */}
      <View style={styles.particlesContainer}>
        {[...Array(8)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 400}
            size={4 + Math.random() * 4}
            color={
              i % 2 === 0
                ? "rgba(124, 58, 237, 0.6)"
                : "rgba(251, 191, 36, 0.6)"
            }
            startX={Math.random() * SCREEN_WIDTH}
          />
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
          hitSlop={20}
        >
          <ArrowLeft size={24} color="#FFF" />
        </Pressable>

        <Pressable
          onPress={handleRestore}
          style={styles.restoreButton}
          hitSlop={20}
        >
          <Text style={styles.restoreText}>Geri Yükle</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <AnimatedCrown />

          <Animated.Text
            entering={FadeInUp.delay(200).springify()}
            style={styles.heroTitle}
          >
            Premium&apos;a Geç
          </Animated.Text>

          <Animated.Text
            entering={FadeInUp.delay(300).springify()}
            style={styles.heroSubtitle}
          >
            Fotoğraflarını bir üst seviyeye taşı
          </Animated.Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Animated.Text
            entering={FadeIn.delay(400)}
            style={styles.sectionTitle}
          >
            Neler Kazanırsın?
          </Animated.Text>

          <View style={styles.featuresList}>
            {features.map((feature, index) => (
              <FeatureItem
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                delay={500 + index * 100}
              />
            ))}
          </View>
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          <Animated.Text
            entering={FadeIn.delay(700)}
            style={styles.sectionTitle}
          >
            Planını Seç
          </Animated.Text>

          {fetching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#7c3aed" size="large" />
              <Text style={styles.loadingText}>Planlar yükleniyor...</Text>
            </View>
          ) : (
            <View style={styles.pricingList}>
              {packages.map((pack, index) => {
                // Aylık fiyatı bul (tasarruf hesabı için)
                const monthlyPack = packages.find(
                  (p) => p.packageType === "MONTHLY",
                );
                const monthlyPrice = monthlyPack?.product.price;

                return (
                  <PricingCard
                    key={pack.identifier}
                    pack={pack}
                    isSelected={selectedPackageId === pack.identifier}
                    isPopular={pack.product.title === "Studio"}
                    isBestValue={pack.product.title === "Studio"}
                    monthlyPrice={monthlyPrice}
                    onSelect={() => setSelectedPackageId(pack.identifier)}
                    delay={750 + index * 100}
                  />
                );
              })}
            </View>
          )}
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <CTAButton
            onPress={handleSubscribe}
            loading={loading}
            disabled={fetching || !selectedPackage}
          />

          {/* Trial Info */}
          <Animated.View entering={FadeIn.delay(900)} style={styles.trialInfo}>
            <Gift size={16} color="#10B981" />
            <Text style={styles.trialText}>7 gün ücretsiz dene</Text>
          </Animated.View>

          {/* Trust Indicators */}
          <Animated.View
            entering={FadeInUp.delay(1000)}
            style={styles.trustSection}
          >
            <View style={styles.trustItem}>
              <Shield size={20} color="rgba(255,255,255,0.6)" />
              <Text style={styles.trustText}>Güvenli Ödeme</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <X size={20} color="rgba(255,255,255,0.6)" />
              <Text style={styles.trustText}>İstediğin Zaman İptal</Text>
            </View>
          </Animated.View>

          {/* Terms */}
          <Animated.Text entering={FadeIn.delay(1100)} style={styles.termsText}>
            Abonelik otomatik olarak yenilenir. İstediğiniz zaman
            Ayarlar&apos;dan iptal edebilirsiniz.
          </Animated.Text>
        </View>

        {/* Developer Tools (Hidden by default) */}
        <View style={styles.devToolsSection}>
          <Pressable
            onPress={() => setShowDevTools(!showDevTools)}
            style={styles.devToolsToggle}
          >
            <Text style={styles.devToolsToggleText}>Geliştirici Araçları</Text>
            {showDevTools ? (
              <ChevronUp size={16} color="rgba(255,255,255,0.3)" />
            ) : (
              <ChevronDown size={16} color="rgba(255,255,255,0.3)" />
            )}
          </Pressable>

          {showDevTools && (
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={styles.devToolsContent}
            >
              <Text style={styles.devToolsLabel}>Customer ID:</Text>
              <Text style={styles.devToolsValue}>
                {customerInfo?.originalAppUserId ?? "-"}
              </Text>

              <Text style={styles.devToolsLabel}>Entitlements:</Text>
              <Text style={styles.devToolsValue}>
                {JSON.stringify(
                  customerInfo?.entitlements.active ?? {},
                  null,
                  2,
                )}
              </Text>

              <View style={styles.devToolsActions}>
                <Button
                  title="Console'a Logla"
                  onPress={() => {
                    console.log(
                      "CustomerInfo:",
                      JSON.stringify(customerInfo, null, 2),
                    );
                    Alert.alert("Başarılı", "Console'a loglandı!");
                  }}
                  variant="outline"
                  size="sm"
                />
                <Button
                  title="Bilgileri Yenile"
                  onPress={fetchCustomerInfo}
                  variant="outline"
                  size="sm"
                />
              </View>
            </Animated.View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  particle: {
    position: "absolute",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  restoreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  restoreText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },
  scrollContent: {
    paddingHorizontal: 24,
  },

  // Hero Section
  heroSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
  },
  crownWrapper: {
    position: "relative",
    marginBottom: 24,
  },
  crownGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    left: -30,
    top: -30,
    borderRadius: 80,
    overflow: "hidden",
  },
  crownGlowGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 80,
  },
  crownContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  sparkle: {
    position: "absolute",
  },
  sparkle1: {
    top: -5,
    right: -10,
  },
  sparkle2: {
    bottom: 10,
    left: -15,
  },
  sparkle3: {
    top: 20,
    right: -20,
  },
  heroTitle: {
    fontFamily: Typography.fontFamily.oswaldBold,
    fontSize: 42,
    color: "#FFF",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  heroSubtitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginTop: 8,
  },

  // Features Section
  featuresSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 20,
    color: "#FFF",
    marginBottom: 20,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 16,
    color: "#FFF",
  },
  featureDescription: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  featureCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Pricing Section
  pricingSection: {
    marginBottom: 32,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
  },
  pricingList: {
    gap: 12,
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    right: 16,
    zIndex: 10,
  },
  popularGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  popularText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 12,
    color: "#FFF",
  },
  pricingCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  pricingCardSelected: {
    borderColor: "#7c3aed",
    backgroundColor: "rgba(124, 58, 237, 0.1)",
  },
  pricingCardBestValue: {
    borderColor: "rgba(16, 185, 129, 0.5)",
  },
  selectionGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BorderRadius.xl,
  },
  pricingCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  pricingInfo: {
    flex: 1,
  },
  pricingName: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
    color: "#FFF",
    marginBottom: 2,
  },
  pricingNameSelected: {
    color: "#FFF",
  },
  pricingDescription: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 12,
  },
  pricingDescriptionSelected: {
    color: "rgba(255,255,255,0.6)",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  pricingPrice: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 28,
    color: "#FFF",
  },
  pricingPriceSelected: {
    color: "#FFF",
  },
  pricingPeriod: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    marginLeft: 4,
  },
  pricingPeriodSelected: {
    color: "rgba(255,255,255,0.7)",
  },
  pricePerMonth: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 13,
    color: "#a78bfa",
    marginTop: 4,
  },
  savingsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  savingsText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 13,
    color: "#10B981",
  },
  selectionIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  selectionIndicatorSelected: {
    borderColor: "#7c3aed",
    backgroundColor: "#7c3aed",
  },

  // CTA Section
  ctaSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  ctaWrapper: {
    position: "relative",
    width: "100%",
  },
  ctaGlow: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    height: 60,
    borderRadius: BorderRadius.lg,
  },
  ctaText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
    color: "#FFF",
  },
  trialInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  trialText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 14,
    color: "#10B981",
  },
  trustSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    gap: 16,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trustText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
  },
  trustDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  termsText: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 18,
    paddingHorizontal: 20,
  },

  // Dev Tools
  devToolsSection: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 20,
  },
  devToolsToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  devToolsToggleText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 13,
    color: "rgba(255,255,255,0.3)",
  },
  devToolsContent: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: BorderRadius.md,
    padding: 16,
    marginTop: 8,
  },
  devToolsLabel: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 8,
  },
  devToolsValue: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  devToolsActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  // Premium Active State
  premiumActiveContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  premiumActiveTitle: {
    fontFamily: Typography.fontFamily.oswaldBold,
    fontSize: 36,
    color: "#FFF",
    textAlign: "center",
    marginTop: 24,
  },
  premiumActiveSubtitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginTop: 8,
  },
  premiumActiveActions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 40,
  },
});
