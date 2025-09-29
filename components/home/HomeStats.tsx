import ThemedCard from "@/components/ThemedCard";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { todayStats } from "@/components/data";
import { useDeviceDimensions, useTheme } from "@/hooks";
import Ionicon from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, View } from "react-native";

export const HomeStats: React.FC = () => {
  const { colors } = useTheme();
  const { isTablet, isSmallDevice } = useDeviceDimensions();

  // Responsive font boyutları
  const statValueFontSize = isTablet ? 24 : isSmallDevice ? 18 : 20;
  const statTitleFontSize = isTablet ? 12 : isSmallDevice ? 10 : 11;
  const statChangeFontSize = isTablet ? 14 : isSmallDevice ? 10 : 12;

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
          <ThemedText
            variant="caption"
            color="secondary"
            style={{ fontSize: statTitleFontSize }}
          >
            {stat.title}
          </ThemedText>
        </View>
        <ThemedText
          variant="h3"
          weight="bold"
          style={[styles.statValue, { fontSize: statValueFontSize }]}
        >
          {stat.value}
        </ThemedText>
        <ThemedText
          variant="caption"
          style={[
            styles.statChange,
            { color: "#10B981", fontSize: statChangeFontSize },
          ]}
        >
          {stat.change}
        </ThemedText>
      </ThemedCard>
    );
  };

  return (
    <ThemedView
      style={[
        styles.todayStatsSection,
        { paddingHorizontal: isTablet ? 8 : isSmallDevice ? 4 : 6 },
      ]}
    >
      <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>
        Bugün
      </ThemedText>
      <View style={[styles.statsGrid, { gap: isTablet ? 12 : 8 }]}>
        {todayStats.map(renderStatCard)}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  todayStatsSection: {
    paddingTop: 16,
  },
  statsGrid: {
    flexDirection: "row",
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
