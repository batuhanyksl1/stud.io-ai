import { useContentCreation } from "@/hooks";
import { useAppDispatch } from "@/store/hooks";
import { pickImage } from "@/utils/pickImage";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { pollAiToolStatus } from "../../store/slices/contentCreationSlice";

const Sikko = () => {
  const dispatch = useAppDispatch();
  const {
    uploadImageToStorage,
    imageStorageUrl,
    uploadImageToAITool,
    createdImageUrl,
    storageUploadProcessingStatus,
    aiToolProcessingStatus,
    status,
    setActivityIndicatorColor,
    activityIndicatorColor,
    error,
  } = useContentCreation();

  const [imageUri, setImageUri] = useState<string | null>();

  const handlePickImage = async () => {
    try {
      const pickedImageUri = await pickImage();
      setImageUri(pickedImageUri);

      if (pickedImageUri) {
        console.log("🔄 Storage'a yükleniyor...");
        const imageUrl = await uploadImageToStorage(pickedImageUri);
        console.log("📤 Storage URL:", imageUrl);

        if (imageUrl) {
          console.log("🤖 AI Tool'a gönderiliyor...");
          const aiToolRequest = await uploadImageToAITool(
            imageUrl,
            "bir elma koy bu fotoğrafa",
          );

          if (
            aiToolRequest &&
            typeof aiToolRequest === "object" &&
            "request_id" in aiToolRequest
          ) {
            const aiToolRequestId = aiToolRequest.request_id?.toString();
            console.log("🎯 AI Tool Request ID:", aiToolRequestId);

            if (aiToolRequestId) {
              const aiToolStatusResult = await dispatch(
                pollAiToolStatus({
                  requestId: aiToolRequestId,
                }),
              );

              const statusPayload = aiToolStatusResult.payload;
              if (
                statusPayload &&
                typeof statusPayload === "object" &&
                "status" in statusPayload &&
                statusPayload.status === "COMPLETED"
              ) {
                const aiToolResult = await dispatch(
                  pollAiToolStatus({
                    requestId: aiToolRequestId,
                  }),
                ).unwrap();
                console.log("🎯 AI Tool sonucu:", aiToolResult.images[0]?.url);
              }
              console.log("🎯 AI Tool durumu:", statusPayload.images[0]?.url);
            }
          }
        }
      } else {
        console.log("❌ Resim seçilmedi.");
        setActivityIndicatorColor("rgb(43, 252, 217)");
        return null;
      }
    } catch (error) {
      console.error("💥 Hata oluştu:", error);
      setActivityIndicatorColor("rgb(255, 0, 0)");
      return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        🧪 Debug Ekranı
      </Text>

      {/* Buttons */}
      <Button title="📸 Resim Seç" onPress={handlePickImage} />

      {/* Status Indicators */}
      <View
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: "#f0f0f0",
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          📊 State Durumları:
        </Text>

        <Text style={{ marginBottom: 5 }}>
          🎯 Genel Status:{" "}
          <Text
            style={{
              color:
                status === "pending"
                  ? "orange"
                  : status === "fulfilled"
                    ? "green"
                    : status === "failed"
                      ? "red"
                      : "gray",
            }}
          >
            {status}
          </Text>
        </Text>

        <Text style={{ marginBottom: 5 }}>
          📤 Storage Status:{" "}
          <Text
            style={{
              color:
                storageUploadProcessingStatus === "pending"
                  ? "orange"
                  : storageUploadProcessingStatus === "fulfilled"
                    ? "green"
                    : storageUploadProcessingStatus === "failed"
                      ? "red"
                      : "gray",
            }}
          >
            {storageUploadProcessingStatus}
          </Text>
        </Text>

        <Text style={{ marginBottom: 5 }}>
          🤖 AI Tool Status:{" "}
          <Text
            style={{
              color:
                aiToolProcessingStatus === "pending"
                  ? "orange"
                  : aiToolProcessingStatus === "fulfilled"
                    ? "green"
                    : aiToolProcessingStatus === "failed"
                      ? "red"
                      : "gray",
            }}
          >
            {aiToolProcessingStatus}
          </Text>
        </Text>
        <Text style={{ marginBottom: 5 }}>
          📤 Image Storage URL:{" "}
          <Text
            style={{
              color:
                aiToolProcessingStatus === "pending"
                  ? "orange"
                  : aiToolProcessingStatus === "fulfilled"
                    ? "green"
                    : aiToolProcessingStatus === "failed"
                      ? "red"
                      : "gray",
            }}
          >
            {imageStorageUrl || " Yok"}
          </Text>
        </Text>
        <Text style={{ marginBottom: 5 }}>
          📤 Image Storage URL:{" "}
          <Text
            style={{
              color:
                aiToolProcessingStatus === "pending"
                  ? "orange"
                  : aiToolProcessingStatus === "fulfilled"
                    ? "green"
                    : aiToolProcessingStatus === "failed"
                      ? "red"
                      : "gray",
            }}
          >
            {createdImageUrl}
          </Text>
        </Text>

        <Text style={{ marginBottom: 5 }}>
          🎨 Activity Color:{" "}
          <Text style={{ color: activityIndicatorColor }}>
            {activityIndicatorColor}
          </Text>
        </Text>

        {error && (
          <Text style={{ marginTop: 10, color: "red", fontWeight: "bold" }}>
            ❌ Hata: {error}
          </Text>
        )}
      </View>

      {/* Loading Indicator */}
      {status === "pending" && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color={activityIndicatorColor} />
          <Text style={{ marginTop: 10 }}>İşlem devam ediyor...</Text>
        </View>
      )}

      {/* Selected Image */}
      {imageUri && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            📸 Seçilen Resim:
          </Text>
          <Image
            source={{ uri: createdImageUrl || "" }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
            resizeMode="contain"
          />
          <Text style={{ marginTop: 5, fontSize: 12, color: "gray" }}>
            {createdImageUrl}
          </Text>
        </View>
      )}

      {/* Created Image */}
      {createdImageUrl && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            🎨 Oluşturulan Resim:
          </Text>
          <Image
            source={{ uri: createdImageUrl }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
            resizeMode="contain"
          />
          <Text style={{ marginTop: 5, fontSize: 12, color: "gray" }}>
            {createdImageUrl}
          </Text>
        </View>
      )}

      {/* Debug Info */}
      <View
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: "#e8f4fd",
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
          🔍 Debug Bilgileri:
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 3 }}>
          • Storage Status: {storageUploadProcessingStatus}
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 3 }}>
          • AI Tool Status: {aiToolProcessingStatus}
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 3 }}>
          • Created Image URL: {createdImageUrl ? "✅ Var" : "❌ Yok"}
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 3 }}>
          • Error: {error ? "❌ " + error : "✅ Yok"}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Sikko;
