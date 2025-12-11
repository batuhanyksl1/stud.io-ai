import { editingServices } from "@/components/data/homeData";
import { BorderRadius, Spacing, Typography } from "@/constants/DesignTokens";
import { useDeviceDimensions } from "@/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Stars,
  Wand2,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const ONBOARDING_KEY = "hasSeenOnboarding";

// Onboarding slides data
const onboardingSlides = [
  {
    id: "welcome",
    type: "intro",
    title: "Stud.io",
    subtitle: "AI-Powered Photo Studio",
    description:
      "Fotoğraflarınızı saniyeler içinde profesyonel düzeye taşıyın. Yapay zeka ile sınırsız düzenleme imkanı.",
    icon: Sparkles,
    gradient: ["#667eea", "#764ba2", "#f093fb"],
    particles: true,
  },
  {
    id: "profile-showcase",
    type: "showcase",
    title: "Profesyonel Profil",
    subtitle: "LinkedIn Ready",
    description: "Selfie'den profesyonel iş fotoğrafına. Tek dokunuşla.",
    serviceIndex: 0,
    gradient: ["#0A66C2", "#003952", "#001f33"],
    badge: "En Popüler",
  },
  {
    id: "enhancement-showcase",
    type: "showcase",
    title: "Akıllı İyileştirme",
    subtitle: "Smart Enhancement",
    description:
      "Bulanık, karanlık veya düşük kaliteli fotoğrafları canlandırın.",
    serviceIndex: 1,
    gradient: ["#FF8A08", "#E14C3F", "#8B0000"],
    badge: "Kaliteli",
  },
  {
    id: "acne-showcase",
    type: "showcase",
    title: "Kusursuz Cilt",
    subtitle: "Akne Temizleme",
    description: "Doğal görünümü koruyarak kusursuz bir cilde kavuşun.",
    serviceIndex: 2,
    gradient: ["#FF6B81", "#F53D5C", "#8B0000"],
    badge: "Favori",
  },
  {
    id: "cta",
    type: "cta",
    title: "Başlamaya\nHazır mısın?",
    subtitle: "Ücretsiz Dene",
    description: "Hemen başla, ilk düzenlemen bizden. Kredi kartı gerekmez.",
    icon: Zap,
    gradient: ["#00d2ff", "#3a7bd5", "#7c3aed"],
    features: [
      { icon: Wand2, text: "AI Destekli Düzenleme" },
      { icon: Stars, text: "Sınırsız Olasılık" },
      { icon: Sparkles, text: "Profesyonel Sonuçlar" },
    ],
  },
];

// Animated Particle Component
const Particle: React.FC<{ delay: number; size: number }> = ({
  delay,
  size,
}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const randomX = Math.random() * SCREEN_WIDTH;
    const randomEndX = randomX + (Math.random() - 0.5) * 100;

    translateX.value = randomX;
    translateY.value = SCREEN_HEIGHT + 50;

    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(0.8, { duration: 500 }),
        withTiming(0.8, { duration: 2000 }),
        withTiming(0, { duration: 500 }),
      ),
    );

    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(1.2, { duration: 1500 }),
        withTiming(0.5, { duration: 1000 }),
      ),
    );

    translateY.value = withDelay(
      delay,
      withTiming(-50, { duration: 3000, easing: Easing.out(Easing.quad) }),
    );

    translateX.value = withDelay(
      delay,
      withTiming(randomEndX, {
        duration: 3000,
        easing: Easing.inOut(Easing.sin),
      }),
    );
  }, [delay, opacity, scale, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    />
  );
};

// Floating Orb Component
const FloatingOrb: React.FC<{
  color: string;
  size: number;
  initialX: number;
  initialY: number;
  delay: number;
}> = ({ color, size, initialX, initialY, delay }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.3, { duration: 1000 }));

    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-20, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(20, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(15, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          withTiming(-15, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.8, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, [delay, opacity, scale, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          left: initialX,
          top: initialY,
        },
      ]}
    />
  );
};

