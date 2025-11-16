import { useAppSelector } from "@/store/hooks";
import { consumeCreditsOnBackend, NotEnoughCreditsError } from "@/services/billingConsume";

export function useCredits() {
  const billing = useAppSelector((state) => state.billing);

  const totalCredits =
    billing.credits.subscriptionCredits + billing.credits.extraCredits;

  // Debug log
  console.log("[useCredits] Billing state:", {
    plan: billing.plan,
    subscriptionCredits: billing.credits.subscriptionCredits,
    extraCredits: billing.credits.extraCredits,
    totalCredits,
  });

  const canGenerate = (cost: number = 1): boolean => {
    return totalCredits >= cost;
  };

  const consumeCredits = async (cost: number = 1): Promise<void> => {
    if (!canGenerate(cost)) {
      throw new NotEnoughCreditsError();
    }

    await consumeCreditsOnBackend(cost);
  };

  return {
    subscriptionCredits: billing.credits.subscriptionCredits,
    extraCredits: billing.credits.extraCredits,
    totalCredits,
    plan: billing.plan,
    canGenerate,
    consumeCredits,
  };
}

