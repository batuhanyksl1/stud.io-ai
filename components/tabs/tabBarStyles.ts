import { Typography } from "@/constants";
import { StyleSheet } from "react-native";

export const tabBarStyles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontWeight: "500",
  },
});
