import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

interface DeviceDimensions {
  width: number;
  height: number;
  isSmallDevice: boolean;
  isMediumDevice: boolean;
  isLargeDevice: boolean;
  isTablet: boolean;
  screenType: "phone" | "tablet";
}

export const useDeviceDimensions = (): DeviceDimensions => {
  const [dimensions, setDimensions] = useState<DeviceDimensions>(() => {
    const { width, height } = Dimensions.get("window");
    return calculateDimensions(width, height);
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(calculateDimensions(window.width, window.height));
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};

const calculateDimensions = (
  width: number,
  height: number,
): DeviceDimensions => {
  const isSmallDevice = width < 375; // iPhone SE, küçük telefonlar
  const isMediumDevice = width >= 375 && width < 414; // iPhone 12/13/14
  const isLargeDevice = width >= 414 && width < 768; // iPhone Plus, Pro Max
  const isTablet = width >= 768; // iPad ve tabletler

  return {
    width,
    height,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    isTablet,
    screenType: isTablet ? "tablet" : "phone",
  };
};
