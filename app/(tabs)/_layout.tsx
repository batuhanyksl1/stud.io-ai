import { tabBarStyles } from "@/components/tabs";
import { tabConfigs } from "@/constants/tabs";
import { useDeviceDimensions, useTheme } from "@/hooks";
import { getAndroidTabBarStyles } from "@/utils/tabBarConfig";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const theme = useTheme();
  const { isTablet, isSmallDevice } = useDeviceDimensions();

  const colors = theme.colors;
  const isAndroid = Platform.OS === "android";

  const androidStyles = isAndroid
    ? getAndroidTabBarStyles(isTablet, isSmallDevice)
    : null;

  const screenOptions = {
    headerShown: false,
    animation: "none" as const,
    tabBarStyle: [
      tabBarStyles.tabBar,
      {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        ...(androidStyles && {
          height: androidStyles.height,
          paddingBottom: androidStyles.paddingBottom,
          paddingTop: androidStyles.paddingTop,
        }),
      },
    ],
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarLabelStyle: [
      tabBarStyles.tabLabel,
      ...(androidStyles
        ? [
            {
              fontSize: androidStyles.fontSize,
              marginTop: androidStyles.marginTop,
            },
          ]
        : []),
    ],
    tabBarIconStyle: androidStyles
      ? {
          marginTop: androidStyles.marginTop,
        }
      : undefined,
  };

  return (
    <Tabs screenOptions={screenOptions}>
      {tabConfigs.map((config) => (
        <Tabs.Screen
          key={config.name}
          name={config.name as any}
          options={{
            title: config.title,
            href: config.href as any,
            tabBarIcon: config.tabBarIcon,
          }}
        />
      ))}
    </Tabs>
  );
}
