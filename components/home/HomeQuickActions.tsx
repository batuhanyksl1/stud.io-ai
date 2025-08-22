import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { quickActions } from "@/components/data";
import Ionicon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

export const HomeQuickActions: React.FC = () => {
  const router = useRouter();

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "camera":
        router.push("/(tabs)/editor?mode=camera");
        break;
      case "gallery":
        router.push("/(tabs)/editor?mode=gallery");
        break;
      case "recent":
        // Recent işlemleri göster
        break;
      case "premium":
        router.push("/premium");
        break;
    }
  };

  const renderQuickAction = (action: (typeof quickActions)[0]) => {
    return (
      <TouchableOpacity
        key={action.id}
        onPress={() => handleQuickAction(action.id)}
        activeOpacity={0.8}
        style={styles.quickActionContainer}
      >
        <LinearGradient
          colors={action.gradient as [string, string]}
          style={styles.quickActionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicon name={action.icon as any} size={24} color="#FFFFFF" />
          <ThemedText
            variant="caption"
            weight="semiBold"
            style={styles.quickActionText}
          >
            {action.title}
          </ThemedText>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.quickActionsSection}>
      <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>
        Hızlı Başlat
      </ThemedText>
      <View style={styles.quickActionsGrid}>
        {quickActions.map(renderQuickAction)}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  quickActionsSection: {
    paddingHorizontal: 24,
    paddingTop: 3,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 0,
  },
  quickActionContainer: {
    width: (width - 44) / 2, // 24px padding * 2 + 12px gap * 2
  },
  quickActionGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 12,
    minHeight: 80,
    justifyContent: "center",
  },
  quickActionText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  sectionTitle: {
    marginBottom: 16,
  },
});
