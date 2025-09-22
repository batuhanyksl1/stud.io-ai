import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface DisplayNameModalProps {
  visible: boolean;
  onConfirm: (displayName: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DisplayNameModal({
  visible,
  onConfirm,
  onCancel,
  isLoading = false,
}: DisplayNameModalProps) {
  const [displayName, setDisplayName] = useState("");

  console.log("DisplayNameModal - visible:", visible);

  const handleConfirm = () => {
    if (!displayName.trim()) {
      Alert.alert("Hata", "Lütfen bir isim girin");
      return;
    }

    if (displayName.trim().length < 2) {
      Alert.alert("Hata", "İsim en az 2 karakter olmalıdır");
      return;
    }

    onConfirm(displayName.trim());
  };

  const handleCancel = () => {
    setDisplayName("");
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={["rgba(88, 28, 135, 0.95)", "rgba(15, 23, 42, 0.95)"]}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <Text style={styles.title}>Hoş Geldiniz!</Text>
              <Text style={styles.subtitle}>
                Devam etmek için lütfen adınızı girin
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Adınız</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Adınızı girin"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoFocus
                  maxLength={50}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.confirmButton,
                    (!displayName.trim() || isLoading) && styles.buttonDisabled,
                  ]}
                  onPress={handleConfirm}
                  disabled={!displayName.trim() || isLoading}
                >
                  <Text style={styles.confirmButtonText}>
                    {isLoading ? "Kaydediliyor..." : "Devam Et"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    padding: 0,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  confirmButton: {
    backgroundColor: "#ffffff",
  },
  buttonDisabled: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
});
