import React from "react";
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../constants/DesignTokens";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Badge, ComingSoonBadge } from "./Badge";

/**
 * Badge komponentinin kullanım örnekleri
 * Bu dosya sadece örnek amaçlıdır, production'da kullanılmaz
 */
export const BadgeExample: React.FC = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Badge Örnekleri</ThemedText>

      {/* Yakında Badge Örnekleri */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Yakında Badge'leri</ThemedText>

        <View style={styles.row}>
          <ComingSoonBadge size="sm" />
          <ComingSoonBadge size="md" />
          <ComingSoonBadge size="lg" />
        </View>

        <View style={styles.row}>
          <ComingSoonBadge transparent />
          <ComingSoonBadge rounded={false} />
        </View>
      </View>

      {/* Diğer Badge Varyantları */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>
          Diğer Badge Varyantları
        </ThemedText>

        <View style={styles.row}>
          <Badge variant="default">Varsayılan</Badge>
          <Badge variant="success">Başarılı</Badge>
          <Badge variant="warning">Uyarı</Badge>
          <Badge variant="error">Hata</Badge>
          <Badge variant="info">Bilgi</Badge>
        </View>

        <View style={styles.row}>
          <Badge variant="default" transparent>
            Şeffaf
          </Badge>
          <Badge variant="success" size="lg">
            Büyük
          </Badge>
          <Badge variant="warning" size="sm">
            Küçük
          </Badge>
        </View>
      </View>

      {/* Özel Kullanım Örnekleri */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>
          Özel Kullanım Örnekleri
        </ThemedText>

        <View style={styles.row}>
          <Badge variant="coming-soon" size="sm">
            Yeni Özellik
          </Badge>
          <Badge variant="info" size="sm">
            Beta
          </Badge>
          <Badge variant="success" size="sm">
            Aktif
          </Badge>
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
});

export default BadgeExample;
