import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import ThemedText from './ThemedText';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
  font?: 'default' | 'poppins' | 'montserrat' | 'bebas' | 'oswald';
}

export default function Logo({ size = 'md', variant = 'default', font = 'default' }: LogoProps) {
  const { colors } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          fontSize: 18,
        };
      case 'lg':
        return {
          fontSize: 32,
        };
      default: // md
        return {
          fontSize: 24,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getFontFamily = () => {
    switch (font) {
      case 'poppins':
        return 'Poppins-Bold';
      case 'montserrat':
        return 'Montserrat-Bold';
      case 'bebas':
        return 'BebasNeue-Regular';
      case 'oswald':
        return 'Oswald-Bold';
      default:
        return 'Inter-Bold';
    }
  };

  if (variant === 'minimal') {
    return (
      <ThemedText
        variant='h2'
        weight='bold'
        style={{
          ...styles.logoText,
          ...sizeStyles,
          fontFamily: getFontFamily(),
          textAlign: 'center',
        }}
      >
        Stud.io
      </ThemedText>
    );
  }

  return (
    <LinearGradient
      colors={['#3B82F6', '#8B5CF6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.gradientBackground, { height: sizeStyles.fontSize + 8 }]}
    >
      <ThemedText
        weight='bold'
        style={{
          ...styles.logoText,
          ...sizeStyles,
          ...styles.gradientText,
          fontFamily: getFontFamily(),
          textAlign: 'center',
          lineHeight: sizeStyles.fontSize + 8,
        }}
      >
        Stud.io
      </ThemedText>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  logoText: {
    fontWeight: 'bold',
  },
  gradientText: {
    color: '#FFFFFF',
  },
});
