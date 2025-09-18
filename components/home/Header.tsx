import Logo from "@/components/Logo";
import { useTheme } from "@/hooks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RelativePathString, router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Platform } from "react-native";

type HeaderProps = {
  leftIconExists?: boolean;
  rightIconExists?: boolean;
  rightIconPath?: string;
  leftIconPath?: string;
  leftIconType?: LeftIconType;
  rightIconType?: RightIconType;
};

type LeftIconType = "home" | "back" | "information";
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

  switch (leftIconType) {
    case "back":
      leftIconPath = "/(tabs)";
      break;
    case "home":
      leftIconPath = "/(tabs)";
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

  return (
    <View style={styles.container}>
      {leftIconExists ? (
        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={leftIconExists ? () => routingPath(leftIconPath) : () => {}}
        >
          <Ionicons
            name={leftIconType as any}
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      ) : (
        <View />
      )}

      <Logo size="md" font="poppins" />

      {rightIconExists ? (
        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={
            rightIconExists ? () => routingPath(rightIconPath) : () => {}
          }
        >
          <Ionicons
            name={rightIconType as any}
            size={24}
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 0 : 60,
  },
  iconButton: {
    borderRadius: 100,
    borderWidth: 2,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
