import Logo from '@/components/Logo';
import ThemedCard from '@/components/ThemedCard';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Spacing } from '@/constants/DesignTokens';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { ArrowRight, Image as ImageIcon, Palette, Sparkles, Star, Zap } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Dummy data for editing services
const editingServices = [
  {
    id: 1,
    title: 'Portre Oluştur',
    description: 'Yüz özelliklerini mükemmelleştirin ve profesyonel görünüm elde edin',
    icon: Sparkles,
    color: '#FF6B6B',
    features: ['Cilt düzeltme', 'Göz büyütme', 'Dudak iyileştirme'],
    rating: 4.8,
    usageCount: '2.5K+',
    isPopular: true,
  },
  {
    id: 2,
    title: 'Arka Plan',
    description: 'Fotoğrafınızın arka planını istediğiniz gibi değiştirin',
    icon: ImageIcon,
    color: '#4ECDC4',
    features: ['Otomatik algılama', '100+ arka plan', 'Yüksek kalite'],
    rating: 4.7,
    usageCount: '1.8K+',
    isPopular: false,
  },
  {
    id: 3,
    title: 'Renk Düzenleme',
    description: 'Fotoğrafınızın renklerini profesyonel araçlarla düzenleyin',
    icon: Palette,
    color: '#45B7D1',
    features: ['Sıcaklık ayarı', 'Doygunluk', 'Kontrast'],
    rating: 4.6,
    usageCount: '1.2K+',
    isPopular: false,
  },
  // {
  //   id: 4,
  //   title: 'Kırpma & Döndürme',
  //   description: 'Fotoğrafınızı istediğiniz boyutlarda kırpın ve döndürün',
  //   icon: Crop,
  //   color: '#96CEB4',
  //   features: ['Serbest kırpma', 'Oran koruma', 'Otomatik düzeltme'],
  //   rating: 4.5,
  //   usageCount: '900+',
  //   isPopular: false,
  // },
  // {
  //   id: 5,
  //   title: 'Göz Düzenleme',
  //   description: 'Gözlerinizi daha canlı ve etkileyici hale getirin',
  //   icon: Eye,
  //   color: '#FFEAA7',
  //   features: ['Göz beyazı', 'İris renklendirme', 'Kirpik ekleme'],
  //   rating: 4.9,
  //   usageCount: '3.1K+',
  //   isPopular: true,
  // },
  {
    id: 6,
    title: 'Hızlı Düzeltme',
    description: 'Tek tıkla fotoğrafınızı mükemmelleştirin',
    icon: Zap,
    color: '#DDA0DD',
    features: ['Otomatik düzeltme', 'Hızlı işlem', 'AI destekli'],
    rating: 4.4,
    usageCount: '800+',
    isPopular: false,
  },
];

