import { ThemedText, ThemedView } from '@/components';
import { useTheme } from '@/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Camera, Sparkles } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { colors, isDark } = useTheme();
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleSlide = useSharedValue(30);
  const sparkleRotate = useSharedValue(0);
  const sparkleScale = useSharedValue(0);
  const backgroundOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  const navigateToLanding = () => {
    router.replace('/');
  };

  useEffect(() => {
    // Background fade in
    backgroundOpacity.value = withTiming(1, { duration: 500 });

    // Logo animations
    logoScale.value = withDelay(300, withSpring(1, { damping: 15, stiffness: 100 }));
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));

    // Sparkle animations
    sparkleScale.value = withDelay(800, withSpring(1, { damping: 12 }));
    sparkleRotate.value = withDelay(800, withTiming(360, { duration: 1000 }));

    // Title animations
    titleOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));
    titleSlide.value = withDelay(1000, withSpring(0, { damping: 15 }));

    // Pulse effect
    pulseScale.value = withDelay(
      1200,
      withSequence(withTiming(1.05, { duration: 800 }), withTiming(1, { duration: 800 })),
    );

    // Navigate after animations
    const timer = setTimeout(() => {
      runOnJS(navigateToLanding)();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const logoContainerStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { scale: pulseScale.value }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotate.value}deg` }, { scale: sparkleScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleSlide.value }],
  }));

  return (
    <ThemedView style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <Animated.View style={[styles.backgroundContainer, backgroundStyle]}>
        <LinearGradient
          colors={isDark ? ['#1F2937', '#111827', '#000000'] : ['#0077B5', '#004182', '#001F3F']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Animated background elements */}
          <View style={styles.backgroundElements}>
            <View style={[styles.floatingElement, styles.element1]} />
            <View style={[styles.floatingElement, styles.element2]} />
            <View style={[styles.floatingElement, styles.element3]} />
          </View>

          <View style={styles.content}>
            {/* Logo Section */}
            <Animated.View style={[styles.logoContainer, logoContainerStyle]}>
              <View style={styles.logoWrapper}>
                <View style={styles.logoBackground}>
                  <Camera size={64} color="#FFFFFF" strokeWidth={2} />
                </View>

                <Animated.View style={[styles.sparkleContainer, sparkleStyle]}>
                  <Sparkles size={28} color="#F59E0B" strokeWidth={2} />
                </Animated.View>
              </View>
            </Animated.View>

            {/* Title Section */}
            <Animated.View style={[styles.titleContainer, titleStyle]}>
              <ThemedText variant="h2" color="inverse" align="center">
                LinkedIn Profile
              </ThemedText>
              <ThemedText variant="h2" color="inverse" align="center">
                Creator
              </ThemedText>
              <View style={styles.tagline}>
                <ThemedText variant="caption" weight="medium" color="inverse" align="center">
                  Professional • AI-Powered • Instant
                </ThemedText>
              </View>
            </Animated.View>

            {/* Loading indicator */}
            <View style={styles.loadingContainer}>
              <View style={styles.loadingBar}>
                <Animated.View style={[styles.loadingProgress, { width: '100%' }]} />
              </View>
              <ThemedText variant="caption" color="inverse" align="center">
                Preparing your studio...
              </ThemedText>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0077B5',
  },
  backgroundContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  backgroundElements: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingElement: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 50,
  },
  element1: {
    width: 100,
    height: 100,
    top: '20%',
    left: '10%',
  },
  element2: {
    width: 60,
    height: 60,
    top: '60%',
    right: '15%',
  },
  element3: {
    width: 80,
    height: 80,
    bottom: '25%',
    left: '20%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 48,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 64,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  tagline: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  taglineText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 80 : 60,
    left: 32,
    right: 32,
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});
