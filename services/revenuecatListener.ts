import { firestore } from "@/firebase.config";
import type { SubscriptionPlan } from "@/store/slices/billingSlice";
import { Platform } from "react-native";
import Purchases, { CustomerInfo } from "react-native-purchases";
import { getPlanConfig } from "./billingRefill";

function mapCustomerInfoToPlan(customerInfo: CustomerInfo): SubscriptionPlan {
  // Entitlements üzerinden karar verelim
  const entitlements = customerInfo.entitlements?.active || {};

  if (entitlements["pro_yearly"]) return "pro_yearly";
  if (entitlements["pro"]) return "pro";
  if (entitlements["starter"]) return "starter";

  return "free";
}

export async function upsertBillingFromCustomerInfo(
  customerInfo: CustomerInfo,
  uid: string,
): Promise<void> {
  const plan = mapCustomerInfoToPlan(customerInfo);
  const config = getPlanConfig(plan);

  const billingRef = firestore().collection("userBilling").doc(uid);
  const snap = await billingRef.get();

  const now = firestore.FieldValue.serverTimestamp();

  if (!snap.exists) {
    // İlk defa billing oluşturuluyor
    await billingRef.set({
      plan,
      subscriptionCredits: config.monthlyCredits,
      extraCredits: 0,
      maxSubscriptionCredits: config.maxSubscriptionCredits,
      lastRefillAt: now,
      nextRefillAt: null, // RevenueCat renewal date'i burada kullanabilirsin
      platform: Platform.OS === "ios" ? "ios" : "android",
      rcCustomerId: customerInfo.originalAppUserId,
      entitlements: customerInfo.entitlements?.active || {},
    });
  } else {
    // Sadece planı ve entitlements'ı güncelle
    // Refill işini yenileme zamanında ayrı yapacağız
    const current = snap.data();
    if (!current) return;

    await billingRef.update({
      plan,
      maxSubscriptionCredits: config.maxSubscriptionCredits,
      rcCustomerId: customerInfo.originalAppUserId,
      entitlements: customerInfo.entitlements?.active || {},
    });
  }
}

export function initRevenueCatListener(uid: string) {
  try {
    Purchases.addCustomerInfoUpdateListener(async (customerInfo) => {
      try {
        await upsertBillingFromCustomerInfo(customerInfo, uid);
      } catch (e) {
        console.error("[RevenueCat] upsert billing error", e);
      }
    });
  } catch (error: any) {
    // RevenueCat configure edilmemişse bu hata normal, sessizce geç
    if (
      error?.message?.includes("singleton instance") ||
      error?.message?.includes("configure")
    ) {
      console.log(
        "[RevenueCat] RevenueCat henüz configure edilmemiş, listener atlanıyor",
      );
    } else {
      console.error("[RevenueCat] Listener init error:", error);
    }
  }
}
