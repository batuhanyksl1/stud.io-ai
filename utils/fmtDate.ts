/**
 * Tarih formatlama yardımcı fonksiyonları
 */

/**
 * Tarihi ay ve yıl formatında döndürür (örn: "Ocak 2024")
 * @param date - Formatlanacak tarih
 * @returns Formatlanmış tarih string'i
 */
export const formatJoinDate = (date: Date) => {
  return date.toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });
};

/**
 * Timestamp'i gün ve ay formatında döndürür (örn: "15 Oca")
 * @param timestamp - Formatlanacak timestamp (milisaniye)
 * @returns Formatlanmış tarih string'i
 */
export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });
};

