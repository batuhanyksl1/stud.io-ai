import {
  Header,
  HomeCarousel,
  HomeServices,
  HomeStats,
  ThemedText,
  ThemedView,
} from "@/components";
import { useDeviceDimensions, useTheme } from "@/hooks";
import { useAppSelector } from "@/store/hooks";
import Ionicons from "@expo/vector-icons/Ionicons";
import auth from "@react-native-firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { isTablet, isSmallDevice } = useDeviceDimensions();
  const user = useAppSelector((state) => state.auth.user);

  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Giriş animasyonu
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Kullanıcı adını al
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Günaydın";
    if (hour < 18) return "İyi günler";
    return "İyi akşamlar";
  };

  const firebaseUser = auth().currentUser;
  const resolvedDisplayName =
    firebaseUser?.displayName?.trim() || user?.displayName?.trim() || "";
  const userName =
    resolvedDisplayName || firebaseUser?.email || user?.email || "Kullanıcı";

  return (
    <ThemedView backgroundColor="background" style={styles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Arka plan gradyanı */}
      <View style={styles.backgroundGradientContainer}>
        <LinearGradient
          colors={
            isDark
              ? [
                  "rgba(59, 130, 246, 0.08)",
                  "rgba(139, 92, 246, 0.05)",
                  "transparent",
                ]
              : [
                  "rgba(59, 130, 246, 0.06)",
                  "rgba(139, 92, 246, 0.04)",
                  "transparent",
                ]
          }
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.6 }}
        />
        {/* Dekoratif daireler */}
        <View
          style={[
            styles.decorCircle,
            styles.decorCircle1,
            {
              backgroundColor: isDark
                ? "rgba(59, 130, 246, 0.06)"
                : "rgba(59, 130, 246, 0.04)",
            },
          ]}
        />
        <View
          style={[
            styles.decorCircle,
            styles.decorCircle2,
            {
              backgroundColor: isDark
                ? "rgba(139, 92, 246, 0.05)"
                : "rgba(139, 92, 246, 0.03)",
            },
          ]}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        {/* Header */}
        <Header leftIconType="information" rightIconType="settings" />

        {/* Hoşgeldin Bölümü */}
        <Animated.View
          style={[
            styles.welcomeSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              paddingHorizontal: isTablet ? 24 : isSmallDevice ? 12 : 16,
            },
          ]}
        >
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeTextContainer}>
              <ThemedText
                variant="caption"
                color="secondary"
                style={styles.greetingText}
              >
                {getGreeting()} 👋
              </ThemedText>
              <ThemedText variant="h3" weight="bold" style={styles.userName}>
                {userName}
              </ThemedText>
            </View>

            {/* Hızlı İşlem Butonu */}
            {/* <TouchableOpacity activeOpacity={0.8}>
              <LinearGradient
                colors={["#3B82F6", "#8B5CF6"]}
                style={styles.quickActionButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="add" size={22} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity> */}
          </View>

          {/* Motivasyon kartı */}
          {/* <Animated.View
            style={[
              styles.motivationCard,
              {
                backgroundColor: isDark
                  ? "rgba(59, 130, 246, 0.12)"
                  : "rgba(59, 130, 246, 0.08)",
                borderColor: isDark
                  ? "rgba(59, 130, 246, 0.2)"
                  : "rgba(59, 130, 246, 0.15)",
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.motivationIconWrapper}>
              <Ionicons name="sparkles" size={18} color="#3B82F6" />
            </View>
            <View style={styles.motivationTextContainer}>
              <ThemedText
                variant="caption"
                weight="semiBold"
                style={{ color: "#3B82F6" }}
              >
                AI ile fotoğraflarınızı dönüştürün
              </ThemedText>
              <ThemedText
                variant="caption"
                color="secondary"
                style={styles.motivationSubtext}
              >
                Profesyonel sonuçlar için bir servis seçin
              </ThemedText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textTertiary}
            />
          </Animated.View> */}
        </Animated.View>

        {/* Ana içerik */}
        <Animated.View
          style={[
            styles.mainContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              paddingHorizontal: isTablet ? 16 : isSmallDevice ? 8 : 12,
            },
          ]}
        >
          {/* Carousel */}
          <HomeCarousel />

          {/* Servisler */}
          <HomeServices />

          {/* İstatistikler */}
          <HomeStats />

          {/* Alt boşluk */}
          <View style={{ height: 24 }} />
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradientContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 400,
    overflow: "hidden",
  },
  backgroundGradient: {
    flex: 1,
  },
  decorCircle: {
    position: "absolute",
    borderRadius: 999,
  },
  decorCircle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  decorCircle2: {
    width: 200,
    height: 200,
    top: 150,
    left: -80,
  },
  scrollContent: {
    paddingBottom: Platform.OS === "ios" ? 20 : 30,
  },
  welcomeSection: {
    marginBottom: 8,
  },
  welcomeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  userName: {
    marginTop: 0,
    fontSize: 26,
    letterSpacing: -0.5,
  },
  quickActionButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  motivationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  motivationIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  motivationTextContainer: {
    flex: 1,
  },
  motivationSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  mainContent: {
    flex: 1,
  },
});
