import { yupResolver } from '@hookform/resolvers/yup';
import { LinearGradient } from 'expo-linear-gradient';
import { Apple, Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import * as yup from 'yup';
import { useTheme } from '../../hooks/useTheme';
import Logo from '../Logo';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  displayName?: string;
}

interface AuthScreenProps {
  mode: 'signin' | 'signup';
  onSubmit: (data: AuthFormData) => Promise<void>;
  onToggleMode: () => void;
  onSocialAuth: (provider: 'google' | 'apple') => Promise<void>;
  loading?: boolean;
}

const { height: screenHeight } = Dimensions.get('window');

export const AuthScreen: React.FC<AuthScreenProps> = ({
  mode,
  onSubmit,
  onToggleMode,
  onSocialAuth,
  loading = false,
}) => {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  const schema = yup.object().shape({
    email: yup
      .string()
      .email('Geçerli bir e-posta adresi girin')
      .required('E-posta adresi gereklidir'),
    password: yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre gereklidir'),
    ...(mode === 'signup' && {
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Şifreler eşleşmiyor')
        .required('Şifre tekrarı gereklidir'),
      displayName: yup.string().min(2, 'Ad en az 2 karakter olmalıdır').required('Ad gereklidir'),
    }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AuthFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider);
    try {
      await onSocialAuth(provider);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <LinearGradient
      colors={
        colorScheme === 'dark'
          ? ['#0f172a', '#1e293b', '#334155']
          : ['#f8fafc', '#e2e8f0', '#cbd5e1']
      }
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            minHeight: screenHeight,
            paddingVertical: 20,
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
            {/* Header with Logo */}
            <View style={{ alignItems: 'center', marginBottom: 40 }}>
              <Logo size='lg' variant='default' font='poppins' />
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: 'bold',
                  marginTop: 16,
                  marginBottom: 8,
                  color: colorScheme === 'dark' ? '#ffffff' : '#1f2937',
                  textAlign: 'center',
                }}
              >
                {mode === 'signin' ? t('auth.welcome') : t('auth.createAccount')}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280',
                  textAlign: 'center',
                  lineHeight: 24,
                }}
              >
                {mode === 'signin'
                  ? 'Hesabınıza devam etmek için giriş yapın'
                  : 'Başlamak için hesap oluşturun'}
              </Text>
            </View>

            {/* Auth Form */}
            <Card variant='glass' padding='lg' blur>
              <View style={{ gap: 20 }}>
                {mode === 'signup' && (
                  <Controller
                    control={control}
                    name='displayName'
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label={t('profile.displayName')}
                        placeholder='Adınızı girin'
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.displayName?.message}
                        leftIcon={
                          <User size={20} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
                        }
                        autoCapitalize='words'
                      />
                    )}
                  />
                )}

                <Controller
                  control={control}
                  name='email'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={t('auth.email')}
                      placeholder='E-posta adresinizi girin'
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.email?.message}
                      leftIcon={
                        <Mail size={20} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
                      }
                      keyboardType='email-address'
                      autoCapitalize='none'
                    />
                  )}
                />

                <Controller
                  control={control}
                  name='password'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={t('auth.password')}
                      placeholder='Şifrenizi girin'
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.password?.message}
                      leftIcon={
                        <Lock size={20} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
                      }
                      secureTextEntry
                    />
                  )}
                />

                {mode === 'signin' && (
                  <Button
                    title='Şifremi Unuttum'
                    onPress={() => {
                      // TODO: Implement forgot password
                      console.log('Forgot password pressed');
                    }}
                    variant='ghost'
                    size='sm'
                    style={{ alignSelf: 'flex-end', marginTop: -8 }}
                  />
                )}

                {mode === 'signup' && (
                  <Controller
                    control={control}
                    name='confirmPassword'
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label={t('auth.confirmPassword')}
                        placeholder='Şifrenizi tekrar girin'
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.confirmPassword?.message}
                        leftIcon={
                          <Lock size={20} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
                        }
                        secureTextEntry
                      />
                    )}
                  />
                )}

                <Button
                  title={loading ? '' : mode === 'signin' ? 'Giriş Yap' : 'Hesap Oluştur'}
                  onPress={handleSubmit(onSubmit)}
                  loading={loading}
                  disabled={!isValid || loading}
                  gradient
                  size='lg'
                  style={{ marginTop: 10 }}
                />

                {/* Divider */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 24,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: colorScheme === 'dark' ? '#374151' : '#d1d5db',
                    }}
                  />
                  <Text
                    style={{
                      marginHorizontal: 16,
                      fontSize: 14,
                      fontWeight: '500',
                      color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280',
                    }}
                  >
                    veya devam edin
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: colorScheme === 'dark' ? '#374151' : '#d1d5db',
                    }}
                  />
                </View>

                {/* Social Auth */}
                <View style={{ gap: 12 }}>
                  <Button
                    title={socialLoading === 'google' ? '' : 'Google ile giriş yap'}
                    onPress={() => handleSocialAuth('google')}
                    variant='outline'
                    loading={socialLoading === 'google'}
                    disabled={socialLoading !== null}
                    icon={
                      !socialLoading && (
                        <Mail size={20} color={colorScheme === 'dark' ? '#60a5fa' : '#2563eb'} />
                      )
                    }
                  />

                  {Platform.OS === 'ios' && (
                    <Button
                      title={socialLoading === 'apple' ? '' : 'Apple ile giriş yap'}
                      onPress={() => handleSocialAuth('apple')}
                      variant='outline'
                      loading={socialLoading === 'apple'}
                      disabled={socialLoading !== null}
                      icon={
                        !socialLoading && (
                          <Apple size={20} color={colorScheme === 'dark' ? '#60a5fa' : '#2563eb'} />
                        )
                      }
                    />
                  )}
                </View>
              </View>
            </Card>

            {/* Toggle Mode */}
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280',
                  textAlign: 'center',
                }}
              >
                {mode === 'signin' ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
              </Text>
              <Button
                title={mode === 'signin' ? 'Hesap Oluştur' : 'Giriş Yap'}
                onPress={onToggleMode}
                variant='ghost'
                style={{ marginTop: 8 }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};
