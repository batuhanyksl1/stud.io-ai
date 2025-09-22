import { BorderRadius, Shadows, Spacing } from "@/constants/DesignTokens";
import { useTheme } from "@/hooks/useTheme";
import React, { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

interface ThemedCardProps {
  children: ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Spacing;
  elevation?: "none" | "sm" | "md" | "lg" | "xl";
  borderRadius?: keyof typeof BorderRadius;
}

/**
 * ThemedCard Component
 *
 * A card component that provides consistent elevation, padding,
 * and theming across the application.
 */
export default function ThemedCard({
  children,
  style,
  padding = "lg",
  elevation = "md",
  borderRadius = "lg",
}: ThemedCardProps) {
  const { colors } = useTheme();

  const cardStyle: ViewStyle[] = [
    {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius[borderRadius],
      padding: Spacing[padding],
      borderWidth: 1,
      borderColor: colors.borderSubtle,
    },
    ...(Shadows[elevation] ? [Shadows[elevation] as ViewStyle] : []),
    ...(style ? [style] : []),
  ];

  return <View style={cardStyle}>{children}</View>;
}
