import { sendStorage } from "@/utils/SendStorage";
import { pickImage } from "@/utils/pickImage";
import React, { useState } from "react";
import { Button, Image, SafeAreaView, Text, View } from "react-native";

const Sikko = () => {
  const [image, setImage] = useState<string | null>(null);

  const handlePickImage = async () => {
    const newImage = await pickImage();
    setImage(newImage);
    const downloadURL = await sendStorage(newImage);
    console.log("downloadURL", downloadURL);
  };

  return (
    <SafeAreaView>
      <Text>sikko</Text>
      <Button title="Pick Image" onPress={handlePickImage} />
      {image && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text>Seçilen Resim:</Text>
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200, marginTop: 10 }}
            resizeMode="contain"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Sikko;
