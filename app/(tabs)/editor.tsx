import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import { Download, RotateCw, Palette, Contrast, Sun, ArrowLeft, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import ThemedCard from '@/components/ThemedCard';
import ScrollContainer from '@/components/ScrollContainer';
import { Spacing } from '@/constants/DesignTokens';

const { width, height } = Dimensions.get('window');

interface FilterOption {
  id: string;
  name: string;
  brightness: number;
  contrast: number;
  saturation: number;
  backgroundColor: string;
}

const filterOptions: FilterOption[] = [
  {
    id: 'original',
    name: 'Original',
    brightness: 1,
    contrast: 1,
    saturation: 1,
    backgroundColor: 'transparent',
  },
  {
    id: 'professional',
    name: 'Professional',
    brightness: 1.1,
    contrast: 1.2,
    saturation: 0.9,
    backgroundColor: '#F8FAFC',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    brightness: 1.05,
    contrast: 1.15,
    saturation: 0.85,
    backgroundColor: '#EFF6FF',
  },
  {
    id: 'warm',
    name: 'Warm',
    brightness: 1.15,
    contrast: 1.1,
    saturation: 1.1,
    backgroundColor: '#FEF7ED',
  },
  {
    id: 'cool',
    name: 'Cool',
    brightness: 1.05,
    contrast: 1.25,
    saturation: 0.9,
    backgroundColor: '#F0F9FF',
  },
];

export default function EditorTab() {
  const { colors } = useTheme();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(filterOptions[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const viewShotRef = useRef<ViewShot>(null);

  useEffect(() => {
    if (imageUri) {
      processImage();
    }
  }, [imageUri, selectedFilter, rotation]);

  const processImage = async () => {
    if (!imageUri) return;

    setIsProcessing(true);
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }, { rotate: rotation }],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );

      setProcessedImage(manipResult.uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const rotateImage = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setRotation((prev) => (prev + 90) % 360);
  };

  const selectFilter = (filter: FilterOption) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedFilter(filter);
  };

  const saveImage = async () => {
    if (!viewShotRef.current) return;

    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const uri = await viewShotRef.current.capture();

      if (Platform.OS !== 'web') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          await MediaLibrary.saveToLibraryAsync(uri);
          Alert.alert('Success', 'Profile picture saved to your gallery!');
        } else {
          Alert.alert('Permission Required', 'Please grant permission to save photos');
        }
      } else {
        // For web, create download link
        const link = document.createElement('a');
        link.href = uri;
        link.download = 'linkedin-profile-picture.png';
        link.click();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const goBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  if (!imageUri) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <Palette size={80} color={colors.textTertiary} strokeWidth={1.5} />
        <ThemedText
          variant='h3'
          weight='bold'
          align='center'
          style={{ marginTop: 24, marginBottom: 16 }}
        >
          No Image Selected
        </ThemedText>
        <ThemedText variant='body' color='secondary' align='center' style={{ lineHeight: 24 }}>
          Go to Camera or Gallery to select an image to edit
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
            Edit Profile Picture
          </ThemedText>
          <ThemedText variant='caption' color='secondary'>
            Apply professional styling
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={saveImage}
        >
          <Check size={20} color={colors.textOnPrimary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollContainer>
        <ThemedCard style={styles.previewContainer} padding='xl' elevation='md'>
          <ViewShot
            ref={viewShotRef}
            style={styles.viewShot}
            options={{ format: 'png', quality: 0.9 }}
          >
            <View
              style={[styles.profileFrame, { backgroundColor: selectedFilter.backgroundColor }]}
            >
              <View style={styles.imageContainer}>
                {processedImage && (
                  <Image
                    source={{ uri: processedImage }}
                    style={[
                      styles.profileImage,
                      {
                        opacity: selectedFilter.brightness,
                      },
                    ]}
                  />
                )}
              </View>
            </View>
          </ViewShot>
        </ThemedCard>

        <ThemedCard style={styles.controls} padding='lg' elevation='sm'>
          <View style={styles.controlSection}>
            <ThemedText variant='bodyLarge' weight='semiBold' style={{ marginBottom: 16 }}>
              Adjustments
            </ThemedText>
            <View style={styles.adjustmentButtons}>
              <TouchableOpacity
                style={[
                  styles.adjustmentButton,
                  { backgroundColor: colors.secondarySubtle, borderColor: colors.border },
                ]}
                onPress={rotateImage}
              >
                <RotateCw size={20} color={colors.primary} strokeWidth={2} />
                <ThemedText
                  variant='caption'
                  weight='medium'
                  color='primary'
                  style={{ marginLeft: 8 }}
                >
                  Rotate
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.controlSection}>
            <ThemedText variant='bodyLarge' weight='semiBold' style={{ marginBottom: 16 }}>
              Filters
            </ThemedText>
            <ScrollContainer
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersContainer}
            >
              {filterOptions.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor:
                        selectedFilter.id === filter.id
                          ? colors.primarySubtle
                          : colors.secondarySubtle,
                      borderColor: selectedFilter.id === filter.id ? colors.primary : 'transparent',
                    },
                  ]}
                  onPress={() => selectFilter(filter)}
                >
                  <View
                    style={[
                      styles.filterPreview,
                      {
                        backgroundColor: filter.backgroundColor || colors.border,
                        borderColor: colors.border,
                      },
                    ]}
                  />
                  <ThemedText
                    variant='caption'
                    weight={selectedFilter.id === filter.id ? 'semiBold' : 'medium'}
                    color={selectedFilter.id === filter.id ? 'primary' : 'secondary'}
                    align='center'
                  >
                    {filter.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollContainer>
          </View>
        </ThemedCard>
      </ScrollContainer>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginTop: 24,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0077B5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0077B5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  previewContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  viewShot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileFrame: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  imageContainer: {
    width: 264,
    height: 264,
    borderRadius: 132,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  controls: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: Platform.OS === 'ios' ? 34 : 24,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  controlSection: {
    marginBottom: 24,
  },
  controlTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  adjustmentButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  adjustmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  adjustmentButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#0077B5',
    marginLeft: 8,
  },
  filtersContainer: {
    maxHeight: 120,
  },
  filtersContent: {
    paddingRight: 24,
  },
  filterButton: {
    alignItems: 'center',
    marginRight: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
  },
  filterButtonActive: {
    backgroundColor: '#EBF8FF',
    borderColor: '#0077B5',
  },
  filterPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  filterTextActive: {
    color: '#0077B5',
    fontFamily: 'Inter-SemiBold',
  },
});
