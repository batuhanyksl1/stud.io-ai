import { useTheme } from '@/hooks/useTheme';
import React, { ReactNode } from 'react';
import { SafeAreaView, ViewStyle } from 'react-native';

interface ThemedViewProps {
  children: ReactNode;
  style?: ViewStyle;
  backgroundColor?: 'background' | 'surface' | 'surfaceElevated' | 'primary' | 'transparent';
  padding?: keyof typeof import('@/constants/DesignTokens').Spacing;
  margin?: keyof typeof import('@/constants/DesignTokens').Spacing;
}

/**
 * ThemedView Component
 *
 * A themed container that automatically applies the correct colors
 * based on the current theme (light/dark).
 */
export default function ThemedView({
  children,
  style,
  backgroundColor = 'background',
  padding,
  margin,
}: ThemedViewProps) {
  const { colors } = useTheme();
  const { Spacing } = require('@/constants/DesignTokens');

  const viewStyle: ViewStyle[] = [
    {
      backgroundColor: backgroundColor === 'transparent' ? 'transparent' : colors[backgroundColor],
    },
    margin && { margin: Spacing[margin] },
    padding && { padding: Spacing[padding] },
    style,
  ].filter(Boolean) as ViewStyle[];

  return <SafeAreaView style={viewStyle}>{children}</SafeAreaView>;
}
