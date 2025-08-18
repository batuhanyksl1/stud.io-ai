import { BorderRadius, ComponentTokens, Shadows, Spacing } from '@/constants/DesignTokens';
import { useTheme } from '@/hooks/useTheme';
import React, { ReactNode } from 'react';
import { ActivityIndicator, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import ThemedText from './ThemedText';

interface ThemedButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * ThemedButton Component
 *
 * A comprehensive button component with multiple variants, sizes,
 * and states that follows the design system tokens.
 */
export default function ThemedButton({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: ThemedButtonProps) {
  const { colors } = useTheme();

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? colors.interactiveDisabled : colors.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? colors.interactiveDisabled : colors.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? colors.interactiveDisabled : colors.border,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'destructive':
        return {
          backgroundColor: disabled ? colors.interactiveDisabled : colors.error,
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: colors.primary,
          borderWidth: 0,
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textTertiary;

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'destructive':
        return colors.textOnPrimary;
      case 'outline':
      case 'ghost':
        return colors.textPrimary;
      default:
        return colors.textOnPrimary;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    const sizeConfig = ComponentTokens.button;
    return {
      height: sizeConfig.height[size],
      paddingHorizontal: sizeConfig.padding[size].horizontal,
      paddingVertical: sizeConfig.padding[size].vertical,
    };
  };

  const buttonStyle: ViewStyle[] = [
    {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.md,
      opacity: disabled ? 0.6 : 1,
    },
    getVariantStyle(),
    getSizeStyle(),
    variant !== 'ghost' && Shadows.sm,
    style,
  ];

  const textColor = getTextColor();
  const fontSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';
  const fontWeight = variant === 'ghost' ? 'medium' : 'semiBold';

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size='small' color={textColor} />
      ) : (
        <>
          {icon &&
            iconPosition === 'left' &&
            React.cloneElement(icon as React.ReactElement, {
              style: { marginRight: Spacing.xs },
            })}

          <ThemedText
            variant={fontSize === 'sm' ? 'caption' : fontSize === 'lg' ? 'bodyLarge' : 'body'}
            weight={fontWeight}
            style={[{ color: textColor }, textStyle]}
          >
            {children}
          </ThemedText>

          {icon &&
            iconPosition === 'right' &&
            React.cloneElement(icon as React.ReactElement, {
              style: { marginLeft: Spacing.xs },
            })}
        </>
      )}
    </TouchableOpacity>
  );
}
