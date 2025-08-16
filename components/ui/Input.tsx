import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getInputClasses = () => {
    const baseClasses = 'rounded-xl font-inter-regular';

    const sizeClasses = {
      sm: 'h-10 px-3 text-sm',
      md: 'h-12 px-4 text-base',
      lg: 'h-14 px-5 text-lg',
    };

    const variantClasses = {
      default:
        colorScheme === 'dark'
          ? 'bg-secondary-800 text-white'
          : 'bg-secondary-50 text-secondary-900',
      filled:
        colorScheme === 'dark'
          ? 'bg-secondary-700 text-white'
          : 'bg-secondary-100 text-secondary-900',
      outline:
        colorScheme === 'dark'
          ? `bg-secondary-800 border-2 text-white ${
              error ? 'border-error-500' : isFocused ? 'border-primary-500' : 'border-secondary-700'
            }`
          : `bg-white border-2 text-secondary-900 ${
              error ? 'border-error-500' : isFocused ? 'border-primary-600' : 'border-secondary-200'
            }`,
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
  };

  const getLabelClasses = () => {
    return `text-sm font-inter-medium mb-2 ${
      colorScheme === 'dark' ? 'text-secondary-300' : 'text-secondary-700'
    }`;
  };

  const getErrorClasses = () => {
    return `text-sm font-inter-regular mt-1 ${
      colorScheme === 'dark' ? 'text-error-400' : 'text-error-600'
    }`;
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View className='w-full'>
      {label && <Text className={getLabelClasses()}>{label}</Text>}

      <View className='relative'>
        {leftIcon && (
          <View className='absolute left-3 top-1/2 -translate-y-1/2 z-10'>{leftIcon}</View>
        )}

        <TextInput
          className={`${getInputClasses()} ${leftIcon ? 'pl-12' : ''} ${
            rightIcon || secureTextEntry ? 'pr-12' : ''
          }`}
          placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            className='absolute right-3 top-1/2 -translate-y-1/2'
            onPress={secureTextEntry ? togglePasswordVisibility : undefined}
          >
            {secureTextEntry ? (
              isPasswordVisible ? (
                <EyeOff size={20} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
              ) : (
                <Eye size={20} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
              )
            ) : (
              rightIcon
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text className={getErrorClasses()}>{error}</Text>}
    </View>
  );
};
