import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useCallback, useEffect, useState } from "react";

export function useAccount() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = auth().currentUser;

      if (!currentUser) {
        setError("Kullanıcı giriş yapmamış");
        setData(null);
        return;
      }

      const snapshot = await firestore()
        .collection("account")
        .doc(currentUser.uid)
        .get();

      setData(snapshot.exists() ? snapshot.data() : null);
    } catch (err: any) {
      console.log("useAccount error:", err);
      setError(err?.message ?? "Bilinmeyen hata");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return {
    data,
    loading,
    error,
    refetch: fetchAccount,
  };
}
