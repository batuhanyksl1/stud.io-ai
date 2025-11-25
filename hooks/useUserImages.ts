import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useCallback, useEffect, useState } from "react";

export interface FirestoreDocument {
  id: string;
  [key: string]: any;
}

export function useUserImages() {
  const [documents, setDocuments] = useState<FirestoreDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        setError("Kullanıcı giriş yapmamış!");
        setDocuments([]);
        return;
      }

      const querySnapshot = await firestore()
        .collection("aiToolRequests")
        .where("userId", "==", currentUser.uid)
        .get();

      if (querySnapshot.docs.length === 0) {
        setError("Bu kullanıcı için doküman bulunamadı!");
        setDocuments([]);
      } else {
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDocuments(docs);
      }
    } catch (err: any) {
      console.error("❌ Veri çekme hatası:", err);
      setError(`Hata: ${err.message}`);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser?.uid) {
      fetchUserDocuments();
    } else {
      setDocuments([]);
      setLoading(false);
      setError(null);
    }
  }, [fetchUserDocuments]);

  return {
    documents,
    loading,
    error,
    refetch: fetchUserDocuments,
  };
}
