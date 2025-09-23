- Ekranların lokalizasyonu yapılacak. 
- profil ekranı düzenlenecek. yaratılanlar aktarılacak.
- backend serivi yazılacak bunun için.

1. services/index.ts boş, authService implementasyonu olmadığı için app/auth/signup.tsx:2, app/auth/forgot-password.tsx:2, app/(tabs)/settings.tsx:9 derleme hatası veriyor; Firebase tabanlı servis katmanı eklenmeli.

2. Misafir akışı onboarding’de açık (app/index.tsx:27), ancak içerik oluşturma zinciri kimlik doğrulaması istiyor (store/slices/contentCreationSlice.ts:82-109); anonim kullanıcı desteği ekleyin ya da “misafir devam et” seçeneğini kaldırın.

3. Fal API’si “YOUR_FAL_KEY” ile sabit (store/slices/contentCreationSlice.ts:7-10); EAS ortam değişkeni, hata yakalama ve kota kontrolü tamamlanmadıkça üretim yapay zekâ çağrıları çalışmaz.

4. Profil sekmesi maket veri kullanıyor (app/(tabs)/profile.tsx:45-104); gerçek kullanım geçmişi, görsel listesi ve Firestore/Firebase Storage akışı eklenmeden kullanıcıya yanıltıcı içerik sunuluyor.

5. Ayarlar ekranındaki Gizlilik/TOS öğeleri sadece log atıyor (app/(tabs)/settings.tsx:297-304) ve kopya başka ürün adından bahsediyor (app/(tabs)/settings.tsx:86-110); yasal sayfalar, destek kanalı ve marka dili tamamlanmalı.

6. Uygun KVKK/GDPR metinleri, 13+ yaş beyanı ve AI çıktılarına dair sorumluluk reddi eklenmeli.

7. app/premium.tsx:17-150 mock; gerçek IAP aboneliği uygulanmalı ya da ekran mağaza metninden çıkarılmalı.

8. iOS izin açıklamaları jenerik (ios/studioai/Info.plist:33-58), Android manifestinde modası geçmiş izinler var (android/app/src/main/AndroidManifest.xml:2-18); platform politikalarına göre güncelleyin.

9. Crash/performans izleme ve anonim analitik entegrasyonu yok; yayın öncesi Sentry benzeri bir çözüm ve KVKK’ya uyumlu veri işleme eklenmeli.

10. localization/locales/*.json dosyalarında olmayan özelliklere referans var; çeviri içerikleri gerçek fonksiyonlarla hizalanmalı.