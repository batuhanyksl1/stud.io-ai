export type AndroidTabBarStyles = {
  height: number;
  paddingBottom: number;
  paddingTop: number;
  fontSize: number;
  marginTop: number;
};

export const getAndroidTabBarStyles = (
  isTablet: boolean,
  isSmallDevice: boolean,
): AndroidTabBarStyles => {
  return {
    height: isTablet ? 75 : isSmallDevice ? 50 : 65,
    paddingBottom: isTablet ? 20 : isSmallDevice ? 8 : 10,
    paddingTop: isTablet ? 8 : isSmallDevice ? 0 : 5,
    fontSize: isTablet ? 14 : isSmallDevice ? 9 : 12,
    marginTop: isTablet ? 2 : isSmallDevice ? 0 : 1,
  };
};
