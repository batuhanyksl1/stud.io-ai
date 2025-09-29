import { Typography } from "@/constants/DesignTokens";
import { useDeviceDimensions, useTheme } from "@/hooks";
import { getResponsiveFontSize, getResponsiveLineHeight } from "@/utils";
import React, { ReactNode } from "react";
import { StyleProp, Text, TextStyle } from "react-native";

interface ThemedTextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
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
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
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
  numberOfLines,
  ellipsizeMode,
}: ThemedTextProps) {
  const { colors } = useTheme();
  const deviceDimensions = useDeviceDimensions();

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case "h1": {
        const fontSize = getResponsiveFontSize(
          Typography.fontSize.xxxxxxl,
          deviceDimensions,
        );
        return {
          fontSize,
          lineHeight: getResponsiveLineHeight(
            fontSize,
            Typography.lineHeight.tight,
          ),
          fontFamily: Typography.fontFamily.bold,
        };
      }
      case "h2": {
        const fontSize = getResponsiveFontSize(
          Typography.fontSize.xxxxxl,
          deviceDimensions,
        );
        return {
          fontSize,
          lineHeight: getResponsiveLineHeight(
            fontSize,
            Typography.lineHeight.tight,
          ),
          fontFamily: Typography.fontFamily.bold,
        };
      }
      case "h3": {
        const fontSize = getResponsiveFontSize(
          Typography.fontSize.xxxxl,
          deviceDimensions,
        );
        return {
          fontSize,
          lineHeight: getResponsiveLineHeight(
            fontSize,
            Typography.lineHeight.tight,
          ),
          fontFamily: Typography.fontFamily.semiBold,
          marginTop: 16,
        };
      }
      case "h4": {
        const fontSize = getResponsiveFontSize(
          Typography.fontSize.xxxl,
          deviceDimensions,
        );
        return {
          fontSize,
          lineHeight: getResponsiveLineHeight(
            fontSize,
            Typography.lineHeight.tight,
          ),
          fontFamily: Typography.fontFamily.semiBold,
        };
      }
      case "bodyLarge": {
        const fontSize = getResponsiveFontSize(
          Typography.fontSize.lg,
          deviceDimensions,
        );
        return {
          fontSize,
          lineHeight: getResponsiveLineHeight(
            fontSize,
            Typography.lineHeight.normal,
          ),
          fontFamily: Typography.fontFamily.primary,
        };
      }
      case "body": {
        const fontSize = getResponsiveFontSize(
          Typography.fontSize.md,
          deviceDimensions,
        );
        return {
          fontSize,
          lineHeight: getResponsiveLineHeight(
            fontSize,
            Typography.lineHeight.normal,
          ),
          fontFamily: Typography.fontFamily.primary,
        };
      }
      case "caption": {
        const fontSize = getResponsiveFontSize(
          Typography.fontSize.sm,
          deviceDimensions,
        );
        return {
          fontSize,
          lineHeight: getResponsiveLineHeight(
            fontSize,
            Typography.lineHeight.normal,
          ),
          fontFamily: Typography.fontFamily.primary,
        };
      }
      case "overline": {
        const fontSize = getResponsiveFontSize(
          Typography.fontSize.xs,
          deviceDimensions,
        );
        return {
          fontSize,
          lineHeight: getResponsiveLineHeight(
            fontSize,
            Typography.lineHeight.normal,
          ),
          fontFamily: Typography.fontFamily.medium,
          letterSpacing: Typography.letterSpacing.wide,
          textTransform: "uppercase",
        };
      }
      default: {
        const fontSize = getResponsiveFontSize(
          Typography.fontSize.md,
          deviceDimensions,
        );
        return {
          fontSize,
          lineHeight: getResponsiveLineHeight(
            fontSize,
            Typography.lineHeight.normal,
          ),
          fontFamily: Typography.fontFamily.primary,
        };
      }
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

  const textStyle: StyleProp<TextStyle> = [
    getVariantStyle(),
    getWeightStyle(),
    {
      color: getColorValue(),
      textAlign: align,
      ...(fontFamily && { fontFamily }),
    },
    style,
  ];

  return (
    <Text
      style={textStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </Text>
  );
}
