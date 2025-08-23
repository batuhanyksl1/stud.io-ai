import Logo from "@/components/Logo";
import ThemedText from "@/components/ThemedText";
import { useTheme } from "@/hooks";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const HomeHeader: React.FC = () => {
  return (
      <View style={{ alignItems: 'center' }}>
        <Logo size="md" font="poppins" />
      </View>
  );
};

