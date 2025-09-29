import {
  editingServices,
  quickActions,
  recentActivity,
  todayStats,
} from "@/components/data/homeData";
import {
  BorderRadius,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignTokens";
import { firestore } from "@/firebase.config";
import { useTheme } from "@/hooks";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SikolokoPage() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState<any[]>([]);

  // Firestore'a homeData bilgilerini kaydet
  const uploadHomeDataToFirestore = async () => {
    setLoading(true);

    try {
      console.log("🚀 Firestore'a homeData yükleniyor...");

      // 1. Editing Services Collection
      const editingServicesCollection =
        firestore().collection("editingServices");

      for (const service of editingServices) {
        await editingServicesCollection.doc(service.id).set({
          ...service,
          uploadedAt: firestore.FieldValue.serverTimestamp(),
          uploadedBy: "sikoloko-admin",
        });
        console.log(`✅ Service uploaded: ${service.title}`);
      }

      // 2. Quick Actions Collection
      const quickActionsCollection = firestore().collection("quickActions");

      for (const action of quickActions) {
        await quickActionsCollection.doc(action.id).set({
          ...action,
          uploadedAt: firestore.FieldValue.serverTimestamp(),
          uploadedBy: "sikoloko-admin",
        });
        console.log(`✅ Quick Action uploaded: ${action.title}`);
      }

      // 3. Recent Activity Collection
      const recentActivityCollection = firestore().collection("recentActivity");

      for (const activity of recentActivity) {
        await recentActivityCollection.doc(activity.id).set({
          ...activity,
          uploadedAt: firestore.FieldValue.serverTimestamp(),
          uploadedBy: "sikoloko-admin",
        });
        console.log(`✅ Recent Activity uploaded: ${activity.title}`);
      }

      // 4. Today Stats Collection
      const todayStatsCollection = firestore().collection("todayStats");

      for (const stat of todayStats) {
        await todayStatsCollection
          .doc(stat.title.replace(/\s+/g, "_").toLowerCase())
          .set({
            ...stat,
            uploadedAt: firestore.FieldValue.serverTimestamp(),
            uploadedBy: "sikoloko-admin",
          });
        console.log(`✅ Today Stat uploaded: ${stat.title}`);
      }

      // 5. Ana HomeData Collection (tüm verileri bir arada)
      const homeDataCollection = firestore().collection("homeData");

      await homeDataCollection.doc("main_data").set({
        editingServices,
        quickActions,
        recentActivity,
        todayStats,
        uploadedAt: firestore.FieldValue.serverTimestamp(),
        uploadedBy: "sikoloko-admin",
        version: "1.0.0",
      });

      console.log("✅ Ana homeData collection oluşturuldu");

      // Başarı mesajı
      Alert.alert(
        "✅ Başarılı!",
        `Firestore'a başarıyla yüklendi:\n• ${editingServices.length} Editing Service\n• ${quickActions.length} Quick Action\n• ${recentActivity.length} Recent Activity\n• ${todayStats.length} Today Stat\n• 1 Ana HomeData Collection`,
        [{ text: "Tamam" }],
      );

      // Yüklenen verileri state'e kaydet
      setUploadedData([
        { type: "editingServices", count: editingServices.length },
        { type: "quickActions", count: quickActions.length },
        { type: "recentActivity", count: recentActivity.length },
        { type: "todayStats", count: todayStats.length },
        { type: "mainData", count: 1 },
      ]);
    } catch (error: any) {
      console.error("❌ Firestore yükleme hatası:", error);
      Alert.alert(
        "❌ Hata!",
        `Firestore'a yükleme sırasında hata oluştu:\n${error.message}`,
        [{ text: "Tamam" }],
      );
    } finally {
      setLoading(false);
    }
  };

  // Firestore'dan veri sil
  const clearFirestoreData = async () => {
    Alert.alert(
      "⚠️ Uyarı",
      "Tüm homeData koleksiyonlarını silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              // Tüm koleksiyonları sil
              const collections = [
                "editingServices",
                "quickActions",
                "recentActivity",
                "todayStats",
                "homeData",
              ];

              for (const collectionName of collections) {
                const collection = firestore().collection(collectionName);
                const snapshot = await collection.get();

                const batch = firestore().batch();
                snapshot.docs.forEach((doc) => {
                  batch.delete(doc.ref);
                });

                await batch.commit();
                console.log(`🗑️ ${collectionName} koleksiyonu temizlendi`);
              }

              Alert.alert("✅ Başarılı!", "Tüm koleksiyonlar temizlendi.");
              setUploadedData([]);
            } catch (error: any) {
              console.error("❌ Silme hatası:", error);
              Alert.alert(
                "❌ Hata!",
                `Silme sırasında hata oluştu:\n${error.message}`,
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          🚀 Sikoloko Admin Panel
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Firestore HomeData Yönetimi
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          📊 Veri İstatistikleri
        </Text>

        <View style={styles.statsContainer}>
          <View
            style={[
              styles.statItem,
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {editingServices.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Editing Services
            </Text>
          </View>

          <View
            style={[
              styles.statItem,
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {quickActions.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Quick Actions
            </Text>
          </View>

          <View
            style={[
              styles.statItem,
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {recentActivity.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Recent Activity
            </Text>
          </View>

          <View
            style={[
              styles.statItem,
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {todayStats.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Today Stats
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          🔥 Firestore İşlemleri
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            styles.uploadButton,
            { backgroundColor: colors.primary },
            loading && styles.disabledButton,
          ]}
          onPress={uploadHomeDataToFirestore}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>📤 Firestore&apos;a Yükle</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.clearButton,
            {
              backgroundColor: colors.error || "#EF4444",
              borderColor: colors.border,
            },
            loading && styles.disabledButton,
          ]}
          onPress={clearFirestoreData}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: "white" }]}>
            🗑️ Tüm Verileri Sil
          </Text>
        </TouchableOpacity>
      </View>

      {uploadedData.length > 0 && (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            ✅ Son Yüklenen Veriler
          </Text>

          {uploadedData.map((item, index) => (
            <View
              key={index}
              style={[
                styles.uploadedItem,
                { backgroundColor: colors.surfaceElevated },
              ]}
            >
              <Text
                style={[styles.uploadedType, { color: colors.textPrimary }]}
              >
                {item.type}
              </Text>
              <Text style={[styles.uploadedCount, { color: colors.primary }]}>
                {item.count} item
              </Text>
            </View>
          ))}
        </View>
      )}

      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          📋 Oluşturulan Koleksiyonlar
        </Text>

        <View style={styles.collectionsList}>
          <Text
            style={[styles.collectionItem, { color: colors.textSecondary }]}
          >
            • editingServices
          </Text>
          <Text
            style={[styles.collectionItem, { color: colors.textSecondary }]}
          >
            • quickActions
          </Text>
          <Text
            style={[styles.collectionItem, { color: colors.textSecondary }]}
          >
            • recentActivity
          </Text>
          <Text
            style={[styles.collectionItem, { color: colors.textSecondary }]}
          >
            • todayStats
          </Text>
          <Text
            style={[styles.collectionItem, { color: colors.textSecondary }]}
          >
            • homeData (ana koleksiyon)
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  header: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    alignItems: "center",
    ...Shadows.md,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
  },
  card: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    ...Shadows.sm,
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: Spacing.lg,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  statNumber: {
    fontSize: Typography.fontSize.xxl,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    textAlign: "center",
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  uploadButton: {
    backgroundColor: "#10B981",
  },
  clearButton: {
    backgroundColor: "#EF4444",
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: "white",
  },
  uploadedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  uploadedType: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
  },
  uploadedCount: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
  },
  collectionsList: {
    gap: Spacing.sm,
  },
  collectionItem: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.primary,
    paddingVertical: Spacing.xs,
  },
});
