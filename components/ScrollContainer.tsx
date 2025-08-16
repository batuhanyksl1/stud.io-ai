import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ScrollContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  horizontal?: boolean;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  bounces?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
}

/**
 * ScrollContainer Component
 *
 * A reusable scroll container that ensures proper scroll behavior
 * across all screens with consistent styling and theme support.
 */
export default function ScrollContainer({
  children,
  style,
  contentContainerStyle,
  horizontal = false,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  bounces = true,
  keyboardShouldPersistTaps = 'handled',
}: ScrollContainerProps) {
  const { colors } = useTheme();

  const scrollViewStyle = [styles.scrollView, { backgroundColor: colors.background }, style];

  const contentStyle = [styles.contentContainer, contentContainerStyle];

  return (
    <ScrollView
      style={scrollViewStyle}
      contentContainerStyle={contentStyle}
      horizontal={horizontal}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      bounces={bounces}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      alwaysBounceVertical={!horizontal}
      alwaysBounceHorizontal={horizontal}
      scrollEventThrottle={16}
      decelerationRate='normal'
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Ensures content doesn't get cut off at bottom
  },
});
