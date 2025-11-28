/**
 * Google Sign-In Configuration
 *
 * Web Client ID'yi Firebase Console'dan almanız gerekiyor:
 * 1. Firebase Console'a gidin
 * 2. Authentication > Sign-in method > Google > Web SDK configuration
 * 3. Web Client ID'yi kopyalayın ve aşağıya yapıştırın
 *
 * iOS Client ID'yi almak için:
 * 1. Firebase Console > Authentication > Sign-in method > Google
 * 2. iOS SDK configuration bölümündeki Client ID'yi kopyalayın
 * VEYA
 * Google Cloud Console > APIs & Services > Credentials
 * iOS client ID'yi bulun
 */

// Web Client ID formatı: xxxxxx-xxxxxxxxxxxx.apps.googleusercontent.com
export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  "216158155286-79ip0e8hfqiimqnpv638iu2srgv2gfmg.apps.googleusercontent.com"; // Web Client ID (düzeltilmiş)

// iOS Client ID formatı: xxxxxx-xxxxxxxxxxxx.apps.googleusercontent.com
// GoogleService-Info.plist dosyasındaki CLIENT_ID değerini kullanın
export const GOOGLE_IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
  "216158155286-ffbvpd0reu5tlui3b82u65ih37ivcpqs.apps.googleusercontent.com"; // iOS Client ID (GoogleService-Info.plist'ten)
