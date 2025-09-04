import { useTheme } from "@/hooks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";

export default function TabLayout() {
  // Varsayılan değerler
  const defaultColors = {
    surface: "#ffffff",
    border: "#e0e0e0",
    primary: "#007AFF",
    textSecondary: "#8E8E93",
  };

  let colors = defaultColors;
  let colorScheme = "system";

  try {
    const theme = useTheme();
    colors = theme.colors || defaultColors;
    colorScheme = theme.colorScheme || "system";
  } catch (error) {
    console.warn("TabLayout: useTheme error, using defaults:", error);
  }

  // colorScheme undefined ise varsayılan değer kullan
  const safeColorScheme = colorScheme || "system";

  // colors undefined ise varsayılan değerler kullan
  const safeColors = colors || defaultColors;

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: safeColors.surface,
              borderTopColor: safeColors.border,
            },
          ],
          tabBarActiveTintColor: safeColors.primary,
          tabBarInactiveTintColor: safeColors.textSecondary,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Create",
            tabBarIcon: ({ size, color, focused }) =>
              focused ? (
                <Ionicons name="hammer" size={size} color={color} />
              ) : (
                <Ionicons name="hammer-outline" size={size} color={color} />
              ),
          }}
        />

        <Tabs.Screen
          name="sikko"
          options={{
            title: "Sikko", // Bu sayfa tab olarak görünmeyecek
            href: null,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
            title: "Settings",
            tabBarIcon: ({ size, color, focused }) =>
              focused ? (
                <Ionicons name="settings" size={size} color={color} />
              ) : (
                <Ionicons name="settings-outline" size={size} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ size, color, focused }) =>
              focused ? (
                <Ionicons name="person" size={size} color={color} />
              ) : (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    //height: Platform.OS === "ios" ? 90 : 70,
    paddingBottom: Platform.OS === "ios" ? 25 : 10,
    paddingTop: 10,
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
    fontFamily: "Inter-Medium",
    fontSize: 12,
  },
});
