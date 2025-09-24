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
import { Platform, ScrollView, StyleSheet, View } from "react-native";
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
          <View style={{ height: 16 }} />
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
    // Platform spesifik margin - iOS'te gerekli, Android'de sorun yaratıyor
    marginHorizontal: Platform.OS === "ios" ? 8 : -4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
