import { useAuth, useTheme } from "@/hooks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
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

interface ForgotPasswordData {
  email: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Geçerli bir e-posta adresi girin")
    .required("E-posta adresi gereklidir"),
});

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const { resetPassword, isLoading } = useAuth();
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<ForgotPasswordData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleResetPassword = async (data: ForgotPasswordData) => {
    try {
      const result = await resetPassword(data.email);
      if (result.meta.requestStatus === "fulfilled") {
        setEmailSent(true);
        Alert.alert(
          "E-posta Gönderildi",
          "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.",
          [{ text: "Tamam" }],
        );
      } else {
        Alert.alert("Hata", result.payload as string);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "E-posta gönderilemedi";
      Alert.alert("Hata", errorMessage);
    }
  };

  const handleGoToSignIn = () => {
    router.push("/auth/signin");
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
            <View style={{ width: 40 }} /> {/* Spacer */}

            <View style={styles.logoContainer}>
              <Text style={styles.logo}>Stud.io</Text>
            </View>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Şifremi Unuttum</Text>
              <Text style={styles.formSubtitle}>
                {emailSent
                  ? "E-postanızı kontrol edin"
                  : "E-posta adresinizi girin, size sıfırlama bağlantısı gönderelim"}
              </Text>
            </View>

            {emailSent ? (
              <View style={styles.successContainer}>
                <View style={styles.successIcon}>
                  <Ionicons name="mail" size={40} color="#10b981" />
                </View>

                <Text style={styles.successTitle}>E-posta Gönderildi!</Text>

                <Text style={styles.successDescription}>
                  {getValues("email")} adresine şifre sıfırlama bağlantısı
                  gönderildi. Lütfen e-postanızı kontrol edin ve bağlantıya
                  tıklayarak şifrenizi sıfırlayın.
                </Text>

                <TouchableOpacity
                  style={styles.successButton}
                  onPress={handleGoToSignIn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.successButtonText}>
                    Giriş Sayfasına Dön
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>E-posta</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="E-posta adresinizi girin"
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

                <TouchableOpacity
                  style={[
                    styles.resetButton,
                    !isValid && styles.resetButtonDisabled,
                  ]}
                  onPress={handleSubmit(handleResetPassword)}
                  disabled={!isValid || isLoading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.resetButtonText}>
                    {isLoading
                      ? "Gönderiliyor..."
                      : "Sıfırlama Bağlantısı Gönder"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Back to sign in link */}
            {!emailSent && (
              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>
                  Şifrenizi hatırladınız mı?
                </Text>
                <TouchableOpacity
                  onPress={handleGoToSignIn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.signInLink}>Giriş Yap</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  resetButton: {
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  resetButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  successContainer: {
    alignItems: "center",
    gap: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  successDescription: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  successButton: {
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 16,
  },
  successButtonText: {
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
});
