import { useAppSelector } from "@/store/hooks";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { useEffect, useMemo } from "react";

interface UseAuthProtectionOptions {
  /** Service identifier to check against free services */
  serviceId?: string;
  /** List of service IDs that don't require authentication */
  freeServiceIds?: string[];
  /** Redirect path when authentication is required */
  redirectPath?: string;
  /** Skip protection entirely */
  skip?: boolean;
}

interface UseAuthProtectionReturn {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether protection check is still processing (redirecting) */
  isProtecting: boolean;
  /** Whether this service is free (doesn't require auth) */
  isFreeService: boolean;
}

const DEFAULT_FREE_SERVICES: string[] = [];
const DEFAULT_REDIRECT_PATH = "/auth";

export const useAuthProtection = (
  options: UseAuthProtectionOptions = {},
): UseAuthProtectionReturn => {
  const {
    serviceId,
    freeServiceIds = DEFAULT_FREE_SERVICES,
    redirectPath = DEFAULT_REDIRECT_PATH,
    skip = false,
  } = options;

  const pathname = usePathname();
  const params = useLocalSearchParams();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const isFreeService = useMemo(() => {
    if (!serviceId) return false;
    return freeServiceIds.includes(serviceId);
  }, [serviceId, freeServiceIds]);

  // Protection'ın aktif olup olmadığını belirle
  const isProtecting = useMemo(() => {
    if (skip) return false;
    if (isAuthenticated) return false;

    // serviceId varsa ve ücretsiz değilse, koruma aktif
    if (serviceId && !isFreeService) return true;

    // serviceId yoksa ve login değilse, koruma aktif
    if (!serviceId) return true;

    // Ücretsiz servis listesi boş olsa bile auth gerekli
    // Bu mantık yukarıdaki serviceId check ile zaten kapsanıyor ama netlik için kalsın
    if (isFreeService) return false;

    return false;
  }, [skip, isAuthenticated, serviceId, isFreeService]);

  // Yönlendirme effect'i
  useEffect(() => {
    if (isProtecting) {
      // Mevcut path ve parametreleri alıp returnUrl oluştur
      const queryString = new URLSearchParams(params as any).toString();
      const currentPath = pathname + (queryString ? `?${queryString}` : "");
      const returnUrl = encodeURIComponent(currentPath);
      
      router.replace(`${redirectPath}?returnUrl=${returnUrl}`);
    }
  }, [isProtecting, redirectPath, pathname, params]);

  return {
    isAuthenticated,
    isProtecting,
    isFreeService,
  };
};

