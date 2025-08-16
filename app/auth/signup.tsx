import Logo from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { authService, SignUpCredentials, SignUpData } from '@/services/authService';

import { yupResolver } from '@hookform/resolvers/yup';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import * as yup from 'yup';

const { height: screenHeight } = Dimensions.get('window');

interface SignUpFormData extends SignUpData {
  confirmPassword: string;
}

const schema = yup.object().shape({
  displayName: yup.string().min(2, 'Ad en az 2 karakter olmalıdır').required('Ad gereklidir'),
  email: yup
    .string()
    .email('Geçerli bir e-posta adresi girin')
    .required('E-posta adresi gereklidir'),
  password: yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre gereklidir'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Şifreler eşleşmiyor')
    .required('Şifre tekrarı gereklidir'),
});

export default function SignUpScreen() {
  const { colorScheme } = useTheme();
  const [loading, setLoadingState] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleSignUp = async (data: SignUpFormData) => {
    setLoadingState(true);

    try {
      const signUpData: SignUpCredentials = {
        email: data.email,
        password: data.password,
        displayName: data.displayName,
      };

      const response = await authService.signUp(signUpData);

      Alert.alert('Başarılı!', 'Hesabınız başarıyla oluşturuldu.', [
        { text: 'Tamam', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Hesap oluşturulamadı';
      Alert.alert('Hata', errorMessage);
    } finally {
      setLoadingState(false);
    }
  };

  const handleGoToSignIn = () => {
    router.push('/auth/signin');
  };

  const handleGoBack = () => {
    router.back();
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
          <View style={{ paddingHorizontal: 24, paddingTop: 40 }}>
            {/* Back Button */}
            <Button
              title=''
              onPress={handleGoBack}
              variant='ghost'
              icon={<ArrowLeft size={24} color={colorScheme === 'dark' ? 'white' : '#1f2937'} />}
              style={{ alignSelf: 'flex-start', marginBottom: 20 }}
            />

            {/* Header */}
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
                Hesap Oluştur
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280',
                  textAlign: 'center',
                  lineHeight: 24,
                }}
              >
                Başlamak için hesap oluşturun
              </Text>
            </View>

            {/* Sign Up Form */}
            <Card variant='glass' padding='lg' blur>
              <View style={{ gap: 20 }}>
                <Controller
                  control={control}
                  name='displayName'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label='Ad Soyad'
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

                <Controller
                  control={control}
                  name='email'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label='E-posta'
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
                      label='Şifre'
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

                <Controller
                  control={control}
                  name='confirmPassword'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label='Şifre Tekrar'
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

                <Button
                  title={loading ? '' : 'Hesap Oluştur'}
                  onPress={handleSubmit(handleSignUp)}
                  loading={loading}
                  disabled={!isValid || loading}
                  gradient
                  size='lg'
                  style={{ marginTop: 10 }}
                />
              </View>
            </Card>

            {/* Sign In Link */}
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280',
                  textAlign: 'center',
                }}
              >
                Zaten hesabınız var mı?
              </Text>
              <Button
                title='Giriş Yap'
                onPress={handleGoToSignIn}
                variant='ghost'
                style={{ marginTop: 8 }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
