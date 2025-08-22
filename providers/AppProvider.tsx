import { initializeAuthStateDirect } from "@/hooks/useAuth";
import { store } from "@/store";
import { cleanupAuth } from "@/store/slices/authSlice";
import React, { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  useEffect(() => {
    // Firebase Auth'u initialize et ve auth state'ini dinle
    console.log("AppProvider.tsx: AppProvider mounted");
    console.log("AppProvider.tsx: Calling initializeAuthStateDirect...");

    initializeAuthStateDirect()
      .then(() => {
        console.log(
          "AppProvider.tsx: initializeAuthStateDirect completed successfully",
        );
      })
      .catch((error) => {
        console.error(
          "AppProvider.tsx: Error in initializeAuthStateDirect:",
          error,
        );
      });

    // Cleanup function - component unmount olduğunda auth listener'ı temizle
    return () => {
      console.log(
        "AppProvider.tsx: AppProvider unmounting, cleaning up auth...",
      );
      store.dispatch(cleanupAuth());
    };
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
