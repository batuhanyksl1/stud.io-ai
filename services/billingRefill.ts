import { firestore } from "@/firebase.config";
import type { SubscriptionPlan } from "@/store/slices/billingSlice";

export function getPlanConfig(plan: SubscriptionPlan) {
  switch (plan) {
    case "starter":
      return {
        monthlyCredits: 100,
        maxSubscriptionCredits: 200,
      };
    case "pro":
      return {
        monthlyCredits: 300,
        maxSubscriptionCredits: 600,
      };
    case "pro_yearly":
      return {
        monthlyCredits: 300, // yine aylık gibi düşüneceksin
        maxSubscriptionCredits: 600,
      };
    case "free":
    default:
      return {
        monthlyCredits: 0,
        maxSubscriptionCredits: 0,
      };
  }
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export async function maybeRefillUserCredits(
  uid: string,
  plan: SubscriptionPlan,
): Promise<void> {
  const billingRef = firestore().collection("userBilling").doc(uid);
  const snap = await billingRef.get();

  if (!snap.exists) {
    console.log("[BillingRefill] Doküman bulunamadı:", uid);
    return;
  }

  const data = snap.data();
  if (!data) return;

  const config = getPlanConfig(plan);
  if (!config.monthlyCredits) return;

  const now = new Date();
  const lastRefill = data.lastRefillAt
    ? new Date(data.lastRefillAt.toDate())
    : null;

  // Eğer hiç refill yoksa => hemen doldur
  if (!lastRefill) {
    await billingRef.update({
      subscriptionCredits: config.monthlyCredits,
      maxSubscriptionCredits: config.maxSubscriptionCredits,
      lastRefillAt: firestore.FieldValue.serverTimestamp(),
      nextRefillAt: firestore.Timestamp.fromDate(addMonths(now, 1)),
    });
    return;
  }

  // Bir sonraki refill zamanı gelmiş mi?
  const nextRefill = data.nextRefillAt
    ? new Date(data.nextRefillAt.toDate())
    : addMonths(lastRefill, 1);

  if (now >= nextRefill) {
    const currentSubCredits = data.subscriptionCredits || 0;
    const newSubCredits = Math.min(
      currentSubCredits + config.monthlyCredits,
      config.maxSubscriptionCredits,
    );

    await billingRef.update({
      subscriptionCredits: newSubCredits,
      maxSubscriptionCredits: config.maxSubscriptionCredits,
      lastRefillAt: firestore.FieldValue.serverTimestamp(),
      nextRefillAt: firestore.Timestamp.fromDate(addMonths(nextRefill, 1)),
    });
  }
}

