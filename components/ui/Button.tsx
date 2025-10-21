import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  BorderRadius,
  ComponentTokens,
  Spacing,
  Typography,
} from "../../constants/DesignTokens";
import { useTheme } from "../../hooks/useTheme";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
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
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  gradient = false,
}) => {
  const { colorScheme, colors } = useTheme();
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

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: BorderRadius.md,
      minHeight: ComponentTokens.button.height[size],
      paddingHorizontal: ComponentTokens.button.padding[size].horizontal,
      paddingVertical: ComponentTokens.button.padding[size].vertical,
      opacity: disabled ? 0.5 : 1,
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: colors.primary,
      },
      secondary: {
        backgroundColor:
          colorScheme === "dark"
            ? colors.surfaceElevated
            : colors.secondarySubtle,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: colors.primary,
      },
      ghost: {
        backgroundColor: "transparent",
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<string, TextStyle> = {
      sm: { fontSize: Typography.fontSize.sm },
      md: { fontSize: Typography.fontSize.md },
      lg: { fontSize: Typography.fontSize.lg },
    };

    const variantStyles: Record<string, TextStyle> = {
      primary: {
        color: colors.textOnPrimary,
        fontFamily: Typography.fontFamily.semiBold,
      },
      secondary: {
        color: colorScheme === "dark" ? colors.textPrimary : colors.textPrimary,
        fontFamily: Typography.fontFamily.semiBold,
      },
      outline: {
        color: colors.primary,
        fontFamily: Typography.fontFamily.semiBold,
      },
      ghost: {
        color: colors.primary,
        fontFamily: Typography.fontFamily.medium,
      },
    };

    return {
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const ButtonContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "white" : colors.primary}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              getTextStyle(),
              icon ? { marginLeft: Spacing.sm } : {},
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (gradient && variant === "primary") {
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
          colors={
            colorScheme === "dark"
              ? ["#3b82f6", "#8b5cf6"]
              : ["#2563eb", "#7c3aed"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={getButtonStyle()}
        >
          <ButtonContent />
        </LinearGradient>
      </AnimatedTouchableOpacity>
    );
  }

  return (
    <AnimatedTouchableOpacity
      style={[getButtonStyle(), animatedStyle, style]}
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
