import { firestore } from "@/firebase.config";
import { store } from "@/store";
import { consumeCredits } from "@/store/slices/billingSlice";
import auth from "@react-native-firebase/auth";

export class NotEnoughCreditsError extends Error {
  constructor() {
    super("NOT_ENOUGH_CREDITS");
    this.name = "NotEnoughCreditsError";
  }
}

export async function consumeCreditsOnBackend(cost: number): Promise<void> {
  const user = auth().currentUser;
  if (!user) throw new Error("Not logged in");

  const ref = firestore().collection("userBilling").doc(user.uid);

  await firestore().runTransaction(async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists) throw new Error("No billing document");

    const data = snap.data();
    if (!data) throw new Error("No billing data");

    const total = (data.subscriptionCredits || 0) + (data.extraCredits || 0);

    if (total < cost) {
      throw new NotEnoughCreditsError();
    }

    let sub = data.subscriptionCredits || 0;
    let extra = data.extraCredits || 0;
    let remainingCost = cost;

    const subUse = Math.min(sub, remainingCost);
    sub -= subUse;
    remainingCost -= subUse;

    if (remainingCost > 0) {
      extra -= remainingCost;
    }

    transaction.update(ref, {
      subscriptionCredits: sub,
      extraCredits: extra,
    });
  });

  // Redux'ı optimistik güncelle (snapshot zaten gelecek ama hızlı UI için)
  store.dispatch(consumeCredits(cost));
}

