import { Animations } from "@/constants/DesignTokens";
import { useEffect, useState } from "react";
import { Animated } from "react-native";

/**
 * Ekran animasyonlarını yöneten hook
 * fadeAnim ve scaleAnim state'lerini ve animasyon başlatma mantığını sağlar
 */
export function useScreenAnimations(
  localImageUri: string | null,
  createdImageUrl: string | null,
) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: Animations.duration.normal,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 45,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();
  }, [localImageUri, createdImageUrl, fadeAnim, scaleAnim]);

  return { fadeAnim, scaleAnim };
}

