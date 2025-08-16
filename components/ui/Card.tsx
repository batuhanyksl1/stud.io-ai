import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
  blur?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
  blur = false,
}) => {
  const { colorScheme } = useTheme();

  const getPaddingClasses = () => {
    const paddingMap = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    };
    return paddingMap[padding];
  };

  const getCardClasses = () => {
    const baseClasses = 'rounded-2xl';

    const variantClasses = {
      default:
        colorScheme === 'dark'
          ? 'bg-secondary-800 border border-secondary-700'
          : 'bg-white border border-secondary-200',
      elevated:
        colorScheme === 'dark'
          ? 'bg-secondary-800 shadow-lg shadow-black/20'
          : 'bg-white shadow-lg shadow-secondary-900/10',
      glass:
        colorScheme === 'dark'
          ? 'bg-secondary-800/80 border border-secondary-700/50'
          : 'bg-white/80 border border-secondary-200/50',
      gradient: '',
    };

    return `${baseClasses} ${variantClasses[variant]} ${getPaddingClasses()}`;
  };

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={
          colorScheme === 'dark'
            ? ['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.1)']
            : ['rgba(37, 99, 235, 0.05)', 'rgba(124, 58, 237, 0.05)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`rounded-2xl ${getPaddingClasses()}`}
        style={style}
      >
        {blur ? (
          <BlurView intensity={20} tint={colorScheme} className='rounded-2xl overflow-hidden'>
            {children}
          </BlurView>
        ) : (
          children
        )}
      </LinearGradient>
    );
  }

  if (blur && variant === 'glass') {
    return (
      <BlurView
        intensity={20}
        tint={colorScheme}
        className={`${getCardClasses()} overflow-hidden`}
        style={style}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View className={getCardClasses()} style={style}>
      {children}
    </View>
  );
};
