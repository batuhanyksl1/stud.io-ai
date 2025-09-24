import { Header, ThemedCard, ThemedText, ThemedView } from "@/components";
import { useTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";
import * as MailComposer from "expo-mail-composer";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HelpSupportScreen() {
  const { colors, colorScheme } = useTheme();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!message.trim()) {
      Alert.alert("Hata", "Lütfen mesajınızı yazın.");
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      // MailComposer'ın kullanılabilir olup olmadığını kontrol et
      const isAvailable = await MailComposer.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert(
          "E-posta Gönderilemiyor",
          "Cihazınızda e-posta gönderebilecek bir uygulama bulunamadı. Lütfen e-posta uygulamanızı yapılandırın.",
        );
        return;
      }

      // E-posta gönder
      const result = await MailComposer.composeAsync({
        recipients: ["batuhanyksl1@gmail.com"], // Destek e-posta adresi
        subject: "Stud.io AI - Yardım & Destek",
        body: `Merhaba,

${message}

---
Bu mesaj Stud.io AI uygulamasından gönderilmiştir.
Kullanıcı: ${Platform.OS} cihazından`,
        isHtml: false,
      });

      if (result.status === MailComposer.MailComposerStatus.SENT) {
        Alert.alert("Başarılı", "Mesajınız başarıyla gönderildi!");
        setMessage("");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (result.status === MailComposer.MailComposerStatus.SAVED) {
        Alert.alert("Kaydedildi", "Mesajınız taslak olarak kaydedildi.");
        setMessage("");
      } else if (result.status === MailComposer.MailComposerStatus.CANCELLED) {
        // Kullanıcı iptal etti, hiçbir şey yapma
      }
    } catch (error) {
      console.error("E-posta gönderme hatası:", error);
      Alert.alert(
        "Hata",
        "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <ThemedText variant="h2" weight="bold" style={styles.title}>
        Yardım & Destek
      </ThemedText>
      <ThemedText variant="body" style={styles.subtitle}>
        Sorunlarınızı bize bildirin, size yardımcı olalım
      </ThemedText>
    </View>
  );

  const renderContactInfo = () => (
    <ThemedCard style={styles.contactCard} elevation="sm">
      <ThemedText
        variant="caption"
        weight="semiBold"
        style={{ ...styles.sectionTitle, color: colors.textSecondary }}
      >
        İLETİŞİM BİLGİLERİ
      </ThemedText>

      <View style={styles.contactItem}>
        <ThemedText variant="body" weight="medium" style={styles.contactLabel}>
          E-posta
        </ThemedText>
        <ThemedText
          variant="body"
          style={{ ...styles.contactValue, color: colors.primary }}
        >
          support@stud.io-ai.com
        </ThemedText>
      </View>

      <View style={styles.contactItem}>
        <ThemedText variant="body" weight="medium" style={styles.contactLabel}>
          Yanıt Süresi
        </ThemedText>
        <ThemedText
          variant="body"
          style={{ ...styles.contactValue, color: colors.textSecondary }}
        >
          24-48 saat içinde
        </ThemedText>
      </View>
    </ThemedCard>
  );

  const renderMessageForm = () => (
    <ThemedCard style={styles.formCard} elevation="sm">
      <ThemedText
        variant="caption"
        weight="semiBold"
        style={{ ...styles.sectionTitle, color: colors.textSecondary }}
      >
        MESAJINIZ
      </ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText variant="body" weight="medium" style={styles.inputLabel}>
          Sorununuzu veya önerinizi yazın
        </ThemedText>
        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.textPrimary,
            },
          ]}
          value={message}
          onChangeText={setMessage}
          placeholder="Mesajınızı buraya yazın..."
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />
        <ThemedText
          variant="caption"
          style={{ ...styles.characterCount, color: colors.textSecondary }}
        >
          {message.length}/1000 karakter
        </ThemedText>
      </View>

      <TouchableOpacity
        style={[
          styles.sendButton,
          {
            backgroundColor: message.trim() ? colors.primary : colors.border,
          },
        ]}
        onPress={handleSendEmail}
        disabled={!message.trim() || isLoading}
        activeOpacity={0.8}
      >
        <ThemedText
          variant="body"
          weight="medium"
          style={{
            color: message.trim() ? "white" : colors.textSecondary,
          }}
        >
          {isLoading ? "Gönderiliyor..." : "E-posta Gönder"}
        </ThemedText>
      </TouchableOpacity>
    </ThemedCard>
  );

  const renderFAQ = () => (
    <ThemedCard style={styles.faqCard} elevation="sm">
      <ThemedText
        variant="caption"
        weight="semiBold"
        style={{ ...styles.sectionTitle, color: colors.textSecondary }}
      >
        SIKÇA SORULAN SORULAR
      </ThemedText>

      <View style={styles.faqItem}>
        <ThemedText variant="body" weight="medium" style={styles.faqQuestion}>
          Uygulama nasıl çalışır?
        </ThemedText>
        <ThemedText
          variant="caption"
          style={{ ...styles.faqAnswer, color: colors.textSecondary }}
        >
          Stud.io AI, yapay zeka teknolojisi kullanarak görsellerinizi
          düzenlemenize yardımcı olur. Sadece bir görsel seçin ve istediğiniz
          düzenlemeyi yapın.
        </ThemedText>
      </View>

      <View style={styles.faqItem}>
        <ThemedText variant="body" weight="medium" style={styles.faqQuestion}>
          Hangi dosya formatları desteklenir?
        </ThemedText>
        <ThemedText
          variant="caption"
          style={{ ...styles.faqAnswer, color: colors.textSecondary }}
        >
          JPG, PNG, WEBP formatlarındaki görselleri destekliyoruz. Maksimum
          dosya boyutu 10MB'dır.
        </ThemedText>
      </View>

      <View style={styles.faqItem}>
        <ThemedText variant="body" weight="medium" style={styles.faqQuestion}>
          Görsellerim güvende mi?
        </ThemedText>
        <ThemedText
          variant="caption"
          style={{ ...styles.faqAnswer, color: colors.textSecondary }}
        >
          Evet, tüm görselleriniz şifrelenmiş olarak işlenir ve 24 saat sonra
          otomatik olarak silinir.
        </ThemedText>
      </View>
    </ThemedCard>
  );

  return (
    <ThemedView backgroundColor="background" style={styles.container}>
      <StatusBar style={colorScheme === "dark" ? "dark" : "light"} />
      <Header leftIconType="arrow-back" rightIconType="settings" />

      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {/* {renderContactInfo()} */}
        {renderMessageForm()}
        {renderFAQ()}

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
  // Contact Card Styles
  contactCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    letterSpacing: 0.5,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  contactLabel: {
    flex: 1,
  },
  contactValue: {
    flex: 1,
    textAlign: "right",
  },
  // Form Card Styles
  formCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
  },
  inputGroup: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
    maxHeight: 200,
  },
  characterCount: {
    marginTop: 4,
    textAlign: "right",
    opacity: 0.7,
  },
  sendButton: {
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  // FAQ Card Styles
  faqCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
  },
  faqItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  faqQuestion: {
    marginBottom: 4,
  },
  faqAnswer: {
    lineHeight: 20,
    opacity: 0.8,
  },
});
