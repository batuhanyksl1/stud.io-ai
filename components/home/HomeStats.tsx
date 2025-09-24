import ThemedCard from "@/components/ThemedCard";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { todayStats } from "@/components/data";
import { useTheme } from "@/hooks";
import Ionicon from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, View } from "react-native";

export const HomeStats: React.FC = () => {
  const { colors } = useTheme();

  const renderStatCard = (stat: (typeof todayStats)[0]) => {
    return (
      <ThemedCard
        key={stat.title}
        style={styles.statCard}
        padding="md"
        elevation="sm"
      >
        <View style={styles.statHeader}>
          <View
            style={[styles.statIcon, { backgroundColor: stat.color + "20" }]}
          >
            <Ionicon name={stat.icon as any} size={16} color={stat.color} />
          </View>
          <ThemedText variant="caption" color="secondary">
            {stat.title}
          </ThemedText>
        </View>
        <ThemedText variant="h3" weight="bold" style={styles.statValue}>
          {stat.value}
        </ThemedText>
        <ThemedText
          variant="caption"
          style={[styles.statChange, { color: "#10B981" }]}
        >
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
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 10,
    minHeight: 70,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  statIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    marginBottom: 2,
  },
  statChange: {
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitle: {
    marginBottom: 12,
  },
});
