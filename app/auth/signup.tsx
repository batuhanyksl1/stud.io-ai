import { AppleLogo, DisplayNameModal, GoogleLogo } from "@/components";
import { useAuth, useTheme } from "@/hooks";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function SignUpScreen() {
  const { colors } = useTheme();
  const { returnUrl } = useLocalSearchParams();
  const {
    loginAsGuest,
    loginWithGoogle,
    loginWithApple,
    isLoading,
    needsDisplayName,
    updateUserName,
    isAuthenticated,
    user,
  } = useAuth();

  const handleGuestLogin = async () => {
    try {
      const result = await loginAsGuest();
      if (result.meta.requestStatus === "fulfilled") {
        // Misafir girişi başarılı, display name modal'ı gösterilecek
      } else {
        Alert.alert("Hata", result.payload as string);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Misafir girişi yapılamadı";
      Alert.alert("Hata", errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await loginWithGoogle();
      if (result.meta.requestStatus !== "fulfilled") {
        Alert.alert("Hata", result.payload as string);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Google ile giriş yapılamadı";
      Alert.alert("Hata", errorMessage);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const result = await loginWithApple();
      if (result.meta.requestStatus !== "fulfilled") {
        Alert.alert("Hata", result.payload as string);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Apple ile giriş yapılamadı";
      Alert.alert("Hata", errorMessage);
    }
  };

  // Display name modal'ı göster (kullanıcı bu sayfaya geldiyse display name yok demektir)
  useEffect(() => {
    console.log("=== SIGNUP SCREEN DEBUG ===");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("user:", user);
    console.log("needsDisplayName:", needsDisplayName);

    if (isAuthenticated && user) {
      console.log("Current user display name:", user.displayName);
      const hasDisplayName = user.displayName && user.displayName.trim() !== "";
      console.log("Has display name:", hasDisplayName);

      if (hasDisplayName) {
        // Display name varsa ana uygulamaya git
        console.log("✅ User has display name - navigating to main app");
        if (returnUrl) {
          router.replace(decodeURIComponent(returnUrl as string) as any);
        } else {
          router.replace("/(tabs)");
        }
      } else {
        // Display name yoksa modal göster
        console.log("🚨 User needs display name - modal should be visible");
      }
    }
  }, [isAuthenticated, user, returnUrl]);

  const handleDisplayNameConfirm = async (displayName: string) => {
    try {
      const result = await updateUserName(displayName);
      if (result.meta.requestStatus === "fulfilled") {
        if (returnUrl) {
          router.replace(decodeURIComponent(returnUrl as string) as any);
        } else {
          router.replace("/(tabs)");
        }
      } else {
        Alert.alert("Hata", result.payload as string);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "İsim güncellenemedi";
      Alert.alert("Hata", errorMessage);
    }
  };

  const handleDisplayNameCancel = () => {
    // Logout user if they cancel display name entry
    // This ensures they can't access the app without a display name
    router.replace("/auth/signup");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Arka plan görseli */}
      <Image
        source={require("@/assets/images/carousel/image-a-2.jpg")}
        style={styles.backgroundImage}
        blurRadius={2}
        contentFit="cover"
        cachePolicy="memory-disk"
      />

      {/* Gradient overlay */}
      <LinearGradient
        colors={["rgba(88, 28, 135, 0.7)", "rgba(15, 23, 42, 0.8)"]}
        style={styles.gradientOverlay}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ width: 40 }} /> {/* Spacer */}
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>Stud.io</Text>
            </View>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Hesap Oluştur</Text>
              <Text style={styles.formSubtitle}>
                Hesabınızı oluşturun veya misafir olarak devam edin
              </Text>
            </View>

            <View style={styles.form}>
              {/* Google Sign-In button */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                disabled={isLoading}
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
                  <AppleLogo
                    size={28}
                    color="#ffffff"
                    style={styles.appleIcon}
                  />
                  <Text style={styles.appleButtonText}>Apple ile Devam Et</Text>
                </TouchableOpacity>
              )}

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>veya</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Guest login button */}
              <TouchableOpacity
                style={styles.guestButton}
                onPress={handleGuestLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.guestButtonText}>
                  {isLoading ? "Loading..." : "Misafir Olarak Devam Et"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Display Name Modal */}
      {(() => {
        const shouldShowModal =
          isAuthenticated &&
          user !== null &&
          (!user.displayName || user.displayName.trim() === "");

        console.log("Modal visibility check:");
        console.log("- isAuthenticated:", isAuthenticated);
        console.log("- user !== null:", user !== null);
        console.log("- user.displayName:", user?.displayName);
        console.log("- shouldShowModal:", shouldShowModal);

        return (
          <DisplayNameModal
            visible={shouldShowModal}
            onConfirm={handleDisplayNameConfirm}
            onCancel={handleDisplayNameCancel}
            isLoading={isLoading}
          />
        );
      })()}
    </KeyboardAvoidingView>
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
  },
  gradientOverlay: {
    position: "absolute",
    width: width,
    height: height,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  formHeader: {
    marginBottom: 40,
  },
  formTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 24,
  },
  form: {
    gap: 16,
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
  guestButton: {
    height: 56,
    backgroundColor: "transparent",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
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
});
