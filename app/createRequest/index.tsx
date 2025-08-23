// screens/CreateRequestScreen.v2.tsx
import { ThemedButton, ThemedCard, ThemedText, ThemedView } from "@/components";
import { BorderRadius, Colors, Spacing } from "@/constants/Colors";
import { fmtTime, now, emptyService } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useReducer, useRef, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { RequestData, RequestStatus, ServiceKey, ServiceState, ServiceStatus } from "@/types";


// ===== Helpers =====



const initialReq = (id: string, imageUri: string): RequestData => ({
  id,
  imageUri,
  timestamp: now(),
  overall: "uploading",
  services: {
    serviceA: emptyService(),
    serviceB: emptyService(),
    serviceC: emptyService(),
  },
});

const overallFromServices = (s: Record<ServiceKey, ServiceState>): RequestStatus => {
  const values = Object.values(s);
  if (values.some(v => v.status === "error")) return "error";
  if (values.every(v => v.status === "completed")) return "completed";
  if (values.some(v => v.status === "uploading")) return "uploading";
  if (values.some(v => v.status === "processing")) return "processing";
  return "idle";
};

const statusChip = (status: ServiceStatus) => {
  switch (status) {
    case "uploading":   return { icon: "cloud-upload-outline", color: Colors.primary, text: "Yükleniyor", bg: Colors.primary + "15" };
    case "processing":  return { icon: "sync-outline",         color: Colors.warning, text: "İşleniyor", bg: Colors.warning + "15" };
    case "completed":   return { icon: "checkmark-circle",     color: Colors.success, text: "Hazır",     bg: Colors.success + "15" };
    case "error":       return { icon: "alert-circle",         color: Colors.error,   text: "Hata",      bg: Colors.error + "15" };
    case "canceled":    return { icon: "ban",                  color: Colors.gray400, text: "İptal",     bg: Colors.gray100 };
    default:            return { icon: "ellipse-outline",      color: Colors.gray400, text: "Bekliyor",  bg: Colors.gray100 };
  }
};

// ===== Reducer (tek kaynak doğrusu) =====
type Action =
  | { type: "ADD"; payload: RequestData }
  | { type: "UPDATE_SERVICE"; id: string; service: ServiceKey; data: Partial<ServiceState> }
  | { type: "SET_OVERALL"; id: string; overall: RequestStatus }
  | { type: "CANCEL"; id: string }
  | { type: "CLEAR_COMPLETED" };

function reducer(state: RequestData[], action: Action): RequestData[] {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];
    case "UPDATE_SERVICE":
      return state.map(r => {
        if (r.id !== action.id) return r;
        const services = {
          ...r.services,
          [action.service]: { ...r.services[action.service], ...action.data },
        };
        const overall = overallFromServices(services);
        return { ...r, services, overall };
      });
    case "SET_OVERALL":
      return state.map(r => (r.id === action.id ? { ...r, overall: action.overall } : r));
    case "CANCEL":
      return state.map(r => (r.id === action.id ? { ...r, overall: "canceled", canceled: true } : r));
    case "CLEAR_COMPLETED":
      return state.filter(r => r.overall !== "completed");
    default:
      return state;
  }
}

// ===== Simülasyon: upload + 3 servis paralel =====
// Not: Gerçek entegrasyonda her servise kendi API çağrını koyacaksın.
// Aşağıdaki zamanlar sadece UX test içindir.
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
async function simulateUpload(onProgress: (p: number) => void) {
  for (let i = 0; i <= 100; i += 12) {
    await sleep(120);
    onProgress(Math.min(100, i));
  }
}
async function simulateService(service: ServiceKey, onStep: (data: Partial<ServiceState>) => void) {
  // her servis farklı süre/akış
  const steps = service === "serviceA" ? 7 : service === "serviceB" ? 9 : 11;
  for (let i = 0; i <= steps; i++) {
    await sleep(160 + Math.random() * 140);
    const pct = Math.round((i / steps) * 100);
    onStep({ status: i === 0 ? "processing" : pct >= 100 ? "completed" : "processing", progress: pct });
  }
  // örnek sonuç url
  onStep({ resultUrl: `https://example.com/${service}.jpg`, status: "completed", progress: 100 });
}

