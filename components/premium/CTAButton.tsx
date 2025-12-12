import { BorderRadius, Typography } from "@/constants/DesignTokens";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Zap } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface CTAButtonProps {
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
  label?: string;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  onPress,
  loading,
  disabled,
  label = "Premium'a Geç",
}) => {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.5, { duration: 1500 }),
      ),
      -1,
      true,
    );
  }, [glowOpacity]);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: interpolate(glowOpacity.value, [0.5, 1], [1, 1.05]) }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(800).springify()}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
      >
        <View style={styles.ctaWrapper}>
          {/* Glow Effect */}
          <Animated.View style={[styles.ctaGlow, glowStyle]}>
            <LinearGradient
              colors={["rgba(124, 58, 237, 0.5)", "rgba(219, 39, 119, 0.5)"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>

          {/* Button */}
          <Animated.View style={buttonStyle}>
            <LinearGradient
              colors={
                disabled
                  ? ["#6B7280", "#4B5563"]
                  : ["#7c3aed", "#db2777", "#f59e0b"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Zap size={24} color="#FFF" fill="#FFF" />
                  <Text style={styles.ctaText}>{label}</Text>
                </>
              )}
            </LinearGradient>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ctaWrapper: {
    position: "relative",
    width: "100%",
  },
  ctaGlow: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    height: 60,
    borderRadius: BorderRadius.lg,
  },
  ctaText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
    color: "#FFF",
  },
});

