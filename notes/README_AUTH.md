# Firebase Auth Entegrasyonu

Bu proje Firebase Auth kullanarak kullanıcı kimlik doğrulama işlemlerini gerçekleştirir. Tüm auth işlemleri `store/slices/authSlice.ts` içerisinde yapılır.

## Kurulum

Firebase yapılandırması `firebase.config.ts` dosyasında yapılmıştır. Firebase Auth otomatik olarak `AppProvider` içerisinde initialize edilir.

## Kullanım

### useAuth Hook

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitializing,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    deleteUserAccount,
    clearAuthError,
  } = useAuth();

  // Kullanıcı girişi
  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'password123'
    });

    if (result.meta.requestStatus === 'fulfilled') {
      console.log('Giriş başarılı');
    } else {
      console.log('Giriş hatası:', result.payload);
    }
  };

  // Kullanıcı kaydı
  const handleRegister = async () => {
    const result = await register({
      email: 'user@example.com',
      password: 'password123',
      displayName: 'Test User'
    });
  };

  // Çıkış yapma
  const handleLogout = async () => {
    await logout();
  };

  // Şifre sıfırlama
  const handleResetPassword = async () => {
    await resetPassword('user@example.com');
  };

  // Profil güncelleme
  const handleUpdateProfile = async () => {
    await updateUserProfile({
      displayName: 'Yeni İsim',
      photoURL: 'https://example.com/photo.jpg'
    });
  };

  // Hesap silme
  const handleDeleteAccount = async () => {
    await deleteUserAccount({
      password: 'currentPassword'
    });
  };

  if (isInitializing) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <AuthenticatedApp />;
}
```

### Redux Store'dan Doğrudan Erişim

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signIn, signUp, signOut } from '@/store/slices/authSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    const result = await dispatch(
      signIn({
        email: 'user@example.com',
        password: 'password123',
      }),
    );
  };
}
```

## Auth State

Auth state şu bilgileri içerir:

- `user`: Mevcut kullanıcı bilgileri (null ise giriş yapılmamış)
- `isAuthenticated`: Kullanıcının giriş yapıp yapmadığı
- `isLoading`: Auth işlemi devam ediyor mu
- `isInitializing`: Firebase Auth initialize ediliyor mu
- `error`: Hata mesajı (varsa)

## Hata Yönetimi

Firebase Auth hataları Türkçe mesajlarla döndürülür:

- `auth/user-not-found`: Kullanıcı bulunamadı
- `auth/wrong-password`: Hatalı şifre
- `auth/email-already-in-use`: E-posta zaten kullanımda
- `auth/weak-password`: Zayıf şifre
- `auth/invalid-email`: Geçersiz e-posta

## Güvenlik

- Kullanıcı oturumu Firebase tarafından güvenli şekilde yönetilir
- Hesap silme işlemi için yeniden kimlik doğrulama gerekir
- Şifre sıfırlama e-postası Firebase tarafından gönderilir

## Dosya Yapısı

```
store/
├── slices/
│   └── authSlice.ts          # Ana auth slice
├── hooks.ts                  # Redux hooks
└── index.ts                  # Store yapılandırması

hooks/
└── useAuth.ts               # Auth hook

providers/
└── AppProvider.tsx          # Firebase initialize

firebase.config.ts           # Firebase yapılandırması
```
