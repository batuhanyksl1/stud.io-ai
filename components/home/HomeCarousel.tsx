import ThemedText from "@/components/ThemedText";
import { editingServices } from "@/components/data";
import { useContentCreation, useDeviceDimensions, useTheme } from "@/hooks";
import Ionicon from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import ThemedView from "../ThemedView";

interface HomeCarouselProps {
  onPageChange?: (_page: number) => void;
}

export const HomeCarousel: React.FC<HomeCarouselProps> = ({ onPageChange }) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const { clearAllImages, resetUIState } = useContentCreation();
  const { isTablet, isSmallDevice } = useDeviceDimensions();
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const autoScrollInterval = useRef<number | null>(null);

  // Animasyonlar
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Otomatik kaydırma
  useEffect(() => {
    autoScrollInterval.current = setInterval(() => {
      const nextPage = (currentPage + 1) % editingServices.length;
      setCurrentPage(nextPage);
      pagerRef.current?.setPage(nextPage);
    }, 5000);

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [currentPage]);

  const onPageSelected = (e: any) => {
    const newPage = e.nativeEvent.position;
    setCurrentPage(newPage);
    onPageChange?.(newPage);

    // Sayfa değiştiğinde animasyon
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleServicePress = (
    servicePrompt: string,
    aiRequestUrl: string,
    aiStatusUrl: string,
    aiResultUrl: string,
    hasMultipleInputImage: boolean,
    hasPreSelectedImage: boolean,
    gradient: string[],
    title: string,
    token: number,
  ) => {
    clearAllImages();
    resetUIState();

    router.push({
      pathname: "/(tabs)/creationPage",
      params: {
        servicePrompt: servicePrompt,
        aiRequestUrl: aiRequestUrl,
        aiStatusUrl: aiStatusUrl,
        aiResultUrl: aiResultUrl,
        hasMultipleInputImage: hasMultipleInputImage ? "true" : "false",
        hasPreSelectedImage: hasPreSelectedImage ? "true" : "false",
        gradient: JSON.stringify(gradient),
        title: title,
        token: token,
      },
    });
  };

  // Responsive boyutlar
  const carouselHeight = isTablet ? 380 : isSmallDevice ? 310 : 340;
  const cardHeight = isTablet ? 350 : isSmallDevice ? 280 : 310;
  const imageWidth = isTablet ? 208 : isSmallDevice ? 165 : 185;
  const imageHeight = isTablet ? 328 : isSmallDevice ? 268 : 295;
  const titleFontSize = isTablet ? 30 : isSmallDevice ? 22 : 26;
  const subtitleFontSize = isTablet ? 16 : isSmallDevice ? 13 : 15;
  const buttonFontSize = isTablet ? 15 : isSmallDevice ? 12 : 14;

  const renderCarouselItem = (item: (typeof editingServices)[0]) => (
    <View style={styles.carouselPage}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={item.gradient as any}
          style={[styles.carouselCard, { height: cardHeight }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Dekoratif arka plan elementleri */}
          <View style={styles.decorativeElements}>
            <View style={[styles.decorCircle, styles.decorCircle1]} />
            <View style={[styles.decorCircle, styles.decorCircle2]} />
            <View style={[styles.decorCircle, styles.decorCircle3]} />
          </View>

          {/* Görseller */}
          <View style={styles.carouselImagesContainer}>
            <View style={[styles.imageWrapper, styles.imageLeft]}>
              <Image
                source={
                  typeof item.image1 === "string"
                    ? { uri: item.image1 }
                    : (item.image1 as any)
                }
                style={[
                  styles.carouselImage,
                  {
                    width: imageWidth,
                    height: imageHeight,
                  },
                ]}
              />
              {/* Görsel gölgesi */}
            </View>

            <View style={[styles.imageWrapper, styles.imageRight]}>
              <Image
                source={
                  typeof item.image2 === "string"
                    ? { uri: item.image2 }
                    : (item.image2 as any)
                }
                style={[
                  styles.carouselImage,
                  {
                    width: imageWidth,
                    height: imageHeight,
                  },
                ]}
              />
            </View>
          </View>

          {/* İçerik */}
          <View style={styles.carouselContent}>
            {/* Badge */}
            {item.isPopular && (
              <View style={styles.popularBadge}>
                <Ionicon name="star" size={10} color="#FFD700" />
                <ThemedText
                  variant="caption"
                  weight="semiBold"
                  style={styles.badgeText}
                >
                  {item.badge}
                </ThemedText>
              </View>
            )}

            <ThemedText
              variant="h3"
              weight="bold"
              style={[styles.carouselTitle, { fontSize: titleFontSize }]}
            >
              {item.title}
            </ThemedText>

            <ThemedText
              variant="body"
              style={[styles.carouselSubtitle, { fontSize: subtitleFontSize }]}
            >
              {item.subtitle}
            </ThemedText>

            {/* Glassmorphism buton */}
            <TouchableOpacity
              style={styles.carouselButtonWrapper}
              onPress={() =>
                handleServicePress(
                  item.prompt,
                  item.aiRequestUrl as string,
                  item.aiStatusUrl as string,
                  item.aiResultUrl as string,
                  item.hasMultipleInputImage as boolean,
                  item.hasPreSelectedImage as boolean,
                  item.gradient as string[],
                  item.title,
                  item.token as number,
                )
              }
              activeOpacity={0.8}
            >
              {Platform.OS === "ios" ? (
                <BlurView intensity={30} style={styles.carouselButton}>
                  <ThemedText
                    variant="body"
                    weight="bold"
                    style={[
                      styles.carouselButtonText,
                      { fontSize: buttonFontSize },
                    ]}
                  >
                    Hemen Dene
                  </ThemedText>
                  <View style={styles.buttonIconWrapper}>
                    <Ionicon name="arrow-forward" size={16} color="white" />
                  </View>
                </BlurView>
              ) : (
                <View style={[styles.carouselButton, styles.androidButton]}>
                  <ThemedText
                    variant="body"
                    weight="bold"
                    style={[
                      styles.carouselButtonText,
                      { fontSize: buttonFontSize },
                    ]}
                  >
                    Hemen Dene
                  </ThemedText>
                  <View style={styles.buttonIconWrapper}>
                    <Ionicon name="arrow-forward" size={16} color="white" />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );

  return (
    <ThemedView
      backgroundColor="transparent"
      style={[
        styles.carouselSection,
        {
          paddingHorizontal: isTablet ? 8 : isSmallDevice ? 4 : 6,
          overflow: "visible",
        },
      ]}
    >
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <View
            style={[
              styles.sectionIcon,
              {
                backgroundColor: isDark
                  ? "rgba(139, 92, 246, 0.2)"
                  : "rgba(139, 92, 246, 0.12)",
              },
            ]}
          >
            <Ionicon name="flame" size={16} color="#8B5CF6" />
          </View>
          <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>
            Öne Çıkanlar
          </ThemedText>
        </View>
        <View style={styles.pageIndicatorContainer}>
          <ThemedText variant="caption" color="secondary">
            {currentPage + 1}/{editingServices.length}
          </ThemedText>
        </View>
      </View>

      <View
        style={[
          styles.carouselContainer,
          { height: carouselHeight, overflow: "visible" },
        ]}
      >
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={onPageSelected}
        >
          {editingServices.map((item) => (
            <View key={item.id} style={styles.pageContainer}>
              {renderCarouselItem(item)}
            </View>
          ))}
        </PagerView>

        {/* Modern sayfa göstergeleri */}
        <View style={styles.pagination}>
          {editingServices.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCurrentPage(index);
                pagerRef.current?.setPage(index);
              }}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor:
                      index === currentPage
                        ? "#8B5CF6"
                        : isDark
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(0,0,0,0.15)",
                    width: index === currentPage ? 28 : 8,
                    transform: [
                      {
                        scale: index === currentPage ? 1 : 0.85,
                      },
                    ],
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  carouselSection: {
    paddingVertical: Platform.OS === "ios" ? 0 : 0,
    marginBottom: Platform.OS === "ios" ? 5 : 0,
    overflow: "visible",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: 0,
  },
  pageIndicatorContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  carouselContainer: {
    overflow: "visible",
  },
  pagerView: {
    flex: 1,
    overflow: "visible",
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal: 2,
    overflow: "visible",
  },
  carouselPage: {
    flex: 1,
    overflow: "visible",
  },
  carouselCard: {
    borderRadius: 24,
    padding: 20,
    justifyContent: "flex-end",
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 12,
  },
  decorativeElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  decorCircle1: {
    width: 200,
    height: 200,
    top: -80,
    right: -60,
  },
  decorCircle2: {
    width: 120,
    height: 120,
    bottom: -40,
    left: -30,
  },
  decorCircle3: {
    width: 80,
    height: 80,
    top: 60,
    left: 20,
  },
  carouselImagesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  imageWrapper: {
    position: "relative",
    marginHorizontal: 0,
    overflow: "visible",
  },
  imageLeft: {
    marginRight: 8,
  },
  imageRight: {
    marginLeft: 8,
  },
  carouselImage: {
    borderRadius: 16,
    opacity: 0.85,
  },
  imageShadow: {
    position: "absolute",
    bottom: -8,
    left: 10,
    right: 10,
    height: 20,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    transform: [{ scaleX: 0.9 }],
  },
  carouselContent: {
    alignItems: "center",
    zIndex: 10,
    position: "relative",
  },
  popularBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 10,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
  },
  carouselTitle: {
    color: "white",
    textAlign: "center",
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  carouselSubtitle: {
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 16,
  },
  carouselButtonWrapper: {
    overflow: "hidden",
    borderRadius: 28,
  },
  carouselButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 10,
    overflow: "hidden",
  },
  androidButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  carouselButtonText: {
    color: "white",
  },
  buttonIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
});
