import { ThemedCard, ThemedText, ThemedView } from '@/components';
import { todayStats } from '@/components/data';
import { useTheme } from '@/hooks';
import Ionicon from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export const HomeStats: React.FC = () => {
  const { colors } = useTheme();

  const renderStatCard = (stat: (typeof todayStats)[0]) => {
    return (
      <ThemedCard key={stat.title} style={styles.statCard} padding="md" elevation="sm">
        <View style={styles.statHeader}>
          <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
            <Ionicon name={stat.icon as any} size={16} color={stat.color} />
          </View>
          <ThemedText variant="caption" color="secondary">
            {stat.title}
          </ThemedText>
        </View>
        <ThemedText variant="h3" weight="bold" style={styles.statValue}>
          {stat.value}
        </ThemedText>
        <ThemedText variant="caption" style={[styles.statChange, { color: '#10B981' }]}>
          {stat.change}
        </ThemedText>
      </ThemedCard>
    );
  };

  return (
    <ThemedView style={styles.todayStatsSection}>
      <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>
        Bugün
      </ThemedText>
      <View style={styles.statsGrid}>{todayStats.map(renderStatCard)}</View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  todayStatsSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    minHeight: 80,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    marginBottom: 16,
  },
});
