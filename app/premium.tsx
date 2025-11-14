import { Button } from "@/components";
import { RC_ENTITLEMENT_ID } from "@/constants";
import { useTheme } from "@/hooks";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft, Check, Crown, X, Zap } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
} from "react-native-purchases";

interface PlanFeature {
  name: string;
  free: boolean;
  premium: boolean;
}

// Removed unused PricingPlan interface

export default function PremiumScreen() {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [customerInfoLoading, setCustomerInfoLoading] = useState<boolean>(true);
  const [refreshingCustomerInfo, setRefreshingCustomerInfo] =
    useState<boolean>(false);
  const [showRawCustomerInfo, setShowRawCustomerInfo] =
    useState<boolean>(false);

  const features: PlanFeature[] = [
    { name: t("premium.unlimitedPhotos"), free: false, premium: true },
    { name: t("premium.advancedFilters"), free: false, premium: true },
    { name: t("premium.cloudStorage"), free: false, premium: true },
    { name: t("premium.prioritySupport"), free: false, premium: true },
    { name: t("premium.noAds"), free: false, premium: true },
    { name: "Basic Editing", free: true, premium: true },
    { name: "Standard Filters", free: true, premium: true },
    { name: "Local Storage", free: true, premium: true },
  ];

  const fetchOfferings = useCallback(async () => {
    try {
      setFetching(true);
      const offerings = await Purchases.getOfferings();
      const available = offerings.current?.availablePackages ?? [];
      setPackages(available);
      if (available.length > 0) {
        setSelectedPackageId((prev) => {
          if (prev && available.some((pack) => pack.identifier === prev)) {
            return prev;
          }
          return available[0].identifier;
        });
      } else {
        setSelectedPackageId(null);
      }
    } catch (_e) {
      Alert.alert(
        t("common.error"),
        "Paketler alınırken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.",
      );
    } finally {
      setFetching(false);
    }
  }, [t]);

  const fetchCustomerDetails = useCallback(
    async (withPrimaryLoader = true) => {
      try {
        if (withPrimaryLoader) {
          setCustomerInfoLoading(true);
        } else {
          setRefreshingCustomerInfo(true);
        }
        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
      } catch (_e) {
        Alert.alert(
          t("common.error"),
          "Abonelik bilgileri alınırken bir hata oluştu. Lütfen tekrar deneyin.",
        );
      } finally {
        if (withPrimaryLoader) {
          setCustomerInfoLoading(false);
        } else {
          setRefreshingCustomerInfo(false);
        }
      }
    },
    [t],
  );

  useEffect(() => {
    fetchOfferings();
    fetchCustomerDetails();
  }, [fetchOfferings, fetchCustomerDetails]);

  const selectedPackage = useMemo(
    () => packages.find((p) => p.identifier === selectedPackageId) ?? null,
    [packages, selectedPackageId],
  );

  // Premium durumunu kontrol et - aktif entitlement varsa premium aktif
  const activeEntitlements = customerInfo
    ? Object.values(customerInfo.entitlements.active ?? {})
    : [];
  const isPremiumActive =
    activeEntitlements.length > 0 &&
    activeEntitlements.some((ent) => ent.isActive === true);

  useEffect(() => {
    if (customerInfo) {
      console.log(
        "[PremiumScreen] CustomerInfo:",
        JSON.stringify(customerInfo, null, 2),
      );
    }
  }, [customerInfo]);

  const subscriptionDetails = useMemo(() => {
    if (!customerInfo) return [];

    const activeEnts = Object.values(customerInfo.entitlements.active ?? {});
    const firstActiveEntitlement = activeEnts.find((ent) => ent.isActive);
    const subscriptions = customerInfo.subscriptionsByProductIdentifier ?? {};
    const firstSubscription =
      customerInfo.activeSubscriptions.length > 0
        ? subscriptions[customerInfo.activeSubscriptions[0]]
        : null;

    return [
      {
        label: "Premium Durumu",
        value: isPremiumActive ? "✅ Aktif" : "❌ Pasif",
        highlight: isPremiumActive,
      },
      {
        label: "Entitlement",
        value: firstActiveEntitlement?.identifier ?? "-",
      },
      {
        label: "Ürün Kimliği",
        value:
          firstActiveEntitlement?.productIdentifier ??
          firstSubscription?.productIdentifier ??
          "-",
      },
      {
        label: "Aktif Abonelikler",
        value:
          customerInfo.activeSubscriptions.length > 0
            ? customerInfo.activeSubscriptions.join(", ")
            : "Bulunamadı",
      },
      {
        label: "Mağaza",
        value:
          firstSubscription?.store === "APP_STORE"
            ? "App Store"
            : (firstSubscription?.store ?? "-"),
      },
      {
        label: "Ortam",
        value: firstSubscription?.isSandbox
          ? "🧪 Sandbox (Test)"
          : "🚀 Production",
      },
      {
        label: "Fiyat",
        value:
          firstSubscription && "price" in firstSubscription
            ? `${(firstSubscription as any).price.amount} ${(firstSubscription as any).price.currency}`
            : "-",
      },
      {
        label: "İlk Satın Alma",
        value: formatDateTime(
          firstActiveEntitlement?.originalPurchaseDate ??
            firstSubscription?.originalPurchaseDate,
        ),
      },
      {
        label: "Son Satın Alma",
        value: formatDateTime(
          firstActiveEntitlement?.latestPurchaseDate ??
            firstSubscription?.purchaseDate,
        ),
      },
      {
        label: "Bitiş Tarihi",
        value: formatDateTime(
          firstActiveEntitlement?.expirationDate ??
            firstSubscription?.expiresDate,
        ),
      },
      {
        label: "Otomatik Yenileme",
        value:
          firstActiveEntitlement?.willRenew || firstSubscription?.willRenew
            ? "✅ Evet"
            : "❌ Hayır",
      },
      {
        label: "Kullanıcı ID",
        value: customerInfo.originalAppUserId ?? "-",
      },
      {
        label: "İlk Görülme",
        value: formatDateTime(customerInfo.firstSeen),
      },
      {
        label: "Son Güncelleme",
        value: formatDateTime(customerInfo.requestDate),
      },
    ];
  }, [customerInfo, isPremiumActive]);

  const customerInfoJson = useMemo(
    () =>
      customerInfo
        ? JSON.stringify(customerInfo, null, 2)
        : "RevenueCat üzerinden veri alınamadı.",
    [customerInfo],
  );

  function formatDateTime(dateInput?: string | null): string {
    if (!dateInput) return "-";
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return "-";
    try {
      const datePart = date.toLocaleDateString("tr-TR");
      const timePart = date.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${datePart} ${timePart}`;
    } catch (_e) {
      return date.toISOString();
    }
  }

  function formatPeriod(period?: string | null): string {
    if (!period) return "";
    switch (period) {
      case "P1W":
        return "/hafta";
      case "P1M":
        return "/ay";
      case "P3M":
        return "/3 ay";
      case "P6M":
        return "/6 ay";
      case "P1Y":
        return "/yıl";
      default:
        return "";
    }
  }

  const handleSubscribe = async () => {
    setLoading(true);

    try {
      if (!selectedPackage) {
        Alert.alert(t("common.error"), "Lütfen bir plan seçin.");
        return;
      }
      const { customerInfo: purchaseCustomerInfo } =
        await Purchases.purchasePackage(selectedPackage);
      setCustomerInfo(purchaseCustomerInfo);
      const isActive = Boolean(
        purchaseCustomerInfo.entitlements.active[RC_ENTITLEMENT_ID],
      );
      void fetchOfferings();
      if (isActive) {
        Alert.alert(t("common.success"), "Premium'a hoş geldiniz!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (e: any) {
      if (e?.userCancelled) return; // kullanıcı iptali
      Alert.alert(t("common.error"), "Satın alma işlemi başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      const restoredCustomerInfo = await Purchases.restorePurchases();
      setCustomerInfo(restoredCustomerInfo);
      const isActive = Boolean(
        restoredCustomerInfo.entitlements.active[RC_ENTITLEMENT_ID],
      );
      void fetchOfferings();
      if (isActive) {
        Alert.alert(t("common.success"), "Satın alımlar geri yüklendi.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Restore Purchases", "Aktif satın alma bulunamadı.");
      }
    } catch (_e) {
      Alert.alert(t("common.error"), "Geri yükleme başarısız oldu.");
    }
  };

  const handleOpenManagementURL = useCallback(() => {
    const url = customerInfo?.managementURL;
    if (!url) {
      Alert.alert("Bilgi", "Yönetim bağlantısı şu anda mevcut değil.");
      return;
    }
    Linking.openURL(url).catch(() => {
      Alert.alert("Hata", "Yönetim bağlantısı açılamadı.");
    });
  }, [customerInfo]);

  const handleLogCustomerInfo = useCallback(() => {
    if (!customerInfo) {
      console.log("[PremiumScreen] CustomerInfo: null");
      Alert.alert("Bilgi", "CustomerInfo henüz yüklenmedi.");
      return;
    }
    console.log(
      "[PremiumScreen] CustomerInfo:",
      JSON.stringify(customerInfo, null, 2),
    );
    Alert.alert("Başarılı", "CustomerInfo konsola loglandı!");
  }, [customerInfo]);

  return (
    <LinearGradient
      colors={
        colorScheme === "dark"
          ? ["#0f0f23", "#1a1a2e", "#16213e"]
          : ["#667eea", "#764ba2", "#f093fb"]
      }
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Button
              title=""
              onPress={() => router.back()}
              variant="ghost"
              icon={<ArrowLeft size={24} color="white" />}
            />
          </View>

          <View style={styles.headerContent}>
            {/* Premium Crown with Glow Effect */}
            <View style={styles.crownContainer}>
              <LinearGradient
                colors={["#fbbf24", "#f59e0b", "#d97706"]}
                style={styles.crownGradient}
              >
                <Crown size={48} color="white" />
              </LinearGradient>

              {/* Glow rings */}
              <View style={styles.glowRing1} />
              <View style={styles.glowRing2} />
            </View>

            <Text style={styles.title}>{t("premium.upgradeToPremium")}</Text>

            <Text style={styles.subtitle}>
              Fotoğraflarınızı bir sonraki seviyeye taşıyın
            </Text>

            {/* Premium Benefits Pills */}
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitPill}>
                <Text style={styles.benefitText}>✨ Sınırsız Fotoğraf</Text>
              </View>
              <View style={styles.benefitPill}>
                <Text style={styles.benefitText}>🚀 Gelişmiş Filtreler</Text>
              </View>
              <View style={styles.benefitPill}>
                <Text style={styles.benefitText}>☁️ Bulut Depolama</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Subscription Status */}
        <View style={styles.statusSection}>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>Abonelik Durumunuz</Text>
              <View
                style={[
                  styles.statusBadge,
                  isPremiumActive
                    ? styles.statusBadgeActive
                    : styles.statusBadgeInactive,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    isPremiumActive
                      ? styles.statusBadgeTextActive
                      : styles.statusBadgeTextInactive,
                  ]}
                >
                  {isPremiumActive ? "Aktif" : "Pasif"}
                </Text>
              </View>
            </View>

            {customerInfoLoading ? (
              <View style={styles.statusLoading}>
                <ActivityIndicator color="#667eea" />
                <Text style={styles.statusLoadingText}>
                  Abonelik bilgileriniz yükleniyor...
                </Text>
              </View>
            ) : customerInfo ? (
              <View style={styles.statusDetails}>
                {subscriptionDetails.map((detail) => (
                  <View
                    key={detail.label}
                    style={[
                      styles.statusRow,
                      detail.highlight && styles.statusRowHighlight,
                    ]}
                  >
                    <Text style={styles.statusLabel}>{detail.label}</Text>
                    <Text
                      style={[
                        styles.statusValue,
                        detail.highlight && styles.statusValueHighlight,
                      ]}
                    >
                      {detail.value}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.statusLoading}>
                <Text style={styles.statusLoadingText}>
                  RevenueCat üzerinden abonelik bilginiz bulunamadı.
                </Text>
              </View>
            )}

            <View style={styles.statusActions}>
              <Button
                title={refreshingCustomerInfo ? "" : "Bilgileri Yenile"}
                onPress={() => fetchCustomerDetails(false)}
                loading={refreshingCustomerInfo}
                variant="outline"
                size="sm"
              />
              <Button
                title="Aboneliği Yönet"
                onPress={handleOpenManagementURL}
                variant="outline"
                size="sm"
                disabled={!customerInfo?.managementURL}
              />
              <Button
                title="Console'a Logla"
                onPress={handleLogCustomerInfo}
                variant="outline"
                size="sm"
                disabled={!customerInfo}
              />
            </View>

            <TouchableOpacity
              style={styles.rawDataToggle}
              onPress={() => setShowRawCustomerInfo((prev) => !prev)}
              activeOpacity={0.8}
            >
              <Text style={styles.rawDataToggleText}>
                {showRawCustomerInfo
                  ? "RevenueCat çıktısını gizle"
                  : "RevenueCat çıktısını göster"}
              </Text>
              <Text style={styles.rawDataToggleHint}>
                {showRawCustomerInfo
                  ? "Gizlemek için dokunun"
                  : "Ham JSON verisini görüntüleyin"}
              </Text>
            </TouchableOpacity>

            {showRawCustomerInfo && (
              <View style={styles.rawDataContainer}>
                <Text style={styles.rawDataText}>{customerInfoJson}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Features Comparison */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>
              {t("premium.premiumFeatures")}
            </Text>

            {/* Column Headers */}
            <View style={styles.columnHeaders}>
              <View style={styles.featureColumn}>
                <Text style={styles.columnTitle}>Özellik</Text>
              </View>
              <View style={styles.priceColumn}>
                <View style={styles.freeBadge}>
                  <Text style={styles.freeBadgeText}>Ücretsiz</Text>
                </View>
              </View>
              <View style={styles.priceColumn}>
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.premiumBadge}
                >
                  <Text style={styles.premiumBadgeText}>Premium</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Feature Rows */}
            <View style={styles.featureRows}>
              {features.map((feature, index) => (
                <View
                  key={index}
                  style={[
                    styles.featureRow,
                    feature.premium &&
                      !feature.free &&
                      styles.premiumFeatureRow,
                  ]}
                >
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureName}>{feature.name}</Text>
                    {feature.premium && !feature.free && (
                      <Text style={styles.premiumLabel}>
                        🌟 Premium Özelliği
                      </Text>
                    )}
                  </View>

                  <View style={styles.featureIcons}>
                    <View style={styles.iconContainer}>
                      {feature.free ? (
                        <View style={styles.checkIcon}>
                          <Check size={18} color="#16a34a" />
                        </View>
                      ) : (
                        <View style={styles.xIcon}>
                          <X size={18} color="#dc2626" />
                        </View>
                      )}
                    </View>

                    <View style={styles.iconContainer}>
                      <View style={styles.premiumCheckIcon}>
                        <Check size={18} color="white" />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Bottom CTA */}
            <View style={styles.bottomCTA}>
              <Text style={styles.ctaTitle}>
                Premium&apos;a geçin ve tüm özelliklerin kilidini açın! 🚀
              </Text>
              <Text style={styles.ctaSubtitle}>
                7 gün ücretsiz deneme ile başlayın
              </Text>
            </View>
          </View>
        </View>

        {/* Pricing Plans */}
        <View style={styles.pricingSection}>
          <Text style={styles.pricingTitle}>Planınızı Seçin</Text>

          <View style={styles.plansContainer}>
            {packages.map((pack) => (
              <View
                key={pack.identifier}
                style={[
                  styles.planCard,
                  selectedPackageId === pack.identifier &&
                    styles.selectedPlanCard,
                ]}
              >
                {/* Popular Badge */}
                {pack.packageType === "MONTHLY" && (
                  <View style={styles.popularBadge}>
                    <LinearGradient
                      colors={["#ff6b6b", "#ee5a24"]}
                      style={styles.popularGradient}
                    >
                      <Text style={styles.popularText}>🔥 En Popüler</Text>
                    </LinearGradient>
                  </View>
                )}

                {/* Card Content */}
                <LinearGradient
                  colors={
                    selectedPackageId === pack.identifier
                      ? ["#667eea", "#764ba2"]
                      : ["#ffffff", "#f8f9fa"]
                  }
                  style={styles.planContent}
                >
                  <View style={styles.planHeader}>
                    <View style={styles.planInfo}>
                      <Text
                        style={[
                          styles.planName,
                          selectedPackageId === pack.identifier &&
                            styles.selectedPlanText,
                        ]}
                      >
                        {pack.product.title}
                      </Text>

                      <View style={styles.priceContainer}>
                        <Text
                          style={[
                            styles.planPrice,
                            selectedPackageId === pack.identifier &&
                              styles.selectedPlanText,
                          ]}
                        >
                          {pack.product.priceString}
                        </Text>
                        <Text
                          style={[
                            styles.planPeriod,
                            selectedPackageId === pack.identifier &&
                              styles.selectedPlanPeriod,
                          ]}
                        >
                          {formatPeriod(pack.product.subscriptionPeriod)}
                        </Text>
                      </View>

                      {/* Plan Benefits */}
                      <View style={styles.planBenefits}>
                        <Text
                          style={[
                            styles.benefitItem,
                            selectedPackageId === pack.identifier &&
                              styles.selectedBenefitItem,
                          ]}
                        >
                          📱 Tüm premium özellikler
                        </Text>
                      </View>
                    </View>

                    <View style={styles.selectButton}>
                      <Button
                        title={
                          selectedPackageId === pack.identifier
                            ? "✓ Seçildi"
                            : "Seç"
                        }
                        onPress={() => setSelectedPackageId(pack.identifier)}
                        variant={
                          selectedPackageId === pack.identifier
                            ? "outline"
                            : "primary"
                        }
                        size="sm"
                      />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaSection}>
          {/* Main CTA Button */}
          <View style={styles.mainCTA}>
            <LinearGradient
              colors={["#667eea", "#764ba2", "#f093fb"]}
              style={styles.ctaGradient}
            >
              <Button
                title={loading ? "" : "🚀 7 Gün Ücretsiz Deneyin"}
                onPress={handleSubscribe}
                loading={loading}
                disabled={fetching || !selectedPackage}
                variant="primary"
                size="lg"
                icon={!loading && <Zap size={24} color="white" />}
              />
            </LinearGradient>
          </View>

          {/* Secondary Actions */}
          <View style={styles.secondaryActions}>
            <Button
              title="📱 Satın Alımları Geri Yükle"
              onPress={handleRestore}
              variant="ghost"
              size="md"
            />

            {/* Trust Indicators */}
            <View style={styles.trustIndicators}>
              <View style={styles.trustRow}>
                <View style={styles.trustItem}>
                  <Text style={styles.trustIcon}>🔒</Text>
                  <Text style={styles.trustText}>Güvenli Ödeme</Text>
                </View>
                <View style={styles.trustItem}>
                  <Text style={styles.trustIcon}>⭐</Text>
                  <Text style={styles.trustText}>4.8/5 Puan</Text>
                </View>
                <View style={styles.trustItem}>
                  <Text style={styles.trustIcon}>👥</Text>
                  <Text style={styles.trustText}>10K+ Kullanıcı</Text>
                </View>
              </View>
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
              7 gün ücretsiz deneme • İstediğiniz zaman iptal edin • Otomatik
              yenileme Hesap Ayarları&apos;ndan kapatılabilir
            </Text>
          </View>

          {/* Bottom Spacing for Safe Area */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 64,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  headerContent: {
    alignItems: "center",
  },
  crownContainer: {
    position: "relative",
    marginBottom: 32,
  },
  crownGradient: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
  },
  glowRing1: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    borderColor: "rgba(252, 211, 77, 0.3)",
  },
  glowRing2: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 1,
    borderColor: "rgba(254, 240, 138, 0.2)",
  },
  title: {
    fontSize: 36,
    fontFamily: "Inter-Black",
    textAlign: "center",
    marginBottom: 12,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Inter-Medium",
    textAlign: "center",
    color: "white",
    paddingHorizontal: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  benefitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 24,
    gap: 8,
  },
  benefitPill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  benefitText: {
    color: "white",
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
  },
  statusSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statusCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 22,
    fontFamily: "Inter-Black",
    color: "#1f2937",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeActive: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.35)",
  },
  statusBadgeInactive: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.35)",
  },
  statusBadgeText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
  },
  statusBadgeTextActive: {
    color: "#15803d",
  },
  statusBadgeTextInactive: {
    color: "#b91c1c",
  },
  statusLoading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 8,
  },
  statusLoadingText: {
    fontFamily: "Inter-Medium",
    color: "#4b5563",
    textAlign: "center",
  },
  statusDetails: {
    gap: 12,
    marginTop: 8,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusRowHighlight: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.2)",
  },
  statusLabel: {
    fontFamily: "Inter-SemiBold",
    color: "#4b5563",
    flex: 1,
    flexShrink: 1,
    fontSize: 14,
  },
  statusValue: {
    fontFamily: "Inter-Medium",
    color: "#1f2937",
    flex: 1.1,
    fontSize: 14,
    textAlign: "right",
    flexShrink: 1,
  },
  statusValueHighlight: {
    fontFamily: "Inter-Bold",
    color: "#15803d",
    fontSize: 15,
  },
  statusActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 24,
  },
  rawDataToggle: {
    marginTop: 16,
  },
  rawDataToggleText: {
    fontFamily: "Inter-SemiBold",
    color: "#4338ca",
    fontSize: 14,
  },
  rawDataToggleHint: {
    fontFamily: "Inter-Regular",
    color: "#6b7280",
    fontSize: 12,
    marginTop: 4,
  },
  rawDataContainer: {
    marginTop: 16,
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.4)",
  },
  rawDataText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#e0f2fe",
    lineHeight: 18,
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featuresCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
  },
  featuresTitle: {
    fontSize: 24,
    fontFamily: "Inter-Black",
    textAlign: "center",
    marginBottom: 32,
    color: "#1f2937",
  },
  columnHeaders: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  featureColumn: {
    flex: 1,
  },
  columnTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#4b5563",
    textAlign: "center",
  },
  priceColumn: {
    width: 80,
  },
  freeBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  freeBadgeText: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: "#4b5563",
    textAlign: "center",
  },
  premiumBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  premiumBadgeText: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: "white",
    textAlign: "center",
  },
  featureRows: {
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#f9fafb",
  },
  premiumFeatureRow: {
    backgroundColor: "#faf5ff",
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  featureInfo: {
    flex: 1,
  },
  featureName: {
    fontFamily: "Inter-SemiBold",
    color: "#1f2937",
    fontSize: 16,
  },
  premiumLabel: {
    fontSize: 12,
    color: "#9333ea",
    fontFamily: "Inter-Medium",
    marginTop: 4,
  },
  featureIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    alignItems: "center",
  },
  checkIcon: {
    backgroundColor: "#dcfce7",
    padding: 8,
    borderRadius: 20,
  },
  xIcon: {
    backgroundColor: "#fee2e2",
    padding: 8,
    borderRadius: 20,
  },
  premiumCheckIcon: {
    backgroundColor: "#22c55e",
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomCTA: {
    marginTop: 32,
    padding: 16,
    backgroundColor: "#8b5cf6",
    borderRadius: 16,
  },
  ctaTitle: {
    color: "white",
    fontFamily: "Inter-Bold",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 8,
  },
  ctaSubtitle: {
    color: "white",
    fontFamily: "Inter-Medium",
    textAlign: "center",
    fontSize: 14,
    opacity: 0.9,
  },
  pricingSection: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  pricingTitle: {
    fontSize: 24,
    fontFamily: "Inter-Black",
    textAlign: "center",
    marginBottom: 32,
    color: "white",
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  selectedPlanCard: {
    transform: [{ scale: 1.05 }],
    shadowColor: "#667eea",
    shadowOpacity: 0.3,
    elevation: 12,
  },
  popularBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    zIndex: 10,
  },
  popularGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    transform: [{ rotate: "12deg" }],
  },
  popularText: {
    color: "white",
    fontFamily: "Inter-Bold",
    fontSize: 12,
  },
  planContent: {
    padding: 24,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontFamily: "Inter-Black",
    marginBottom: 8,
    color: "#1f2937",
  },
  selectedPlanText: {
    color: "white",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  planPrice: {
    fontSize: 32,
    fontFamily: "Inter-Black",
    color: "#111827",
  },
  planPeriod: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    marginLeft: 4,
    color: "#4b5563",
  },
  selectedPlanPeriod: {
    color: "white",
    opacity: 0.8,
  },
  savingsBadge: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  savingsText: {
    color: "white",
    fontFamily: "Inter-Bold",
    fontSize: 14,
  },
  planBenefits: {
    marginTop: 16,
    gap: 8,
  },
  benefitItem: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#4b5563",
  },
  selectedBenefitItem: {
    color: "white",
    opacity: 0.9,
  },
  selectButton: {
    marginLeft: 16,
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  mainCTA: {
    marginBottom: 24,
  },
  ctaGradient: {
    borderRadius: 16,
    padding: 4,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  secondaryActions: {
    gap: 12,
  },
  trustIndicators: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    opacity: 0.2,
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  trustItem: {
    alignItems: "center",
  },
  trustIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  trustText: {
    color: "white",
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    textAlign: "center",
    opacity: 0.9,
  },
  termsText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    lineHeight: 20,
    color: "white",
    paddingHorizontal: 16,
    marginTop: 16,
    opacity: 0.7,
  },
  bottomSpacing: {
    height: 32,
  },
});