export default function HomeTab() {
  const { colors } = useTheme();

  const handleServicePress = (serviceId: number) => {
    // Navigate to editor with selected service
    router.push({
      pathname: '/(tabs)/editor',
      params: { serviceId: serviceId.toString() },
    });
  };

  const renderServiceCard = (service: (typeof editingServices)[0]) => {
    const IconComponent = service.icon;

    return (
      <TouchableOpacity
        key={service.id}
        onPress={() => handleServicePress(service.id)}
        activeOpacity={0.8}
      >
        <ThemedCard style={{ backgroundColor: colors.surface }} padding="lg" elevation="md">
          <View style={styles.serviceHeader}>
            <View style={styles.serviceInfo}>
              <View style={styles.titleRow}>
                <View style={[styles.iconContainer, { backgroundColor: service.color }]}>
                  <IconComponent size={24} color="#FFFFFF" strokeWidth={2} />
                </View>
                <ThemedText variant="h4" weight="semiBold" style={styles.serviceTitle}>
                  {service.title}
                </ThemedText>
                {service.isPopular && (
                  <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                    <Star size={12} color={colors.textOnPrimary} fill={colors.textOnPrimary} />
                    <ThemedText variant="caption" color="onPrimary" weight="semiBold">
                      Popüler
                    </ThemedText>
                  </View>
                )}
                <ArrowRight size={20} color={colors.textPrimary} strokeWidth={2} />
              </View>
              <ThemedText variant="body" color="secondary" style={styles.serviceDescription}>
                {service.description}
              </ThemedText>
            </View>
          </View>

          {/* <View style={styles.serviceFeatures}>
            {service.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View
                  style={[
                    styles.featureDot,
                    { backgroundColor: service.color },
                  ]}
                />
                <ThemedText variant="caption" color="secondary">
                  {feature}
                </ThemedText>
              </View>
            ))}
          </View> */}

          <View style={styles.serviceStats}>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <ThemedText variant="caption" weight="semiBold" style={styles.rating}>
                {service.rating}
              </ThemedText>
            </View>
            <ThemedText variant="caption" color="secondary">
              {service.usageCount} kullanım
            </ThemedText>
          </View>
        </ThemedCard>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, { marginHorizontal: Spacing.md }]}>
          <Logo size="md" font="poppins" />
          <ThemedText variant="caption" color="secondary" style={styles.title}>
            Profesyonel görsel düzenleme araçları
          </ThemedText>
        </View>
      </View>

      <ScrollView
        style={{
          flex: 1,
          marginHorizontal: Spacing.md,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 34 : 24,
        }}
      >
        <ThemedView style={styles.welcomeSection}>
          <ThemedCard style={{ backgroundColor: colors.surface }} padding="xl" elevation="sm">
            <ThemedText variant="h3" weight="bold" style={styles.welcomeTitle}>
              Hoş Geldiniz! 👋
            </ThemedText>
            <ThemedText variant="body" color="secondary" style={styles.welcomeText}>
              Fotoğraflarınızı profesyonel araçlarla düzenleyin. 4 farklı servisimizden birini seçin
              ve başlayın.
            </ThemedText>
          </ThemedCard>
        </ThemedView>

        <ThemedView style={styles.servicesSection}>
          <ThemedText variant="h2" weight="bold" style={styles.sectionTitle}>
            Servisler
          </ThemedText>
          <ThemedText variant="body" color="secondary" style={styles.sectionSubtitle}>
            İhtiyacınıza uygun servisi seçin
          </ThemedText>

          <ThemedView style={styles.servicesGrid}>
            {editingServices.map(renderServiceCard)}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.statsSection}>
          <ThemedCard style={{ backgroundColor: colors.surface }} padding="lg" elevation="sm">
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <ThemedText variant="h2" weight="bold" color="primary">
                  10K+
                </ThemedText>
                <ThemedText
                  variant="caption"
                  color="secondary"
                  style={{ width: 80, textAlign: 'center' }}
                >
                  Düzenlenen Fotoğraf
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText variant="h2" weight="bold" color="primary">
                  4.7
                </ThemedText>
                <ThemedText
                  variant="caption"
                  color="secondary"
                  style={{ width: 80, textAlign: 'center' }}
                >
                  Ortalama Puan
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText variant="h2" weight="bold" color="primary">
                  4
                </ThemedText>
                <ThemedText
                  variant="caption"
                  color="secondary"
                  style={{ width: 80, textAlign: 'center' }}
                >
                  Düzenleme Servisi
                </ThemedText>
              </View>
            </View>
          </ThemedCard>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 5,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  title: {
    marginBottom: 4,
  },
  welcomeSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  welcomeTitle: {
    marginBottom: 8,
  },
  welcomeText: {
    lineHeight: 22,
  },
  servicesSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    paddingTop: 10,
  },
  sectionSubtitle: {
    marginBottom: 24,
    lineHeight: 20,
  },
  servicesGrid: {
    gap: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceTitle: {
    marginRight: 8,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    overflow: 'hidden',
    position: 'absolute',
    top: -30,
    right: -30,
  },
  serviceDescription: {
    lineHeight: 20,
    marginTop: 16,
  },
  serviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    marginLeft: 2,
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
});
