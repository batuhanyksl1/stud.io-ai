import { DisplayNameModal } from "@/components";
import { useAuth } from "@/hooks";
import { SignInCredentials } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

const { width, height } = Dimensions.get("window");

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Geçerli bir e-posta adresi girin")
    .required("E-posta adresi gereklidir"),
  password: yup
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre gereklidir"),
});

export default function SignInScreen() {
  const { t } = useTranslation();

  const {
    login,
    isLoading,
    needsDisplayName,
    updateUserName,
    isAuthenticated,
    user,
  } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInCredentials>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleSignIn = async (data: SignInCredentials) => {
    try {
      const result = await login(data);
      if (result.meta.requestStatus === "fulfilled") {
        // needsDisplayName state'i güncellendikten sonra useEffect ile kontrol edilecek
        // Burada hiçbir şey yapmıyoruz
      } else {
        Alert.alert("Hata", result.payload as string);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Giriş yapılamadı";
      Alert.alert("Hata", errorMessage);
    }
  };

  // Display name modal'ı göster (kullanıcı bu sayfaya geldiyse display name yok demektir)
  useEffect(() => {
    console.log("=== SIGNIN SCREEN DEBUG ===");
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
        router.replace("/(tabs)");
      } else {
        // Display name yoksa modal göster
        console.log("🚨 User needs display name - modal should be visible");
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
    // Logout user if they cancel display name entry
    // This ensures they can't access the app without a display name
    router.replace("/auth/signin");
  };

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
  };

  const handleGoToSignUp = () => {
    router.push("/auth/signup");
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
                {t("auth.signInToYourAccount")}
              </Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{t("auth.email")}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={t("auth.enterYourEmail")}
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {errors.email && (
                      <Text style={styles.errorText}>
                        {errors.email.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{t("auth.password")}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={t("auth.enterYourPassword")}
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      autoCorrect={false}
                    />
                    {errors.password && (
                      <Text style={styles.errorText}>
                        {errors.password.message}
                      </Text>
                    )}
                  </View>
                )}
              />
              {/* Forgot password */}
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={handleForgotPassword}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>
                  {t("auth.forgotPassword")}
                </Text>
              </TouchableOpacity>
              {/* Sign in button */}
              <TouchableOpacity
                style={[
                  styles.signInButton,
                  !isValid && styles.signInButtonDisabled,
                ]}
                onPress={handleSubmit(handleSignIn)}
                disabled={!isValid || isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.signInButtonText}>
                  {isLoading ? t("common.loading") : t("auth.signIn")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign up link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>{t("auth.dontHaveAccount")}</Text>
              <TouchableOpacity onPress={handleGoToSignUp} activeOpacity={0.7}>
                <Text style={styles.signUpLink}>{t("auth.signUp")}</Text>
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
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  input: {
    height: 56,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#ffffff",
    textDecorationLine: "underline",
  },
  signInButton: {
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signInButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 32,
  },
  signUpText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    textDecorationLine: "underline",
  },
});
