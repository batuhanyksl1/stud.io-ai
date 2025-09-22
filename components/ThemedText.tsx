import { Typography } from "@/constants/DesignTokens";
import { useTheme } from "@/hooks/useTheme";
import React, { ReactNode } from "react";
import { Text, TextStyle } from "react-native";

interface ThemedTextProps {
  children: ReactNode;
  style?: TextStyle;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body"
    | "bodyLarge"
    | "caption"
    | "overline";
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "inverse"
    | "onPrimary"
    | "success"
    | "warning"
    | "error";
  weight?: "regular" | "medium" | "semiBold" | "bold";
  align?: "left" | "center" | "right";
  fontFamily?: string;
}

/**
 * ThemedText Component
 *
 * A text component that applies consistent typography and theming
 * across the application with predefined variants.
 */
export default function ThemedText({
  children,
  style,
  variant = "body",
  color = "primary",
  weight = "regular",
  align = "left",
  fontFamily,
}: ThemedTextProps) {
  const { colors } = useTheme();

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case "h1":
        return {
          fontSize: Typography.fontSize.xxxxxxl,
          lineHeight: Typography.fontSize.xxxxxxl * Typography.lineHeight.tight,
          fontFamily: Typography.fontFamily.bold,
        };
      case "h2":
        return {
          fontSize: Typography.fontSize.xxxxxl,
          lineHeight: Typography.fontSize.xxxxxl * Typography.lineHeight.tight,
          fontFamily: Typography.fontFamily.bold,
        };
      case "h3":
        return {
          fontSize: Typography.fontSize.xxxxl,
          lineHeight: Typography.fontSize.xxxxl * Typography.lineHeight.tight,
          fontFamily: Typography.fontFamily.semiBold,
          marginTop: 16,
        };
      case "h4":
        return {
          fontSize: Typography.fontSize.xxxl,
          lineHeight: Typography.fontSize.xxxl * Typography.lineHeight.tight,
          fontFamily: Typography.fontFamily.semiBold,
        };
      case "bodyLarge":
        return {
          fontSize: Typography.fontSize.lg,
          lineHeight: Typography.fontSize.lg * Typography.lineHeight.normal,
          fontFamily: Typography.fontFamily.primary,
        };
      case "body":
        return {
          fontSize: Typography.fontSize.md,
          lineHeight: Typography.fontSize.md * Typography.lineHeight.normal,
          fontFamily: Typography.fontFamily.primary,
        };
      case "caption":
        return {
          fontSize: Typography.fontSize.sm,
          lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
          fontFamily: Typography.fontFamily.primary,
        };
      case "overline":
        return {
          fontSize: Typography.fontSize.xs,
          lineHeight: Typography.fontSize.xs * Typography.lineHeight.normal,
          fontFamily: Typography.fontFamily.medium,
          letterSpacing: Typography.letterSpacing.wide,
          textTransform: "uppercase",
        };
      default:
        return {
          fontSize: Typography.fontSize.md,
          lineHeight: Typography.fontSize.md * Typography.lineHeight.normal,
          fontFamily: Typography.fontFamily.primary,
        };
    }
  };

  const getColorValue = () => {
    switch (color) {
      case "primary":
        return colors.textPrimary;
      case "secondary":
        return colors.textSecondary;
      case "tertiary":
        return colors.textTertiary;
      case "inverse":
        return colors.textInverse;
      case "onPrimary":
        return colors.textOnPrimary;
      case "success":
        return colors.success;
      case "warning":
        return colors.warning;
      case "error":
        return colors.error;
      default:
        return colors.textPrimary;
    }
  };

  const getWeightStyle = (): TextStyle => {
    switch (weight) {
      case "medium":
        return { fontFamily: Typography.fontFamily.medium };
      case "semiBold":
        return { fontFamily: Typography.fontFamily.semiBold };
      case "bold":
        return { fontFamily: Typography.fontFamily.bold };
      default:
        return { fontFamily: Typography.fontFamily.primary };
    }
  };

  const textStyle: TextStyle[] = [
    getVariantStyle(),
    getWeightStyle(),
    {
      color: getColorValue(),
      textAlign: align,
      ...(fontFamily && { fontFamily }),
    },
    ...(style ? [style] : []),
  ];

  return <Text style={textStyle}>{children}</Text>;
}
