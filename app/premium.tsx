import { Button } from '@/components';
import { useTheme } from '@/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Check, Crown, X, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

interface PlanFeature {
  name: string;
  free: boolean;
  premium: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  popular?: boolean;
  savings?: string;
}

export default function PremiumScreen() {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');
  const [loading, setLoading] = useState(false);

  const features: PlanFeature[] = [
    { name: t('premium.unlimitedPhotos'), free: false, premium: true },
    { name: t('premium.advancedFilters'), free: false, premium: true },
    { name: t('premium.cloudStorage'), free: false, premium: true },
    { name: t('premium.prioritySupport'), free: false, premium: true },
    { name: t('premium.noAds'), free: false, premium: true },
    { name: 'Basic Editing', free: true, premium: true },
    { name: 'Standard Filters', free: true, premium: true },
    { name: 'Local Storage', free: true, premium: true },
  ];

  const plans: PricingPlan[] = [
    {
      id: 'monthly',
      name: t('premium.monthlyPlan'),
      price: '$9.99',
      period: '/month',
    },
    {
      id: 'yearly',
      name: t('premium.yearlyPlan'),
      price: '$59.99',
      period: '/year',
      popular: true,
      savings: 'Save 50%',
    },
  ];

  const handleSubscribe = async (planId: string) => {
    setLoading(true);

    try {
      // Simulate subscription process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Subscription state would be managed here

      Alert.alert(
        t('common.success'),
        'Welcome to Premium! You now have access to all premium features.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch {
      Alert.alert(t('common.error'), 'Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    Alert.alert('Restore Purchases', 'No previous purchases found.', [{ text: 'OK' }]);
  };

  return (
    <LinearGradient
      colors={
        colorScheme === 'dark'
          ? ['#0f0f23', '#1a1a2e', '#16213e']
          : ['#667eea', '#764ba2', '#f093fb']
      }
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Button
              title=""
              onPress={() => router.back()}
              variant="ghost"
              icon={<ArrowLeft size={24} color="white" />}
            />
          </View>

          <View style={styles.headerContent}>
            {/* Premium Crown with Glow Effect */}
            <View style={styles.crownContainer}>
              <LinearGradient
                colors={['#fbbf24', '#f59e0b', '#d97706']}
                style={styles.crownGradient}
              >
                <Crown size={48} color="white" />
              </LinearGradient>

              {/* Glow rings */}
              <View style={styles.glowRing1} />
              <View style={styles.glowRing2} />
            </View>

            <Text style={styles.title}>{t('premium.upgradeToPremium')}</Text>

            <Text style={styles.subtitle}>Fotoğraflarınızı bir sonraki seviyeye taşıyın</Text>

            {/* Premium Benefits Pills */}
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitPill}>
                <Text style={styles.benefitText}>✨ Sınırsız Fotoğraf</Text>
              </View>
              <View style={styles.benefitPill}>
                <Text style={styles.benefitText}>🚀 Gelişmiş Filtreler</Text>
              </View>
              <View style={styles.benefitPill}>
                <Text style={styles.benefitText}>☁️ Bulut Depolama</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Features Comparison */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>{t('premium.premiumFeatures')}</Text>

            {/* Column Headers */}
            <View style={styles.columnHeaders}>
              <View style={styles.featureColumn}>
                <Text style={styles.columnTitle}>Özellik</Text>
              </View>
              <View style={styles.priceColumn}>
                <View style={styles.freeBadge}>
                  <Text style={styles.freeBadgeText}>Ücretsiz</Text>
                </View>
              </View>
              <View style={styles.priceColumn}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>Premium</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Feature Rows */}
            <View style={styles.featureRows}>
              {features.map((feature, index) => (
                <View
                  key={index}
                  style={[
                    styles.featureRow,
                    feature.premium && !feature.free && styles.premiumFeatureRow,
                  ]}
                >
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureName}>{feature.name}</Text>
                    {feature.premium && !feature.free && (
                      <Text style={styles.premiumLabel}>🌟 Premium Özelliği</Text>
                    )}
                  </View>

                  <View style={styles.featureIcons}>
                    <View style={styles.iconContainer}>
                      {feature.free ? (
                        <View style={styles.checkIcon}>
                          <Check size={18} color="#16a34a" />
                        </View>
                      ) : (
                        <View style={styles.xIcon}>
                          <X size={18} color="#dc2626" />
                        </View>
                      )}
                    </View>

                    <View style={styles.iconContainer}>
                      <View style={styles.premiumCheckIcon}>
                        <Check size={18} color="white" />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Bottom CTA */}
            <View style={styles.bottomCTA}>
              <Text style={styles.ctaTitle}>
                Premium&apos;a geçin ve tüm özelliklerin kilidini açın! 🚀
              </Text>
              <Text style={styles.ctaSubtitle}>7 gün ücretsiz deneme ile başlayın</Text>
            </View>
          </View>
        </View>

        {/* Pricing Plans */}
        <View style={styles.pricingSection}>
          <Text style={styles.pricingTitle}>Planınızı Seçin</Text>

          <View style={styles.plansContainer}>
            {plans.map((plan) => (
              <View
                key={plan.id}
                style={[styles.planCard, selectedPlan === plan.id && styles.selectedPlanCard]}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <LinearGradient colors={['#ff6b6b', '#ee5a24']} style={styles.popularGradient}>
                      <Text style={styles.popularText}>🔥 En Popüler</Text>
                    </LinearGradient>
                  </View>
                )}

                {/* Card Content */}
                <LinearGradient
                  colors={
                    selectedPlan === plan.id ? ['#667eea', '#764ba2'] : ['#ffffff', '#f8f9fa']
                  }
                  style={styles.planContent}
                >
                  <View style={styles.planHeader}>
                    <View style={styles.planInfo}>
                      <Text
                        style={[
                          styles.planName,
                          selectedPlan === plan.id && styles.selectedPlanText,
                        ]}
                      >
                        {plan.name}
                      </Text>

                      <View style={styles.priceContainer}>
                        <Text
                          style={[
                            styles.planPrice,
                            selectedPlan === plan.id && styles.selectedPlanText,
                          ]}
                        >
                          {plan.price}
                        </Text>
                        <Text
                          style={[
                            styles.planPeriod,
                            selectedPlan === plan.id && styles.selectedPlanPeriod,
                          ]}
                        >
                          {plan.period}
                        </Text>
                      </View>

                      {plan.savings && (
                        <View style={styles.savingsBadge}>
                          <Text style={styles.savingsText}>💰 %50 Tasarruf</Text>
                        </View>
                      )}

                      {/* Plan Benefits */}
                      <View style={styles.planBenefits}>
                        {plan.id === 'yearly' ? (
                          <>
                            <Text
                              style={[
                                styles.benefitItem,
                                selectedPlan === plan.id && styles.selectedBenefitItem,
                              ]}
                            >
                              ✨ Tüm premium özellikler
                            </Text>
                            <Text
                              style={[
                                styles.benefitItem,
                                selectedPlan === plan.id && styles.selectedBenefitItem,
                              ]}
                            >
                              🚀 Öncelikli destek
                            </Text>
                          </>
                        ) : (
                          <Text
                            style={[
                              styles.benefitItem,
                              selectedPlan === plan.id && styles.selectedBenefitItem,
                            ]}
                          >
                            📱 Tüm premium özellikler
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.selectButton}>
                      <Button
                        title={selectedPlan === plan.id ? '✓ Seçildi' : 'Seç'}
                        onPress={() => setSelectedPlan(plan.id)}
                        variant={selectedPlan === plan.id ? 'outline' : 'primary'}
                        size="sm"
                      />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaSection}>
          {/* Main CTA Button */}
          <View style={styles.mainCTA}>
            <LinearGradient colors={['#667eea', '#764ba2', '#f093fb']} style={styles.ctaGradient}>
              <Button
                title={loading ? '' : '🚀 7 Gün Ücretsiz Deneyin'}
                onPress={() => handleSubscribe(selectedPlan)}
                loading={loading}
                variant="primary"
                size="lg"
                icon={!loading && <Zap size={24} color="white" />}
              />
            </LinearGradient>
          </View>

          {/* Secondary Actions */}
          <View style={styles.secondaryActions}>
            <Button
              title="📱 Satın Alımları Geri Yükle"
              onPress={handleRestore}
              variant="ghost"
              size="md"
            />

            {/* Trust Indicators */}
            <View style={styles.trustIndicators}>
              <View style={styles.trustRow}>
                <View style={styles.trustItem}>
                  <Text style={styles.trustIcon}>🔒</Text>
                  <Text style={styles.trustText}>Güvenli Ödeme</Text>
                </View>
                <View style={styles.trustItem}>
                  <Text style={styles.trustIcon}>⭐</Text>
                  <Text style={styles.trustText}>4.8/5 Puan</Text>
                </View>
                <View style={styles.trustItem}>
                  <Text style={styles.trustIcon}>👥</Text>
                  <Text style={styles.trustText}>10K+ Kullanıcı</Text>
                </View>
              </View>
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
              7 gün ücretsiz deneme • İstediğiniz zaman iptal edin • Otomatik yenileme Hesap
              Ayarları&apos;ndan kapatılabilir
            </Text>
          </View>

          {/* Bottom Spacing for Safe Area */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 64,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  headerContent: {
    alignItems: 'center',
  },
  crownContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  crownGradient: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
  },
  glowRing1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    borderColor: 'rgba(252, 211, 77, 0.3)',
  },
  glowRing2: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 1,
    borderColor: 'rgba(254, 240, 138, 0.2)',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter-Black',
    textAlign: 'center',
    marginBottom: 12,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    color: 'white',
    paddingHorizontal: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  benefitPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  benefitText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featuresCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
  },
  featuresTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Black',
    textAlign: 'center',
    marginBottom: 32,
    color: '#1f2937',
  },
  columnHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  featureColumn: {
    flex: 1,
  },
  columnTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#4b5563',
    textAlign: 'center',
  },
  priceColumn: {
    width: 80,
  },
  freeBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  freeBadgeText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#4b5563',
    textAlign: 'center',
  },
  premiumBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  premiumBadgeText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: 'white',
    textAlign: 'center',
  },
  featureRows: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
  },
  premiumFeatureRow: {
    backgroundColor: '#faf5ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  featureInfo: {
    flex: 1,
  },
  featureName: {
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    fontSize: 16,
  },
  premiumLabel: {
    fontSize: 12,
    color: '#9333ea',
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  featureIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    alignItems: 'center',
  },
  checkIcon: {
    backgroundColor: '#dcfce7',
    padding: 8,
    borderRadius: 20,
  },
  xIcon: {
    backgroundColor: '#fee2e2',
    padding: 8,
    borderRadius: 20,
  },
  premiumCheckIcon: {
    backgroundColor: '#22c55e',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomCTA: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
  },
  ctaTitle: {
    color: 'white',
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 8,
  },
  ctaSubtitle: {
    color: 'white',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.9,
  },
  pricingSection: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  pricingTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Black',
    textAlign: 'center',
    marginBottom: 32,
    color: 'white',
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  selectedPlanCard: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#667eea',
    shadowOpacity: 0.3,
    elevation: 12,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
  },
  popularGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    transform: [{ rotate: '12deg' }],
  },
  popularText: {
    color: 'white',
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  planContent: {
    padding: 24,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontFamily: 'Inter-Black',
    marginBottom: 8,
    color: '#1f2937',
  },
  selectedPlanText: {
    color: 'white',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  planPrice: {
    fontSize: 32,
    fontFamily: 'Inter-Black',
    color: '#111827',
  },
  planPeriod: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
    color: '#4b5563',
  },
  selectedPlanPeriod: {
    color: 'white',
    opacity: 0.8,
  },
  savingsBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  savingsText: {
    color: 'white',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  planBenefits: {
    marginTop: 16,
    gap: 8,
  },
  benefitItem: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
  },
  selectedBenefitItem: {
    color: 'white',
    opacity: 0.9,
  },
  selectButton: {
    marginLeft: 16,
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  mainCTA: {
    marginBottom: 24,
  },
  ctaGradient: {
    borderRadius: 16,
    padding: 4,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  secondaryActions: {
    gap: 12,
  },
  trustIndicators: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    opacity: 0.2,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  trustItem: {
    alignItems: 'center',
  },
  trustIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  trustText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.9,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
    color: 'white',
    paddingHorizontal: 16,
    marginTop: 16,
    opacity: 0.7,
  },
  bottomSpacing: {
    height: 32,
  },
});
