import Logo from '@/components/Logo';
import ThemedCard from '@/components/ThemedCard';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import Ionicon from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Carousel için örnek veriler
const carouselData = [
  {
    id: 1,
    title: 'Portre Düzenleme',
    subtitle: 'Yüz güzelleştirme ve renk düzeltme',
    icon: 'user',
    gradient: ['#FF6B6B', '#FFE66D'],
  },
  {
    id: 2,
    title: 'Manzara Fotoğrafları',
    subtitle: 'Doğal renkleri canlandırın',
    icon: 'mountain',
    gradient: ['#4ECDC4', '#44A08D'],
  },
  {
    id: 3,
    title: 'Ürün Fotoğrafları',
    subtitle: 'Profesyonel görünüm',
    icon: 'shopping-bag',
    gradient: ['#A8E6CF', '#7FCDCD'],
  },
  {
    id: 4,
    title: 'Sokak Fotoğrafçılığı',
    subtitle: 'Dramatik efektler ekleyin',
    icon: 'camera',
    gradient: ['#FF9A9E', '#FECFEF'],
  },
];

// Ana servislerimiz
const editingServices = [
  {
    id: 'profile-picture',
    title: 'Profil Fotoğrafı',
    subtitle: 'LinkedIn Ready',
    description: 'LinkedIn için profesyonel profil fotoğrafları oluşturun',
    icon: 'zap',
    color: '#0077B5',
    gradient: ['#0077B5', '#005885'],
    features: ['Profesyonel filtreler', 'Otomatik boyutlandırma', 'LinkedIn uyumlu format'],
    rating: 4.8,
    usageCount: '2.5K+',
    isPopular: true,
    badge: 'En Popüler',
  },
  {
    id: 'background-removal',
    title: 'Arka Plan Kaldırma',
    subtitle: 'AI Powered',
    description: 'Fotoğraflarınızdan arka planı otomatik olarak kaldırın',
    icon: 'image',
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
    features: ['AI destekli arka plan kaldırma', 'Hassas kenar tespiti', 'Şeffaf PNG çıktı'],
    rating: 4.7,
    usageCount: '1.8K+',
    isPopular: false,
    badge: 'Hızlı',
  },
  {
    id: 'photo-enhancement',
    title: 'Fotoğraf İyileştirme',
    subtitle: 'Smart Enhancement',
    description: 'Fotoğraflarınızı AI ile otomatik olarak iyileştirin',
    icon: 'palette',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
    features: ['Otomatik parlaklık ayarı', 'Gürültü azaltma', 'Keskinlik artırma'],
    rating: 4.6,
    usageCount: '1.2K+',
    isPopular: false,
    badge: 'Kaliteli',
  },
  {
    id: 'style-transfer',
    title: 'Stil Transferi',
    subtitle: 'Artistic AI',
    description: 'Fotoğraflarınıza sanatsal stiller uygulayın',
    icon: 'zap',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED'],
    features: ['Çoklu sanat stili', 'Gerçek zamanlı önizleme', 'Stil yoğunluğu ayarı'],
    rating: 4.9,
    usageCount: '3.1K+',
    isPopular: true,
    badge: 'Yaratıcı',
  },
];

// Hızlı aksiyonlar
const quickActions = [
  {
    id: 'camera',
    title: 'Fotoğraf Çek',
    icon: 'camera',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1D4ED8'],
  },
  {
    id: 'gallery',
    title: 'Galeriden Seç',
    icon: 'image',
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
  },
  {
    id: 'recent',
    title: 'Son Düzenlemeler',
    icon: 'clock',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
  },
  {
    id: 'premium',
    title: 'Premium Özellikler',
    icon: 'award',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED'],
  },
];

// Son aktiviteler (mock data)
const recentActivity = [
  {
    id: '1',
    title: 'LinkedIn Profil Fotoğrafı',
    service: 'Profil Fotoğrafı',
    timestamp: '2 saat önce',
    status: 'completed',
    thumbnail: '📸',
  },
  {
    id: '2',
    title: 'Arka Plan Kaldırma',
    service: 'Arka Plan Kaldırma',
    timestamp: '1 gün önce',
    status: 'completed',
    thumbnail: '🖼️',
  },
  {
    id: '3',
    title: 'Sanatsal Stil',
    service: 'Stil Transferi',
    timestamp: '3 gün önce',
    status: 'completed',
    thumbnail: '🎨',
  },
];

