import { RC_ENTITLEMENT_ID } from "@/constants";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
} from "react-native-purchases";

interface UsePremiumSubscriptionReturn {
  // State
  loading: boolean;
  fetching: boolean;
  packages: PurchasesPackage[];
  selectedPackageId: string | null;
  selectedPackage: PurchasesPackage | null;
  customerInfo: CustomerInfo | null;
  isPremiumActive: boolean;

  // Actions
  setSelectedPackageId: (id: string | null) => void;
  handleSubscribe: () => Promise<void>;
  handleRestore: () => Promise<void>;
  handleManageSubscription: () => void;
}

export const usePremiumSubscription = (): UsePremiumSubscriptionReturn => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

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
    } catch (error: unknown) {
      console.error("Paketler alınırken hata:", error);
    } finally {
      setFetching(false);
    }
  }, []);

  const fetchCustomerInfo = useCallback(async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (error: unknown) {
      console.error("Customer info hatası:", error);
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

  const handleSubscribe = useCallback(async () => {
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
    } catch (e: unknown) {
      const error = e as { userCancelled?: boolean };
      if (error?.userCancelled) return;
      Alert.alert(t("common.error"), "Satın alma işlemi başarısız oldu.");
    } finally {
      setLoading(false);
    }
  }, [selectedPackage, t]);

  const handleRestore = useCallback(async () => {
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
    } catch (_error: unknown) {
      Alert.alert(t("common.error"), "Geri yükleme başarısız oldu.");
    }
  }, [t]);

  const handleManageSubscription = useCallback(() => {
    const url = customerInfo?.managementURL;
    if (url) {
      Linking.openURL(url);
    } else {
      Alert.alert("Bilgi", "Yönetim bağlantısı mevcut değil.");
    }
  }, [customerInfo]);

  return {
    // State
    loading,
    fetching,
    packages,
    selectedPackageId,
    selectedPackage,
    customerInfo,
    isPremiumActive,

    // Actions
    setSelectedPackageId,
    handleSubscribe,
    handleRestore,
    handleManageSubscription,
  };
};

