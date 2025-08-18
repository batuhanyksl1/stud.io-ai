import { ThemedText, ThemedView } from '@/components';
import { carouselData } from '@/components/data';
import { useTheme } from '@/hooks';
import Ionicon from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

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
      const nextPage = (currentPage + 1) % carouselData.length;
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

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderCarouselItem = ({ item }: { item: (typeof carouselData)[0] }) => (
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

        {/* Yazılar ön planda */}
        <View style={styles.carouselContent}>
          <ThemedText variant="h4" weight="bold" style={styles.carouselTitle}>
            {item.title}
          </ThemedText>
          <ThemedText variant="body" style={styles.carouselSubtitle}>
            {item.subtitle}
          </ThemedText>
          <TouchableOpacity style={styles.carouselButton} onPress={() => router.push('/editor')}>
            <ThemedText variant="body" weight="semiBold" style={styles.carouselButtonText}>
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
        Öne Çıkan Özellikler
      </ThemedText>

      <View style={[styles.carouselContainer]}>
        <FlatList
          ref={flatListRef}
          data={carouselData}
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
            { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 0 },
          ]}
        >
          {carouselData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: index === currentPage ? colors.primary : colors.border,
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
    paddingVertical: 32,
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
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  carouselImagesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  carouselImage: {
    width: 190,
    height: 230,
    borderRadius: 16,
    opacity: 0.7,
  },
  carouselContent: {
    alignItems: 'center',
    zIndex: 1,
    position: 'relative',
  },
  carouselTitle: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  carouselSubtitle: {
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 20,
  },
  carouselButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  carouselButtonText: {
    color: 'white',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
