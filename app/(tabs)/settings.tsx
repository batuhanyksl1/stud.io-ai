import { Header, ThemedCard, ThemedText, ThemedView } from "@/components";
import { useAuth, useTheme } from "@/hooks";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  type: "toggle" | "navigation" | "action" | "theme";
  value?: boolean;
  onPress?: () => void;
  onToggle?: (_value: boolean) => void;
  destructive?: boolean;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function SettingsScreen() {
  const { colors, colorScheme, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleSignOut = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkmak istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ],
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Stud.io AI uygulamasını keşfedin! 🚀",
        url: "https://stud.io",
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      "Önbelleği Temizle",
      "Tüm önbellek verileri silinecek. Bu işlem geri alınamaz.",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Temizle",
          style: "destructive",
          onPress: () => {
            // Cache temizleme işlemi
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ],
    );
  };

  const settingSections: SettingSection[] = [
    {
      title: "Hesap",
      items: [
        {
          id: "profile",
          title: "Profil",
          subtitle: user?.email || "Kullanıcı",
          icon: <Ionicons name="person" size={20} color={colors.textPrimary} />,
          type: "navigation",
          onPress: () => {
            // Profile sayfasına git
          },
        },
        {
          id: "notifications",
          title: "Bildirimler",
          subtitle: "Push bildirimleri",
          icon: (
            <Ionicons
              name="notifications"
              size={20}
              color={colors.textPrimary}
            />
          ),
          type: "toggle",
          value: notifications,
          onToggle: setNotifications,
        },
      ],
    },
    {
      title: "Görünüm",
      items: [
        {
          id: "theme",
          title: "Tema",
          subtitle: colorScheme === "dark" ? "Koyu" : "Açık",
          icon: (
            <Ionicons
              name={colorScheme === "dark" ? "moon" : "sunny"}
              size={20}
              color={colors.textPrimary}
            />
          ),
          type: "theme",
          onPress: toggleDarkMode,
        },
        {
          id: "auto-save",
          title: "Otomatik Kaydet",
          subtitle: "Çalışmalarınızı otomatik kaydedin",
          icon: (
            <Ionicons name="download" size={20} color={colors.textPrimary} />
          ),
          type: "toggle",
          value: autoSave,
          onToggle: setAutoSave,
        },
      ],
    },
    {
      title: "Uygulama",
      items: [
        {
          id: "share",
          title: "Uygulamayı Paylaş",
          subtitle: "Arkadaşlarınızla paylaşın",
          icon: <Ionicons name="share" size={20} color={colors.textPrimary} />,
          type: "action",
          onPress: handleShare,
        },
        {
          id: "rate",
          title: "Uygulamayı Değerlendir",
          subtitle: "App Store'da puan verin",
          icon: <Ionicons name="star" size={20} color={colors.textPrimary} />,
          type: "action",
          onPress: () => {
            // App Store'a yönlendir
          },
        },
        {
          id: "help",
          title: "Yardım & Destek",
          subtitle: "SSS ve iletişim",
          icon: (
            <Ionicons name="help-circle" size={20} color={colors.textPrimary} />
          ),
          type: "navigation",
          onPress: () => {
            // Help sayfasına git
          },
        },
      ],
    },
    {
      title: "Gelişmiş",
      items: [
        {
          id: "clear-cache",
          title: "Önbelleği Temizle",
          subtitle: "Uygulama verilerini temizle",
          icon: <Ionicons name="trash" size={20} color={colors.error} />,
          type: "action",
          destructive: true,
          onPress: handleClearCache,
        },
        {
          id: "sign-out",
          title: "Çıkış Yap",
          subtitle: "Hesabınızdan çıkın",
          icon: <Ionicons name="log-out" size={20} color={colors.error} />,
          type: "action",
          destructive: true,
          onPress: handleSignOut,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    const handlePress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      item.onPress?.();
    };

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, { borderBottomColor: colors.border }]}
        onPress={handlePress}
        disabled={item.type === "toggle"}
      >
        <View style={styles.settingItemLeft}>
          <View
            style={[styles.iconContainer, { backgroundColor: colors.surface }]}
          >
            {item.icon}
          </View>
          <View style={styles.settingItemText}>
            <ThemedText
              variant="body"
              weight="medium"
              style={{
                ...styles.settingTitle,
                ...(item.destructive ? { color: colors.error } : {}),
              }}
            >
              {item.title}
            </ThemedText>
            {item.subtitle && (
              <ThemedText
                variant="caption"
                style={{
                  ...styles.settingSubtitle,
                  ...(item.destructive ? { color: colors.error } : {}),
                }}
              >
                {item.subtitle}
              </ThemedText>
            )}
          </View>
        </View>

        <View style={styles.settingItemRight}>
          {item.type === "toggle" && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor={colors.surface}
            />
          )}
          {item.type === "navigation" && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          )}
          {item.type === "action" && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          )}
          {item.type === "theme" && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView backgroundColor="background" style={styles.container}>
      <StatusBar style={colorScheme === "dark" ? "dark" : "light"} />
      <Header leftIconType="arrow-back" rightIconType="home" />

      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <ThemedText variant="h2" weight="bold" style={styles.title}>
            Ayarlar
          </ThemedText>
          <ThemedText variant="body" style={styles.subtitle}>
            Uygulamanızı kişiselleştirin
          </ThemedText>
        </View>

        {settingSections.map((section, sectionIndex) => (
          <ThemedCard
            key={section.title}
            style={{
              ...styles.sectionCard,
              ...(sectionIndex === 0 ? styles.firstSection : {}),
            }}
            elevation="sm"
          >
            <ThemedText
              variant="caption"
              weight="semiBold"
              style={{ ...styles.sectionTitle, color: colors.textSecondary }}
            >
              {section.title.toUpperCase()}
            </ThemedText>
            {section.items.map((item, itemIndex) => (
              <View key={item.id}>
                {renderSettingItem(item)}
                {itemIndex < section.items.length - 1 && (
                  <View
                    style={[
                      styles.separator,
                      { backgroundColor: colors.border },
                    ]}
                  />
                )}
              </View>
            ))}
          </ThemedCard>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: Platform.OS === "ios" ? 8 : -4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 8,
  },
  firstSection: {
    marginTop: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingItemText: {
    flex: 1,
  },
  settingTitle: {
    marginBottom: 2,
  },
  settingSubtitle: {
    opacity: 0.7,
  },
  settingItemRight: {
    marginLeft: 12,
  },
  separator: {
    height: 1,
    marginLeft: 60,
  },
});
