import { editingServices } from "@/components/data/homeData";
import { BorderRadius, Spacing, Typography } from "@/constants/DesignTokens";
import { useDeviceDimensions, useTheme } from "@/hooks";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  Modal,
  PanResponder,
  PanResponderGestureState,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ExamplesModalProps {
  visible: boolean;
  activeExampleIndex: number;
  onClose: () => void;
  onMomentumEnd: (_event: any) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Before/After Comparison Slider Component
const BeforeAfterSlider: React.FC<{
  beforeImage: any;
  afterImage: any;
  size: number;
  colors: any;
}> = ({ beforeImage, afterImage, size, colors }) => {
  const [sliderPosition, setSliderPosition] = useState(0.5);
  const sliderAnim = useSharedValue(0.5);
  const isDragging = useSharedValue(false);
  const pulseAnim = useSharedValue(1);

  // Pulse animation for the handle
  useEffect(() => {
    const runPulse = () => {
      pulseAnim.value = withSequence(
        withTiming(1.15, { duration: 800 }),
        withTiming(1, { duration: 800 }),
      );
    };
    runPulse();
    const interval = setInterval(runPulse, 2000);
    return () => clearInterval(interval);
  }, [pulseAnim]);

  const handleSliderChange = useCallback(
    (gestureX: number, containerWidth: number) => {
      const newPosition = Math.max(
        0.05,
        Math.min(0.95, gestureX / containerWidth),
      );
      setSliderPosition(newPosition);
      sliderAnim.value = newPosition;
    },
    [sliderAnim],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (
        _: GestureResponderEvent,
        __: PanResponderGestureState,
      ) => {
        isDragging.value = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: (
        event: GestureResponderEvent,
        _: PanResponderGestureState,
      ) => {
        const { locationX } = event.nativeEvent;
        handleSliderChange(locationX, size);
      },
      onPanResponderRelease: () => {
        isDragging.value = false;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },
    }),
  ).current;

  const handleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isDragging.value ? 1.2 : pulseAnim.value }],
  }));

  const beforeClipStyle = useAnimatedStyle(() => ({
    width: `${sliderAnim.value * 100}%`,
  }));

  return (
    <View
      style={[styles.sliderContainer, { width: size, height: size }]}
      {...panResponder.panHandlers}
    >
      {/* After Image (Background) */}
      <View style={styles.imageLayer}>
        <Image
          source={
            typeof afterImage === "string" ? { uri: afterImage } : afterImage
          }
          style={[styles.sliderImage, { width: size, height: size }]}
          resizeMode="cover"
        />
        {/* "SONRA" label */}
        <View
          style={[
            styles.imageLabel,
            styles.afterLabel,
            { backgroundColor: colors.primary + "E6" },
          ]}
        >
          <Text style={styles.imageLabelText}>SONRA</Text>
        </View>
      </View>

      {/* Before Image (Overlay with clip) */}
      <Animated.View
        style={[
          styles.beforeImageWrapper,
          beforeClipStyle,
          { overflow: "hidden" },
        ]}
      >
        <Image
          source={
            typeof beforeImage === "string" ? { uri: beforeImage } : beforeImage
          }
          style={[styles.sliderImage, { width: size, height: size }]}
          resizeMode="cover"
        />
        {/* "ÖNCE" label */}
        <View
          style={[
            styles.imageLabel,
            styles.beforeLabel,
            { backgroundColor: colors.textSecondary + "E6" },
          ]}
        >
          <Text style={styles.imageLabelText}>ÖNCE</Text>
        </View>
      </Animated.View>

      {/* Slider Line */}
      <View style={[styles.sliderLine, { left: `${sliderPosition * 100}%` }]}>
        <LinearGradient
          colors={["transparent", "#FFFFFF", "#FFFFFF", "transparent"]}
          style={styles.sliderLineGradient}
        />
      </View>

      {/* Slider Handle */}
      <Animated.View
        style={[
          styles.sliderHandle,
          { left: `${sliderPosition * 100}%` },
          handleAnimatedStyle,
        ]}
      >
        <LinearGradient
          colors={[colors.primary, "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sliderHandleGradient}
        >
          <View style={styles.sliderHandleInner}>
            <ChevronLeft size={10} color="#FFF" strokeWidth={3} />
            <ChevronRight size={10} color="#FFF" strokeWidth={3} />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Hint Text */}
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>← Kaydır →</Text>
      </View>
    </View>
  );
};

