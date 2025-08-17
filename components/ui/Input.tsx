import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { BorderRadius, SemanticColors, Spacing, Typography } from '../../constants/DesignTokens';
import { useTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  variant = 'outline',
  size = 'md',
  secureTextEntry,
  ...props
}) => {
  const { colorScheme } = useTheme();
  const colors = SemanticColors[colorScheme];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getInputStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.md,
      fontFamily: Typography.fontFamily.primary,
      height: size === 'sm' ? 40 : size === 'md' ? 48 : 56,
      paddingHorizontal: size === 'sm' ? Spacing.sm : size === 'md' ? Spacing.md : Spacing.lg,
      fontSize:
        size === 'sm'
          ? Typography.fontSize.sm
          : size === 'md'
            ? Typography.fontSize.md
            : Typography.fontSize.lg,
    };

    const variantStyles: Record<string, ViewStyle> = {
      default: {
        backgroundColor: colorScheme === 'dark' ? colors.surfaceElevated : colors.secondarySubtle,
        color: colors.textPrimary,
      },
      filled: {
        backgroundColor: colorScheme === 'dark' ? colors.surface : colors.secondarySubtle,
        color: colors.textPrimary,
      },
      outline: {
        backgroundColor: colorScheme === 'dark' ? colors.surface : colors.surface,
        borderWidth: 2,
        borderColor: error ? colors.error : isFocused ? colors.borderFocus : colors.border,
        color: colors.textPrimary,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  const getLabelStyle = (): TextStyle => ({
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.sm,
    color: colors.textSecondary,
  });

  const getErrorStyle = (): TextStyle => ({
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.primary,
    marginTop: Spacing.xs,
    color: colors.error,
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={{ width: '100%' }}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}

      <View style={{ position: 'relative' }}>
        {leftIcon && (
          <View
            style={{
              position: 'absolute',
              left: Spacing.sm,
              top: '50%',
              transform: [{ translateY: -10 }],
              zIndex: 10,
            }}
          >
            {leftIcon}
          </View>
        )}

        <TextInput
          style={[
            getInputStyle(),
            leftIcon && { paddingLeft: 48 },
            (rightIcon || secureTextEntry) && { paddingRight: 48 },
          ]}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: Spacing.sm,
              top: '50%',
              transform: [{ translateY: -10 }],
            }}
            onPress={secureTextEntry ? togglePasswordVisibility : undefined}
          >
            {secureTextEntry ? (
              isPasswordVisible ? (
                <EyeOff size={20} color={colors.textTertiary} />
              ) : (
                <Eye size={20} color={colors.textTertiary} />
              )
            ) : (
              rightIcon
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={getErrorStyle()}>{error}</Text>}
    </View>
  );
};
