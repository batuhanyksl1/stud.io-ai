import { DeviceDimensions } from "@/hooks/useDeviceDimensions";

/**
 * Responsive font size utility
 * Cihaz boyutuna göre font boyutlarını hesaplar
 */
export const getResponsiveFontSize = (
  baseSize: number,
  deviceDimensions: DeviceDimensions,
): number => {
  const { isSmallDevice, isMediumDevice, isLargeDevice, isTablet } =
    deviceDimensions;

  if (isSmallDevice) {
    return Math.round(baseSize * 0.85); // Küçük cihazlarda %15 küçült
  }

  if (isMediumDevice) {
    return Math.round(baseSize * 0.95); // Orta cihazlarda %5 küçült
  }

  if (isLargeDevice) {
    return baseSize; // Büyük cihazlarda orijinal boyut
  }

  if (isTablet) {
    return Math.round(baseSize * 1.2); // Tabletlerde %20 büyüt
  }

  return baseSize;
};

/**
 * Responsive line height utility
 * Font boyutuna göre line height hesaplar
 */
export const getResponsiveLineHeight = (
  fontSize: number,
  lineHeightMultiplier: number = 1.5,
): number => {
  return Math.round(fontSize * lineHeightMultiplier);
};

/**
 * Responsive typography scale
 * Cihaz boyutuna göre tüm typography boyutlarını hesaplar
 */
export const getResponsiveTypography = (deviceDimensions: DeviceDimensions) => {
  const baseFontSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    xxxxl: 32,
    xxxxxl: 36,
    xxxxxxl: 48,
  };

  const responsiveFontSizes = Object.entries(baseFontSizes).reduce(
    (acc, [key, value]) => {
      acc[key as keyof typeof baseFontSizes] = getResponsiveFontSize(
        value,
        deviceDimensions,
      );
      return acc;
    },
    {} as typeof baseFontSizes,
  );

  return {
    fontSize: responsiveFontSizes,
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tight: -0.025,
      normal: 0,
      wide: 0.025,
    },
  };
};
