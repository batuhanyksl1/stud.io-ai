import { BorderRadius, Typography } from "@/constants/DesignTokens";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PurchasesPackage } from "react-native-purchases";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface PricingCardProps {
  pack: PurchasesPackage;
  isSelected: boolean;
  isPopular: boolean;
  isBestValue: boolean;
  monthlyPrice?: number;
  onSelect: () => void;
  delay: number;
}

const formatPeriod = (period?: string | null): string => {
  if (!period) return "";
  switch (period) {
    case "P1W":
      return "hafta";
    case "P1M":
      return "ay";
    case "P3M":
      return "3 ay";
    case "P6M":
      return "6 ay";
    case "P1Y":
      return "yıl";
    default:
      return "";
  }
};

export const PricingCard: React.FC<PricingCardProps> = ({
  pack,
  isSelected,
  isPopular,
  isBestValue,
  onSelect,
  delay,
}) => {
  const scale = useSharedValue(1);
  const borderGlow = useSharedValue(0);

  useEffect(() => {
    if (isSelected) {
      borderGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.5, { duration: 1000 }),
        ),
        -1,
        true,
      );
    }
  }, [borderGlow, isSelected]);

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: borderGlow.value,
  }));

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onSelect();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={cardStyle}>
          {/* Badge */}
          {(isPopular || isBestValue) && (
            <View style={styles.popularBadge}>
              <LinearGradient
                colors={
                  isBestValue ? ["#10B981", "#059669"] : ["#ef4444", "#dc2626"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.popularGradient}
              >
                <Text style={styles.popularText}>
                  {isBestValue ? "💎 En Avantajlı" : "🔥 En Popüler"}
                </Text>
              </LinearGradient>
            </View>
          )}

          {/* Card */}
          <View
            style={[
              styles.pricingCard,
              isSelected && styles.pricingCardSelected,
              isBestValue && styles.pricingCardBestValue,
            ]}
          >
            {/* Selection Glow */}
            {isSelected && (
              <Animated.View style={[styles.selectionGlow, glowStyle]}>
                <LinearGradient
                  colors={["rgba(124, 58, 237, 0.3)", "transparent"]}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            )}

            <View style={styles.pricingCardContent}>
              {/* Left: Info */}
              <View style={styles.pricingInfo}>
                {/* Title & Description */}
                <Text
                  style={[
                    styles.pricingName,
                    isSelected && styles.pricingNameSelected,
                  ]}
                >
                  {pack.product.title.replace(" (Stud.io AI)", "")}
                </Text>

                {/* Product Description (200 Görsel Üretme Şansı vb.) */}
                <Text
                  style={[
                    styles.pricingDescription,
                    isSelected && styles.pricingDescriptionSelected,
                  ]}
                >
                  {pack.product.description}
                </Text>

                {/* Price */}
                <View style={styles.priceRow}>
                  <Text
                    style={[
                      styles.pricingPrice,
                      isSelected && styles.pricingPriceSelected,
                    ]}
                  >
                    {pack.product.priceString}
                  </Text>
                  <Text
                    style={[
                      styles.pricingPeriod,
                      isSelected && styles.pricingPeriodSelected,
                    ]}
                  >
                    /{formatPeriod(pack.product.subscriptionPeriod)}
                  </Text>
                </View>
              </View>

              {/* Right: Selection indicator */}
              <View
                style={[
                  styles.selectionIndicator,
                  isSelected && styles.selectionIndicatorSelected,
                ]}
              >
                {isSelected && <Check size={20} color="#FFF" strokeWidth={3} />}
              </View>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  popularBadge: {
    position: "absolute",
    top: -12,
    right: 16,
    zIndex: 10,
  },
  popularGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  popularText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 12,
    color: "#FFF",
  },
  pricingCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  pricingCardSelected: {
    borderColor: "#7c3aed",
    backgroundColor: "rgba(124, 58, 237, 0.1)",
  },
  pricingCardBestValue: {
    borderColor: "rgba(16, 185, 129, 0.5)",
  },
  selectionGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BorderRadius.xl,
  },
  pricingCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  pricingInfo: {
    flex: 1,
  },
  pricingName: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
    color: "#FFF",
    marginBottom: 2,
  },
  pricingNameSelected: {
    color: "#FFF",
  },
  pricingDescription: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 12,
  },
  pricingDescriptionSelected: {
    color: "rgba(255,255,255,0.6)",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  pricingPrice: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 28,
    color: "#FFF",
  },
  pricingPriceSelected: {
    color: "#FFF",
  },
  pricingPeriod: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    marginLeft: 4,
  },
  pricingPeriodSelected: {
    color: "rgba(255,255,255,0.7)",
  },
  selectionIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  selectionIndicatorSelected: {
    borderColor: "#7c3aed",
    backgroundColor: "#7c3aed",
  },
});

