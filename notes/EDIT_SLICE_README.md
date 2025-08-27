# Edit Slice Kullanım Kılavuzu

Bu dokümantasyon, `editSlice.ts` dosyasının nasıl kullanılacağını açıklar. Bu slice, görsel seçme, Firebase Storage'a yükleme ve dummy servise gönderme işlemlerini yönetir.

## Özellikler

- 📱 **Görsel Seçme**: Galeriden görsel seçme veya kamera ile fotoğraf çekme
- ☁️ **Firebase Storage**: Seçilen görselleri Firebase Storage'a yükleme
- 🤖 **Dummy Servis**: Yüklenen görselleri işlemek için dummy servis entegrasyonu
- 📊 **Progress Tracking**: Yükleme ve işleme durumlarını takip etme
- 🗑️ **Silme**: Görselleri hem local'den hem de storage'dan silme

## Kurulum

### 1. Store'a Ekleme

`store/index.ts` dosyasında edit reducer'ı zaten eklenmiş durumda:

```typescript
import editReducer from "@/store/slices/editSlice";

export const store = configureStore({
  reducer: {
    // ... diğer reducer'lar
    edit: editReducer,
  },
});
```

### 2. Gerekli Bağımlılıklar

Aşağıdaki paketler zaten `package.json`'da mevcut:

- `expo-image-picker`: Görsel seçme ve kamera erişimi
- `firebase`: Firebase Storage işlemleri
- `@reduxjs/toolkit`: Redux state yönetimi

## Kullanım

### Temel Kullanım

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  pickImage,
  takePhoto,
  uploadImageToStorage,
  processImageWithDummyService,
  deleteImage,
} from '@/store/slices/editSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { images, isUploading, isProcessing, error } = useAppSelector((state) => state.edit);

  // Galeriden görsel seç
  const handlePickImage = async () => {
    try {
      await dispatch(pickImage()).unwrap();
    } catch (error) {
      console.error('Görsel seçme hatası:', error);
    }
  };

  // Kamera ile fotoğraf çek
  const handleTakePhoto = async () => {
    try {
      await dispatch(takePhoto()).unwrap();
    } catch (error) {
      console.error('Fotoğraf çekme hatası:', error);
    }
  };

  // Görseli storage'a yükle
  const handleUpload = async (imageId: string) => {
    try {
      await dispatch(uploadImageToStorage(imageId)).unwrap();
    } catch (error) {
      console.error('Yükleme hatası:', error);
    }
  };

  // Görseli işle
  const handleProcess = async (imageId: string) => {
    try {
      await dispatch(processImageWithDummyService(imageId)).unwrap();
    } catch (error) {
      console.error('İşleme hatası:', error);
    }
  };

  // Görseli sil
  const handleDelete = async (imageId: string) => {
    try {
      await dispatch(deleteImage(imageId)).unwrap();
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  return (
    <View>
      {/* UI bileşenleri */}
    </View>
  );
}
```

### State Yapısı

```typescript
interface EditState {
  images: EditImage[]; // Seçilen görseller listesi
  selectedImageId: string | null; // Seçili görsel ID'si
  isImagePickerOpen: boolean; // Görsel seçici açık mı?
  isUploading: boolean; // Yükleme durumu
  isProcessing: boolean; // İşleme durumu
  error: string | null; // Hata mesajı
  uploadProgress: number; // Yükleme progress'i (0-100)
}

interface EditImage {
  id: string; // Benzersiz ID
  uri: string; // Görsel URI'si
  fileName: string; // Dosya adı
  fileSize: number; // Dosya boyutu (byte)
  mimeType: string; // MIME tipi
  uploadProgress?: number; // Yükleme progress'i
  downloadURL?: string; // Firebase download URL'i
  isUploaded: boolean; // Yüklendi mi?
  isProcessing: boolean; // İşleniyor mu?
  processingResult?: any; // İşleme sonucu
  error?: string; // Hata mesajı
  createdAt: Date; // Oluşturulma tarihi
}
```

### Async Thunks

#### 1. `pickImage()`

Galeriden görsel seçer.

```typescript
await dispatch(pickImage()).unwrap();
```

#### 2. `takePhoto()`

Kamera ile fotoğraf çeker.

```typescript
await dispatch(takePhoto()).unwrap();
```

#### 3. `uploadImageToStorage(imageId: string)`

Seçilen görseli Firebase Storage'a yükler.

```typescript
await dispatch(uploadImageToStorage(imageId)).unwrap();
```

#### 4. `processImageWithDummyService(imageId: string)`

Yüklenen görseli dummy servise gönderir ve işler.

```typescript
await dispatch(processImageWithDummyService(imageId)).unwrap();
```

#### 5. `deleteImage(imageId: string)`

Görseli hem local'den hem de storage'dan siler.

```typescript
await dispatch(deleteImage(imageId)).unwrap();
```

### Actions

#### 1. `setSelectedImage(imageId: string | null)`

Seçili görseli değiştirir.

```typescript
dispatch(setSelectedImage(imageId));
```

#### 2. `clearError()`

Hata mesajını temizler.

```typescript
dispatch(clearError());
```

#### 3. `clearAllImages()`

Tüm görselleri temizler.

```typescript
dispatch(clearAllImages());
```

## Örnek Component

`ImageEditor.tsx` dosyasında tam bir örnek component bulunmaktadır. Bu component:

- Görsel seçme ve çekme butonları
- Yükleme progress bar'ı
- İşleme durumu göstergesi
- Görsel galerisi
- Hata mesajları
- İşleme sonuçları

içerir.

## İzinler

### iOS (Info.plist)

```xml
<key>NSCameraUsageDescription</key>
<string>Bu uygulama fotoğraf çekmek için kameraya erişim istiyor</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Bu uygulama görsel seçmek için galeriye erişim istiyor</string>
```

### Android (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Firebase Storage Kurulumu

Firebase Storage'ın düzgün çalışması için:

1. Firebase Console'da Storage'ı etkinleştirin
2. Storage kurallarını yapılandırın:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Hata Yönetimi

Tüm async thunk'lar hata durumlarını yakalar ve state'e kaydeder:

```typescript
const { error } = useAppSelector((state) => state.edit);

if (error) {
  // Hata mesajını göster
  Alert.alert("Hata", error);
}
```

## Performans Optimizasyonları

1. **Görsel Sıkıştırma**: Seçilen görseller otomatik olarak sıkıştırılır
2. **Progress Tracking**: Yükleme durumu gerçek zamanlı takip edilir
3. **Memory Management**: Silinen görseller hem local'den hem de storage'dan temizlenir

## Gelecek Geliştirmeler

- [ ] Çoklu görsel seçimi
- [ ] Görsel düzenleme araçları
- [ ] Gerçek AI servis entegrasyonu
- [ ] Offline desteği
- [ ] Görsel filtreleme ve arama
- [ ] Batch işlemler
