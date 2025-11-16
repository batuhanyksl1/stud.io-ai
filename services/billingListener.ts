import { firestore } from "@/firebase.config";
import { store } from "@/store";
import type { SubscriptionPlan } from "@/store/slices/billingSlice";
import { setBillingState } from "@/store/slices/billingSlice";

export function listenUserBilling(uid: string) {
  const ref = firestore().collection("userBilling").doc(uid);

  const unsubscribe = ref.onSnapshot(
    (snapshot) => {
      if (!snapshot.exists) {
        console.log("[BillingListener] Doküman bulunamadı:", uid);
        return;
      }

      const data = snapshot.data();
      if (!data) return;

      // Firestore Timestamp'leri ISO string'e çevir
      const lastRefillAt = data.lastRefillAt
        ? data.lastRefillAt.toDate?.()
          ? data.lastRefillAt.toDate().toISOString()
          : data.lastRefillAt
        : null;

      const nextRefillAt = data.nextRefillAt
        ? data.nextRefillAt.toDate?.()
          ? data.nextRefillAt.toDate().toISOString()
          : data.nextRefillAt
        : null;

      console.log("[BillingListener] Firestore'dan gelen veri:", {
        plan: data.plan,
        subscriptionCredits: data.subscriptionCredits,
        extraCredits: data.extraCredits,
        lastRefillAt,
        nextRefillAt,
      });

      store.dispatch(
        setBillingState({
          plan: (data.plan as SubscriptionPlan) || "free",
          credits: {
            subscriptionCredits: data.subscriptionCredits || 0,
            extraCredits: data.extraCredits || 0,
            lastRefillAt,
            nextRefillAt,
            maxSubscriptionCredits: data.maxSubscriptionCredits || 0,
          },
        }),
      );
    },
    (error) => {
      console.error("[BillingListener] Hata:", error);
    },
  );

  return unsubscribe;
}
