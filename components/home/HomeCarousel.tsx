import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { editingServices } from "@/components/data";
import { useTheme } from "@/hooks";
import Ionicon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { Badge } from "../ui/Badge";

const { width } = Dimensions.get("window");

interface HomeCarouselProps {
  onPageChange?: (page: number) => void;
}

export const HomeCarousel: React.FC<HomeCarouselProps> = ({ onPageChange }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const autoScrollInterval = useRef<number | null>(null);

  // Otomatik kaydırma
  useEffect(() => {
    autoScrollInterval.current = setInterval(() => {
      const nextPage = (currentPage + 1) % editingServices.length;
      setCurrentPage(nextPage);
      flatListRef.current?.scrollToIndex({
        index: nextPage,
        animated: true,
      });
    }, 4000); // 4 saniyede bir değişir

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [currentPage]);

  // Sayfa değiştiğinde
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newPage = viewableItems[0].index;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  };

  const handleServicePress = (
    servicePrompt: string,
    aiToolRequest: string,
    aiToolStatus: string,
    aiToolResult: string,
  ) => {
    router.push({
      pathname: "/(tabs)/creationPage",
      params: {
        servicePrompt: servicePrompt,
        aiToolRequest: aiToolRequest,
        aiToolStatus: aiToolStatus,
        aiToolResult: aiToolResult,
      },
    });
    console.log(aiToolRequest, aiToolStatus, aiToolResult);
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderCarouselItem = ({
    item,
  }: {
    item: (typeof editingServices)[0];
  }) => (
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
                item.aiToolRequest as string,
                item.aiToolStatus as string,
                item.aiToolResult as string,
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
        <FlatList
          ref={flatListRef}
          data={editingServices}
          renderItem={renderCarouselItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: width - 32,
            offset: (width - 32) * index,
            index,
          })}
        />

        {/* Sayfa göstergeleri */}
        <View
          style={[
            styles.pagination,
            { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 0 },
          ]}
        >
          {editingServices.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    index === currentPage ? colors.primary : colors.border,
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
    paddingHorizontal: 24,
    paddingVertical: Platform.OS === "ios" ? 0 : 10,
    marginBottom: Platform.OS === "ios" ? 10 : 0,
  },
  carouselContainer: {
    height: 240,
  },
  carouselPage: {
    width: width - 32,
    paddingHorizontal: 0,
  },
  carouselCard: {
    borderRadius: 16,
    padding: 24,
    height: 240,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
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
    width: 200 * (Platform.OS === "ios" ? 1 : 1.06),
    height: 235,
    borderRadius: 16,
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
    marginBottom: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  carouselSubtitle: {
    color: "white",
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 20,
  },
  carouselButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  carouselButtonText: {
    color: "white",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    marginBottom: 16,
  },
});
