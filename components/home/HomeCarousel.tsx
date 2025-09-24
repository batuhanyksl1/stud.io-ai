import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { editingServices } from "@/components/data";
import { useContentCreation, useTheme } from "@/hooks";
import Ionicon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { Badge } from "../ui/Badge";

interface HomeCarouselProps {
  onPageChange?: (_page: number) => void;
}

export const HomeCarousel: React.FC<HomeCarouselProps> = ({ onPageChange }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const { clearAllImages, resetUIState } = useContentCreation();
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const autoScrollInterval = useRef<number | null>(null);

  // Otomatik kaydırma
  useEffect(() => {
    autoScrollInterval.current = setInterval(() => {
      const nextPage = (currentPage + 1) % editingServices.length;
      setCurrentPage(nextPage);
      pagerRef.current?.setPage(nextPage);
    }, 4000); // 4 saniyede bir değişir

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [currentPage]);

  // Sayfa değiştiğinde
  const onPageSelected = (e: any) => {
    const newPage = e.nativeEvent.position;
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  const handleServicePress = (
    servicePrompt: string,
    aiRequestUrl: string,
    aiStatusUrl: string,
    aiResultUrl: string,
  ) => {
    // Yeni servis seçildiğinde tüm görselleri ve UI state'ini temizle
    clearAllImages();
    resetUIState();

    router.push({
      pathname: "/(tabs)/creationPage",
      params: {
        servicePrompt: servicePrompt,
        aiRequestUrl: aiRequestUrl,
        aiStatusUrl: aiStatusUrl,
        aiResultUrl: aiResultUrl,
      },
    });
    console.log(aiRequestUrl, aiStatusUrl, aiResultUrl);
  };

  const renderCarouselItem = (item: (typeof editingServices)[0]) => (
    <View style={styles.carouselPage}>
      <LinearGradient
        colors={item.gradient as any}
        style={styles.carouselCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Görseller arka planda */}
        <View style={styles.carouselImagesContainer}>
          <Image source={item.image1} style={styles.carouselImage} />
          <Image source={item.image2} style={styles.carouselImage} />
        </View>
        <Badge style={styles.carouselBadge} variant="coming-soon">
          Yakında ✨
        </Badge>

        {/* Yazılar ön planda */}
        <View style={styles.carouselContent}>
          <ThemedText variant="h4" weight="bold" style={styles.carouselTitle}>
            {item.title}
          </ThemedText>
          <ThemedText variant="body" style={styles.carouselSubtitle}>
            {item.subtitle}
          </ThemedText>
          <TouchableOpacity
            style={styles.carouselButton}
            onPress={() =>
              handleServicePress(
                item.prompt,
                item.aiRequestUrl as string,
                item.aiStatusUrl as string,
                item.aiResultUrl as string,
              )
            }
          >
            <ThemedText
              variant="body"
              weight="semiBold"
              style={styles.carouselButtonText}
            >
              Dene
            </ThemedText>
            <Ionicon name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <ThemedView style={styles.carouselSection}>
      <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>
        Öne Çıkanlar
      </ThemedText>

      <View style={[styles.carouselContainer]}>
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

        {/* Sayfa göstergeleri */}
        <View
          style={[
            styles.pagination,
            {
              position: "absolute",
              bottom: -25,
              left: 0,
              right: 0,
              zIndex: 10,
            },
          ]}
        >
          {editingServices.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    index !== currentPage ? colors.primary : colors.border,
                  width: index === currentPage ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  carouselSection: {
    paddingVertical: Platform.OS === "ios" ? 0 : 5,
    marginBottom: Platform.OS === "ios" ? 5 : 0,
  },
  carouselContainer: {
    height: 300,
    overflow: "visible",
  },
  pagerView: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal: 1,
  },
  carouselPage: {
    flex: 1,
  },
  carouselCard: {
    borderRadius: 12,
    padding: 16,
    height: 280,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 10,
  },
  carouselBadge: {
    position: "absolute",
    top: 10,
    right: 10,
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
    gap: 3,
  },
  carouselImage: {
    width: 180 * (Platform.OS === "ios" ? 1.15 : 1.06),
    height: 275,
    borderRadius: 12,
    opacity: 0.7,
  },
  carouselContent: {
    alignItems: "center",
    zIndex: 1,
    position: "relative",
  },
  carouselTitle: {
    color: "white",
    textAlign: "center",
    marginBottom: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  carouselSubtitle: {
    color: "white",
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 12,
  },
  carouselButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  carouselButtonText: {
    color: "white",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    marginBottom: 12,
  },
});
