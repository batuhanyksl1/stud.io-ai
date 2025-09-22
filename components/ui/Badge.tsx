import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import {
  BorderRadius,
  SemanticColors,
  Spacing,
  Typography,
} from "../../constants/DesignTokens";
import { useTheme } from "../../hooks/useTheme";

export interface BadgeProps {
  /**
   * Badge içeriği
   */
  children: React.ReactNode;

  /**
   * Badge boyutu
   */
  size?: "sm" | "md" | "lg";

  /**
   * Badge varyantı
   */
  variant?:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "coming-soon";

  /**
   * Özel stil
   */
  style?: ViewStyle;

  /**
   * Metin stili
   */
  textStyle?: TextStyle;

  /**
   * Yuvarlak köşeler
   */
  rounded?: boolean;

  /**
   * Şeffaflık
   */
  transparent?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  size = "md",
  variant = "default",
  style,
  textStyle,
  rounded = true,
  transparent = false,
}) => {
  const { isDark } = useTheme();
  const colors = SemanticColors[isDark ? "dark" : "light"];

  const getBadgeStyles = () => {
    const baseStyle: ViewStyle = {
      paddingHorizontal:
        size === "sm" ? Spacing.sm : size === "lg" ? Spacing.lg : Spacing.md,
      paddingVertical:
        size === "sm" ? Spacing.xs : size === "lg" ? Spacing.sm : Spacing.xs,
      borderRadius: rounded ? BorderRadius.full : BorderRadius.sm,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-start",
    };

    // Varyant renkleri
    const variantStyles: Record<string, ViewStyle> = {
      default: {
        backgroundColor: transparent ? "transparent" : colors.secondarySubtle,
        borderWidth: transparent ? 1 : 0,
        borderColor: colors.border,
      },
      success: {
        backgroundColor: transparent ? "transparent" : colors.successSubtle,
        borderWidth: transparent ? 1 : 0,
        borderColor: colors.success,
      },
      warning: {
        backgroundColor: transparent ? "transparent" : colors.warningSubtle,
        borderWidth: transparent ? 1 : 0,
        borderColor: colors.warning,
      },
      error: {
        backgroundColor: transparent ? "transparent" : colors.errorSubtle,
        borderWidth: transparent ? 1 : 0,
        borderColor: colors.error,
      },
      info: {
        backgroundColor: transparent ? "transparent" : colors.primarySubtle,
        borderWidth: transparent ? 1 : 0,
        borderColor: colors.primary,
      },
      "coming-soon": {
        backgroundColor: transparent ? "transparent" : colors.primary,
        borderWidth: transparent ? 1 : 0,
        borderColor: colors.warning,

        // Özel animasyon için gradient efekti simülasyonu
      },
    };

    return [baseStyle, variantStyles[variant], style];
  };

  const getTextStyles = () => {
    const baseTextStyle: TextStyle = {
      fontFamily: Typography.fontFamily.medium,
      fontSize:
        size === "sm"
          ? Typography.fontSize.xs
          : size === "lg"
            ? Typography.fontSize.sm
            : Typography.fontSize.xs,
      lineHeight: size === "sm" ? 16 : size === "lg" ? 20 : 16,
      textAlign: "center",
    };

    // Varyant metin renkleri
    const variantTextStyles: Record<string, TextStyle> = {
      default: {
        color: transparent ? colors.textSecondary : colors.textPrimary,
      },
      success: {
        color: transparent ? colors.success : colors.textPrimary,
      },
      warning: {
        color: transparent ? colors.warning : colors.textPrimary,
      },
      error: {
        color: transparent ? colors.error : colors.textPrimary,
      },
      info: {
        color: transparent ? colors.primary : colors.textPrimary,
      },
      "coming-soon": {
        color: "white",
        fontWeight: "600",
      },
    };

    return [baseTextStyle, variantTextStyles[variant], textStyle];
  };

  return (
    <View style={getBadgeStyles()}>
      <Text style={getTextStyles()}>{children}</Text>
    </View>
  );
};

// Özel "Yakında" badge komponenti
export const ComingSoonBadge: React.FC<
  Omit<BadgeProps, "variant" | "children">
> = (props) => {
  return (
    <Badge variant="coming-soon" {...props}>
      Yakında
    </Badge>
  );
};

export default Badge;
