import { firestore } from "@/firebase.config";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export interface UserImage {
  id: string;
  url: string;
  timestamp: number;
  filterName: string;
  isFavorite: boolean;
  downloads: number;
  fileName?: string;
  contentType?: string;
  fileSize?: number;
}

export function useUserImages() {
  const { user } = useAuth();
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("=== useUserImages useEffect çalıştı ===");
    console.log("User objesi:", user);
    console.log("User UID:", user?.uid);
    console.log("User email:", user?.email);

    if (!user?.uid) {
      console.log("❌ User UID yok, boş array döndürülüyor");
      setImages([]);
      setLoading(false);
      return;
    }

    console.log("✅ User UID var:", user.uid, "Görseller çekiliyor...");

    const fetchUserImages = async () => {
      try {
        console.log("🔄 Kullanıcı dokümanları çekiliyor...");
        setLoading(true);
        setError(null);

        // Kullanıcı giriş yapmış mı kontrol et
        if (!user?.uid) {
          setError("Kullanıcı giriş yapmamış!");
          setImages([]);
          return;
        }

        console.log("👤 Kullanıcı UID:", user.uid);

        // aiToolRequests koleksiyonundan kullanıcının dokümanlarını çek
        const querySnapshot = await firestore()
          .collection("aiToolRequests")
          .where("userId", "==", user.uid)
          .get();

        console.log("📊 Sorgu sonucu:", querySnapshot.docs.length, "doküman");

        if (querySnapshot.docs.length === 0) {
          setError("Bu kullanıcı için doküman bulunamadı!");
          setImages([]);
        } else {
          const docs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setImages([]); // Şimdilik boş array, veri yapısını görmek için
          console.log("✅ Kullanıcı dokümanları yüklendi:", docs.length);
          console.log("📋 TÜM DOKÜMANLAR:");
          docs.forEach((doc, index) => {
            console.log(`📄 Doküman #${index + 1}:`, doc);
          });
        }
      } catch (err: any) {
        console.error("❌ Veri çekme hatası:", err);
        setError(`Hata: ${err.message}`);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserImages();
  }, [user?.uid, user]);

  const toggleFavorite = async (imageId: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, isFavorite: !img.isFavorite } : img,
      ),
    );
    // TODO: Firestore'da favori durumunu güncelle
  };

  const deleteImage = async (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    // TODO: Firestore'dan görseli sil
  };

  return {
    images,
    loading,
    error,
    toggleFavorite,
    deleteImage,
    refetch: () => {
      if (user?.uid) {
        // useEffect'i tetiklemek için user.uid'yi değiştir
        setImages([]);
        setLoading(true);
      }
    },
  };
}
