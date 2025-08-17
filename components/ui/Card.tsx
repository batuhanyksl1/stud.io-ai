import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { BorderRadius, SemanticColors, Shadows, Spacing } from '../../constants/DesignTokens';
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
  const colors = SemanticColors[colorScheme];

  const getPaddingStyle = (): ViewStyle => {
    const paddingMap = {
      none: { padding: 0 },
      sm: { padding: Spacing.sm },
      md: { padding: Spacing.md },
      lg: { padding: Spacing.lg },
      xl: { padding: Spacing.xl },
    };
    return paddingMap[padding];
  };

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.lg,
    };

    const variantStyles: Record<string, ViewStyle> = {
      default: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      },
      elevated: {
        backgroundColor: colors.surface,
        ...Shadows.lg,
      },
      glass: {
        backgroundColor:
          colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
        borderColor: colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)',
      },
      gradient: {},
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...getPaddingStyle(),
    };
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
        style={[
          {
            borderRadius: BorderRadius.lg,
            ...getPaddingStyle(),
          },
          style,
        ]}
      >
        {blur ? (
          <BlurView
            intensity={20}
            tint={colorScheme}
            style={{
              borderRadius: BorderRadius.lg,
              overflow: 'hidden',
            }}
          >
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
        style={[getCardStyle(), { overflow: 'hidden' }, style]}
      >
        {children}
      </BlurView>
    );
  }

  return <View style={[getCardStyle(), style]}>{children}</View>;
};
