import Logo from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/hooks/useTheme';
import { authService } from '@/services/authService';
import { yupResolver } from '@hookform/resolvers/yup';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Mail, Send } from 'lucide-react-native';
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

interface ForgotPasswordData {
  email: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Geçerli bir e-posta adresi girin')
    .required('E-posta adresi gereklidir'),
});

export default function ForgotPasswordScreen() {
  const { colorScheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<ForgotPasswordData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleResetPassword = async (data: ForgotPasswordData) => {
    setLoading(true);

    try {
      await authService.forgotPassword(data.email);
      setEmailSent(true);
      Alert.alert(
        'E-posta Gönderildi',
        'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.',
        [{ text: 'Tamam' }],
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'E-posta gönderilemedi';
      Alert.alert('Hata', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToSignIn = () => {
    router.push('/auth/signin');
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
                Şifremi Unuttum
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280',
                  textAlign: 'center',
                  lineHeight: 24,
                  paddingHorizontal: 20,
                }}
              >
                {emailSent
                  ? 'Şifre sıfırlama bağlantısı gönderildi'
                  : 'E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim'}
              </Text>
            </View>

            {/* Reset Password Form */}
            <Card variant='glass' padding='lg' blur>
              {emailSent ? (
                <View style={{ alignItems: 'center', gap: 20 }}>
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: colorScheme === 'dark' ? '#065f46' : '#d1fae5',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Send size={40} color={colorScheme === 'dark' ? '#10b981' : '#059669'} />
                  </View>

                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: colorScheme === 'dark' ? '#ffffff' : '#1f2937',
                      textAlign: 'center',
                    }}
                  >
                    E-posta Gönderildi!
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280',
                      textAlign: 'center',
                      lineHeight: 20,
                    }}
                  >
                    {getValues('email')} adresine şifre sıfırlama bağlantısı gönderildi. E-postanızı
                    kontrol edin ve bağlantıya tıklayın.
                  </Text>

                  <Button
                    title='Giriş Sayfasına Dön'
                    onPress={handleGoToSignIn}
                    gradient
                    size='lg'
                    style={{ width: '100%', marginTop: 10 }}
                  />
                </View>
              ) : (
                <View style={{ gap: 20 }}>
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

                  <Button
                    title={loading ? '' : 'Şifre Sıfırlama Bağlantısı Gönder'}
                    onPress={handleSubmit(handleResetPassword)}
                    loading={loading}
                    disabled={!isValid || loading}
                    gradient
                    size='lg'
                    style={{ marginTop: 10 }}
                  />
                </View>
              )}
            </Card>

            {/* Back to Sign In */}
            {!emailSent && (
              <View style={{ alignItems: 'center', marginTop: 24 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280',
                    textAlign: 'center',
                  }}
                >
                  Şifrenizi hatırladınız mı?
                </Text>
                <Button
                  title='Giriş Yap'
                  onPress={handleGoToSignIn}
                  variant='ghost'
                  style={{ marginTop: 8 }}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
