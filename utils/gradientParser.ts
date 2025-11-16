/**
 * Gradient string'ini parse eder ve renk array'i döndürür
 * @param gradient - JSON string formatında gradient renkleri
 * @returns Renk array'i, parse hatası durumunda fallback renkler
 */
export function parseGradient(gradient?: string): string[] {
  if (gradient) {
    try {
      return JSON.parse(gradient);
    } catch {
      return ["#0077B5", "#005885"]; // Parse hatası durumunda fallback
    }
  }
  return ["#0077B5", "#005885"]; // Gradient yoksa fallback
}

