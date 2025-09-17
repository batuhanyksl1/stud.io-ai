import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Auth state'ini kontrol et (tek seferlik subscribe)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setIsAuthenticated(!!user);
      setIsEmailVerified(user?.emailVerified || false);
      setIsInitializing(false);
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Kullanıcı hazır olduğunda yönlendir
  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      if (isEmailVerified) {
        const currentUser = getAuth().currentUser;

        const hasDisplayName =
          currentUser?.displayName && currentUser.displayName.trim() !== "";

        if (hasDisplayName) {
          router.replace("/(tabs)");
        } else {
          router.replace("/auth/signin");
        }
      } else {
        router.replace("/email-verification");
      }
    }
  }, [isInitializing, isAuthenticated, isEmailVerified]);
  if (isInitializing) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "#ffffff", fontSize: 16 }}>Yükleniyor...</Text>
      </View>
    );
  }

  const handleLogin = () => {
    router.push("/auth/signin");
  };

  const handleSignUp = () => {
    router.push("/auth/signup");
  };

  const handleGuestContinue = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      {/* Arka plan görseli */}
      <Image
        source={require("@/assets/images/carousel/image-a-2.jpg")}
        style={styles.backgroundImage}
        blurRadius={3}
      />

      {/* Gradient overlay */}
      <LinearGradient
        colors={["rgba(88, 28, 135, 0.8)", "rgba(15, 23, 42, 0.9)"]}
        style={styles.gradientOverlay}
      />

      {/* Status bar alanı */}
      <View style={styles.statusBar} />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Stud.io</Text>
      </View>

      {/* Ana içerik */}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.mainTitle}>Yours.</Text>
          <Text style={styles.subTitle}>On the move.</Text>
          <Text style={styles.description}>
            Never miss out on what you love. All in the Stud.io app.
          </Text>
        </View>

        {/* Butonlar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.outlineButtonText}>Log in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filledButton}
            onPress={handleSignUp}
            activeOpacity={0.8}
          >
            <Text style={styles.filledButtonText}>Sign up</Text>
          </TouchableOpacity>
        </View>

        {/* Misafir girişi */}
        <TouchableOpacity
          style={styles.guestButton}
          onPress={handleGuestContinue}
          activeOpacity={0.7}
        >
          <Text style={styles.guestButtonText}>Continue as guest</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerLogo}>Stud.io</Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.footerText}>curated by</Text>
          <Text style={styles.footerBrand}>CrafTex AI Studio</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  backgroundImage: {
    position: "absolute",
    width: width,
    height: height,
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    width: width,
    height: height,
  },
  statusBar: {
    height: 44,
  },
  logoContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 60,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 32,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 16,
    color: "#e2e8f0",
    lineHeight: 24,
    maxWidth: "80%",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  outlineButton: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  filledButton: {
    flex: 1,
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  filledButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  guestButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
  },
  guestButtonText: {
    fontSize: 14,
    color: "#ffffff",
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerLogo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#94a3b8",
  },
  footerBrand: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});
