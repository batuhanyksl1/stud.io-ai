import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ru from "./locales/ru.json";
import tr from "./locales/tr.json";

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  ru: { translation: ru },
};

// Desteklenen diller
const supportedLanguages = ["en", "tr", "ru"];

// Güvenli dil algılama
const getDeviceLanguage = () => {
  try {
    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
      const deviceLang = locales[0].languageCode;
      // Desteklenen dillerden biri mi kontrol et
      if (deviceLang && supportedLanguages.includes(deviceLang)) {
        return deviceLang;
      }
    }
  } catch (error) {
    console.warn("Dil algılanamadı:", error);
  }
  return "en"; // Varsayılan dil
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: "en",
  debug: __DEV__, // Sadece geliştirme modunda debug
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  // Dil değiştirme için
  supportedLngs: supportedLanguages,
  // Eksik çeviriler için uyarı
  saveMissing: __DEV__,
});

export default i18n;
