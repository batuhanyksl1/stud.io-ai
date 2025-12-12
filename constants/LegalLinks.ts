/**
 * Legal Links - Privacy Policy ve Terms of Use URL'leri
 * Apple Review gereksinimleri için abonelik sayfasında gösterilmeli
 */

// TODO: Gerçek URL'leri buraya ekleyin
// Şimdilik placeholder URL'ler kullanılıyor

export const LEGAL_LINKS = {
  // Gizlilik Politikası - Privacy Policy
  PRIVACY_POLICY: "https://batuhanyuksel.notion.site/Gizlilik-Politikas-27bb651f144e80f7b32ece22facf79fa",
  
  // Kullanım Şartları - Terms of Use (EULA)
  TERMS_OF_USE: "https://batuhanyuksel.notion.site/Kullanim-Sartlari-EULA-27bb651f144e80f7b32ece22facf79fa",
} as const;

// URL'lerin doğru formatta olduğunu kontrol eden yardımcı fonksiyon
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

