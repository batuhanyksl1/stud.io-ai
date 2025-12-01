import { Header, ThemedCard, ThemedText, ThemedView } from "@/components";
import { ImageViewer } from "@/components/creation/ImageViewer";
import { useTheme } from "@/hooks";
import { useAppDispatch } from "@/store/hooks";
import { downloadImage } from "@/store/slices/contentCreationSlice";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type AnyDoc = Record<string, any>;

export default function GalleryItemDetailScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const id = useMemo(
    () => (Array.isArray(params.id) ? params.id[0] : params.id),
    [params.id],
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docData, setDocData] = useState<AnyDoc | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const handleOpenImage = (url: string) => {
    setViewingImage(url);
    setViewerVisible(true);
  };

  const handleDownload = async () => {
    if (viewingImage) {
      await dispatch(downloadImage({ imageUrl: viewingImage }));
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchDoc = async () => {
      try {
        if (!id) {
          setError("Geçersiz öğe kimliği");
          setLoading(false);
          return;
        }

        const snap = await firestore()
          .collection("aiToolRequests")
          .doc(String(id))
          .get();
        if (!snap.exists) {
          if (!isMounted) return;
          setError("Kayıt bulunamadı");
          setDocData(null);
        } else {
          if (!isMounted) return;
          setDocData({ id: snap.id, ...snap.data() });
          console.log("snap.data()", snap.data());
        }
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || "Bilinmeyen hata");
        setDocData(null);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchDoc();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Alanlarin hazirlanmasi
  const resultImages: { url?: string }[] = useMemo(() => {
    const arr = docData?.result?.data?.images;
    return Array.isArray(arr) ? arr : [];
  }, [docData]);

  const referenceImageUrls: string[] = useMemo(() => {
    const arr = docData?.imageUrls;
    return Array.isArray(arr) ? arr : [];
  }, [docData]);

  const coverUrl: string | undefined = useMemo(() => {
    // Sonuc gorselini once result.images[0].url'den, yoksa data.images[0].url'den al
    const urlFromResult = resultImages?.[0]?.url;
    if (urlFromResult) return urlFromResult;
    const dataImages = docData?.data?.images;
    if (Array.isArray(dataImages) && dataImages[0]?.url)
      return dataImages[0].url;
    return undefined;
  }, [docData, resultImages]);

  const createdAtText = useMemo(() => {
    const ts = docData?.createdAt;
    if (ts?.seconds) {
      try {
        const d = new Date(ts.seconds * 1000 + (ts.nanoseconds || 0) / 1e6);
        return d.toLocaleString();
      } catch {}
    }
    const updated = docData?.result?.updatedAt;
    if (updated?._seconds) {
      const d = new Date(updated._seconds * 1000);
      return d.toLocaleString();
    }
    return undefined;
  }, [docData]);

  const hasCustomPrompt: boolean = useMemo(() => {
    const val = docData?.hasCustomPrompt;
    return Boolean(val);
  }, [docData]);

  const prompt: string | undefined = useMemo(() => {
    if (!hasCustomPrompt) return undefined;
    const p = docData?.prompt;
    return typeof p === "string" ? p : undefined;
  }, [docData, hasCustomPrompt]);

  return (
    <ThemedView style={styles.container}>
      <Header leftIconType="arrow-back" rightIconType="settings" />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText
            variant="body"
            color="secondary"
            style={{ marginTop: 12 }}
          >
            Detay yükleniyor...
          </ThemedText>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <ThemedText
            variant="bodyLarge"
            weight="semiBold"
            style={{ marginBottom: 8 }}
          >
            Kayıt getirilemedi
          </ThemedText>
          <ThemedText variant="body" color="secondary">
            {error}
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 12 }}>
            {/* Buyuk sonuc gorseli */}
            {coverUrl && (
              <ThemedCard elevation="sm" style={{ padding: 8 }}>
                <ThemedText
                  variant="body"
                  weight="semiBold"
                  style={{ marginBottom: 8 }}
                >
                  Sonuç
                </ThemedText>
                <TouchableOpacity
                  style={styles.coverWrapper}
                  onPress={() => handleOpenImage(coverUrl)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: coverUrl }}
                    style={styles.coverImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </ThemedCard>
            )}

            {/* Kucuk referans gorseller */}
            {referenceImageUrls.length > 0 && (
              <ThemedCard elevation="sm" style={{ padding: 8 }}>
                <ThemedText
                  variant="body"
                  weight="semiBold"
                  style={{ marginBottom: 8 }}
                >
                  Referans Görseller
                </ThemedText>
                <View style={styles.imageGrid}>
                  {referenceImageUrls.map((url, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.imageItem}
                      onPress={() => handleOpenImage(url)}
                      activeOpacity={0.9}
                    >
                      {!!url && (
                        <Image
                          source={{ uri: url }}
                          style={styles.image}
                          resizeMode="cover"
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ThemedCard>
            )}

            {/* Prompt (sadece hasCustomPrompt true ise) */}
            {hasCustomPrompt && !!prompt && (
              <ThemedCard elevation="sm" style={{ padding: 12 }}>
                <ThemedText
                  variant="body"
                  weight="semiBold"
                  style={{ marginBottom: 8 }}
                >
                  Kullanılan Prompt
                </ThemedText>
                <ThemedText variant="body" color="secondary">
                  {prompt}
                </ThemedText>
              </ThemedCard>
            )}

            {/* Meta bilgiler */}
            <ThemedCard elevation="sm" style={{ padding: 12 }}>
              <ThemedText
                variant="body"
                weight="semiBold"
                style={{ marginBottom: 8 }}
              >
                Detaylar
              </ThemedText>
              <View style={{ gap: 6 }}>
                {!!createdAtText && (
                  <ThemedText variant="body" color="secondary">
                    Oluşturma Tarihi: {createdAtText}
                  </ThemedText>
                )}
              </View>
            </ThemedCard>
          </View>
        </ScrollView>
      )}

      <ImageViewer
        visible={viewerVisible}
        imageUrl={viewingImage || undefined}
        onClose={() => setViewerVisible(false)}
        onDownload={handleDownload}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  content: {
    padding: 12,
  },
  coverWrapper: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    aspectRatio: 1,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageItem: {
    width: "49%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  jsonBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  codeText: {
    fontFamily: "Menlo",
    fontSize: 12,
  },
});
