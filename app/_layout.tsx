import { useFrameworkReady, useTheme } from "@/hooks";
import "@/localization/i18n";
import { AppProvider } from "@/providers";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import {
  Oswald_400Regular,
  Oswald_500Medium,
  Oswald_700Bold,
} from "@expo-google-fonts/oswald";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { colorScheme } = useTheme();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

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
    if (!isInitializing) {
      console.log("=== ROUTING DECISION ===");
      console.log("isAuthenticated:", isAuthenticated);
      console.log("isEmailVerified:", isEmailVerified);

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
        console.log("User not authenticated - going to signin");
        router.replace("/auth");
      }
    }
  }, [isInitializing, isAuthenticated, isEmailVerified]);

  // Auth state hala initialize ediliyorsa loading göster
  if (isInitializing) {
    return null; // Splash screen zaten gösteriliyor
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="premium" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,

    // Poppins
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,

    // Montserrat
    "Montserrat-Regular": Montserrat_400Regular,
    "Montserrat-Medium": Montserrat_500Medium,
    "Montserrat-SemiBold": Montserrat_600SemiBold,
    "Montserrat-Bold": Montserrat_700Bold,

    // Bebas Neue
    "BebasNeue-Regular": BebasNeue_400Regular,

    // Oswald
    "Oswald-Regular": Oswald_400Regular,
    "Oswald-Medium": Oswald_500Medium,
    "Oswald-Bold": Oswald_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
