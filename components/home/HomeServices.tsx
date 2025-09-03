import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { editingServices } from "@/components/data";
import Ionicon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const HomeServices: React.FC = () => {
  const router = useRouter();

  const handleServicePress = (serviceId: string) => {
    router.push(`/(tabs)/[prompt]`);
  };

  const renderServiceCard = (service: (typeof editingServices)[0]) => {
    return (
      <TouchableOpacity
        key={service.id}
        onPress={() => handleServicePress(service.id)}
        activeOpacity={0.8}
        style={styles.serviceCardContainer}
      >
        <LinearGradient
          colors={service.gradient as [string, string, ...string[]]}
          style={styles.serviceGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.serviceCardContent}>
            <View style={styles.serviceHeader}>
              <View style={styles.serviceIconWrapper}>
                <Ionicon name={service.icon as any} size={28} color="#FFFFFF" />
              </View>
              {service.isPopular && (
                <View
                  style={[
                    styles.popularBadge,
                    { backgroundColor: "rgba(255,255,255,0.2)" },
                  ]}
                >
                  <Ionicon name="star" size={10} color="#FFD700" />
                  <ThemedText variant="caption" style={styles.popularText}>
                    {service.badge}
                  </ThemedText>
                </View>
              )}
            </View>

            <View style={styles.serviceContent}>
              <ThemedText variant="caption" style={styles.serviceSubtitle}>
                {service.subtitle}
              </ThemedText>
              <ThemedText
                variant="h4"
                weight="bold"
                style={styles.serviceTitle}
              >
                {service.title}
              </ThemedText>
              <ThemedText variant="caption" style={styles.serviceDescription}>
                {service.description}
              </ThemedText>
            </View>

            <View style={styles.serviceFooter}>
              <View style={styles.serviceStats}>
                <Ionicon name="star" size={12} color="#FFD700" />
                <ThemedText variant="caption" style={styles.rating}>
                  {service.rating}
                </ThemedText>
                <ThemedText variant="caption" style={styles.usageCount}>
                  • {service.usageCount}
                </ThemedText>
              </View>
              <Ionicon
                name="arrow-forward"
                size={16}
                color="rgba(255,255,255,0.8)"
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.servicesSection}>
      <View style={styles.sectionHeader}>
        <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>
          Tüm Servisler
        </ThemedText>
        <TouchableOpacity>
          <ThemedText variant="body" color="primary" weight="semiBold">
            Tümünü Gör
          </ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.servicesGrid}>
        {editingServices.map(renderServiceCard)}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  servicesSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  servicesGrid: {
    gap: 16,
  },
  serviceCardContainer: {
    marginBottom: 0,
  },
  serviceGradient: {
    borderRadius: 20,
    padding: 20,
    minHeight: 160,
  },
  serviceCardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  serviceIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  popularBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  popularText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  serviceContent: {
    marginTop: 16,
    marginBottom: 16,
  },
  serviceSubtitle: {
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
    fontSize: 12,
    fontWeight: "500",
  },
  serviceTitle: {
    color: "#FFFFFF",
    marginBottom: 8,
  },
  serviceDescription: {
    color: "rgba(255,255,255,0.9)",
    lineHeight: 18,
    fontSize: 13,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  usageCount: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
});
