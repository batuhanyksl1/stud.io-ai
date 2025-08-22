# Stud.io AI - Codebase Mimarisi

## 🏗️ **Genel Yapı**

Bu proje React Native + Expo Router kullanarak geliştirilmiş bir AI fotoğraf düzenleme uygulamasıdır. Codebase, modern React Native best practice'lerine uygun olarak organize edilmiştir.

## 📁 **Klasör Yapısı**

```
stud.io-ai/
├── app/                    # Expo Router sayfaları
│   ├── (tabs)/            # Tab navigasyonu
│   ├── auth/              # Kimlik doğrulama sayfaları
│   └── _layout.tsx        # Ana layout
├── components/            # Yeniden kullanılabilir bileşenler
│   ├── ui/               # Temel UI bileşenleri
│   ├── auth/             # Auth bileşenleri
│   └── index.ts          # Merkezi export
├── providers/            # Context Provider'ları
│   ├── AppProvider.tsx   # Ana provider
│   └── index.ts          # Export
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Kimlik doğrulama hook'u
│   ├── useTheme.ts       # Tema hook'u
│   └── index.ts          # Merkezi export
├── store/                # Redux store
│   ├── slices/           # Redux slices
│   ├── hooks.ts          # Redux hooks
│   └── index.ts          # Store konfigürasyonu
├── services/             # API servisleri
│   ├── authService.ts    # Kimlik doğrulama servisi
│   └── index.ts          # Merkezi export
├── types/                # TypeScript tip tanımları
├── constants/            # Sabitler ve tasarım tokenları
├── utils/                # Yardımcı fonksiyonlar
└── assets/               # Statik dosyalar
```

## 🔄 **State Yönetimi**

### **Redux Store Yapısı**

- **auth**: Kimlik doğrulama durumu
- **theme**: Tema ayarları
- **user**: Kullanıcı profili

### **Provider Yapısı**

```typescript
// Tek provider ile tüm state yönetimi
<AppProvider>
  <AppContent />
</AppProvider>
```

## 🎨 **Tema Sistemi**

### **Renk Şemaları**

- Light Mode
- Dark Mode
- System Mode (otomatik)

### **Tasarım Tokenları**

- Renkler
- Tipografi
- Boşluklar
- Border radius
- Gölgeler

## 🔐 **Kimlik Doğrulama**

### **Auth Flow**

1. Giriş/Kayıt
2. Token yönetimi
3. Oturum kontrolü
4. Güvenli çıkış

### **Auth Hook**

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

## 📱 **Sayfa Yapısı**

### **Ana Sayfalar**

- **Splash**: Uygulama başlangıcı
- **Home**: Ana sayfa (carousel + servisler)
- **Editor**: Fotoğraf düzenleme
- **Profile**: Kullanıcı profili
- **Settings**: Ayarlar

### **Auth Sayfaları**

- **Sign In**: Giriş
- **Sign Up**: Kayıt
- **Forgot Password**: Şifre sıfırlama

## 🧩 **Bileşen Sistemi**

### **UI Bileşenleri**

- Button
- Card
- Input
- LoadingSpinner

### **Themed Bileşenler**

- ThemedButton
- ThemedCard
- ThemedText
- ThemedView

### **Feature Bileşenler**

- Logo
- ImageEditor
- FilterPreview
- ScrollContainer

## 🔧 **Import Yapısı**

### **Merkezi Export'lar**

```typescript
// Components
import { Button, ThemedCard, Logo } from '@/components';

// Hooks
import { useAuth, useTheme } from '@/hooks';

// Services
import { authService } from '@/services';

// Constants
import { Colors, Spacing } from '@/constants';
```

## 🚀 **Geliştirme Kuralları**

### **1. Dosya Organizasyonu**

- Her feature kendi klasöründe
- Merkezi export dosyaları kullan
- Tutarlı naming convention

### **2. State Yönetimi**

- Redux Toolkit kullan
- Async thunks ile API çağrıları
- Normalized state yapısı

### **3. Bileşen Geliştirme**

- TypeScript kullan
- Props interface tanımla
- Memoization uygula

### **4. Styling**

- Design tokenları kullan
- Responsive tasarım
- Accessibility desteği

## 📦 **Bağımlılıklar**

### **Ana Kütüphaneler**

- React Native 0.79.5
- Expo Router 5.1.4
- Redux Toolkit 2.8.2
- React Hook Form 7.62.0

### **UI Kütüphaneleri**

- Expo Linear Gradient
- Lucide React Native
- React Native Vector Icons

### **Geliştirme Araçları**

- TypeScript
- ESLint
- Prettier

## 🔄 **Migrations**

### **Provider Yapısı**

- Eski: Çoklu provider (ReduxProvider, ThemeProvider, AuthProvider)
- Yeni: Tek AppProvider

### **Import Yapısı**

- Eski: Direkt dosya import'ları
- Yeni: Merkezi export'lar

### **State Yönetimi**

- Eski: Context API + Redux karışımı
- Yeni: Sadece Redux Toolkit

## 🎯 **Gelecek Planları**

1. **Performance Optimizasyonu**
   - React.memo kullanımı
   - Lazy loading
   - Image optimization

2. **Testing**
   - Unit testler
   - Integration testler
   - E2E testler

3. **CI/CD**
   - Automated testing
   - Code quality checks
   - Deployment pipeline

4. **Monitoring**
   - Error tracking
   - Performance monitoring
   - Analytics