// İstatistikler
const todayStats = [
  {
    title: 'Bugün İşlenen',
    value: '24',
    change: '+12%',
    icon: 'trending-up',
    color: '#10B981',
  },
  {
    title: 'Bu Hafta',
    value: '156',
    change: '+8%',
    icon: 'users',
    color: '#3B82F6',
  },
  {
    title: 'Toplam Proje',
    value: '1.2K',
    change: '+24%',
    icon: 'award',
    color: '#8B5CF6',
  },
];

export default function HomeScreen() {
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
    }, 3000); // 3 saniyede bir değişir

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [currentPage]);

  // Sayfa değiştiğinde
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const handleServicePress = (serviceId: string) => {
    router.push(`/service-detail?serviceId=${serviceId}`);
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'camera':
        router.push('/(tabs)/editor?mode=camera');
        break;
      case 'gallery':
        router.push('/(tabs)/editor?mode=gallery');
        break;
      case 'recent':
        // Recent işlemleri göster
        break;
      case 'premium':
        router.push('/premium');
        break;
    }
  };

  const renderCarouselItem = ({ item }: { item: (typeof carouselData)[0] }) => (
    <View style={styles.carouselPage}>
      <LinearGradient
        colors={item.gradient as any}
        style={styles.carouselCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.carouselContent}>
          {/* <View style={styles.carouselIcon}> */}
            {/* <Ionicon name={item.icon as any} size={40} color="white" /> */}
          {/* </View> */}
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

  const renderServiceCard = (service: (typeof editingServices)[0]) => {
    return (
      <TouchableOpacity
        key={service.id}
        onPress={() => handleServicePress(service.id)}
        activeOpacity={0.8}
        style={styles.serviceCardContainer}
      >
        <LinearGradient
          colors={service.gradient as [string, string, ...string[]]}
          style={styles.serviceGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.serviceCardContent}>
            <View style={styles.serviceHeader}>
              <View style={styles.serviceIconWrapper}>
                <Ionicon name={service.icon as any} size={28} color="#FFFFFF" />
              </View>
              {service.isPopular && (
                <View style={[styles.popularBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Ionicon name="star" size={10} color="#FFD700" />
                  <ThemedText variant="caption" style={styles.popularText}>
                    {service.badge}
                  </ThemedText>
                </View>
              )}
            </View>

            <View style={styles.serviceContent}>
              <ThemedText variant="caption" style={styles.serviceSubtitle}>
                {service.subtitle}
              </ThemedText>
              <ThemedText variant="h4" weight="bold" style={styles.serviceTitle}>
                {service.title}
              </ThemedText>
              <ThemedText variant="caption" style={styles.serviceDescription}>
                {service.description}
              </ThemedText>
            </View>

            <View style={styles.serviceFooter}>
              <View style={styles.serviceStats}>
                <Ionicon name="star" size={12} color="#FFD700" />
                <ThemedText variant="caption" style={styles.rating}>
                  {service.rating}
                </ThemedText>
                <ThemedText variant="caption" style={styles.usageCount}>
                  • {service.usageCount}
                </ThemedText>
              </View>
              <Ionicon name="arrow-forward" size={16} color="rgba(255,255,255,0.8)" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderQuickAction = (action: (typeof quickActions)[0]) => {
    return (
      <TouchableOpacity
        key={action.id}
        onPress={() => handleQuickAction(action.id)}
        activeOpacity={0.8}
        style={styles.quickActionContainer}
      >
        <LinearGradient
          colors={action.gradient as [string, string]}
          style={styles.quickActionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicon name={action.icon as any} size={24} color="#FFFFFF" />
          <ThemedText variant="caption" weight="semiBold" style={styles.quickActionText}>
            {action.title}
          </ThemedText>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderActivityItem = (item: (typeof recentActivity)[0]) => {
    return (
      <TouchableOpacity key={item.id} style={styles.activityItem} activeOpacity={0.7}>
        <View style={styles.activityThumbnail}>
          <ThemedText variant="h3">{item.thumbnail}</ThemedText>
        </View>
        <View style={styles.activityContent}>
          <ThemedText variant="body" weight="semiBold">
            {item.title}
          </ThemedText>
          <ThemedText variant="caption" color="secondary">
            {item.service} • {item.timestamp}
          </ThemedText>
        </View>
        <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
      </TouchableOpacity>
    );
  };

  const renderStatCard = (stat: (typeof todayStats)[0]) => {
    return (
      <ThemedCard key={stat.title} style={styles.statCard} padding="md" elevation="sm">
        <View style={styles.statHeader}>
          <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
            <Ionicon name={stat.icon as any} size={16} color={stat.color} />
          </View>
          <ThemedText variant="caption" color="secondary">
            {stat.title}
          </ThemedText>
        </View>
        <ThemedText variant="h3" weight="bold" style={styles.statValue}>
          {stat.value}
        </ThemedText>
        <ThemedText variant="caption" style={[styles.statChange, { color: '#10B981' } as any]}>
          {stat.change}
        </ThemedText>
      </ThemedCard>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Logo size="md" font="poppins" />
            <ThemedText variant="caption" color="secondary" style={styles.headerSubtitle}>
              AI destekli görsel düzenleme
            </ThemedText>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
              <ThemedText variant="body" weight="bold" color="onPrimary">
                B
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Section
          <ThemedView style={styles.heroSection}>
            <LinearGradient
              colors={[colors.primary + '20', colors.primary + '05']}
              style={styles.heroGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.heroContent}>
                <View style={styles.heroIcon}>
                  <Ionicon name="zap" size={32} color={colors.primary} />
                </View>
                <ThemedText variant="h2" weight="bold" style={styles.heroTitle}>
                  Merhaba! 👋
                </ThemedText>
                <ThemedText variant="body" color="secondary" style={styles.heroSubtitle}>
                  Bugün hangi fotoğrafınızı düzenlemek istiyorsunuz?
                </ThemedText>
              </View>
            </LinearGradient>
          </ThemedView> */}

          {/* Dinamik Carousel - EK OLARAK */}
          <ThemedView style={styles.carouselSection}>
            <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>
              Öne Çıkan Özellikler
            </ThemedText>

            <View style={styles.carouselContainer}>
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
              <View style={styles.pagination}>
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

          {/* Quick Actions */}
          <ThemedView style={styles.quickActionsSection}>
            <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>
              Hızlı Başlat
            </ThemedText>
            <View style={styles.quickActionsGrid}>{quickActions.map(renderQuickAction)}</View>
          </ThemedView>

          {/* Today Stats */}
          <ThemedView style={styles.todayStatsSection}>
            <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>
              Bugün
            </ThemedText>
            <View style={styles.statsGrid}>{todayStats.map(renderStatCard)}</View>
          </ThemedView>

          {/* Services Section */}
          <ThemedView style={styles.servicesSection}>
            <View style={styles.sectionHeader}>
              <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>
                Tüm Servisler
              </ThemedText>
              <TouchableOpacity>
                <ThemedText variant="body" color="primary" weight="semiBold">
                  Tümünü Gör
                </ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.servicesGrid}>{editingServices.map(renderServiceCard)}</View>
          </ThemedView>

          {/* Recent Activity */}
          <ThemedView style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>
                Son Aktiviteler
              </ThemedText>
              <TouchableOpacity>
                <ThemedText variant="body" color="primary" weight="semiBold">
                  Tümünü Gör
                </ThemedText>
              </TouchableOpacity>
            </View>
            <ThemedCard
              style={[styles.recentCard, { backgroundColor: colors.surface }] as any}
              padding="sm"
              elevation="sm"
            >
              {recentActivity.map(renderActivityItem)}
            </ThemedCard>
          </ThemedView>

          {/* Bottom Spacing */}
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  headerSubtitle: {
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scroll
  scrollView: {
    flex: 1,
    marginHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 34,
  },

  // Hero Section
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  heroGradient: {
    borderRadius: 20,
    padding: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },

  // Carousel Section - EK OLARAK
  carouselSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  carouselContainer: {
    height: 280,
  },
  carouselPage: {
    width: width - 32,
    paddingHorizontal: 8,
  },
  carouselCard: {
    borderRadius: 16,
    padding: 24,
    height: 240,
    justifyContent: 'center',
  },
  carouselContent: {
    alignItems: 'center',
  },
  carouselIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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

  // Quick Actions
  quickActionsSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  quickActionContainer: {
    width: (width - 44) / 2, // 24px padding * 2 + 12px gap * 2
  },
  quickActionGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    minHeight: 80,
    justifyContent: 'center',
  },
  quickActionText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // Today Stats
  todayStatsSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    minHeight: 80,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Services Section
  servicesSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  servicesGrid: {
    gap: 16,
  },
  serviceCardContainer: {
    marginBottom: 0,
  },
  serviceGradient: {
    borderRadius: 20,
    padding: 20,
    minHeight: 160,
  },
  serviceCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  serviceContent: {
    marginTop: 16,
    marginBottom: 16,
  },
  serviceSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  serviceTitle: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  serviceDescription: {
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
    fontSize: 13,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  usageCount: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },

  // Recent Activity
  recentSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  recentCard: {
    borderRadius: 16,
    marginTop: 16,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  activityThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});
