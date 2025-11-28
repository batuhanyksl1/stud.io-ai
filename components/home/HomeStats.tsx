import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { todayStats } from "@/components/data";
import { useDeviceDimensions, useTheme } from "@/hooks";
import Ionicon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";

export const HomeStats: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { isTablet, isSmallDevice } = useDeviceDimensions();

  // Animasyon değerleri
  const fadeAnims = useRef(todayStats.map(() => new Animated.Value(0))).current;
  const slideAnims = useRef(
    todayStats.map(() => new Animated.Value(20)),
  ).current;
  const countAnims = useRef(
    todayStats.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    // Sıralı giriş animasyonu
    const animations = todayStats.map((_, index) =>
      Animated.parallel([
        Animated.timing(fadeAnims[index], {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnims[index], {
          toValue: 0,
          friction: 8,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.stagger(100, animations).start();
  }, []);

  // Responsive değerler
  const statValueFontSize = isTablet ? 28 : isSmallDevice ? 20 : 24;
  const statTitleFontSize = isTablet ? 12 : isSmallDevice ? 10 : 11;
  const statChangeFontSize = isTablet ? 13 : isSmallDevice ? 10 : 11;
  const iconSize = isTablet ? 20 : isSmallDevice ? 16 : 18;
  const cardPadding = isTablet ? 16 : isSmallDevice ? 12 : 14;

  const renderStatCard = (stat: (typeof todayStats)[0], index: number) => {
    const isPositive = stat.change.startsWith("+");

    return (
      <Animated.View
        key={stat.title}
        style={[
          styles.statCardWrapper,
          {
            opacity: fadeAnims[index],
            transform: [{ translateY: slideAnims[index] }],
          },
        ]}
      >
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: isDark ? colors.surface : "#FFFFFF",
              borderColor: isDark ? colors.border : "rgba(0,0,0,0.06)",
              padding: cardPadding,
            },
          ]}
        >
          {/* Dekoratif gradient çizgi */}
          <LinearGradient
            colors={[stat.color, `${stat.color}50`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.topAccent}
          />

          {/* Icon ve başlık */}
          <View style={styles.statHeader}>
            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor: `${stat.color}15`,
                },
              ]}
            >
              <Ionicon
                name={stat.icon as any}
                size={iconSize}
                color={stat.color}
              />
            </View>
          </View>

          {/* Değer */}
          <View style={styles.statValueContainer}>
            <ThemedText
              variant="h2"
              weight="bold"
              style={[
                styles.statValue,
                {
                  fontSize: statValueFontSize,
                  color: isDark ? colors.textPrimary : "#1F2937",
                },
              ]}
            >
              {stat.value}
            </ThemedText>
          </View>

          {/* Başlık ve değişim */}
          <View style={styles.statFooter}>
            <ThemedText
              variant="caption"
              style={[
                styles.statTitle,
                {
                  fontSize: statTitleFontSize,
                  color: colors.textSecondary,
                },
              ]}
            >
              {stat.title}
            </ThemedText>
            <View
              style={[
                styles.changeBadge,
                {
                  backgroundColor: isPositive
                    ? "rgba(16, 185, 129, 0.12)"
                    : "rgba(239, 68, 68, 0.12)",
                },
              ]}
            >
              <Ionicon
                name={isPositive ? "trending-up" : "trending-down"}
                size={10}
                color={isPositive ? "#10B981" : "#EF4444"}
              />
              <ThemedText
                variant="caption"
                style={[
                  styles.statChange,
                  {
                    color: isPositive ? "#10B981" : "#EF4444",
                    fontSize: statChangeFontSize,
                  },
                ]}
              >
                {stat.change}
              </ThemedText>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <ThemedView
      style={[
        styles.todayStatsSection,
        { paddingHorizontal: isTablet ? 8 : isSmallDevice ? 4 : 6 },
      ]}
    >
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <View
            style={[
              styles.sectionIcon,
              {
                backgroundColor: isDark
                  ? "rgba(251, 146, 60, 0.2)"
                  : "rgba(251, 146, 60, 0.12)",
              },
            ]}
          >
            <Ionicon name="bar-chart" size={16} color="#FB923C" />
          </View>
          <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>
            İstatistikler
          </ThemedText>
        </View>
        <View
          style={[
            styles.liveBadge,
            {
              backgroundColor: isDark
                ? "rgba(16, 185, 129, 0.2)"
                : "rgba(16, 185, 129, 0.12)",
            },
          ]}
        >
          <View style={styles.liveIndicator} />
          <ThemedText
            variant="caption"
            weight="semiBold"
            style={{ color: "#10B981", fontSize: 11 }}
          >
            Canlı
          </ThemedText>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={[styles.statsGrid, { gap: isTablet ? 12 : 10 }]}>
        {todayStats.map((stat, index) => renderStatCard(stat, index))}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  todayStatsSection: {
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: 0,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  statsGrid: {
    flexDirection: "row",
  },
  statCardWrapper: {
    flex: 1,
  },
  statCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    minHeight: Platform.OS === "ios" ? 110 : 105,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statValueContainer: {
    marginBottom: 6,
  },
  statValue: {
    letterSpacing: -0.5,
  },
  statFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statTitle: {
    fontWeight: "500",
    flex: 1,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  statChange: {
    fontWeight: "700",
  },
});