// Before/After Slider Component - Optimized with Gesture Handler
const BeforeAfterSlider: React.FC<{
  beforeImage: any;
  afterImage: any;
  size: number;
}> = ({ beforeImage, afterImage, size }) => {
  // All state managed via shared values for native thread performance
  const sliderPosition = useSharedValue(0.5);
  const isDragging = useSharedValue(false);
  const pulseAnim = useSharedValue(1);
  const glowAnim = useSharedValue(0);

  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/040edaf9-f922-4df9-b5a3-a90cee06775d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "onboarding.tsx:BeforeAfterSlider:useEffect",
        message: "BeforeAfterSlider mounted successfully",
        data: { size },
        timestamp: Date.now(),
        sessionId: "debug-session",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion

    // Pulse animation - continuous with withRepeat instead of interval
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 800 }),
        withTiming(1, { duration: 800 }),
      ),
      -1,
      true,
    );

    // Glow animation
    glowAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0, { duration: 1500 }),
      ),
      -1,
      true,
    );
  }, [glowAnim, pulseAnim]);

  // Haptic feedback helpers (must be called from JS thread)
  const triggerLightHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const triggerMediumHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  // Pan gesture - runs on native thread
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin((event) => {
          isDragging.value = true;
          runOnJS(triggerLightHaptic)();
          // Set initial position based on touch
          const newPosition = Math.max(0.05, Math.min(0.95, event.x / size));
          sliderPosition.value = newPosition;
        })
        .onUpdate((event) => {
          // Update position directly on native thread - no JS bridge
          const newPosition = Math.max(0.05, Math.min(0.95, event.x / size));
          sliderPosition.value = newPosition;
        })
        .onEnd(() => {
          isDragging.value = false;
          runOnJS(triggerMediumHaptic)();
        })
        .onFinalize(() => {
          isDragging.value = false;
        }),
    [isDragging, sliderPosition, size, triggerLightHaptic, triggerMediumHaptic],
  );

  // All animated styles use shared values directly - no setState
  const handleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(isDragging.value ? 1.2 : pulseAnim.value, {
          damping: 15,
          stiffness: 150,
        }),
      },
    ],
  }));

  const beforeClipStyle = useAnimatedStyle(() => ({
    width: `${sliderPosition.value * 100}%`,
  }));

  const sliderLineStyle = useAnimatedStyle(() => ({
    left: `${sliderPosition.value * 100}%`,
  }));

  const sliderHandlePositionStyle = useAnimatedStyle(() => ({
    left: `${sliderPosition.value * 100}%`,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glowAnim.value, [0, 1], [0.3, 0.8]),
    shadowRadius: interpolate(glowAnim.value, [0, 1], [10, 25]),
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.sliderContainer,
          { width: size, height: size },
          glowStyle,
        ]}
      >
        {/* After Image */}
        <View style={styles.imageLayer}>
          <Image
            source={
              typeof afterImage === "string" ? { uri: afterImage } : afterImage
            }
            style={[styles.sliderImage, { width: size, height: size }]}
            resizeMode="cover"
          />
          <View style={[styles.imageLabel, styles.afterLabel]}>
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={styles.labelGradient}
            >
              <Text style={styles.imageLabelText}>SONRA</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Before Image */}
        <Animated.View
          style={[styles.beforeImageWrapper, beforeClipStyle, { height: size }]}
        >
          <Image
            source={
              typeof beforeImage === "string"
                ? { uri: beforeImage }
                : beforeImage
            }
            style={[styles.sliderImage, { width: size, height: size }]}
            resizeMode="cover"
          />
          <View style={[styles.imageLabel, styles.beforeLabel]}>
            <LinearGradient
              colors={["#6B7280", "#4B5563"]}
              style={styles.labelGradient}
            >
              <Text style={styles.imageLabelText}>ÖNCE</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Slider Line - Now animated */}
        <Animated.View style={[styles.sliderLine, sliderLineStyle]}>
          <LinearGradient
            colors={["transparent", "#FFFFFF", "#FFFFFF", "transparent"]}
            style={styles.sliderLineGradient}
          />
        </Animated.View>

        {/* Slider Handle - Now fully animated */}
        <Animated.View
          style={[
            styles.sliderHandle,
            sliderHandlePositionStyle,
            handleAnimatedStyle,
          ]}
        >
          <LinearGradient
            colors={["#7c3aed", "#db2777"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sliderHandleGradient}
          >
            <View style={styles.sliderHandleInner}>
              <ChevronLeft size={12} color="#FFF" strokeWidth={3} />
              <ChevronRight size={12} color="#FFF" strokeWidth={3} />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Hint */}
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>← Kaydırarak karşılaştır →</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

