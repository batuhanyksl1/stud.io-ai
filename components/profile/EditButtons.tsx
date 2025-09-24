import { ThemedText } from "@/components";
import { useTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface EditButtonsProps {
  isEditing: boolean;
  isLoading: boolean;
  hasChanges: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export const EditButtons: React.FC<EditButtonsProps> = ({
  isEditing,
  isLoading,
  hasChanges,
  onEdit,
  onCancel,
  onSave,
}) => {
  const { colors } = useTheme();

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit();
  };

  // Sadece değişiklik varsa göster
  if (!hasChanges) {
    return null;
  }

  return (
    <View style={styles.editButtons}>
      <View style={styles.editButtonRow}>
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: colors.border }]}
          onPress={onCancel}
        >
          <ThemedText
            variant="body"
            weight="medium"
            style={{ color: colors.textPrimary }}
          >
            İptal
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={onSave}
          disabled={isLoading}
        >
          <ThemedText variant="body" weight="medium" style={{ color: "white" }}>
            {isLoading ? "Kaydediliyor..." : "Kaydet"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  editButtons: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  editButtonRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  saveButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
});
