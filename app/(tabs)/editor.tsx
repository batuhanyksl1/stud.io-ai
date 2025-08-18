import { ScrollContainer, ThemedCard, ThemedText, ThemedView } from '@/components';
import { useTheme } from '@/hooks';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Camera, Image as ImageIcon, Palette, Sparkles } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface ServiceOutput {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceIcon: React.ReactNode;
  serviceColor: string;
  imageUrl: string;
  title: string;
  description: string;
  timestamp: string;
}

const serviceOutputs: ServiceOutput[] = [
  {
    id: '1',
    serviceId: 'profile-picture',
    serviceName: 'Profil Fotoğrafı',
    serviceIcon: <Camera size={16} color="#0077B5" strokeWidth={2} />,
    serviceColor: '#0077B5',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    title: 'LinkedIn Profil Fotoğrafı',
    description: 'Profesyonel filtre uygulanmış',
    timestamp: '2 saat önce',
  },
  {
    id: '2',
    serviceId: 'background-removal',
    serviceName: 'Arka Plan Kaldırma',
    serviceIcon: <ImageIcon size={16} color="#10B981" strokeWidth={2} />,
    serviceColor: '#10B981',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
    title: 'Arka Plan Kaldırıldı',
    description: 'AI ile otomatik arka plan kaldırma',
    timestamp: '1 gün önce',
  },
  {
    id: '3',
    serviceId: 'photo-enhancement',
    serviceName: 'Fotoğraf İyileştirme',
    serviceIcon: <Sparkles size={16} color="#F59E0B" strokeWidth={2} />,
    serviceColor: '#F59E0B',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    title: 'İyileştirilmiş Fotoğraf',
    description: 'Otomatik parlaklık ve kontrast ayarı',
    timestamp: '3 gün önce',
  },
  {
    id: '4',
    serviceId: 'style-transfer',
    serviceName: 'Stil Transferi',
    serviceIcon: <Palette size={16} color="#8B5CF6" strokeWidth={2} />,
    serviceColor: '#8B5CF6',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    title: 'Sanatsal Stil Uygulandı',
    description: 'Van Gogh tarzı stil transferi',
    timestamp: '1 hafta önce',
  },
  {
    id: '5',
    serviceId: 'profile-picture',
    serviceName: 'Profil Fotoğrafı',
    serviceIcon: <Camera size={16} color="#0077B5" strokeWidth={2} />,
    serviceColor: '#0077B5',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    title: 'Kurumsal Profil Fotoğrafı',
    description: 'Kurumsal filtre uygulanmış',
    timestamp: '1 hafta önce',
  },
  {
    id: '6',
    serviceId: 'background-removal',
    serviceName: 'Arka Plan Kaldırma',
    serviceIcon: <ImageIcon size={16} color="#10B981" strokeWidth={2} />,
    serviceColor: '#10B981',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
    title: 'Ürün Fotoğrafı',
    description: 'E-ticaret için arka plan kaldırma',
    timestamp: '2 hafta önce',
  },
];

export default function EditorTab() {
  const { colors } = useTheme();

  const handleImagePress = (output: ServiceOutput) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/service-detail?serviceId=${output.serviceId}`);
  };

  const renderServiceBadge = (output: ServiceOutput) => (
    <View style={[styles.serviceBadge, { backgroundColor: `${output.serviceColor}20` }]}>
      {output.serviceIcon}
      <ThemedText
        variant="caption"
        weight="medium"
        style={{ color: output.serviceColor, marginLeft: 4 }}
      >
        {output.serviceName}
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerContent}>
          <ThemedText variant="h3" weight="bold">
            Galeri
          </ThemedText>
          <ThemedText variant="caption" color="secondary">
            Servis çıktılarınızı görüntüleyin
          </ThemedText>
        </View>
      </View>

      <ScrollContainer>
        <View style={styles.galleryContainer}>
          {serviceOutputs.map((output) => (
            <TouchableOpacity
              key={output.id}
              style={styles.imageCard}
              onPress={() => handleImagePress(output)}
              activeOpacity={0.8}
            >
              <ThemedCard style={styles.card} padding="sm" elevation="sm">
                <Image source={{ uri: output.imageUrl }} style={styles.image} />
                <View style={styles.imageInfo}>
                  {renderServiceBadge(output)}
                  <View style={styles.textInfo}>
                    <ThemedText variant="body" weight="semiBold" style={{ fontSize: 14 }}>
                      {output.title}
                    </ThemedText>
                    <ThemedText variant="caption" color="secondary" style={{ fontSize: 12 }}>
                      {output.description}
                    </ThemedText>
                    <ThemedText variant="caption" color="tertiary" style={{ fontSize: 10 }}>
                      {output.timestamp}
                    </ThemedText>
                  </View>
                </View>
              </ThemedCard>
            </TouchableOpacity>
          ))}
        </View>

        {serviceOutputs.length === 0 && (
          <ThemedView style={styles.emptyContainer}>
            <Palette size={80} color={colors.textTertiary} strokeWidth={1.5} />
            <ThemedText
              variant="h3"
              weight="bold"
              align="center"
              style={{ marginTop: 24, marginBottom: 16 }}
            >
              Henüz Çıktı Yok
            </ThemedText>
            <ThemedText variant="body" color="secondary" align="center" style={{ lineHeight: 24 }}>
              Servislerinizi kullanarak ilk çıktınızı oluşturun
            </ThemedText>
          </ThemedView>
        )}
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  headerContent: {
    flex: 1,
  },
  galleryContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  imageCard: {
    width: (width - 48) / 2,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: (width - 48) / 2,
    resizeMode: 'cover',
  },
  imageInfo: {
    padding: 12,
  },
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  textInfo: {
    gap: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});
