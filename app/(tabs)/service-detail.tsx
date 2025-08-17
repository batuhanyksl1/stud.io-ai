import ScrollContainer from '@/components/ScrollContainer';
import ThemedCard from '@/components/ThemedCard';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Camera, Image as ImageIcon, Palette, Sparkles } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  examples: string[];
}

const services: Service[] = [
  {
    id: 'profile-picture',
    name: 'Profil Fotoğrafı',
    description: 'LinkedIn için profesyonel profil fotoğrafları oluşturun',
    icon: <Camera size={24} color='#0077B5' strokeWidth={2} />,
    color: '#0077B5',
    features: [
      'Profesyonel filtreler',
      'Otomatik boyutlandırma',
      'LinkedIn uyumlu format',
      'Yüksek kalite çıktı',
    ],
    examples: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    ],
  },
  {
    id: 'background-removal',
    name: 'Arka Plan Kaldırma',
    description: 'Fotoğraflarınızdan arka planı otomatik olarak kaldırın',
    icon: <ImageIcon size={24} color='#10B981' strokeWidth={2} />,
    color: '#10B981',
    features: [
      'AI destekli arka plan kaldırma',
      'Hassas kenar tespiti',
      'Şeffaf PNG çıktı',
      'Toplu işleme',
    ],
    examples: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    ],
  },
  {
    id: 'photo-enhancement',
    name: 'Fotoğraf İyileştirme',
    description: 'Fotoğraflarınızı AI ile otomatik olarak iyileştirin',
    icon: <Sparkles size={24} color='#F59E0B' strokeWidth={2} />,
    color: '#F59E0B',
    features: ['Otomatik parlaklık ayarı', 'Gürültü azaltma', 'Keskinlik artırma', 'Renk düzeltme'],
    examples: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop',
    ],
  },
  {
    id: 'style-transfer',
    name: 'Stil Transferi',
    description: 'Fotoğraflarınıza sanatsal stiller uygulayın',
    icon: <Palette size={24} color='#8B5CF6' strokeWidth={2} />,
    color: '#8B5CF6',
    features: [
      'Çoklu sanat stili',
      'Gerçek zamanlı önizleme',
      'Stil yoğunluğu ayarı',
      'Yüksek çözünürlük',
    ],
    examples: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    ],
  },
];

export default function ServiceDetailScreen() {
  const { colors } = useTheme();
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();

  const service = services.find((s) => s.id === serviceId);

  const goBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const startService = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // Burada servisi başlatma işlemi yapılacak
    // Şimdilik ana sayfaya yönlendiriyoruz
    router.push('/(tabs)/');
  };

  if (!service) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText variant='h3' weight='bold' align='center'>
          Servis bulunamadı
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.secondarySubtle }]}
          onPress={goBack}
        >
          <ArrowLeft size={24} color={colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <ThemedText variant='h3' weight='bold'>
            {service.name}
          </ThemedText>
          <ThemedText variant='caption' color='secondary'>
            {service.description}
          </ThemedText>
        </View>
      </View>

      <ScrollContainer>
        <ThemedCard style={styles.serviceCard} padding='xl' elevation='md'>
          <View style={[styles.serviceIcon, { backgroundColor: `${service.color}20` }]}>
            {service.icon}
          </View>
          <ThemedText variant='h4' weight='bold' style={{ marginTop: 16, marginBottom: 8 }}>
            {service.name}
          </ThemedText>
          <ThemedText variant='body' color='secondary' style={{ marginBottom: 24 }}>
            {service.description}
          </ThemedText>

          <View style={styles.featuresSection}>
            <ThemedText variant='bodyLarge' weight='semiBold' style={{ marginBottom: 16 }}>
              Özellikler
            </ThemedText>
            {service.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={[styles.featureDot, { backgroundColor: service.color }]} />
                <ThemedText variant='body' style={{ flex: 1, marginLeft: 12 }}>
                  {feature}
                </ThemedText>
              </View>
            ))}
          </View>
        </ThemedCard>

        <ThemedCard style={styles.examplesCard} padding='lg' elevation='sm'>
          <ThemedText variant='bodyLarge' weight='semiBold' style={{ marginBottom: 16 }}>
            Örnekler
          </ThemedText>
          <View style={styles.examplesGrid}>
            {service.examples.map((example, index) => (
              <View key={index} style={styles.exampleItem}>
                <Image source={{ uri: example }} style={styles.exampleImage} />
              </View>
            ))}
          </View>
        </ThemedCard>

        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: service.color }]}
          onPress={startService}
        >
          <ThemedText variant='bodyLarge' weight='semiBold' color='textOnPrimary'>
            Servisi Başlat
          </ThemedText>
        </TouchableOpacity>
      </ScrollContainer>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  serviceCard: {
    marginHorizontal: 24,
    marginTop: 24,
    alignItems: 'center',
  },
  serviceIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuresSection: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  examplesCard: {
    marginHorizontal: 24,
    marginTop: 16,
  },
  examplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  exampleItem: {
    width: (width - 72) / 3,
    height: (width - 72) / 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  exampleImage: {
    width: '100%',
    height: '100%',
  },
  startButton: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
