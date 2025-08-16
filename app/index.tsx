import ScrollContainer from '@/components/ScrollContainer';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowRight, Award, Camera, Sparkles, Users, Zap } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Dimensions, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function LandingPage() {
  const { colors, isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const scaleAnim = useSharedValue(0.8);
  const rotateAnim = useSharedValue(0);
  const sparkleAnim = useSharedValue(0);

  useEffect(() => {
    // Entrance animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
    scaleAnim.value = withSpring(1, { damping: 12, stiffness: 80 });

    // Continuous sparkle animation
    sparkleAnim.value = withSequence(
      withDelay(1000, withTiming(1, { duration: 1000 })),
      withTiming(0, { duration: 1000 }),
    );

    // Rotate animation for camera icon
    rotateAnim.value = withDelay(500, withSpring(360, { damping: 15 }));
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const cameraIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnim.value}deg` }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sparkleAnim.value, [0, 1], [0.3, 1], Extrapolate.CLAMP),
    transform: [{ scale: interpolate(sparkleAnim.value, [0, 1], [0.8, 1.2], Extrapolate.CLAMP) }],
  }));

  const handleGetStarted = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.push('/auth/signin');
    }
  };

  const handleLearnMore = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Could navigate to onboarding or info screen
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor='transparent'
        translucent
      />

      <LinearGradient
        colors={isDark ? ['#1F2937', '#111827', '#000000'] : ['#0077B5', '#004182', '#001F3F']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollContainer style={{ flex: 1 }}>
          <Animated.View style={[styles.content, containerStyle]}>
            {/* Hero Section */}
            <Animated.View style={[styles.heroSection, heroStyle]}>
              <View style={styles.iconContainer}>
                <Animated.View style={[styles.cameraIconWrapper, cameraIconStyle]}>
                  <Camera size={48} color='#FFFFFF' strokeWidth={2} />
                </Animated.View>
                <Animated.View style={[styles.sparkleIcon, sparkleStyle]}>
                  <Sparkles size={24} color='#F59E0B' strokeWidth={2} />
                </Animated.View>
              </View>

              <ThemedText variant='h1' color='inverse' align='center' style={styles.title}>
                LinkedIn Profile{'\n'}Creator
              </ThemedText>
              <ThemedText
                variant='bodyLarge'
                color='inverse'
                align='center'
                style={styles.subtitle}
              >
                Transform your photos into professional LinkedIn profile pictures with AI-powered
                editing
              </ThemedText>
            </Animated.View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureRow}>
                <View style={styles.featureCard}>
                  <View style={styles.featureIcon}>
                    <Camera size={20} color='#0077B5' strokeWidth={2} />
                  </View>
                  <ThemedText variant='caption' weight='semiBold' color='inverse' align='center'>
                    Smart Camera
                  </ThemedText>
                  <ThemedText
                    variant='caption'
                    color='inverse'
                    align='center'
                    style={styles.featureText}
                  >
                    AI-guided photo capture
                  </ThemedText>
                </View>

                <View style={styles.featureCard}>
                  <View style={styles.featureIcon}>
                    <Sparkles size={20} color='#0077B5' strokeWidth={2} />
                  </View>
                  <ThemedText variant='caption' weight='semiBold' color='inverse' align='center'>
                    Pro Filters
                  </ThemedText>
                  <ThemedText
                    variant='caption'
                    color='inverse'
                    align='center'
                    style={styles.featureText}
                  >
                    Professional styling
                  </ThemedText>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={styles.featureCard}>
                  <View style={styles.featureIcon}>
                    <Users size={20} color='#0077B5' strokeWidth={2} />
                  </View>
                  <ThemedText variant='caption' weight='semiBold' color='inverse' align='center'>
                    LinkedIn Ready
                  </ThemedText>
                  <ThemedText
                    variant='caption'
                    color='inverse'
                    align='center'
                    style={styles.featureText}
                  >
                    Optimized dimensions
                  </ThemedText>
                </View>

                <View style={styles.featureCard}>
                  <View style={styles.featureIcon}>
                    <Award size={20} color='#0077B5' strokeWidth={2} />
                  </View>
                  <ThemedText variant='caption' weight='semiBold' color='inverse' align='center'>
                    Professional
                  </ThemedText>
                  <ThemedText
                    variant='caption'
                    color='inverse'
                    align='center'
                    style={styles.featureText}
                  >
                    Industry standards
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* CTA Buttons */}
            <View style={styles.ctaContainer}>
              <AnimatedTouchableOpacity
                title={isAuthenticated ? 'Uygulamaya Git' : 'Başlayın'}
                onPress={handleGetStarted}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F8FAFC']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Zap size={20} color='#0077B5' strokeWidth={2} />
                  <ThemedText variant='body' weight='semiBold' style={styles.primaryButtonText}>
                    Get Started
                  </ThemedText>
                  <ArrowRight size={20} color='#0077B5' strokeWidth={2} />
                </LinearGradient>
              </AnimatedTouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={handleLearnMore}>
                <ThemedText variant='body' weight='semiBold' color='inverse'>
                  Learn More
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <ThemedText variant='h4' weight='bold' color='inverse'>
                  10K+
                </ThemedText>
                <ThemedText variant='caption' color='inverse' align='center'>
                  Photos Created
                </ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText variant='h4' weight='bold' color='inverse'>
                  95%
                </ThemedText>
                <ThemedText variant='caption' color='inverse' align='center'>
                  Professional Score
                </ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText variant='h4' weight='bold' color='inverse'>
                  4.9★
                </ThemedText>
                <ThemedText variant='caption' color='inverse' align='center'>
                  User Rating
                </ThemedText>
              </View>
            </View>
          </Animated.View>
        </ScrollContainer>
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  cameraIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sparkleIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 16,
    padding: 4,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 16,
  },
  featuresContainer: {
    marginBottom: 48,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  featureCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  ctaContainer: {
    marginBottom: 40,
  },
  primaryButton: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#0077B5',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
