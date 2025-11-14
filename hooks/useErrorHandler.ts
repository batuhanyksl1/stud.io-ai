import { router } from "expo-router";
import { useEffect, useRef } from "react";

/**
 * Hata yönetimi ve özellikle 402 hatası için otomatik yönlendirme mantığını sağlar
 */
export function useErrorHandler(
  errorMessage: string | null,
  setErrorMessage: (message: string | null) => void,
) {
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (!hasRedirectedRef.current && errorMessage?.includes("402")) {
      hasRedirectedRef.current = true;
      // Bu hatayı ekranda göstermemek için temizleyelim
      setErrorMessage(null);
      // Premium ekranına yönlendir
      router.push("/premium");
    } else if (!errorMessage?.includes("402")) {
      // Error mesajı değişti ve artık 402 içermiyorsa flag'i sıfırla
      hasRedirectedRef.current = false;
    }
  }, [errorMessage, setErrorMessage]);

  return {
    shouldShowError: errorMessage && !errorMessage.includes("402"),
  };
}

