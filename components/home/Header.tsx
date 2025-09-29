import Logo from "@/components/Logo";
import { useDeviceDimensions, useTheme } from "@/hooks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RelativePathString, router } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Spacing } from "../../constants/DesignTokens";

type HeaderProps = {
  leftIconExists?: boolean;
  rightIconExists?: boolean;
  rightIconPath?: string;
  leftIconPath?: string;
  leftIconType?: LeftIconType;
  rightIconType?: RightIconType;
};

type LeftIconType = "home" | "arrow-back" | "information";
type RightIconType = "settings" | "home";

export const Header: React.FC<HeaderProps> = ({
  leftIconExists = true,
  rightIconExists = true,
  rightIconPath = "",
  leftIconPath = "",
  leftIconType = "information",
  rightIconType = "settings",
}) => {
  const { colors } = useTheme();
  const { isTablet, isSmallDevice } = useDeviceDimensions();

  switch (leftIconType) {
    case "arrow-back":
      leftIconPath = "/(tabs)";
      break;
    case "home":
      leftIconPath = "/(tabs)";
      break;
    case "information":
      leftIconPath =
        "https://batuhanyuksel.notion.site/Gizlilik-Politikas-27bb651f144e80f7b32ece22facf79fa";
      break;
  }
  switch (rightIconType) {
    case "settings":
      rightIconPath = "/(tabs)/settings";
      break;
    case "home":
      rightIconPath = "/(tabs)/index";
      break;
  }
  const routingPath = (p: string) => {
    router.push(p as RelativePathString);
  };

  // Responsive boyutlar
  const iconSize = isTablet ? 28 : isSmallDevice ? 20 : 24;
  const iconPadding = isTablet ? 12 : isSmallDevice ? 8 : 10;
  const horizontalPadding = isTablet ? 24 : isSmallDevice ? 12 : 16;

  return (
    <View style={[styles.container, { paddingHorizontal: horizontalPadding }]}>
      {leftIconExists ? (
        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              padding: iconPadding,
            },
          ]}
          onPress={leftIconExists ? () => routingPath(leftIconPath) : () => {}}
        >
          <Ionicons
            name={leftIconType as any}
            size={iconSize}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      ) : (
        <View />
      )}

      <Logo size={isTablet ? "lg" : "md"} font="poppins" />

      {rightIconExists ? (
        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              padding: iconPadding,
            },
          ]}
          onPress={
            rightIconExists ? () => routingPath(rightIconPath) : () => {}
          }
        >
          <Ionicons
            name={rightIconType as any}
            size={iconSize}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 0 : 30,
    paddingBottom: Spacing.lg,
  },
  iconButton: {
    borderRadius: 100,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
