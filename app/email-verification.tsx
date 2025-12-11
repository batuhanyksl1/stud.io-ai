import { useAuth } from "@/hooks";
import auth, { sendEmailVerification } from "@react-native-firebase/auth";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function EmailVerificationScreen() {
  const [isResending, setIsResending] = useState(false);
  const [user, setUser] = useState(auth().currentUser);
  const { updateUserName } = useAuth();
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((u) => {
      setUser(u || null);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        await auth().currentUser?.reload();
        const currentUser = auth().currentUser;
        if (currentUser?.emailVerified) {
          if (currentUser.displayName) {
            try {
              await updateUserName(currentUser.displayName as string);
            } catch (error) {
              console.error("Display name güncellenirken hata:", error);
            }
          }
          router.replace("/(tabs)");
        }
      } catch (e) {
        console.warn("Verification kontrolü sırasında hata:", e);
      }
    };

    const interval = setInterval(checkVerificationStatus, 3000);
    return () => clearInterval(interval);
  }, [updateUserName]);

  const handleResendVerification = async () => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    setIsResending(true);
    try {
      await sendEmailVerification(currentUser);
      Alert.alert(
        "E-posta Gönderildi",
        "Doğrulama e-postası tekrar gönderildi. Lütfen e-posta kutunuzu kontrol edin (spam klasörü dahil).",
      );
    } catch (error: any) {
      let message = error?.message || "E-posta gönderilirken bir hata oluştu";
      // Throttling durumunu daha anlaşılır göster
      if (error?.code === "auth/too-many-requests") {
        message =
          "Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.";
      }
      Alert.alert("Hata", message);
    } finally {
      setIsResending(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      router.replace("/auth");
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Arka plan görseli */}
      <Image
        source={require("@/assets/images/carousel/image-a-2.jpg")}
        style={styles.backgroundImage}
        blurRadius={3}
        contentFit="cover"
        cachePolicy="memory-disk"
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
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📧</Text>
          </View>

          <Text style={styles.mainTitle}>E-posta Doğrulama</Text>
          <Text style={styles.subTitle}>Gerekli</Text>

          <Text style={styles.description}>
            {user?.email} adresine gönderilen doğrulama e-postasını kontrol edin
            ve bağlantıya tıklayarak hesabınızı doğrulayın.
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              • E-postanızı kontrol edin (spam klasörü dahil)
            </Text>
            <Text style={styles.infoText}>
              • Doğrulama bağlantısına tıklayın
            </Text>
            <Text style={styles.infoText}>
              • Bu sayfa otomatik olarak güncellenecek
            </Text>
          </View>
        </View>

        {/* Butonlar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleResendVerification}
            disabled={isResending}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {isResending ? "Gönderiliyor..." : "E-postayı Tekrar Gönder"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>
              Farklı Hesap ile Giriş
            </Text>
          </TouchableOpacity>
        </View>
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
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 16,
    color: "#e2e8f0",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 32,
  },
  infoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  infoText: {
    fontSize: 14,
    color: "#cbd5e1",
    lineHeight: 20,
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  secondaryButton: {
    height: 56,
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
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
