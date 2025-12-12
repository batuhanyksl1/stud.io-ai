import React, { useEffect } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface FloatingParticleProps {
  delay: number;
  size: number;
  color: string;
  startX: number;
}

export const FloatingParticle: React.FC<FloatingParticleProps> = ({
  delay,
  size,
  color,
  startX,
}) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(0, { duration: 1000 }),
        ),
        -1,
        false,
      ),
    );

    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-150, { duration: 2000, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      ),
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000 }),
          withTiming(0.5, { duration: 1000 }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const dynamicStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    left: startX,
    bottom: 0,
  };

  return (
    <Animated.View style={[styles.particle, animatedStyle, dynamicStyle]} />
  );
};

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
  },
});

