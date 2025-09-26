import { Header, ThemedCard, ThemedText, ThemedView } from "@/components";
import { useTheme } from "@/hooks";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AnyDoc = Record<string, any>;

export default function GalleryItemDetailScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const id = useMemo(
    () => (Array.isArray(params.id) ? params.id[0] : params.id),
    [params.id],
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docData, setDocData] = useState<AnyDoc | null>(null);

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

  const images: { url?: string }[] = useMemo(() => {
    const resultImages = docData?.result?.data?.images;
    if (Array.isArray(resultImages)) return resultImages;
    const dataImages = docData?.data?.images;
    if (Array.isArray(dataImages)) return dataImages;
    return [];
  }, [docData]);

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
            {images.length > 0 && (
              <ThemedCard elevation="sm" style={{ padding: 8 }}>
                <ThemedText
                  variant="body"
                  weight="semiBold"
                  style={{ marginBottom: 8 }}
                >
                  Üretilen Görseller
                </ThemedText>
                <View style={styles.imageGrid}>
                  {images.map((img, idx) => (
                    <View key={idx} style={styles.imageItem}>
                      {!!img?.url && (
                        <Image
                          source={{ uri: img.url }}
                          style={styles.image}
                          resizeMode="cover"
                        />
                      )}
                    </View>
                  ))}
                </View>
              </ThemedCard>
            )}

            <ThemedCard elevation="sm" style={{ padding: 12 }}>
              <ThemedText
                variant="body"
                weight="semiBold"
                style={{ marginBottom: 8 }}
              >
                Kayıt Bilgileri (Tüm Alanlar)
              </ThemedText>
              <View
                style={[
                  styles.jsonBox,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <Text style={[styles.codeText, { color: colors.textPrimary }]}>
                  {JSON.stringify(docData, null, 2)}
                </Text>
              </View>
            </ThemedCard>
          </View>
        </ScrollView>
      )}
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
