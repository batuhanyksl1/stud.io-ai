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


    // Koleksiyonları listele
    const listCollections = async () => {
      try {
        console.log("📁 Koleksiyonlar listeleniyor...");
        // Not: React Native Firebase'de koleksiyon listesi farklı şekilde yapılır
        // Basit bir test sorgusu yapalım
        const testQuery = await firestore()
          .collection("aiToolRequests")
          .limit(1)
          .get();
        console.log("📊 aiToolRequests koleksiyonu test sonucu:");
        console.log("- Doküman sayısı:", testQuery.docs.length);
        console.log("- Empty mi:", testQuery.empty);

        if (testQuery.docs.length > 0) {
          console.log("📄 İlk doküman ID:", testQuery.docs[0].id);
          console.log("📄 İlk doküman verisi:", testQuery.docs[0].data());
        }
      } catch (error) {
        console.error("❌ Koleksiyon listesi hatası:", error);
      }
    };

    listCollections();

    if (!user?.uid) {
      console.log("❌ User UID yok, boş array döndürülüyor");
      setImages([]);
      setLoading(false);
      return;
    }

    console.log("✅ User UID var:", user.uid, "Görseller çekiliyor...");

    const fetchUserImages = async () => {
      try {
        console.log("🚀 fetchUserImages fonksiyonu başladı");
        setLoading(true);
        setError(null);

        // aiToolRequests koleksiyonundan kullanıcının ID'sine göre dokümanı çek
        console.log("🔍 Firestore sorgusu başlıyor...");
        console.log("Koleksiyon: aiToolRequests");
        console.log("Aranan userId:", user.uid);

        // Önce userId alanı ile sorgula
        let querySnapshot = await firestore()
          .collection("aiToolRequests")
          .where("userId", "==", user.uid)
          .get();

        console.log("📊 userId sorgusu sonucu:");
        console.log("- Doküman sayısı:", querySnapshot.docs.length);
        console.log("- Empty mi:", querySnapshot.empty);

        let doc = querySnapshot.docs[0];

        // Eğer userId ile bulunamazsa, document ID ile dene
        if (!doc) {
          console.log("⚠️ userId ile bulunamadı, document ID ile deneniyor...");
          const docRef = firestore().collection("aiToolRequests").doc(user.uid);
          const docSnapshot = await docRef.get();
          console.log("📄 Document ID sorgusu sonucu:");
          console.log("- Exists:", docSnapshot.exists());
          console.log("- ID:", docSnapshot.id);

          if (docSnapshot.exists()) {
            doc = docSnapshot as any; // Type assertion for compatibility
            console.log("✅ Document ID ile bulundu!");
          } else {
            console.log("❌ Document ID ile de bulunamadı");
          }
        } else {
          console.log("✅ userId ile bulundu!");
        }

        if (!doc || !doc.exists) {
          console.log("❌ Hiçbir doküman bulunamadı");

          // Debug için: Tüm koleksiyonu listele
          console.log("🔍 Debug: Tüm koleksiyonu listeleniyor...");
          try {
            const allDocsSnapshot = await firestore()
              .collection("aiToolRequests")
              .limit(5)
              .get();

            console.log("📋 Koleksiyondaki ilk 5 doküman:");
            allDocsSnapshot.docs.forEach((doc, index) => {
              console.log(`${index + 1}. ID: ${doc.id}`);
              const data = doc.data();
              console.log(`   - userId alanı var mı:`, "userId" in data);
              console.log(`   - userId değeri:`, data.userId);
              console.log(`   - result alanı var mı:`, "result" in data);
            });
          } catch (debugError) {
            console.error("Debug sorgusu hatası:", debugError);
          }

          setImages([]);
          return;
        }

        const data = doc.data();
        console.log("Firestore'dan gelen veri:", data);

        const resultData = data?.result?.data;
        console.log("Result data:", resultData);

        if (!resultData?.images) {
          console.log("Images bulunamadı, resultData:", resultData);
          setImages([]);
          return;
        }

        // Görselleri UserImage formatına dönüştür
        const userImages: UserImage[] = Object.entries(resultData.images).map(
          ([index, imageData]: [string, any]) => ({
            id: `${user.uid}_${index}`,
            url: imageData.url || "",
            timestamp: imageData.updatedAt
              ? new Date(imageData.updatedAt).getTime()
              : Date.now(),
            filterName: imageData.filterName || "Özel Filtre",
            isFavorite: false, // Varsayılan olarak false, daha sonra ayrı bir koleksiyonda tutulabilir
            downloads: 0, // Varsayılan olarak 0, daha sonra ayrı bir koleksiyonda tutulabilir
            fileName: imageData.file_name,
            contentType: imageData.content_type,
            fileSize: imageData.file_size,
          }),
        );

        // Tarihe göre sırala (en yeni önce)
        userImages.sort((a, b) => b.timestamp - a.timestamp);

        setImages(userImages);
      } catch (err) {
        console.error("Kullanıcı görselleri yüklenirken hata:", err);
        setError("Görseller yüklenirken bir hata oluştu");
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
