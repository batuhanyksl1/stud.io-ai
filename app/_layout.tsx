import { RC_ANDROID_API_KEY, RC_ENTITLEMENT_ID } from "@/constants";
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
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       if (Constants.executionEnvironment === "storeClient") return;
  //       if (Platform.OS !== "ios" && Platform.OS !== "android") return;
  //       const hasRNPurchases = !!(NativeModules as any)?.RNPurchases;
  //       if (!hasRNPurchases) return;
  //       const module = await import("react-native-purchases");
  //       const Purchases = module.default;
  //       const apiKey =
  //         Platform.OS === "ios" ? RC_APPLE_API_KEY : RC_ANDROID_API_KEY;
  //       if (apiKey) {
  //         Purchases.configure({ apiKey });
  //       }
  //     } catch (_e) {
  //       // Expo Go veya native modül yoksa sessizce geç
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    if (Platform.OS === "ios") {
      Purchases.configure({ apiKey: "appl_OXTGqZMqjMTqmSsjIqVFKCtlGqw" });
    } else if (Platform.OS === "android") {
      Purchases.configure({ apiKey: RC_ANDROID_API_KEY });
    }

    getCustomerInfo();
    getProducts();
    getOfferings();
  }, []);

  async function getCustomerInfo() {
    const customerInfo = await Purchases.getCustomerInfo();
    // console.log("customerInfo", JSON.stringify(customerInfo, null, 2));
  }

  async function getProducts() {
    const products = await Purchases.getProducts([RC_ENTITLEMENT_ID]);
    //console.log(JSON.stringify(products, null, 2));
  }

  async function getOfferings() {
    const offerings = await Purchases.getOfferings();
    console.log("offerings", JSON.stringify(offerings, null, 2));
  }

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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="premium" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AppProvider>
  );
}
