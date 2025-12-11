import { AppleLogo, DisplayNameModal, GoogleLogo } from "@/components";
import { useAuth } from "@/hooks";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
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

export default function SignInScreen() {
  const { t } = useTranslation();

  const {
    loginWithGoogle,
    loginWithApple,
    isLoading,
    updateUserName,
    isAuthenticated,
    user,
  } = useAuth();

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

  useEffect(() => {
    if (isAuthenticated && user) {
      const hasDisplayName = user.displayName && user.displayName.trim() !== "";
      if (hasDisplayName) {
        router.replace("/(tabs)");
      }
    }
  }, [isAuthenticated, user]);

  const handleDisplayNameConfirm = async (displayName: string) => {
    try {
      const result = await updateUserName(displayName);
      if (result.meta.requestStatus === "fulfilled") {
        router.replace("/(tabs)");
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
    router.replace("/auth/signin");
  };

  return (
    <View style={styles.container}>
      {/* Arka plan görseli */}
      <Image
        source={require("@/assets/images/carousel/image-a-1.png")}
        style={styles.backgroundImage}
        blurRadius={2}
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
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>Stud.io</Text>
            </View>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>{t("auth.welcomeBack")}</Text>
              <Text style={styles.formSubtitle}>
                Hesabınıza giriş yaparak devam edin
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
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
});
