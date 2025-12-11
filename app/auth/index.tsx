import { AppleLogo, DisplayNameModal, GoogleLogo } from "@/components";
import { useAuth } from "@/hooks";
import { LinearGradient } from "expo-linear-gradient";
import { router, useSegments } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const segments = useSegments();
  const {
    loginWithGoogle,
    loginWithApple,
    isLoading,
    updateUserName,
    isAuthenticated,
    user,
  } = useAuth();
  const [showLoading, setShowLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const prevIsLoadingRef = useRef(false);
  const prevIsAuthenticatedRef = useRef(false);

  const handleGoogleSignIn = async () => {
    try {
      // Google sign-in başladığında flag'i set et
      setIsSigningIn(true);

      // Google sign-in başladığında loading göstermiyoruz
      const result = await loginWithGoogle();

      // Google'dan dönünce result kontrolü yap
      if (result.meta.requestStatus !== "fulfilled") {
        Alert.alert("Hata", result.payload as string);
        setIsSigningIn(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Google ile giriş yapılamadı";
      Alert.alert("Hata", errorMessage);
      setIsSigningIn(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      // Apple sign-in başladığında flag'i set et
      setIsSigningIn(true);

      const result = await loginWithApple();

      // Apple'dan dönünce result kontrolü yap
      if (result.meta.requestStatus !== "fulfilled") {
        Alert.alert("Hata", result.payload as string);
        setIsSigningIn(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Apple ile giriş yapılamadı";
      Alert.alert("Hata", errorMessage);
      setIsSigningIn(false);
    }
  };

  // Loading durumunu kontrol et ve sayfa değişimini izle
  useEffect(() => {
    // Google/Apple'dan dönünce isLoading true olduğunda loading'i göster
    if (isLoading && !prevIsLoadingRef.current && isSigningIn) {
      // isLoading yeni true olduysa ve sign-in işlemi başladıysa loading göster
      setShowLoading(true);
    }

    // isLoading false olduğunda ve önceden true ise
    if (prevIsLoadingRef.current && !isLoading && showLoading) {
      // Eğer authentication başarılı olduysa ve display name varsa tabs'a git
      if (isAuthenticated && user) {
        const hasDisplayName =
          user.displayName && user.displayName.trim() !== "";
        if (hasDisplayName) {
          router.replace("/(tabs)");
        }
      }
    }

    prevIsLoadingRef.current = isLoading;
  }, [isLoading, isAuthenticated, user, showLoading, isSigningIn]);

  // Sayfa değiştiğinde loading'i kapat
  useEffect(() => {
    // Tabs sayfasına gidildiğinde loading'i kapat
    if (segments.length > 0 && segments[0] === "(tabs)") {
      setShowLoading(false);
      setIsSigningIn(false);
    }
  }, [segments]);

  // Authentication durumu değiştiğinde kontrol et
  useEffect(() => {
    if (isAuthenticated && user) {
      const hasDisplayName = user.displayName && user.displayName.trim() !== "";
      if (hasDisplayName && !prevIsAuthenticatedRef.current) {
        // İlk kez authenticate olduysa ve display name varsa tabs'a git
        router.replace("/(tabs)");
      }
    }

    prevIsAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated, user]);

  const handleDisplayNameConfirm = async (displayName: string) => {
    try {
      const result = await updateUserName(displayName);
      if (result.meta.requestStatus === "fulfilled") {
        setShowLoading(false);
        setIsSigningIn(false);
        router.replace("/(tabs)");
      } else {
        Alert.alert("Hata", result.payload as string);
        setShowLoading(false);
        setIsSigningIn(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "İsim güncellenemedi";
      Alert.alert("Hata", errorMessage);
      setShowLoading(false);
      setIsSigningIn(false);
    }
  };

  const handleDisplayNameCancel = () => {
    // Kullanıcı iptal ederse, auth sayfasında kalabilir veya signin sayfasına yönlendirilebilir
    // Şimdilik hiçbir şey yapmıyoruz, modal kapanacak
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
        colors={[
          "#162357", // Derin neon mavi          "#295be7", // Parlak canlı AI mavisi
          "rgb(85, 41, 231)", // Parlak canlı AI mavisi
          "rgb(41, 91, 231)", // Parlak canlı AI mavisi
          "#aa25f0", // Net mor
          "#ffe900", // Vurgulu sarı
        ]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0.05, y: 0.18 }}
        end={{ x: 0.97, y: 0.92 }}
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
          <Image
            source={require("@/assets/images/splash-icon.png")}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <Text style={styles.mainTitle}>{t("welcome.mainTitle")}</Text>
          <Text style={styles.subTitle}>{t("welcome.subTitle")}</Text>
          <Text style={styles.description}>{t("welcome.description")}</Text>
        </View>

        {/* Giriş butonları */}
        <View style={styles.buttonContainer}>
          {/* Google Sign-In button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={showLoading}
            activeOpacity={0.8}
          >
            <GoogleLogo size={24} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Google ile Devam Et</Text>
          </TouchableOpacity>

          {/* Apple Sign-In button (sadece iOS'ta) */}
          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={[styles.appleButton, { opacity: 0.5 }]}
              onPress={handleAppleSignIn}
              disabled={true}
              activeOpacity={0.8}
            >
              <AppleLogo size={28} color="#ffffff" style={styles.appleIcon} />
              <Text style={styles.appleButtonText}>Apple ile Devam Et</Text>
            </TouchableOpacity>
          )}

          {/* Divider */}
          {/* <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View> */}

          {/* Misafir girişi */}
          {/* <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestContinue}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text style={styles.guestButtonText}>
              {t("welcome.continueAsGuest")}
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerLogo}>Stud.io</Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.footerText}>{t("welcome.curatedBy")}</Text>
          <Text style={styles.footerBrand}>{t("welcome.craftexBrand")}</Text>
        </View>
      </View>

      {/* Loading Overlay */}
      <Modal
        transparent
        animationType="fade"
        visible={showLoading}
        statusBarTranslucent
      >
        <View style={styles.loadingOverlay}>
          <LinearGradient
            colors={[
              "rgba(15, 23, 42, 0.95)",
              "rgba(22, 35, 87, 0.95)",
              "rgba(15, 23, 42, 0.95)",
            ]}
            style={styles.loadingGradient}
          >
            <View style={styles.loadingContent}>
              <View style={styles.loadingIconContainer}>
                <Image
                  source={require("@/assets/images/splash-icon.png")}
                  style={styles.loadingIcon}
                  resizeMode="contain"
                />
                <View style={styles.loadingSpinnerContainer}>
                  <ActivityIndicator size="large" color="#ffffff" />
                </View>
              </View>
              <Text style={styles.loadingText}>Giriş yapılıyor...</Text>
              <Text style={styles.loadingSubtext}>Lütfen bekleyin</Text>
            </View>
          </LinearGradient>
        </View>
      </Modal>

      {/* Display Name Modal */}
      <DisplayNameModal
        visible={
          isAuthenticated &&
          user !== null &&
          (!user.displayName || user.displayName.trim() === "")
        }
        onConfirm={handleDisplayNameConfirm}
        onCancel={handleDisplayNameCancel}
        isLoading={isLoading}
      />
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
    alignItems: "center",
  },
  logoIcon: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 32,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#e2e8f0",
    lineHeight: 24,
    maxWidth: "80%",
    textAlign: "center",
    alignSelf: "center",
  },
  buttonContainer: {
    paddingTop: 10,
    gap: 16,
    marginBottom: 100,
  },
  googleButton: {
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  appleButton: {
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  googleIcon: {
    marginRight: 0,
  },
  appleIcon: {
    marginRight: 0,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  dividerText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
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
  loadingOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingGradient: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIconContainer: {
    position: "relative",
    marginBottom: 32,
  },
  loadingIcon: {
    width: 120,
    height: 120,
    opacity: 0.9,
  },
  loadingSpinnerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  loadingSubtext: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 0.3,
  },
});
