import { useContentCreation } from "@/hooks";
import { pickImage } from "@/utils/pickImage";
import React, { useState } from "react";
import { Button, Image, SafeAreaView, Text, View } from "react-native";
/**
 *   storageUploadStatus:
    | "idle"
    | "uploadingToStorage"
    | "uploadedToStorage"
    | "uploadingToAITool"
    | "uploadedToAITool"
    | "processing"
    | "completed"
    | "failed";

 */
const Sikko = () => {
  const { uploadImageToStorage, refImageUrl, storageUploadStatus } =
    useContentCreation();
  const [newImageUri, setNewImageUri] = useState<string | null>(refImageUrl);

  const handlePickImage = async () => {
    const newImageUri = await pickImage();
    setNewImageUri(newImageUri);
    uploadImageToStorage(newImageUri);
  };

  return (
    <SafeAreaView>
      <Text>sikko</Text>
      <Button title="Pick Image" onPress={handlePickImage} />
      <Text>{storageUploadStatus}</Text>
      {newImageUri && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text>Seçilen Resim:</Text>
          <Image
            source={{ uri: newImageUri }}
            style={{ width: 200, height: 200, marginTop: 10 }}
            resizeMode="contain"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Sikko;
