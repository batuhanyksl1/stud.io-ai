import "@/localization/i18n";
import { AppProvider } from "@/providers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import SplashScreenComponent from "./splash";

const ONBOARDING_KEY = "hasSeenOnboarding";

SplashScreen.preventAutoHideAsync();

function IndexPageContent() {
  // const { colorScheme } = useTheme();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null,
  );

  // Onboarding kontrolü
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasSeenOnboarding(value === "true");
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setHasSeenOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  // Auth state'ini kontrol et
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      console.log("=== AUTH STATE CHANGED ===");
      console.log("User:", user);
      console.log("Email verified:", user?.emailVerified);
      console.log("Display name:", user?.displayName);

      setIsAuthenticated(!!user);
      setIsEmailVerified(user?.emailVerified || false);
      setIsInitializing(false);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Auth durumuna göre yönlendirme
  useEffect(() => {
    // Onboarding kontrolü henüz yapılmadıysa bekle
    if (hasSeenOnboarding === null) return;

    if (!isInitializing) {
      console.log("=== ROUTING DECISION ===");
      console.log("hasSeenOnboarding:", hasSeenOnboarding);
      console.log("isAuthenticated:", isAuthenticated);
      console.log("isEmailVerified:", isEmailVerified);

      // Onboarding görülmemişse oraya yönlendir
      if (!hasSeenOnboarding) {
        console.log("User has not seen onboarding - navigating to onboarding");
        router.replace("/onboarding");
        setIsReady(true);
        return;
      }

      if (isAuthenticated) {
        if (isEmailVerified) {
          // Email doğrulanmış, display name kontrolü yap
          const currentUser = getAuth().currentUser;
          const hasDisplayName =
            currentUser?.displayName && currentUser.displayName.trim() !== "";

          console.log("Has display name:", hasDisplayName);

          if (hasDisplayName) {
            console.log("✅ User has display name - navigating to main app");
            router.replace("/(tabs)");
          } else {
            console.log("🚨 User needs display name - going to signin");
            router.replace("/auth/signin");
          }
        } else {
          console.log("Email not verified - going to verification");
          router.replace("/email-verification");
        }
      } else {
        // Kullanıcı authenticated değilse ana uygulamaya yönlendir (guest mode)
        console.log(
          "User not authenticated - navigating to main app in guest mode",
        );
        router.replace("/(tabs)");
      }

      // Yönlendirme yapıldıktan sonra ready state'i true yap
      setIsReady(true);
    }
  }, [isInitializing, isAuthenticated, isEmailVerified, hasSeenOnboarding]);

  // Auth state hala initialize ediliyorsa veya ready değilse splash screen göster
  if (isInitializing || !isReady || hasSeenOnboarding === null) {
    return <SplashScreenComponent />;
  }

  // Bu noktaya asla gelmemeli çünkü yukarıda yönlendirme yapılıyor
  return <SplashScreenComponent />;
}

export default function IndexPage() {
  return (
    <AppProvider>
      <IndexPageContent />
    </AppProvider>
  );
}