// Intro Slide Component
const IntroSlide: React.FC<{
  slide: (typeof onboardingSlides)[0];
  isActive: boolean;
}> = ({ slide, isActive }) => {
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(-10);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
      logoRotate.value = withSpring(0, { damping: 15 });
      glowOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
    }
  }, [glowOpacity, isActive, logoRotate, logoScale]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const IconComponent = slide.icon || Sparkles;

  return (
    <View style={styles.slideContent}>
      {/* Floating Orbs */}
      <FloatingOrb
        color="#667eea"
        size={200}
        initialX={-50}
        initialY={100}
        delay={0}
      />
      <FloatingOrb
        color="#764ba2"
        size={150}
        initialX={SCREEN_WIDTH - 100}
        initialY={200}
        delay={300}
      />
      <FloatingOrb
        color="#f093fb"
        size={180}
        initialX={SCREEN_WIDTH / 2 - 90}
        initialY={SCREEN_HEIGHT - 300}
        delay={600}
      />

      {/* Particles */}
      {slide.particles &&
        isActive &&
        [...Array(15)].map((_, i) => (
          <Particle key={i} delay={i * 200} size={4 + Math.random() * 4} />
        ))}

      {/* Logo Section */}
      <Animated.View style={[styles.logoSection, logoAnimatedStyle]}>
        <Animated.View style={[styles.logoGlow, glowAnimatedStyle]}>
          <LinearGradient
            colors={["rgba(124, 58, 237, 0.4)", "transparent"]}
            style={styles.logoGlowGradient}
          />
        </Animated.View>
        <View style={styles.logoIconContainer}>
          <LinearGradient
            colors={["#7c3aed", "#db2777", "#f59e0b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoIconGradient}
          >
            <IconComponent size={48} color="#FFF" strokeWidth={1.5} />
          </LinearGradient>
        </View>
      </Animated.View>

      {/* Text Content */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(600)}
        style={styles.textSection}
      >
        <Text style={styles.introTitle}>{slide.title}</Text>
        <Text style={styles.introSubtitle}>{slide.subtitle}</Text>
      </Animated.View>

      <Animated.Text
        entering={FadeInUp.delay(500).duration(600)}
        style={styles.introDescription}
      >
        {slide.description}
      </Animated.Text>
    </View>
  );
};

// Showcase Slide Component
const ShowcaseSlide: React.FC<{
  slide: (typeof onboardingSlides)[0];
  isActive: boolean;
  imageSize: number;
}> = ({ slide, isActive, imageSize }) => {
  const service = useMemo(
    () => editingServices[slide.serviceIndex ?? 0],
    [slide.serviceIndex],
  );
  const badgeScale = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      badgeScale.value = withDelay(600, withSpring(1, { damping: 12 }));
    }
  }, [badgeScale, isActive]);

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <View style={styles.slideContent}>
      {/* Badge */}
      <Animated.View style={[styles.badgeContainer, badgeAnimatedStyle]}>
        <LinearGradient
          colors={
            (service.gradient as [string, string]) || ["#7c3aed", "#db2777"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.badge}
        >
          <Stars size={14} color="#FFF" />
          <Text style={styles.badgeText}>{slide.badge || service.badge}</Text>
        </LinearGradient>
      </Animated.View>

      {/* Title */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(500)}
        style={styles.showcaseTitleContainer}
      >
        <Text style={styles.showcaseTitle}>{slide.title}</Text>
        <Text style={styles.showcaseSubtitle}>{slide.subtitle}</Text>
      </Animated.View>

      {/* Before/After Slider */}
      <Animated.View
        entering={FadeIn.delay(400).duration(600)}
        style={styles.sliderWrapper}
      >
        <BeforeAfterSlider
          beforeImage={service.image1}
          afterImage={service.image2}
          size={imageSize}
        />
      </Animated.View>

      {/* Description */}
      <Animated.Text
        entering={FadeInDown.delay(600).duration(500)}
        style={styles.showcaseDescription}
      >
        {slide.description}
      </Animated.Text>
    </View>
  );
};

