import { useTheme } from "@/hooks";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  const { colors, colorScheme } = useTheme();

  return (

    <>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
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
          name="editor"
          options={{
            title: "Galeri",
            tabBarIcon: ({ size, color, focused }) =>
              focused ? (
                <Fontisto name="world" size={size} color={color} />
              ) : (
                <Fontisto name="world-o" size={size} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="service-detail"
          options={{
            href: null, // Bu sayfa tab olarak görünmeyecek
          }}
        />
        <Tabs.Screen
          name="sikko"
          options={{
            title: "Sikko", // Bu sayfa tab olarak görünmeyecek
          }}
   
        />
        <Tabs.Screen
          name="settings"
          options={{
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
    // borderTopWidth: 1,
    // height: Platform.OS === 'ios' ? 90 : 70,
    // paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    // paddingTop: 10,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: -2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 5,
  },
  tabLabel: {
    // fontFamily: 'Inter-Medium',
    // fontSize: 12,
  },
});
