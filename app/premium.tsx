import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Check, Crown, X, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, View } from 'react-native';

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

      const mockSubscription = {
        id: 'sub_123',
        status: 'active' as const,
        planId,
        planName: plans.find((p) => p.id === planId)?.name || 'Premium',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(
          Date.now() + (planId === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000,
        ).toISOString(),
        cancelAtPeriodEnd: false,
      };

      // Subscription state would be managed here

      Alert.alert(
        t('common.success'),
        'Welcome to Premium! You now have access to all premium features.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (error) {
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
          ? ['#0f172a', '#1e293b', '#334155']
          : ['#f8fafc', '#e2e8f0', '#cbd5e1']
      }
      className='flex-1'
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className='pt-16 pb-8 px-6'>
          <View className='flex-row items-center justify-between mb-6'>
            <Button
              title=''
              onPress={() => router.back()}
              variant='ghost'
              icon={<ArrowLeft size={24} color={colorScheme === 'dark' ? 'white' : '#1f2937'} />}
            />
          </View>

          <View className='items-center'>
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              className='w-20 h-20 rounded-full items-center justify-center mb-4'
            >
              <Crown size={40} color='white' />
            </LinearGradient>

            <Text
              className={`text-3xl font-inter-bold text-center mb-2 ${
                colorScheme === 'dark' ? 'text-white' : 'text-secondary-900'
              }`}
            >
              {t('premium.upgradeToPremium')}
            </Text>

            <Text
              className={`text-lg font-inter-regular text-center ${
                colorScheme === 'dark' ? 'text-secondary-400' : 'text-secondary-600'
              }`}
            >
              Unlock all premium features and take your photos to the next level
            </Text>
          </View>
        </View>

        {/* Features Comparison */}
        <View className='px-6 mb-8'>
          <Card variant='glass' padding='lg'>
            <Text
              className={`text-xl font-inter-bold mb-6 text-center ${
                colorScheme === 'dark' ? 'text-white' : 'text-secondary-900'
              }`}
            >
              {t('premium.premiumFeatures')}
            </Text>

            <View className='space-y-4'>
              {features.map((feature, index) => (
                <View key={index} className='flex-row items-center justify-between'>
                  <Text
                    className={`flex-1 font-inter-medium ${
                      colorScheme === 'dark' ? 'text-secondary-300' : 'text-secondary-700'
                    }`}
                  >
                    {feature.name}
                  </Text>

                  <View className='flex-row space-x-8'>
                    <View className='w-12 items-center'>
                      {feature.free ? (
                        <Check size={20} color='#22c55e' />
                      ) : (
                        <X size={20} color='#ef4444' />
                      )}
                    </View>

                    <View className='w-12 items-center'>
                      <Check size={20} color='#22c55e' />
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View className='flex-row justify-between mt-6 pt-4 border-t border-secondary-200 dark:border-secondary-700'>
              <Text
                className={`font-inter-semibold ${
                  colorScheme === 'dark' ? 'text-secondary-400' : 'text-secondary-600'
                }`}
              >
                Free
              </Text>
              <Text
                className={`font-inter-semibold ${
                  colorScheme === 'dark' ? 'text-primary-400' : 'text-primary-600'
                }`}
              >
                Premium
              </Text>
            </View>
          </Card>
        </View>

        {/* Pricing Plans */}
        <View className='px-6 mb-8'>
          <Text
            className={`text-xl font-inter-bold mb-6 text-center ${
              colorScheme === 'dark' ? 'text-white' : 'text-secondary-900'
            }`}
          >
            Choose Your Plan
          </Text>

          <View className='space-y-4'>
            {plans.map((plan) => (
              <Card
                key={plan.id}
                variant={selectedPlan === plan.id ? 'gradient' : 'elevated'}
                padding='lg'
              >
                <View className='flex-row items-center justify-between'>
                  <View className='flex-1'>
                    <View className='flex-row items-center mb-2'>
                      <Text
                        className={`text-lg font-inter-bold ${
                          colorScheme === 'dark' ? 'text-white' : 'text-secondary-900'
                        }`}
                      >
                        {plan.name}
                      </Text>
                      {plan.popular && (
                        <View className='ml-2 px-2 py-1 bg-primary-500 rounded-full'>
                          <Text className='text-xs font-inter-semibold text-white'>Popular</Text>
                        </View>
                      )}
                    </View>

                    <View className='flex-row items-baseline'>
                      <Text
                        className={`text-2xl font-inter-bold ${
                          colorScheme === 'dark' ? 'text-white' : 'text-secondary-900'
                        }`}
                      >
                        {plan.price}
                      </Text>
                      <Text
                        className={`text-sm font-inter-regular ml-1 ${
                          colorScheme === 'dark' ? 'text-secondary-400' : 'text-secondary-600'
                        }`}
                      >
                        {plan.period}
                      </Text>
                    </View>

                    {plan.savings && (
                      <Text className='text-sm font-inter-semibold text-green-500 mt-1'>
                        {plan.savings}
                      </Text>
                    )}
                  </View>

                  <Button
                    title={selectedPlan === plan.id ? 'Selected' : 'Select'}
                    onPress={() => setSelectedPlan(plan.id)}
                    variant={selectedPlan === plan.id ? 'primary' : 'outline'}
                    size='sm'
                  />
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* CTA Buttons */}
        <View className='px-6 pb-8 space-y-4'>
          <Button
            title={loading ? '' : t('premium.startFreeTrial')}
            onPress={() => handleSubscribe(selectedPlan)}
            loading={loading}
            gradient
            size='lg'
            icon={!loading && <Zap size={20} color='white' />}
          />

          <Button title={t('premium.restorePurchases')} onPress={handleRestore} variant='ghost' />

          <Text
            className={`text-xs font-inter-regular text-center leading-5 ${
              colorScheme === 'dark' ? 'text-secondary-500' : 'text-secondary-500'
            }`}
          >
            {t('premium.freeTrial')} • Cancel anytime • Auto-renewal can be turned off in Account
            Settings
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
