import { ThemedCard, ThemedText } from "@/components";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface AdditionalInfoSectionProps {
  website: string;
  location: string;
  isEditing: boolean;
  onWebsiteChange: (text: string) => void;
  onLocationChange: (text: string) => void;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  website,
  location,
  isEditing,
  onWebsiteChange,
  onLocationChange,
}) => {
  const { colors } = useTheme();

  return (
    <ThemedCard style={styles.infoCard} elevation="sm">
      <ThemedText
        variant="caption"
        weight="semiBold"
        style={{ ...styles.sectionTitle, color: colors.textSecondary }}
      >
        EK BİLGİLER
      </ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText variant="body" weight="medium" style={styles.inputLabel}>
          Website
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
          value={website}
          onChangeText={onWebsiteChange}
          placeholder="https://example.com"
          placeholderTextColor={colors.textSecondary}
          keyboardType="url"
          editable={isEditing}
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText variant="body" weight="medium" style={styles.inputLabel}>
          Konum
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
          value={location}
          onChangeText={onLocationChange}
          placeholder="Şehir, Ülke"
          placeholderTextColor={colors.textSecondary}
          editable={isEditing}
        />
      </View>
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
});
