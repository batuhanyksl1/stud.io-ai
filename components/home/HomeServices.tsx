import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { editingServices } from "@/components/data";
import Ionicon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

export const HomeServices: React.FC = () => {
  const router = useRouter();

  const handleServicePress = (
    servicePrompt: string,
    aiToolRequest: string,
    aiToolStatus: string,
    aiToolResult: string,
  ) => {
    router.push({
      pathname: "/(tabs)/creationPage",
      params: {
        servicePrompt: servicePrompt,
        aiToolRequest: aiToolRequest,
        aiToolStatus: aiToolStatus,
        aiToolResult: aiToolResult,
      },
    });
    console.log(aiToolRequest, aiToolStatus, aiToolResult);
  };

  const renderServiceCard = (service: (typeof editingServices)[0]) => {
    return (
      <TouchableOpacity
        key={service.id}
        onPress={() =>
          handleServicePress(
            service.prompt,
            service.aiToolRequest as string,
            service.aiToolStatus as string,
            service.aiToolResult as string,
          )
        }
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
                <Ionicon name={service.icon as any} size={20} color="#FFFFFF" />
              </View>
              {service.isPopular && (
                <View
                  style={[
                    styles.popularBadge,
                    { backgroundColor: "rgba(255,255,255,0.2)" },
                  ]}
                >
                  <Ionicon name="star" size={8} color="#FFD700" />
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
                <Ionicon name="star" size={10} color="#FFD700" />
                <ThemedText variant="caption" style={styles.rating}>
                  {service.rating}
                </ThemedText>
                <ThemedText variant="caption" style={styles.usageCount}>
                  • {service.usageCount}
                </ThemedText>
              </View>
              <Ionicon
                name="arrow-forward"
                size={14}
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
        <ThemedText variant="h3" weight="bold">
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
    paddingTop: Platform.OS === "ios" ? 10 : 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  // sectionTitle: {
  //   marginBottom: 16,
  // },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  serviceCardContainer: {
    width: "48%",
    marginBottom: 0,
  },
  serviceGradient: {
    borderRadius: 16,
    padding: 12,
    minHeight: 100,
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
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  popularBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  popularText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  serviceContent: {
    marginTop: 8,
    marginBottom: 8,
  },
  serviceSubtitle: {
    color: "rgba(255,255,255,0.8)",
    marginBottom: 2,
    fontSize: 12,
    fontWeight: "500",
  },
  serviceTitle: {
    color: "#FFFFFF",
    marginBottom: 4,
    fontSize: 16,
  },
  serviceDescription: {
    color: "rgba(255,255,255,0.9)",
    lineHeight: 16,
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
