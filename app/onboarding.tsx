import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowRight, Camera, Cloud, Palette } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, Text, View } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string[];
}

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: t('onboarding.welcome'),
      description: t('onboarding.welcomeDescription'),
      icon: <Camera size={80} color='white' />,
      gradient: ['#3b82f6', '#1d4ed8'],
    },
    {
      id: '2',
      title: t('onboarding.features'),
      description: t('onboarding.featuresDescription'),
      icon: <Palette size={80} color='white' />,
      gradient: ['#8b5cf6', '#7c3aed'],
    },
    {
      id: '3',
      title: t('onboarding.getStarted'),
      description: t('onboarding.getStartedDescription'),
      icon: <Cloud size={80} color='white' />,
      gradient: ['#ec4899', '#db2777'],
    },
  ];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    // First time state would be managed here
    router.replace('/auth');
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

      const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolate.CLAMP);

      const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolate.CLAMP);

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <View style={{ width }} className='flex-1 items-center justify-center px-8'>
        <LinearGradient
          colors={item.gradient}
          className='w-full flex-1 rounded-4xl items-center justify-center'
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={animatedStyle} className='items-center'>
            <View className='w-32 h-32 rounded-full bg-white/20 items-center justify-center mb-8'>
              {item.icon}
            </View>

            <Text className='text-3xl font-inter-bold text-white text-center mb-4'>
              {item.title}
            </Text>

            <Text className='text-lg font-inter-regular text-white/90 text-center leading-7'>
              {item.description}
            </Text>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View className='flex-row justify-center items-center mb-8'>
        {slides.map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

            const dotWidth = interpolate(scrollX.value, inputRange, [8, 24, 8], Extrapolate.CLAMP);

            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.3, 1, 0.3],
              Extrapolate.CLAMP,
            );

            return {
              width: dotWidth,
              opacity,
            };
          });

          return (
            <Animated.View
              key={index}
              style={animatedStyle}
              className={`h-2 rounded-full mx-1 ${
                colorScheme === 'dark' ? 'bg-white' : 'bg-primary-600'
              }`}
            />
          );
        })}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={colorScheme === 'dark' ? ['#0f172a', '#1e293b'] : ['#f8fafc', '#e2e8f0']}
      className='flex-1'
    >
      <View className='flex-1 pt-16 pb-8'>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            scrollX.value = event.nativeEvent.contentOffset.x;
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
        />

        <View className='px-8'>
          {renderPagination()}

          <View className='flex-row justify-between items-center'>
            <Button title={t('onboarding.skip')} onPress={handleSkip} variant='ghost' />

            <Button
              title={
                currentIndex === slides.length - 1 ? t('onboarding.finish') : t('onboarding.next')
              }
              onPress={handleNext}
              gradient
              icon={<ArrowRight size={20} color='white' />}
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
