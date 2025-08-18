import { useTheme } from '@/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  gradient?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color,
  gradient = false,
}) => {
  const { colorScheme, colors } = useTheme();
  const rotation = useSharedValue(0);

  const sizeMap = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  const spinnerSize = sizeMap[size];

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const defaultColor = color || colors.primary;

  if (gradient) {
    return (
      <View style={{ width: spinnerSize, height: spinnerSize }}>
        <Animated.View style={[animatedStyle, { width: '100%', height: '100%' }]}>
          <LinearGradient
            colors={
              colorScheme === 'dark'
                ? ['#3b82f6', '#8b5cf6', '#ec4899']
                : ['#2563eb', '#7c3aed', '#db2777']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: spinnerSize / 2,
              borderWidth: 3,
              borderColor: 'transparent',
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 3,
              left: 3,
              right: 3,
              bottom: 3,
              borderRadius: (spinnerSize - 6) / 2,
              backgroundColor: colors.background,
            }}
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: spinnerSize,
          height: spinnerSize,
          borderRadius: spinnerSize / 2,
          borderWidth: 3,
          borderColor: 'transparent',
          borderTopColor: defaultColor,
          borderRightColor: `${defaultColor}80`,
        },
      ]}
    />
  );
};
