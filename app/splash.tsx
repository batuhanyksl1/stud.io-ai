import { ThemedView } from "@/components";
import { useTheme } from "@/hooks";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const { colors, isDark } = useTheme();

  // Animation values
  const screenOpacity = useSharedValue(0);
  const sunRotation = useSharedValue(0);

  const navigateToLanding = () => {
    router.replace("/");
  };

  useEffect(() => {
    // Screen fade in
    screenOpacity.value = withTiming(1, { duration: 800 });

    // Sun rotation
    sunRotation.value = withDelay(
      500,
      withRepeat(withTiming(360, { duration: 3000 }), -1, false),
    );

    // Navigate after animations
    const timer = setTimeout(() => {
      runOnJS(navigateToLanding)();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sunRotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Animated.View style={[styles.screen, screenStyle]}>
        {/* Background Gradient */}
        {/* <LinearGradient
          colors={
            isDark
              ? ["#FF6B00", "#FF0000", "#CC0000", "#330000"]
              : ["#0077B5", "#0096D6", "#00B4D8", "#001F3F"]
          }
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        /> */}

        {/* Sun Icon */}
        <Animated.View style={[styles.sunContainer, sunStyle]}>
          <View style={styles.sun}>
            <View style={styles.sunCenter} />
            {[...Array(12)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.sunRay,
                  {
                    transform: [{ rotate: `${index * 30}deg` }],
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  sunContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  sun: {
    width: 120,
    height: 120,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  sunCenter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFD700",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  sunRay: {
    position: "absolute",
    width: 4,
    height: 30,
    backgroundColor: "#FFD700",
    borderRadius: 2,
    top: -15,
  },
});
