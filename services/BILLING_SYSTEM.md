# Token/Credit Billing System

Bu dokümantasyon, yeni token/credit bazlı billing sisteminin nasıl çalıştığını açıklar.

## Genel Bakış

Sistem, abonelik + token hibrit modelini kullanır:

- **Abonelik**: Kullanıcıya her ay belirli sayıda token/credit verir
- **Token**: Her görsel üretiminde harcanır
- **Ekstra token paketleri**: Abonelik olsun olmasın, bitince kullanıcı ek paket satın alabilir

## Plan Yapısı

### Free Plan

- İlk kayıt: 20 token (welcome bonus)
- Sonra: Günlük/haftalık ufak bonus (opsiyonel)

### Starter Plan (Aylık)

- 100 token / ay
- Max rollover: 200 token

### Pro Plan (Aylık)

- 300 token / ay
- Max rollover: 600 token

### Pro Yearly Plan (Yıllık)

- 300 token / ay (aylık gibi düşünülür)
- Max rollover: 600 token
- %20-30 indirimli

## Firestore Yapısı

### userBilling/{uid}

```typescript
{
  plan: "free" | "starter" | "pro" | "pro_yearly",
  subscriptionCredits: number,      // reset / rollover
  extraCredits: number,             // top-up, non-expiring
  maxSubscriptionCredits: number,   // rollover limit
  lastRefillAt: Timestamp,
  nextRefillAt: Timestamp | null,
  platform: "ios" | "android",
  rcCustomerId: string | null,
  entitlements: object
}
```

## Kullanım

### Hook'lar

#### useBilling()

Billing listener'ları başlatır ve otomatik olarak Firestore ve RevenueCat'i senkronize eder.

```typescript
import { useBilling } from "@/hooks";

function MyComponent() {
  useBilling(); // Otomatik olarak listener'ları başlatır
  // ...
}
```

#### useCredits()

Kredi kontrolü ve tüketimi için hook.

```typescript
import { useCredits } from "@/hooks";

function ImageGenerator() {
  const { totalCredits, canGenerate, consumeCredits, plan } = useCredits();

  const handleGenerate = async () => {
    if (!canGenerate(1)) {
      Alert.alert("Yetersiz Kredi", "Lütfen premium'a geçin veya paket alın");
      return;
    }

    try {
      await consumeCredits(1); // 1 token düşür
      // Görsel üretim API'sini çağır
      await generateImage();
    } catch (error) {
      if (error instanceof NotEnoughCreditsError) {
        Alert.alert("Yetersiz Kredi");
      }
    }
  };

  return (
    <View>
      <Text>Kalan Kredi: {totalCredits}</Text>
      <Text>Plan: {plan}</Text>
      <Button onPress={handleGenerate} disabled={!canGenerate(1)}>
        Görsel Üret
      </Button>
    </View>
  );
}
```

### Servisler

#### consumeCreditsOnBackend(cost: number)

Backend'de atomik olarak kredi düşer.

```typescript
import {
  consumeCreditsOnBackend,
  NotEnoughCreditsError,
} from "@/services/billingConsume";

try {
  await consumeCreditsOnBackend(1);
  // Başarılı
} catch (error) {
  if (error instanceof NotEnoughCreditsError) {
    // Yetersiz kredi
  }
}
```

#### maybeRefillUserCredits(uid: string, plan: SubscriptionPlan)

Kullanıcının kredilerini yeniler (yenileme tarihi gelmişse).

```typescript
import { maybeRefillUserCredits } from "@/services/billingRefill";

await maybeRefillUserCredits(userId, "pro");
```

## Redux State

```typescript
import { useAppSelector } from "@/store/hooks";

const billing = useAppSelector((state) => state.billing);

// billing.plan: SubscriptionPlan
// billing.credits.subscriptionCredits: number
// billing.credits.extraCredits: number
// billing.credits.totalCredits: number (computed)
```

## Token Tüketim Mantığı

1. Önce `subscriptionCredits`'ten düşülür
2. Yetersizse `extraCredits`'ten düşülür
3. Her ikisi de yetersizse hata fırlatılır

## Rollover Mantığı

- Tokenlar bir sonraki aya devredebilir
- Maksimum limit: `planMonthlyCredits * 2`
- Örnek: Starter plan (100/ay) → max 200 token birikebilir

## Subscription Değişiklikleri

### Upgrade (Starter → Pro)

- Hemen Pro planı aktif olur
- Mevcut krediler korunur
- İstersen bonus verilebilir (+50 kredi gibi)
- Bir sonraki yenilemede Pro miktarı kadar refill yapılır

### Downgrade (Pro → Starter)

- Plan değişikliği bir sonraki yenileme tarihinde aktif olur
- Mevcut tokenlar asla silinmez
- Bir sonraki cycle'da Starter miktarı kadar refill yapılır

## RevenueCat Entegrasyonu

RevenueCat listener otomatik olarak:

1. CustomerInfo değişikliklerini dinler
2. Plan bilgisini Firestore'a yazar
3. Entitlements'ı günceller

Entitlement mapping:

- `pro_yearly` → `pro_yearly`
- `pro` → `pro`
- `starter` → `starter`
- Yoksa → `free`

## Önemli Notlar

1. **Token kelimesini kullanıcıya göstermek zorunda değilsiniz**
   - UI'da "Kalan hak: 87" veya "Kalan kredi: 120 / 300" gibi gösterilebilir

2. **Downgrade'de token silme**
   - Asla yapmayın! Kullanıcıyı çok sinirlendirir ve support kabusu olur.

3. **Refill zamanlaması**
   - Client-side kontrol yapılır (app açıldığında)
   - İleride Cloud Function ile backend'e taşınabilir

4. **Firestore Transaction**
   - Kredi düşme işlemleri atomik olarak yapılır
   - Race condition'lar önlenir

