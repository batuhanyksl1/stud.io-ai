# 🚀 Yeni HTTP Endpoint Curl Örnekleri

Artık Firebase Functions onCall yerine direkt HTTP endpoint'leri kullanıyoruz!

## 1. 🎨 AI Tool Request (aiToolRequest)

Senin verdiğin body formatıyla:

```bash
curl -X POST https://aitoolresult-br4qccjs7a-ew.a.run.app/aiToolRequest \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Put this person into an image that taken in a studio with a good background. Clean looking face with a soft smile looking into the camera",
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/studioai-980a7.firebasestorage.app/o/uploads%2FBxUr8QlqpTfB9hr85oNBBjPuPTs2%2F1758530626109.png?alt=media&token=f6e546c5-64da-48ad-add8-26a5961f190f",
    "extra": {
      "strength": 0.8
    }
  }'
```

## 2. 🔧 Generic BFF Service (bffService)

Herhangi bir URL'e istek atmak için:

```bash
curl -X POST https://aitoolresult-br4qccjs7a-ew.a.run.app/bffService \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://queue.fal.run/fal-ai/nano-banana/edit",
    "method": "POST",
    "body": {
      "prompt": "Make this image more colorful",
      "image_urls": ["https://example.com/your-image.jpg"],
      "guidance_scale": 3.5,
      "num_images": 1,
      "output_format": "jpeg",
      "safety_tolerance": "2"
    },
    "useAuth": true
  }'
```

### Status Kontrolü:
```bash
curl -X POST https://aitoolresult-br4qccjs7a-ew.a.run.app/bffService \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://queue.fal.run/fal-ai/nano-banana/requests/REQUEST_ID/status",
    "method": "GET",
    "useAuth": true
  }'
```

### Result Alma:
```bash
curl -X POST https://aitoolresult-br4qccjs7a-ew.a.run.app/bffService \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://queue.fal.run/fal-ai/nano-banana/requests/REQUEST_ID",
    "method": "GET",
    "useAuth": true
  }'
```

## 📝 Response Format

Tüm endpoint'ler aynı response formatını döner:

### ✅ Başarılı Response:
```json
{
  "success": true,
  "data": {
    // API'den gelen veri
  },
  "url": "https://...",
  "method": "POST",
  "timestamp": "2025-09-22T10:00:00.000Z"
}
```

### ❌ Hata Response:
```json
{
  "success": false,
  "error": "Hata mesajı"
}
```

## 🔒 Güvenlik

- CORS otomatik olarak handle ediliyor
- Sadece `queue.fal.run` ve `fal.run` domainlerine istek yapılabilir
- FAL API key otomatik olarak ekleniyor
- Authentication token'a gerek yok!

## 🆕 Değişenler

- ❌ Firebase ID Token gerekmez artık
- ❌ `data` wrapper'ı yok artık
- ✅ Direkt JSON body gönder
- ✅ Standard HTTP status kodları
- ✅ CORS support
