import authReducer from "@/store/slices/authSlice";
import billingReducer from "@/store/slices/billingSlice";
import contentCreationReducer from "@/store/slices/contentCreationSlice";
import themeReducer from "@/store/slices/themeSlice";
import userReducer from "@/store/slices/userSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    billing: billingReducer,
    theme: themeReducer,
    user: userReducer,
    contentCreation: contentCreationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["auth.user"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
