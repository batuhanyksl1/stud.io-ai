import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

export const pickImage = async (
  allowMultiple: boolean = false,
): Promise<string | string[]> => {
  try {
    // Check permissions
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Galeri erişim izni verilmedi");
      }
    }

    // Pick Image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false, // Görseli orijinal boyutunda al
      quality: 1.0, // En yüksek kalite
      allowsMultipleSelection: allowMultiple,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (allowMultiple) {
        const uris = result.assets.map((asset) => asset.uri);
        console.log("Çoklu görsel seçildi:", uris.length, "adet");
        return uris;
      } else {
        console.log("Image data:", result.assets[0].uri);
        console.log("Görsel seçildi");
        return result.assets[0].uri;
      }
    } else {
      throw new Error("Görsel seçilmedi");
    }
  } catch (error: any) {
    throw new Error(error.message || "Görsel seçilirken hata oluştu");
  }
};
