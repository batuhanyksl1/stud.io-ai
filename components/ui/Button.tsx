import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  gradient = false,
}) => {
  const { colorScheme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getButtonClasses = () => {
    const baseClasses = 'flex-row items-center justify-center rounded-xl';
    const sizeClasses = {
      sm: 'px-4 py-2 min-h-[36px]',
      md: 'px-6 py-3 min-h-[44px]',
      lg: 'px-8 py-4 min-h-[52px]',
    };

    const variantClasses = {
      primary: colorScheme === 'dark' ? 'bg-primary-500' : 'bg-primary-600',
      secondary: colorScheme === 'dark' ? 'bg-secondary-700' : 'bg-secondary-200',
      outline: `border-2 ${colorScheme === 'dark' ? 'border-primary-500' : 'border-primary-600'}`,
      ghost: 'bg-transparent',
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
      disabled ? 'opacity-50' : ''
    }`;
  };

  const getTextClasses = () => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const variantClasses = {
      primary: 'text-white font-inter-semibold',
      secondary:
        colorScheme === 'dark'
          ? 'text-white font-inter-semibold'
          : 'text-secondary-800 font-inter-semibold',
      outline:
        colorScheme === 'dark'
          ? 'text-primary-400 font-inter-semibold'
          : 'text-primary-600 font-inter-semibold',
      ghost:
        colorScheme === 'dark'
          ? 'text-primary-400 font-inter-medium'
          : 'text-primary-600 font-inter-medium',
    };

    return `${sizeClasses[size]} ${variantClasses[variant]}`;
  };

  const ButtonContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          size='small'
          color={variant === 'primary' ? 'white' : colorScheme === 'dark' ? '#60a5fa' : '#2563eb'}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text className={`${getTextClasses()} ${icon ? 'ml-2' : ''}`} style={textStyle}>
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (gradient && variant === 'primary') {
    return (
      <AnimatedTouchableOpacity
        style={[animatedStyle, style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={colorScheme === 'dark' ? ['#3b82f6', '#8b5cf6'] : ['#2563eb', '#7c3aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={`${getButtonClasses().replace('bg-primary-500', '').replace('bg-primary-600', '')}`}
        >
          <ButtonContent />
        </LinearGradient>
      </AnimatedTouchableOpacity>
    );
  }

  return (
    <AnimatedTouchableOpacity
      className={getButtonClasses()}
      style={[animatedStyle, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <ButtonContent />
    </AnimatedTouchableOpacity>
  );
};
