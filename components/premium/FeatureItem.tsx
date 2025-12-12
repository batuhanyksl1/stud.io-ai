import { BorderRadius, Typography } from "@/constants/DesignTokens";
import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export interface FeatureItemData {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: [string, string];
}

interface FeatureItemProps extends FeatureItemData {
  delay: number;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
  delay,
  gradient,
}) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(500).springify()}
      style={styles.featureItem}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featureIconContainer}
      >
        {icon}
      </LinearGradient>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
      <View style={styles.featureCheck}>
        <Check size={18} color="#10B981" strokeWidth={3} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 16,
    color: "#FFF",
  },
  featureDescription: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  featureCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
});

