import {
  Header,
  HomeCarousel,
  HomeServices,
  HomeStats,
  ThemedView,
} from "@/components";
import { useTheme } from "@/hooks";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
export default function HomeScreen() {
  const { colors, colorScheme } = useTheme();

  return (
    <ThemedView backgroundColor="background" style={styles.container}>
      <StatusBar style={colorScheme === "dark" ? "dark" : "light"} />
      <Header leftIconType="information" rightIconType="settings" />

      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <HomeCarousel />
          <HomeServices />
          <HomeStats />
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 34,
  },
});
