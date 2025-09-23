import { DisplayNameModal } from "@/components";
import { useAuth, useTheme } from "@/hooks";
import { SignUpCredentials } from "@/types";

import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
  displayName: yup.string().required("Ad gereklidir"),
  email: yup
    .string()
    .email("Geçerli bir e-posta adresi girin")
    .required("E-posta adresi gereklidir"),
  password: yup
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre gereklidir"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı gereklidir"),
});

export default function SignUpScreen() {
  const { colors } = useTheme();
  const {
    register,
    loginAsGuest,
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
  } = useForm<SignUpCredentials & { confirmPassword: string }>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleSignUp = async (
    data: SignUpCredentials & { confirmPassword: string },
  ) => {
    try {
      const { confirmPassword, ...signUpData } = data;
      const result = await register(signUpData);
      if (result.meta.requestStatus === "fulfilled") {
        // Kayıt başarılı, display name modal'ı gösterilecek
      } else {
        Alert.alert("Hata", result.payload as string);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Kayıt oluşturulamadı";
      Alert.alert("Hata", errorMessage);
    }
  };

  const handleGoToSignIn = () => {
    router.push("/auth/signin");
  };

  const handleGoBack = () => {
    router.back();
  };

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
    router.replace("/auth/signup");
  };

  return (
    <View style={styles.container}>
      {/* Arka plan görseli */}
      <Image
        source={require("@/assets/images/carousel/image-a-2.jpg")}
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Text style={styles.logo}>Stud.io</Text>
            </View>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Create account</Text>
              <Text style={styles.formSubtitle}>
                Join us and start creating
              </Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="displayName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                    {errors.displayName && (
                      <Text style={styles.errorText}>
                        {errors.displayName.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
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
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Create a password"
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

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm your password"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      autoCorrect={false}
                    />
                    {errors.confirmPassword && (
                      <Text style={styles.errorText}>
                        {errors.confirmPassword.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <TouchableOpacity
                style={[
                  styles.signUpButton,
                  !isValid && styles.signUpButtonDisabled,
                ]}
                onPress={handleSubmit(handleSignUp)}
                disabled={!isValid || isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.signUpButtonText}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Text>
              </TouchableOpacity>
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

            {/* Sign in link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account?</Text>
              <TouchableOpacity onPress={handleGoToSignIn} activeOpacity={0.7}>
                <Text style={styles.signInLink}>Sign in</Text>
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
  signUpButton: {
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signUpButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 32,
  },
  signInText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  signInLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    textDecorationLine: "underline",
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
});
