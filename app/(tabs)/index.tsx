import {
  HomeCarousel,
  HomeHeader,
  HomeQuickActions,
  HomeRecentActivity,
  HomeServices,
  HomeStats,
  ThemedView,
} from '@/components';
import { useTheme } from '@/hooks';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <ThemedView backgroundColor="surface" style={styles.container}>
      <HomeHeader />

      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <HomeCarousel />
          <HomeQuickActions />
          <HomeStats />
          <HomeServices />
          <HomeRecentActivity />

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
