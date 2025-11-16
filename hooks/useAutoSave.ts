import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

/**
 * Auto-save ayarını yöneten hook
 * AsyncStorage'dan ayarı yükler ve otomatik kaydetme mantığını sağlar
 */
export function useAutoSave(
  createdImageUrl: string | null,
  onDownloadImage: () => Promise<void>,
) {
  const [autoSave, setAutoSave] = useState<boolean>(true);

  // Otomatik kaydet ayarını yükle
  useEffect(() => {
    const loadAutoSaveSetting = async () => {
      try {
        const savedAutoSave = await AsyncStorage.getItem("autoSave");
        if (savedAutoSave !== null) {
          setAutoSave(JSON.parse(savedAutoSave));
        }
      } catch (error) {
        console.error("Otomatik kaydet ayarı yüklenirken hata:", error);
      }
    };
    loadAutoSaveSetting();
  }, []);

  // Sonuç geldiğinde otomatik kaydet
  useEffect(() => {
    if (createdImageUrl && autoSave) {
      console.log("🔄 Otomatik kaydet başlatılıyor...");
      onDownloadImage();
    }
  }, [createdImageUrl, autoSave, onDownloadImage]);

  return { autoSave };
}
