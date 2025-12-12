import { LinearGradient } from "expo-linear-gradient";
import { Crown, Sparkles, Star } from "lucide-react-native";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export const AnimatedCrown: React.FC = () => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });

    rotation.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 }),
      ),
      -1,
      true,
    );
  }, [glowOpacity, rotation, scale]);

  const crownStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: interpolate(glowOpacity.value, [0.3, 1], [1, 1.3]) }],
  }));

  return (
    <View style={styles.crownWrapper}>
      {/* Glow Effect */}
      <Animated.View style={[styles.crownGlow, glowStyle]}>
        <LinearGradient
          colors={["rgba(251, 191, 36, 0.4)", "transparent"]}
          style={styles.crownGlowGradient}
        />
      </Animated.View>

      {/* Crown */}
      <Animated.View style={crownStyle}>
        <LinearGradient
          colors={["#fbbf24", "#f59e0b", "#d97706"]}
          style={styles.crownContainer}
        >
          <Crown size={52} color="white" strokeWidth={1.5} />
        </LinearGradient>
      </Animated.View>

      {/* Sparkles */}
      <Animated.View
        style={[styles.sparkle, styles.sparkle1]}
        entering={FadeIn.delay(500)}
      >
        <Sparkles size={16} color="#fbbf24" />
      </Animated.View>
      <Animated.View
        style={[styles.sparkle, styles.sparkle2]}
        entering={FadeIn.delay(700)}
      >
        <Star size={12} color="#fbbf24" fill="#fbbf24" />
      </Animated.View>
      <Animated.View
        style={[styles.sparkle, styles.sparkle3]}
        entering={FadeIn.delay(900)}
      >
        <Sparkles size={14} color="#f59e0b" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  crownWrapper: {
    position: "relative",
    marginBottom: 24,
  },
  crownGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    left: -30,
    top: -30,
    borderRadius: 80,
    overflow: "hidden",
  },
  crownGlowGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 80,
  },
  crownContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  sparkle: {
    position: "absolute",
  },
  sparkle1: {
    top: -5,
    right: -10,
  },
  sparkle2: {
    bottom: 10,
    left: -15,
  },
  sparkle3: {
    top: 20,
    right: -20,
  },
});

