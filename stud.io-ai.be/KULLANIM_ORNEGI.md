# BFF Servis Kullanım Örnekleri

## Ana BFF Servisi (`bffService`)

Bu servis herhangi bir URL'e istek yapmak için kullanılabilir. Güvenlik için sadece `queue.fal.run` ve `fal.run` domainlerine izin verilir.

### Kullanım:

```javascript
// Client tarafında (React, React Native vb.)
import { httpsCallable } from 'firebase/functions';

const bffService = httpsCallable(functions, 'bffService');

// POST isteği örneği
const response = await bffService({
  url: "https://queue.fal.run/fal-ai/nano-banana/edit",
  method: "POST",
  body: {
    prompt: "Make this image more colorful",
    image_urls: ["https://example.com/image.jpg"],
    guidance_scale: 3.5,
    num_images: 1,
    output_format: "jpeg",
    safety_tolerance: "2"
  },
  useAuth: true // FAL API key kullan
});

// GET isteği örneği
const statusResponse = await bffService({
  url: "https://queue.fal.run/fal-ai/nano-banana/requests/12345/status",
  method: "GET",
  useAuth: true
});
```

## Özel AI Tool Servisleri

### 1. AI Tool Request (`aiToolRequest`)

```javascript
const aiToolRequest = httpsCallable(functions, 'aiToolRequest');

const response = await aiToolRequest({
  prompt: "Make this image brighter",
  imageUrl: "https://example.com/image.jpg",
  extra: {
    // Ek parametreler
    strength: 0.8
  }
});
```

### 2. AI Tool Status (`aiToolStatus`)

```javascript
const aiToolStatus = httpsCallable(functions, 'aiToolStatus');

const statusResponse = await aiToolStatus({
  requestId: "12345"
});
```

### 3. AI Tool Result (`aiToolResult`)

```javascript
const aiToolResult = httpsCallable(functions, 'aiToolResult');

const resultResponse = await aiToolResult({
  requestId: "12345"
});
```

## Response Formatı

Tüm servisler aynı response formatını döner:

```javascript
{
  success: true,
  data: {
    // API'den gelen veri
  },
  url: "https://...",
  method: "GET/POST",
  timestamp: "2025-09-21T10:00:00.000Z"
}
```

## Hata Yönetimi

Servisler Firebase Functions standart hata formatını kullanır:

```javascript
try {
  const response = await bffService({...});
} catch (error) {
  console.error('Hata kodu:', error.code);
  console.error('Hata mesajı:', error.message);
  console.error('Detaylar:', error.details);
}
```

## Güvenlik

- Sadece `queue.fal.run` ve `fal.run` domainlerine istek yapılabilir
- FAL API key otomatik olarak Authorization header'ına eklenir
- İsteğe bağlı authentication kontrolü yapılabilir