// ===== Component =====
export default function CreateRequestScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [state, dispatch] = useReducer(reducer, []);
  const isBusy = useMemo(() => state.some(r => r.overall === "uploading" || r.overall === "processing"), [state]);
  const cancelMap = useRef<Record<string, boolean>>({}); // kaba iptal mekanizması (gerçek API'de AbortController vb. kullan)

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
      });
      if (!result.canceled && result.assets[0]) setSelectedImage(result.assets[0].uri);
    } catch {
      Alert.alert("Hata", "Görsel seçilemedi.");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") return Alert.alert("İzin gerekli", "Kamera izni verilmedi.");
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.9 });
      if (!result.canceled && result.assets[0]) setSelectedImage(result.assets[0].uri);
    } catch {
      Alert.alert("Hata", "Fotoğraf çekilemedi.");
    }
  };

  const startProcess = async () => {
    if (!selectedImage) return Alert.alert("Uyarı", "Lütfen bir görsel seçin.");
    const id = String(Date.now());
    const req = initialReq(id, selectedImage);
    dispatch({ type: "ADD", payload: req });
    setSelectedImage(null);
    cancelMap.current[id] = false;

    // 1) Upload
    dispatch({ type: "SET_OVERALL", id, overall: "uploading" });
    await simulateUpload(p => {
      (["serviceA", "serviceB", "serviceC"] as ServiceKey[]).forEach(svc =>
        dispatch({ type: "UPDATE_SERVICE", id, service: svc, data: { status: "uploading", progress: p } })
      );
    });

    if (cancelMap.current[id]) return dispatch({ type: "CANCEL", id });

    // 2) Paralel 3 servis
    dispatch({ type: "SET_OVERALL", id, overall: "processing" });

    await Promise.all(
      (["serviceA", "serviceB", "serviceC"] as ServiceKey[]).map(async (svc) => {
        try {
          await simulateService(svc, data => dispatch({ type: "UPDATE_SERVICE", id, service: svc, data }));
        } catch (e: any) {
          dispatch({ type: "UPDATE_SERVICE", id, service: svc, data: { status: "error", error: String(e) } });
        }
      })
    );

    if (cancelMap.current[id]) return dispatch({ type: "CANCEL", id });
    // overall reducer içinde otomatik hesaplanıyor
  };

  const cancelRequest = (id: string) => {
    cancelMap.current[id] = true;
    dispatch({ type: "CANCEL", id });
  };

  const retryFailedServices = async (id: string) => {
    const target = state.find(r => r.id === id);
    if (!target) return;
    const failed = (Object.keys(target.services) as ServiceKey[]).filter(k => target.services[k].status === "error");
    if (failed.length === 0) return;

    dispatch({ type: "SET_OVERALL", id, overall: "processing" });
    await Promise.all(
      failed.map(async (svc) => {
        await simulateService(svc, data => dispatch({ type: "UPDATE_SERVICE", id, service: svc, data }));
      })
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant="h2" weight="bold" style={styles.title}>AI Görsel İşleme</ThemedText>
          <ThemedText variant="body" style={styles.subtitle}>Görseli yükle • 3 servis paralel işlesin • Sonuçlar sırayla gelsin</ThemedText>
        </View>

        {/* Upload */}
        <ThemedCard style={styles.uploadCard} elevation="lg">
          {selectedImage ? (
            <View style={styles.previewWrap}>
              <Image source={{ uri: selectedImage }} style={styles.preview} />
              <View style={styles.overlayButtons}>
                <ThemedButton variant="outline" size="sm" onPress={() => setSelectedImage(null)} style={styles.overlayBtn}>
                  <Ionicons name="refresh" size={16} color={Colors.primary} />
                  <ThemedText variant="caption" style={styles.overlayText}>Değiştir</ThemedText>
                </ThemedButton>
                <ThemedButton size="sm" onPress={startProcess} disabled={isBusy} style={styles.overlayBtnPrimary}>
                  <Ionicons name="rocket" size={16} color={Colors.white} />
                  <ThemedText variant="caption" style={{ color: Colors.white, marginLeft: 6 }}>İşleme Başlat</ThemedText>
                </ThemedButton>
              </View>
            </View>
          ) : (
            <View style={styles.dropArea}>
              <Ionicons name="cloud-upload" size={32} color={Colors.primary} />
              <ThemedText variant="bodyLarge" weight="medium" style={{ marginTop: Spacing.sm }}>Görsel Yükle</ThemedText>
              <ThemedText variant="caption" style={{ color: Colors.textSecondary, marginTop: 2 }}>PNG • JPG • JPEG</ThemedText>
              <View style={styles.uploadActions}>
                <ThemedButton variant="outline" size="sm" onPress={pickImage} style={styles.actionBtn}>
                  <Ionicons name="images" size={16} color={Colors.primary} />
                  <ThemedText variant="caption" style={{ marginLeft: 6 }}>Galeri</ThemedText>
                </ThemedButton>
                <ThemedButton variant="outline" size="sm" onPress={takePhoto} style={styles.actionBtn}>
                  <Ionicons name="camera" size={16} color={Colors.primary} />
                  <ThemedText variant="caption" style={{ marginLeft: 6 }}>Kamera</ThemedText>
                </ThemedButton>
              </View>
            </View>
          )}
        </ThemedCard>

        {/* Dashboard */}
        <View style={styles.historyHeader}>
          <ThemedText variant="h3" weight="semiBold">İşlem Geçmişi</ThemedText>
          {state.length > 0 && (
            <TouchableOpacity onPress={() => dispatch({ type: "CLEAR_COMPLETED" })}>
              <ThemedText variant="caption" style={{ color: Colors.textSecondary }}>Tamamlananları temizle</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {state.length === 0 ? (
          <ThemedCard elevation="sm" style={{ marginHorizontal: Spacing.lg, padding: Spacing.lg }}>
            <ThemedText variant="body">Henüz bir istek yok. Bir görsel yükleyip işleme başlat.</ThemedText>
          </ThemedCard>
        ) : (
          state.map(req => (
            <ThemedCard key={req.id} elevation="sm" style={styles.reqCard}>
              <View style={styles.reqRow}>
                <Image source={{ uri: req.imageUri }} style={styles.reqThumb} />
                <View style={{ flex: 1 }}>
                  <View style={styles.reqHeaderRow}>
                    <ThemedText variant="body" weight="medium">İstek #{req.id.slice(-6)}</ThemedText>
                    <ThemedText variant="caption" style={{ color: Colors.textSecondary }}>{fmtTime(req.timestamp)}</ThemedText>
                  </View>

                  {/* Services chips */}
                  <View style={styles.chipsRow}>
                    {(Object.keys(req.services) as ServiceKey[]).map(key => {
                      const s = req.services[key];
                      const c = statusChip(s.status);
                      return (
                        <View key={key} style={[styles.chip, { backgroundColor: c.bg }]}>
                          <Ionicons name={c.icon as any} size={14} color={c.color} />
                          <ThemedText variant="caption" style={{ color: c.color, marginLeft: 6, fontWeight: "500" }}>
                            {key.toUpperCase().replace("SERVICE", "S")} • {c.text} {s.progress > 0 && s.progress < 100 ? `• %${s.progress}` : ""}
                          </ThemedText>
                        </View>
                      );
                    })}
                  </View>

                  {/* Actions */}
                  <View style={styles.actionsRow}>
                    {req.overall === "processing" || req.overall === "uploading" ? (
                      <ThemedButton variant="outline" size="sm" onPress={() => cancelRequest(req.id)}>
                        <Ionicons name="close-circle" size={16} color={Colors.error} />
                        <ThemedText variant="caption" style={{ marginLeft: 6, color: Colors.error }}>İptal Et</ThemedText>
                      </ThemedButton>
                    ) : null}

                    {req.overall === "error" ? (
                      <ThemedButton variant="outline" size="sm" onPress={() => retryFailedServices(req.id)}>
                        <Ionicons name="refresh" size={16} color={Colors.warning} />
                        <ThemedText variant="caption" style={{ marginLeft: 6, color: Colors.warning }}>Hatalıları Yeniden Dene</ThemedText>
                      </ThemedButton>
                    ) : null}

                    {req.overall === "completed" ? (
                      <ThemedButton size="sm" onPress={() => Alert.alert("Sonuçlar", "Servis sonuçlarını göster…")}>
                        <Ionicons name="eye" size={16} color={Colors.white} />
                        <ThemedText variant="caption" style={{ marginLeft: 6, color: Colors.white }}>Sonuçları Gör</ThemedText>
                      </ThemedButton>
                    ) : null}
                  </View>
                </View>
              </View>
            </ThemedCard>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

// ===== Styles =====
const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    alignItems: "center",
  },
  title: { textAlign: "center", marginBottom: Spacing.xs },
  subtitle: { textAlign: "center", color: Colors.textSecondary },

  uploadCard: { margin: Spacing.lg, marginTop: Spacing.xl },
  dropArea: {
    borderWidth: 2,
    borderColor: Colors.gray200,
    borderStyle: "dashed",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    backgroundColor: Colors.gray50,
  },
  uploadActions: { flexDirection: "row", gap: Spacing.md, marginTop: Spacing.md },
  actionBtn: { flexDirection: "row", alignItems: "center" },

  previewWrap: { position: "relative" },
  preview: { width: "100%", height: 220, borderRadius: BorderRadius.lg, resizeMode: "cover" },
  overlayButtons: { position: "absolute", top: Spacing.md, right: Spacing.md, gap: Spacing.sm },
  overlayBtn: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white + "E6" },
  overlayBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  overlayText: { marginLeft: 6 },

  historyHeader: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    marginTop: -Spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  reqCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md },
  reqRow: { flexDirection: "row" },
  reqThumb: { width: 60, height: 60, borderRadius: BorderRadius.md, marginRight: Spacing.md },

  reqHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing.xs },

  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: Spacing.sm },
  chip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full },

  actionsRow: { flexDirection: "row", gap: Spacing.sm },
});
