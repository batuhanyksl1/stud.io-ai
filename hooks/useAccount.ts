import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";

export function useAccount() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const isFirstLoadRef = useRef<boolean>(true);

  const fetchAccount = useCallback(async () => {
    try {
      setError(null);

      const currentUser = auth().currentUser;

      console.log("currentUser:", currentUser?.uid);
      if (!currentUser) {
        setError("Kullanıcı giriş yapmamış");
        setData(null);
        return;
      }

      const snapshot = await firestore()
        .collection("Account")
        .doc(currentUser.uid)
        .get();

      setData(snapshot.exists() ? snapshot.data() : null);
    } catch (err: any) {
      setError(err?.message ?? "Bilinmeyen hata");
      setData(null);
    }
  }, []);

  useEffect(() => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      setError("Kullanıcı giriş yapmamış");
      setData(null);
      setLoading(false);
      return;
    }

    // Real-time listener kur
    const unsubscribe = firestore()
      .collection("Account")
      .doc(currentUser.uid)
      .onSnapshot(
        (snapshot) => {
          if (snapshot.exists()) {
            setData(snapshot.data());
            setError(null);
          } else {
            setData(null);
          }
          // İlk yükleme tamamlandığında loading'i false yap
          if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            setLoading(false);
          }
        },
        (err) => {
          setError(err?.message ?? "Bilinmeyen hata");
          setData(null);
          if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            setLoading(false);
          }
        },
      );

    unsubscribeRef.current = unsubscribe;

    // Cleanup fonksiyonu
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchAccount,
  };
}
