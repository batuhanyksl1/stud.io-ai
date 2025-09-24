import { ThemedCard, ThemedText } from "@/components";
import { useTheme } from "@/hooks/useTheme";
import { getAuth } from "@react-native-firebase/auth";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface BasicInfoSectionProps {
  displayName: string | null;
  email: string;
  bio: string;
  isEditing: boolean;
  onDisplayNameChange: (_text: string) => void;
  onBioChange: (_text: string) => void;
  onTextChange?: () => void;
  showError?: boolean;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  displayName,
  email: _email,
  bio: _bio,
  isEditing: _isEditing,
  onDisplayNameChange,
  onBioChange: _onBioChange,
  onTextChange,
  showError = false,
}) => {
  const { colors } = useTheme();
  const _currentUser = getAuth().currentUser;
  const username = _currentUser?.displayName;
  return (
    <ThemedCard style={styles.infoCard} elevation="sm">
      <ThemedText
        variant="caption"
        weight="semiBold"
        style={{ ...styles.sectionTitle, color: colors.textSecondary }}
      >
        TEMEL BİLGİLER
      </ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText variant="body" weight="medium" style={styles.inputLabel}>
          İsim
        </ThemedText>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.textPrimary,
            },
          ]}
          value={displayName || ""}
          onChangeText={(text) => {
            onDisplayNameChange(text);
            onTextChange?.();
          }}
          placeholder={username || "İsminizi girin"}
          placeholderTextColor={colors.textSecondary}
        />
        {showError && (
          <ThemedText
            variant="caption"
            style={{ ...styles.errorText, color: colors.error }}
          >
            Bu isim mevcut isminizle aynı
          </ThemedText>
        )}
      </View>

      {/* <View style={styles.inputGroup}>
        <ThemedText variant="body" weight="medium" style={styles.inputLabel}>
          E-posta
        </ThemedText>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.textSecondary,
            },
          ]}
          value={email}
          editable={false}
          placeholder="E-posta adresiniz"
          placeholderTextColor={colors.textSecondary}
        />
        <ThemedText
          variant="caption"
          style={{ ...styles.inputHelper, color: colors.textSecondary }}
        >
          E-posta adresi değiştirilemez
        </ThemedText>
      </View> */}

      {/* <View style={styles.inputGroup}>
        <ThemedText variant="body" weight="medium" style={styles.inputLabel}>
          Hakkımda
        </ThemedText>
        <TextInput
          style={[
            styles.textInput,
            styles.textArea,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.textPrimary,
            },
          ]}
          value={bio}
          onChangeText={onBioChange}
          placeholder="Kendiniz hakkında kısa bir açıklama yazın"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
          editable={isEditing}
        />
      </View> */}
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    letterSpacing: 0.5,
  },
  inputGroup: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  inputHelper: {
    marginTop: 4,
    opacity: 0.7,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});