// CTA Slide Component
const CTASlide: React.FC<{
  slide: (typeof onboardingSlides)[0];
  isActive: boolean;
  onGetStarted: () => void;
}> = ({ slide, isActive, onGetStarted }) => {
  const buttonScale = useSharedValue(1);
  const buttonGlow = useSharedValue(0);
  const arrowX = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      // Button glow animation
      buttonGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withTiming(0, { duration: 1500 }),
        ),
        -1,
        true,
      );

      // Arrow bounce animation
      arrowX.value = withRepeat(
        withSequence(
          withTiming(8, { duration: 600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 600, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
    }
  }, [arrowX, buttonGlow, isActive]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const buttonGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(buttonGlow.value, [0, 1], [0.3, 0.8]),
    shadowRadius: interpolate(buttonGlow.value, [0, 1], [10, 30]),
  }));

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: arrowX.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const IconComponent = slide.icon || Zap;

  return (
    <View style={styles.slideContent}>
      {/* Floating Orbs */}
      <FloatingOrb
        color="#00d2ff"
        size={180}
        initialX={-40}
        initialY={150}
        delay={0}
      />
      <FloatingOrb
        color="#3a7bd5"
        size={140}
        initialX={SCREEN_WIDTH - 80}
        initialY={250}
        delay={400}
      />
      <FloatingOrb
        color="#7c3aed"
        size={160}
        initialX={SCREEN_WIDTH / 2 - 80}
        initialY={SCREEN_HEIGHT - 350}
        delay={200}
      />

      {/* Icon */}
      <Animated.View
        entering={FadeIn.delay(200).duration(500)}
        style={styles.ctaIconContainer}
      >
        <LinearGradient
          colors={["#00d2ff", "#3a7bd5", "#7c3aed"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaIconGradient}
        >
          <IconComponent size={40} color="#FFF" strokeWidth={1.5} />
        </LinearGradient>
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={FadeInUp.delay(300).duration(600)}
        style={styles.ctaTitle}
      >
        {slide.title}
      </Animated.Text>

      <Animated.Text
        entering={FadeInUp.delay(400).duration(600)}
        style={styles.ctaSubtitle}
      >
        {slide.subtitle}
      </Animated.Text>

      {/* Features */}
      <Animated.View
        entering={FadeInUp.delay(500).duration(600)}
        style={styles.featuresContainer}
      >
        {slide.features?.map((feature, index) => {
          const FeatureIcon = feature.icon;
          return (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIconWrapper}>
                <FeatureIcon size={20} color="#7c3aed" />
              </View>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          );
        })}
      </Animated.View>

      {/* CTA Button */}
      <Animated.View
        entering={FadeInUp.delay(700).duration(600)}
        style={[styles.ctaButtonWrapper, buttonGlowStyle]}
      >
        <Pressable
          onPress={onGetStarted}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View style={buttonAnimatedStyle}>
            <LinearGradient
              colors={["#7c3aed", "#db2777"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>Hemen Başla</Text>
              <Animated.View style={arrowAnimatedStyle}>
                <ArrowRight size={24} color="#FFF" strokeWidth={2} />
              </Animated.View>
            </LinearGradient>
          </Animated.View>
        </Pressable>
      </Animated.View>

      {/* Description */}
      <Animated.Text
        entering={FadeIn.delay(900).duration(500)}
        style={styles.ctaDescription}
      >
        {slide.description}
      </Animated.Text>
    </View>
  );
};

// Page Indicator Component
const PageIndicator: React.FC<{
  total: number;
  current: number;
  onPress: (index: number) => void;
}> = ({ total, current, onPress }) => {
  return (
    <View style={styles.indicatorContainer}>
      {[...Array(total)].map((_, index) => (
        <PageDot
          key={index}
          isActive={index === current}
          onPress={() => onPress(index)}
        />
      ))}
    </View>
  );
};

// Page Dot Component
const PageDot: React.FC<{
  isActive: boolean;
  onPress: () => void;
}> = ({ isActive, onPress }) => {
  const scale = useSharedValue(1);
  const width = useSharedValue(10);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1.2, { damping: 15 });
      width.value = withSpring(28, { damping: 15 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withSpring(1, { damping: 15 });
      width.value = withSpring(10, { damping: 15 });
      opacity.value = withTiming(0.3, { duration: 200 });
    }
  }, [isActive, opacity, scale, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.dot, animatedStyle]}>
        <LinearGradient
          colors={isActive ? ["#7c3aed", "#db2777"] : ["#6B7280", "#6B7280"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.dotGradient}
        />
      </Animated.View>
    </Pressable>
  );
};

