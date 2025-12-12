import { Button } from "@/components";
import {
  AnimatedCrown,
  CTAButton,
  FeatureItem,
  FeatureItemData,
  FloatingParticle,
  PricingCard,
} from "@/components/premium";
import { LEGAL_LINKS } from "@/constants";
import { Typography } from "@/constants/DesignTokens";
import { usePremiumSubscription } from "@/hooks";
import { LinearGradient } from "expo-linear-gradient";
import {
  FileText,
  Infinity,
  Shield,
  Sparkles,
  Wand2,
  X,
} from "lucide-react-native";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Particle configuration
const PARTICLE_COUNT = 8;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  delay: i * 400,
  size: 4 + Math.random() * 4,
  color: i % 2 === 0 ? "rgba(124, 58, 237, 0.6)" : "rgba(251, 191, 36, 0.6)",
  startX: Math.random() * SCREEN_WIDTH,
}));

export default function PremiumScreen() {
  const {
    loading,
    fetching,
    packages,
    selectedPackageId,
    selectedPackage,
    isPremiumActive,
    setSelectedPackageId,
    handleSubscribe,
    handleRestore,
    handleManageSubscription,
  } = usePremiumSubscription();

  const features: FeatureItemData[] = useMemo(
    () => [
      {
        icon: <Infinity size={24} color="#FFF" />,
        title: "En Güncel Yapay Zeka Araçları",
        description: "En güncel yapay zeka araçları ile fotoğrafını düzenle",
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

  // Zaten premium ise farklı bir görünüm göster
  if (isPremiumActive) {
    return (
      <LinearGradient
        colors={["#0f0f23", "#1a1a2e", "#0f0f23"]}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={{ width: 44 }} />
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
      {/* Floating Particles */}
      <View style={styles.particlesContainer}>
        {PARTICLES.map((particle) => (
          <FloatingParticle
            key={particle.id}
            delay={particle.delay}
            size={particle.size}
            color={particle.color}
            startX={particle.startX}
          />
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 44 }} />

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

          {/* Legal Links */}
          <Animated.View
            entering={FadeInUp.delay(1200)}
            style={styles.legalLinksContainer}
          >
            <Pressable
              onPress={() => Linking.openURL(LEGAL_LINKS.PRIVACY_POLICY)}
              style={styles.legalLinkButton}
              hitSlop={10}
            >
              <Shield size={14} color="#a78bfa" />
              <Text style={styles.legalLinkText}>Gizlilik Politikası</Text>
            </Pressable>

            <View style={styles.legalLinkDivider} />

            <Pressable
              onPress={() => Linking.openURL(LEGAL_LINKS.TERMS_OF_USE)}
              style={styles.legalLinkButton}
              hitSlop={10}
            >
              <FileText size={14} color="#a78bfa" />
              <Text style={styles.legalLinkText}>Kullanım Şartları</Text>
            </Pressable>
          </Animated.View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
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

  // CTA Section
  ctaSection: {
    alignItems: "center",
    marginBottom: 32,
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

  // Legal Links
  legalLinksContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    gap: 12,
  },
  legalLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  legalLinkText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 13,
    color: "#a78bfa",
    textDecorationLine: "underline",
  },
  legalLinkDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
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
