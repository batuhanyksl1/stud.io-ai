import Logo from "@/components/Logo";
import { useTheme } from "@/hooks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export const HomeHeader: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: colors.surface,
          borderRadius: 100,
          borderWidth: 2,
          borderColor: colors.border,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
        onPress={() => router.push("/settings")}
      >
        <Ionicons name="information" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <Logo size="md" font="poppins" />
      <TouchableOpacity
        style={{
          backgroundColor: colors.surface,
          borderRadius: 100,
          borderWidth: 2,
          borderColor: colors.border,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
        onPress={() => router.push("/settings")}
      >
        <Ionicons
          name="settings-outline"
          size={24}
          color={colors.textPrimary}
        />
      </TouchableOpacity>
    </View>
  );
};
