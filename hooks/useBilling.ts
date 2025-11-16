import { listenUserBilling } from "@/services/billingListener";
import { maybeRefillUserCredits } from "@/services/billingRefill";
import {
  initRevenueCatListener,
  upsertBillingFromCustomerInfo,
} from "@/services/revenuecatListener";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearBilling } from "@/store/slices/billingSlice";
import auth from "@react-native-firebase/auth";
import { useEffect, useRef } from "react";
import Purchases, { CustomerInfo } from "react-native-purchases";

export function useBilling() {
  const dispatch = useAppDispatch();
  const billingUnsubscribeRef = useRef<(() => void) | null>(null);
  const { plan } = useAppSelector((state) => state.billing);
  const user = auth().currentUser;

  useEffect(() => {
    if (!user) {
      // Kullanıcı yoksa listener'ları temizle ve RevenueCat'ten çıkış yap
      if (billingUnsubscribeRef.current) {
        billingUnsubscribeRef.current();
        billingUnsubscribeRef.current = null;
      }
      dispatch(clearBilling());

      // RevenueCat'ten çıkış yap
      try {
        Purchases.logOut().catch((_error) => {
          // RevenueCat configure edilmemişse bu hata normal, sessizce geç
        });
      } catch (_error) {
        // Sessizce geç
      }
      return;
    }

    const uid = user.uid;

    console.log("[useBilling] Listener'lar başlatılıyor, UID:", uid);

    // Firestore billing listener'ı başlat
    billingUnsubscribeRef.current = listenUserBilling(uid);

    // RevenueCat listener'ı başlat (configure edilmemişse hata vermeden geç)
    try {
      // Önce RevenueCat'e kullanıcı ID'sini bağla
      Purchases.logIn(uid)
        .then(async (logInResult) => {
          const customerInfo = logInResult.customerInfo;
          console.log(
            "[useBilling] RevenueCat'e kullanıcı ID'si bağlandı:",
            uid,
            "CustomerInfo:",
            customerInfo.originalAppUserId,
          );

          // Listener'ı başlat
          initRevenueCatListener(uid);

          // Customer info'yu sync et
          try {
            await upsertBillingFromCustomerInfo(customerInfo, uid);
            // Plan'ı aldıktan sonra refill kontrolü yap
            const planFromCustomerInfo =
              customerInfo.entitlements?.active || {};
            let currentPlan: "free" | "starter" | "pro" | "pro_yearly" = "free";
            if (planFromCustomerInfo["pro_yearly"]) currentPlan = "pro_yearly";
            else if (planFromCustomerInfo["pro"]) currentPlan = "pro";
            else if (planFromCustomerInfo["starter"]) currentPlan = "starter";

            await maybeRefillUserCredits(uid, currentPlan);
          } catch (error) {
            console.error("[useBilling] Customer info sync error:", error);
          }
        })
        .catch((error) => {
          // RevenueCat configure edilmemişse bu hata normal, sessizce geç
          if (
            error?.message?.includes("singleton instance") ||
            error?.message?.includes("configure")
          ) {
            console.log(
              "[useBilling] RevenueCat henüz configure edilmemiş, atlanıyor",
            );
          } else {
            console.error("[useBilling] RevenueCat logIn error:", error);
            // logIn başarısız olsa bile listener'ı başlatmayı dene
            try {
              initRevenueCatListener(uid);
              Purchases.getCustomerInfo()
                .then(async (customerInfo: CustomerInfo) => {
                  try {
                    await upsertBillingFromCustomerInfo(customerInfo, uid);
                    const planFromCustomerInfo =
                      customerInfo.entitlements?.active || {};
                    let currentPlan: "free" | "starter" | "pro" | "pro_yearly" =
                      "free";
                    if (planFromCustomerInfo["pro_yearly"])
                      currentPlan = "pro_yearly";
                    else if (planFromCustomerInfo["pro"]) currentPlan = "pro";
                    else if (planFromCustomerInfo["starter"])
                      currentPlan = "starter";
                    await maybeRefillUserCredits(uid, currentPlan);
                  } catch (error) {
                    console.error(
                      "[useBilling] Customer info sync error:",
                      error,
                    );
                  }
                })
                .catch((err) => {
                  console.error("[useBilling] Get customer info error:", err);
                });
            } catch (initError) {
              console.error("[useBilling] Init listener error:", initError);
            }
          }
        });
    } catch (error: any) {
      // RevenueCat configure edilmemişse bu hata normal, sessizce geç
      if (
        error?.message?.includes("singleton instance") ||
        error?.message?.includes("configure")
      ) {
        console.log(
          "[useBilling] RevenueCat henüz configure edilmemiş, atlanıyor",
        );
      } else {
        console.error("[useBilling] RevenueCat init error:", error);
      }
    }

    // Cleanup function
    return () => {
      if (billingUnsubscribeRef.current) {
        billingUnsubscribeRef.current();
        billingUnsubscribeRef.current = null;
      }
    };
  }, [user, dispatch]);

  // Plan değiştiğinde refill kontrolü yap
  useEffect(() => {
    if (!user || !plan) return;

    maybeRefillUserCredits(user.uid, plan).catch((error) => {
      console.error("[useBilling] Refill check error:", error);
    });
  }, [plan, user]);
}
