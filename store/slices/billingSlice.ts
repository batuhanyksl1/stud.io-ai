import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SubscriptionPlan = "free" | "starter" | "pro" | "pro_yearly";

export interface CreditsInfo {
  subscriptionCredits: number; // reset / rollover
  extraCredits: number; // top-up, non-expiring
  lastRefillAt: string | null; // ISO date
  nextRefillAt: string | null; // ISO date
  maxSubscriptionCredits: number; // rollover limit
}

export interface UserBillingState {
  plan: SubscriptionPlan;
  credits: CreditsInfo;
  loading: boolean;
  error: string | null;
}

const initialState: UserBillingState = {
  plan: "free",
  credits: {
    subscriptionCredits: 0,
    extraCredits: 0,
    lastRefillAt: null,
    nextRefillAt: null,
    maxSubscriptionCredits: 0,
  },
  loading: false,
  error: null,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    setBillingState: (
      state,
      action: PayloadAction<Partial<UserBillingState>>,
    ) => {
      if (action.payload.credits) {
        // Credits objesini merge et
        state.credits = { ...state.credits, ...action.payload.credits };
      }
      if (action.payload.plan !== undefined) {
        state.plan = action.payload.plan;
      }
      if (action.payload.loading !== undefined) {
        state.loading = action.payload.loading;
      }
      if (action.payload.error !== undefined) {
        state.error = action.payload.error;
      }
    },
    consumeCredits: (state, action: PayloadAction<number>) => {
      const cost = action.payload; // bu işlem kaç kredi istiyor
      let remainingCost = cost;

      const subUse = Math.min(state.credits.subscriptionCredits, remainingCost);
      state.credits.subscriptionCredits -= subUse;
      remainingCost -= subUse;

      if (remainingCost > 0) {
        state.credits.extraCredits -= remainingCost;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearBilling: (state) => {
      return initialState;
    },
  },
});

export const {
  setBillingState,
  consumeCredits,
  setLoading,
  setError,
  clearBilling,
} = billingSlice.actions;

export default billingSlice.reducer;
