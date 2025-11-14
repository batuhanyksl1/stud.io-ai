import {
  BorderRadius,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignTokens";
import { useDeviceDimensions, useTheme } from "@/hooks";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ErrorBannerProps {
  errorMessage: string | null;
}

/**
 * Hata mesajı gösterimi için banner component'i
 */
export const ErrorBanner: React.FC<ErrorBannerProps> = ({ errorMessage }) => {
  const { colors } = useTheme();
  const { isTablet, isSmallDevice } = useDeviceDimensions();

  if (!errorMessage) {
    return null;
  }

  return (
    <View
      style={[
        styles.errorBanner,
        {
          backgroundColor: colors.errorSubtle,
          borderColor: colors.error,
          marginHorizontal: isTablet ? 8 : isSmallDevice ? 4 : 6,
          padding: isTablet ? 20 : isSmallDevice ? 12 : 16,
        },
      ]}
    >
      <Text
        style={[
          styles.errorText,
          {
            color: colors.error,
            fontSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
          },
        ]}
      >
        {errorMessage}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorBanner: {
    position: "absolute",
    bottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Shadows.md,
  },
  errorText: {
    fontFamily: Typography.fontFamily.medium,
    textAlign: "center",
  },
});