export const ExamplesModal: React.FC<ExamplesModalProps> = ({
  visible,
  activeExampleIndex,
  onClose,
  onMomentumEnd,
}) => {
  const { colors } = useTheme();
  const { isTablet, isSmallDevice } = useDeviceDimensions();
  const [currentIndex, setCurrentIndex] = useState(activeExampleIndex);

  // Animation values
  const overlayOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.9);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(30);
  const buttonOpacity = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);

  const exampleItems = useMemo(
    () =>
      editingServices.slice(0, 3).map((service) => ({
        id: service.id,
        title: service.title,
        subtitle: service.subtitle,
        beforeImage: service.image1,
        afterImage: service.image2,
        gradient: service.gradient,
        color: service.color,
        badge: service.badge,
      })),
    [],
  );

  const imageSize = useMemo(() => {
    if (isTablet) return 280;
    if (isSmallDevice) return 200;
    return 240;
  }, [isTablet, isSmallDevice]);

  // Entrance animations
  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(1, { duration: 300 });
      modalScale.value = withSpring(1, { damping: 20, stiffness: 300 });
      titleOpacity.value = withDelay(150, withTiming(1, { duration: 400 }));
      titleTranslateY.value = withDelay(150, withSpring(0, { damping: 20 }));
      cardOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
      cardTranslateY.value = withDelay(300, withSpring(0, { damping: 18 }));
      buttonOpacity.value = withDelay(500, withTiming(1, { duration: 300 }));
      sparkleRotation.value = withSequence(
        withTiming(15, { duration: 200 }),
        withSpring(0, { damping: 8 }),
      );
    } else {
      overlayOpacity.value = withTiming(0, { duration: 200 });
      modalScale.value = withTiming(0.9, { duration: 200 });
      titleOpacity.value = 0;
      titleTranslateY.value = 20;
      cardOpacity.value = 0;
      cardTranslateY.value = 30;
      buttonOpacity.value = 0;
    }
  }, [
    visible,
    overlayOpacity,
    modalScale,
    titleOpacity,
    titleTranslateY,
    cardOpacity,
    cardTranslateY,
    buttonOpacity,
    sparkleRotation,
  ]);

  // Sparkle continuous animation
  useEffect(() => {
    if (visible) {
      const runSparkle = () => {
        sparkleRotation.value = withSequence(
          withTiming(-10, { duration: 1500 }),
          withTiming(10, { duration: 1500 }),
        );
      };
      runSparkle();
      const interval = setInterval(runSparkle, 3000);
      return () => clearInterval(interval);
    }
  }, [visible, sparkleRotation]);

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose();
  }, [onClose]);

  const handleNext = useCallback(() => {
    if (currentIndex < exampleItems.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onMomentumEnd({
        nativeEvent: { contentOffset: { x: newIndex * SCREEN_WIDTH } },
      });

      // Card transition animation
      cardOpacity.value = withSequence(
        withTiming(0.5, { duration: 150 }),
        withTiming(1, { duration: 200 }),
      );
      cardTranslateY.value = withSequence(
        withTiming(10, { duration: 150 }),
        withSpring(0, { damping: 18 }),
      );
    }
  }, [
    currentIndex,
    exampleItems.length,
    onMomentumEnd,
    cardOpacity,
    cardTranslateY,
  ]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onMomentumEnd({
        nativeEvent: { contentOffset: { x: newIndex * SCREEN_WIDTH } },
      });

      cardOpacity.value = withSequence(
        withTiming(0.5, { duration: 150 }),
        withTiming(1, { duration: 200 }),
      );
      cardTranslateY.value = withSequence(
        withTiming(10, { duration: 150 }),
        withSpring(0, { damping: 18 }),
      );
    }
  }, [currentIndex, onMomentumEnd, cardOpacity, cardTranslateY]);

  const handleDotPress = useCallback(
    (index: number) => {
      if (index !== currentIndex) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCurrentIndex(index);
        onMomentumEnd({
          nativeEvent: { contentOffset: { x: index * SCREEN_WIDTH } },
        });
      }
    },
    [currentIndex, onMomentumEnd],
  );

  // Animated styles
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const currentItem = exampleItems[currentIndex];

  if (!visible || exampleItems.length === 0) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
        {/* Gradient Background */}
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.85)",
            "rgba(15,15,35,0.95)",
            "rgba(0,0,0,0.9)",
          ]}
          style={StyleSheet.absoluteFill}
        />

        {/* Decorative circles */}
        <View
          style={[
            styles.decorCircle,
            styles.decorCircle1,
            { backgroundColor: colors.primary + "15" },
          ]}
        />
        <View
          style={[
            styles.decorCircle,
            styles.decorCircle2,
            { backgroundColor: "#7C3AED15" },
          ]}
        />

        <Animated.View style={[styles.modalContainer, modalAnimatedStyle]}>
          {/* Close Button */}
          <AnimatedPressable
            style={[styles.closeButton, buttonAnimatedStyle]}
            onPress={handleClose}
          >
            <X size={24} color="#FFF" strokeWidth={2} />
          </AnimatedPressable>

          {/* Header */}
          <Animated.View style={[styles.header, titleAnimatedStyle]}>
            <View style={styles.titleRow}>
              <Animated.View style={sparkleAnimatedStyle}>
                <Sparkles
                  size={isTablet ? 32 : 24}
                  color={colors.primary}
                  fill={colors.primary}
                />
              </Animated.View>
              <Text
                style={[
                  styles.title,
                  { fontSize: isTablet ? 32 : isSmallDevice ? 22 : 26 },
                ]}
              >
                Studio AI ile neler mümkün?
              </Text>
            </View>
            <Text
              style={[
                styles.subtitle,
                { fontSize: isTablet ? 16 : isSmallDevice ? 13 : 14 },
              ]}
            >
              Fotoğraflarınızı profesyonel düzeye taşıyın
            </Text>
          </Animated.View>

          {/* Card Content */}
          <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
            {/* Glassmorphic Card */}
            <View style={[styles.card, { borderColor: colors.primary + "30" }]}>
              <LinearGradient
                colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />

              {/* Badge */}
              <View style={styles.badgeContainer}>
                <LinearGradient
                  colors={
                    (currentItem?.gradient as [string, string]) || [
                      colors.primary,
                      "#7C3AED",
                    ]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.badge}
                >
                  <Text style={styles.badgeText}>{currentItem?.badge}</Text>
                </LinearGradient>
              </View>

              {/* Service Title */}
              <Text
                style={[
                  styles.cardTitle,
                  { fontSize: isTablet ? 26 : isSmallDevice ? 20 : 22 },
                ]}
              >
                {currentItem?.title}
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  { fontSize: isTablet ? 15 : isSmallDevice ? 12 : 13 },
                ]}
              >
                {currentItem?.subtitle}
              </Text>

              {/* Before/After Slider */}
              <View style={styles.sliderWrapper}>
                <BeforeAfterSlider
                  beforeImage={currentItem?.beforeImage}
                  afterImage={currentItem?.afterImage}
                  size={imageSize}
                  colors={colors}
                />
              </View>
            </View>

            {/* Navigation Arrows */}
            <View style={styles.navigationContainer}>
              <AnimatedPressable
                style={[
                  styles.navButton,
                  currentIndex === 0 && styles.navButtonDisabled,
                ]}
                onPress={handlePrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft
                  size={24}
                  color={currentIndex === 0 ? "#666" : "#FFF"}
                  strokeWidth={2}
                />
              </AnimatedPressable>

              {/* Page Indicators */}
              <View style={styles.indicators}>
                {exampleItems.map((item, index) => (
                  <PageDot
                    key={item.id}
                    isActive={index === currentIndex}
                    color={colors.primary}
                    onPress={() => handleDotPress(index)}
                  />
                ))}
              </View>

              <AnimatedPressable
                style={[
                  styles.navButton,
                  currentIndex === exampleItems.length - 1 &&
                    styles.navButtonDisabled,
                ]}
                onPress={handleNext}
                disabled={currentIndex === exampleItems.length - 1}
              >
                <ChevronRight
                  size={24}
                  color={
                    currentIndex === exampleItems.length - 1 ? "#666" : "#FFF"
                  }
                  strokeWidth={2}
                />
              </AnimatedPressable>
            </View>
          </Animated.View>

          {/* Skip Button */}
          <Animated.View style={buttonAnimatedStyle}>
            <Pressable style={styles.skipButton} onPress={handleClose}>
              <LinearGradient
                colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Text style={styles.skipText}>Başla</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// Animated Page Dot Component
const PageDot: React.FC<{
  isActive: boolean;
  color: string;
  onPress: () => void;
}> = ({ isActive, color, onPress }) => {
  const scale = useSharedValue(1);
  const width = useSharedValue(10);

  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1.2, { damping: 15 });
      width.value = withSpring(24, { damping: 15 });
    } else {
      scale.value = withSpring(1, { damping: 15 });
      width.value = withSpring(10, { damping: 15 });
    }
  }, [isActive, scale, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    transform: [{ scale: scale.value }],
    backgroundColor: isActive ? color : "rgba(255,255,255,0.3)",
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.dot, animatedStyle]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  decorCircle: {
    position: "absolute",
    borderRadius: 9999,
  },
  decorCircle1: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    top: -SCREEN_WIDTH * 0.3,
    right: -SCREEN_WIDTH * 0.3,
  },
  decorCircle2: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    bottom: -SCREEN_WIDTH * 0.2,
    left: -SCREEN_WIDTH * 0.2,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 420,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  title: {
    fontFamily: Typography.fontFamily.oswaldBold,
    color: "#FFF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.medium,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
  },
  cardContainer: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    width: "100%",
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  badgeContainer: {
    marginBottom: Spacing.md,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 11,
    color: "#FFF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardTitle: {
    fontFamily: Typography.fontFamily.montserratBold,
    color: "#FFF",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontFamily: Typography.fontFamily.medium,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  sliderWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  sliderContainer: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    position: "relative",
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
    bottom: 0,
  },
  sliderImage: {
    borderRadius: BorderRadius.xl,
  },
  imageLabel: {
    position: "absolute",
    bottom: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  beforeLabel: {
    left: Spacing.sm,
  },
  afterLabel: {
    right: Spacing.sm,
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
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sliderHandleGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderHandleInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  hintContainer: {
    position: "absolute",
    bottom: -24,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  hintText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xxl,
    gap: Spacing.lg,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  indicators: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  skipButton: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  skipText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
  },
});
