import { Header, ThemedText, ThemedView } from "@/components";
import {
  ActionsSection,
  BasicInfoSection,
  EditButtons,
} from "@/components/profile";
import { useAuth, useTheme } from "@/hooks";
import { getAuth } from "@react-native-firebase/auth";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";

interface ProfileData {
  displayName: string;
  email: string;
  bio: string;
  website: string;
  location: string;
}

export default function ProfileSettingsScreen() {
  const { colors, colorScheme } = useTheme();
  const { user, updateUserName } = useAuth();

  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: user?.displayName || "",
    email: user?.email || "",
    bio: "",
    website: "",
    location: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSave = async () => {
    if (!profileData.displayName.trim()) {
      Alert.alert("Hata", "İsim alanı boş olamaz.");
      return;
    }

    // Aynı isim kontrolü
    if (profileData.displayName === user?.displayName) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setIsLoading(true);
    try {
      // Profil güncelleme işlemi
      await updateUserName(profileData.displayName);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Başarılı", "Profil bilgileriniz güncellendi.");
      setIsEditing(false);
      setHasChanges(false);
    } catch (error) {
      console.error("Profil güncelleme hatası:", error);
      Alert.alert("Hata", "Profil güncellenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      displayName: user?.displayName || "",
      email: user?.email || "",
      bio: "",
      website: "",
      location: "",
    });
    setIsEditing(false);
    setHasChanges(false);
    setShowError(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleTextChange = () => {
    setHasChanges(true);
    setShowError(false); // Yazı yazıldığında hata mesajını gizle
  };

  const _handleAvatarChange = () => {
    // Avatar değiştirme işlemi
    console.log("Avatar değiştirildi");
  };

  const handleChangePassword = () => {
    Alert.alert("Şifre Değiştir", "Şifre değiştirme özelliği yakında gelecek!");
  };

  const handleDownloadData = () => {
    Alert.alert("Veri İndir", "Veri indirme özelliği yakında gelecek!");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Hesabı Sil",
      "Bu işlem geri alınamaz. Hesabınızı silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: () => {
            Alert.alert("Hesap Silindi", "Hesabınız başarıyla silindi.");
          },
        },
      ],
    );
  };

  const handleDeleteUser = () => {
    Alert.alert(
      "Kullanıcıyı Sil",
      "Bu işlem geri alınamaz. Firebase'den kullanıcıyı kalıcı olarak silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              const currentUser = getAuth().currentUser;
              if (currentUser) {
                await currentUser.delete();
                console.log("Kullanıcı Firebase'den silindi");
                // Auth state değişikliği otomatik olarak _layout.tsx'de handle edilecek
              }
            } catch (error: any) {
              console.error("Kullanıcı silme hatası:", error);
              Alert.alert(
                "Hata",
                "Kullanıcı silinirken bir hata oluştu: " + error.message,
              );
            }
          },
        },
      ],
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <ThemedText variant="h2" weight="bold" style={styles.title}>
        Profil Ayarları
      </ThemedText>
      <ThemedText variant="body" style={styles.subtitle}>
        Profil bilgilerinizi düzenleyin
      </ThemedText>
    </View>
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

        {/* <AvatarSection
          userPhotoURL={user?.photoURL}
          onAvatarChange={handleAvatarChange}
        /> */}

        <BasicInfoSection
          displayName={profileData.displayName}
          email={profileData.email}
          bio={profileData.bio}
          isEditing={isEditing}
          onDisplayNameChange={(text) =>
            setProfileData({ ...profileData, displayName: text })
          }
          onBioChange={(text) => setProfileData({ ...profileData, bio: text })}
          onTextChange={handleTextChange}
          showError={showError}
        />

        {/* <AdditionalInfoSection
          website={profileData.website}
          location={profileData.location}
          isEditing={isEditing}
          onWebsiteChange={(text) =>
            setProfileData({ ...profileData, website: text })
          }
          onLocationChange={(text) =>
            setProfileData({ ...profileData, location: text })
          }
        /> */}
        <EditButtons
          isEditing={isEditing}
          isLoading={isLoading}
          hasChanges={hasChanges}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
        />

        <ActionsSection
          onChangePassword={handleChangePassword}
          onDownloadData={handleDownloadData}
          onDeleteAccount={handleDeleteAccount}
          onDeleteUser={handleDeleteUser}
        />

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
});
