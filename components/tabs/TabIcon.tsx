import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

export type TabIconProps = {
  size: number;
  color: string;
  focused: boolean;
};

export const createTabIcon = (iconName: string, iconOutlineName: string) => {
  const TabIcon = ({ size, color, focused }: TabIconProps) => (
    <Ionicons
      name={(focused ? iconName : iconOutlineName) as any}
      size={size}
      color={color}
    />
  );
  TabIcon.displayName = `TabIcon(${iconName})`;
  return TabIcon;
};