// Main Onboarding Screen
export default function OnboardingScreen() {
  const { isTablet, isSmallDevice } = useDeviceDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideOpacity = useSharedValue(1);

  const imageSize = useMemo(() => {
    if (isTablet) return 320;
    if (isSmallDevice) return 240;
    return 280;
  }, [isTablet, isSmallDevice]);

  const currentSlide = onboardingSlides[currentIndex];

  const animateSlideTransition = useCallback(
    (newIndex: number) => {
      slideOpacity.value = withSequence(
        withTiming(0, { duration: 150 }),
        withTiming(1, { duration: 150 }),
      );
      runOnJS(setCurrentIndex)(newIndex);
    },
    [slideOpacity],
  );

  const handleNext = useCallback(() => {
    if (currentIndex < onboardingSlides.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateSlideTransition(currentIndex + 1);
    }
  }, [animateSlideTransition, currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateSlideTransition(currentIndex - 1);
    }
  }, [animateSlideTransition, currentIndex]);

  const handleDotPress = useCallback(
    (index: number) => {
      if (index !== currentIndex) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        animateSlideTransition(index);
      }
    },
    [animateSlideTransition, currentIndex],
  );

  const handleGetStarted = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      router.replace("/auth");
    } catch (error) {
      console.error("Error saving onboarding state:", error);
      router.replace("/auth");
    }
  }, []);

  const handleSkip = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      router.replace("/auth");
    } catch (error) {
      console.error("Error saving onboarding state:", error);
      router.replace("/auth");
    }
  }, []);

  const slideAnimatedStyle = useAnimatedStyle(() => ({
    opacity: slideOpacity.value,
  }));

  // Swipe gesture handler using GestureHandler for better performance
  const swipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-20, 20])
        .failOffsetY([-50, 50])
        .onEnd((event) => {
          if (event.translationX < -50) {
            runOnJS(handleNext)();
          } else if (event.translationX > 50) {
            runOnJS(handlePrev)();
          }
        }),
    [handleNext, handlePrev],
  );

  const isLastSlide = currentIndex === onboardingSlides.length - 1;

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={styles.container}>
        {/* Background Gradient */}
        <LinearGradient
          colors={
            (currentSlide.gradient as [string, string, ...string[]]) || [
              "#0f0f23",
              "#1a1a2e",
              "#16213e",
            ]
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Dark overlay for better readability */}
        <View style={styles.darkOverlay} />

        {/* Skip Button */}
        {!isLastSlide && (
          <Animated.View
            entering={FadeIn.delay(800).duration(400)}
            style={styles.skipContainer}
          >
            <Pressable onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Atla</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Main Content */}
        <Animated.View style={[styles.mainContent, slideAnimatedStyle]}>
          {currentSlide.type === "intro" && (
            <IntroSlide slide={currentSlide} isActive={currentIndex === 0} />
          )}
          {currentSlide.type === "showcase" && (
            <ShowcaseSlide
              slide={currentSlide}
              isActive={true}
              imageSize={imageSize}
            />
          )}
          {currentSlide.type === "cta" && (
            <CTASlide
              slide={currentSlide}
              isActive={currentIndex === onboardingSlides.length - 1}
              onGetStarted={handleGetStarted}
            />
          )}
        </Animated.View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          {/* Page Indicators */}
          <PageIndicator
            total={onboardingSlides.length}
            current={currentIndex}
            onPress={handleDotPress}
          />

          {/* Navigation Arrows (hidden on last slide) */}
          {!isLastSlide && (
            <View style={styles.navArrows}>
              <Pressable
                onPress={handlePrev}
                style={[
                  styles.navArrow,
                  currentIndex === 0 && styles.navArrowDisabled,
                ]}
                disabled={currentIndex === 0}
              >
                <ChevronLeft
                  size={28}
                  color={currentIndex === 0 ? "#4B5563" : "#FFF"}
                  strokeWidth={2}
                />
              </Pressable>

              <Pressable onPress={handleNext} style={styles.navArrowPrimary}>
                <LinearGradient
                  colors={["#7c3aed", "#db2777"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.navArrowGradient}
                >
                  <Text style={styles.nextText}>Devam</Text>
                  <ChevronRight size={20} color="#FFF" strokeWidth={2} />
                </LinearGradient>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  skipContainer: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 100,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  skipText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 80,
  },
  slideContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  // Particles & Orbs
  particle: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  orb: {
    position: "absolute",
    opacity: 0.3,
  },

  // Logo Section (Intro)
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoGlow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  logoGlowGradient: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  logoIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
  },
  logoIconGradient: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  textSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  introTitle: {
    fontFamily: Typography.fontFamily.oswaldBold,
    fontSize: 56,
    color: "#FFF",
    textTransform: "uppercase",
    letterSpacing: 4,
    textShadowColor: "rgba(124, 58, 237, 0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
  },
  introSubtitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 2,
    marginTop: 8,
  },
  introDescription: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: "85%",
    marginTop: 24,
  },

  // Showcase Slide
  badgeContainer: {
    marginBottom: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 12,
    color: "#FFF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  showcaseTitleContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  showcaseTitle: {
    fontFamily: Typography.fontFamily.oswaldBold,
    fontSize: 36,
    color: "#FFF",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  showcaseSubtitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 4,
  },
  sliderWrapper: {
    marginBottom: 24,
  },
  showcaseDescription: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: "80%",
  },

  // Before/After Slider
  sliderContainer: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  imageLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  beforeImageWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    overflow: "hidden",
  },
  sliderImage: {
    borderRadius: BorderRadius.xl,
  },
  imageLabel: {
    position: "absolute",
    bottom: 12,
    overflow: "hidden",
    borderRadius: BorderRadius.sm,
  },
  labelGradient: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  beforeLabel: {
    left: 12,
  },
  afterLabel: {
    right: 12,
  },
  imageLabelText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 10,
    color: "#FFF",
    letterSpacing: 1,
  },
  sliderLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 3,
    marginLeft: -1.5,
    zIndex: 10,
  },
  sliderLineGradient: {
    flex: 1,
    width: 3,
  },
  sliderHandle: {
    position: "absolute",
    top: "50%",
    marginTop: -24,
    marginLeft: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    zIndex: 20,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  sliderHandleGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderHandleInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  hintContainer: {
    position: "absolute",
    bottom: -28,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  hintText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
  },

  // CTA Slide
  ctaIconContainer: {
    marginBottom: 24,
  },
  ctaIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaTitle: {
    fontFamily: Typography.fontFamily.oswaldBold,
    fontSize: 42,
    color: "#FFF",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
    lineHeight: 50,
  },
  ctaSubtitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 18,
    color: "#7c3aed",
    marginTop: 8,
    marginBottom: 32,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  ctaButtonWrapper: {
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 24,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: BorderRadius.full,
  },
  ctaButtonText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
    color: "#FFF",
  },
  ctaDescription: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },

  // Bottom Navigation
  bottomNav: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 24,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  dotGradient: {
    flex: 1,
    borderRadius: 5,
  },
  navArrows: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navArrow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  navArrowDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  navArrowPrimary: {
    overflow: "hidden",
    borderRadius: BorderRadius.full,
  },
  navArrowGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  nextText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 16,
    color: "#FFF",
  },
});
