import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function FirebaseTest() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔄 Kullanıcı dokümanları çekiliyor...");

      // Kullanıcı giriş yapmış mı kontrol et
      const currentUser = auth().currentUser;
      if (!currentUser) {
        setError("Kullanıcı giriş yapmamış!");
        setDocuments([]);
        return;
      }

      console.log("👤 Kullanıcı UID:", currentUser.uid);

      // aiToolRequests koleksiyonundan kullanıcının dokümanlarını çek
      const querySnapshot = await firestore()
        .collection("aiToolRequests")
        .where("userId", "==", currentUser.uid)
        .get();

      console.log("📊 Sorgu sonucu:", querySnapshot.docs.length, "doküman");

      if (querySnapshot.docs.length === 0) {
        setError("Bu kullanıcı için doküman bulunamadı!");
        setDocuments([]);
      } else {
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDocuments(docs);
        console.log("✅ Kullanıcı dokümanları yüklendi:", docs.length);
      }
    } catch (err: any) {
      console.error("❌ Veri çekme hatası:", err);
      setError(`Hata: ${err.message}`);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setDocuments([]);
    setError(null);
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f5f5f5" }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
          color: "#333",
        }}
      >
        🔥 aiToolRequests - Kullanıcı Dokümanları
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <Button
          title={loading ? "⏳ Yükleniyor..." : "🔄 Dokümanları Çek"}
          onPress={fetchUserDocuments}
          disabled={loading}
        />
        <Button title="🗑️ Temizle" onPress={clearData} disabled={loading} />
      </View>

      {loading && (
        <View
          style={{
            alignItems: "center",
            marginBottom: 20,
            padding: 20,
            backgroundColor: "#e3f2fd",
            borderRadius: 10,
          }}
        >
          <ActivityIndicator size="large" color="#2196f3" />
          <Text style={{ marginTop: 10, color: "#1976d2" }}>
            Kullanıcı dokümanları çekiliyor...
          </Text>
        </View>
      )}

      {error && (
        <View
          style={{
            backgroundColor: "#ffebee",
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
            borderLeftWidth: 4,
            borderLeftColor: "#f44336",
          }}
        >
          <Text style={{ color: "#d32f2f", fontWeight: "bold" }}>
            ❌ {error}
          </Text>
        </View>
      )}

      {documents.length > 0 && (
        <View
          style={{
            backgroundColor: "#e8f5e8",
            padding: 10,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "#2e7d32",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            ✅ {documents.length} doküman bulundu
          </Text>
        </View>
      )}

      <ScrollView style={{ flex: 1 }}>
        {documents.map((doc, index) => (
          <View
            key={doc.id}
            style={{
              backgroundColor: "white",
              padding: 15,
              marginBottom: 15,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
                color: "#1976d2",
              }}
            >
              📄 Doküman #{index + 1}
            </Text>

            <Text style={{ fontSize: 14, marginBottom: 5 }}>
              <Text style={{ fontWeight: "bold" }}>ID:</Text> {doc.id}
            </Text>

            <Text style={{ fontSize: 14, marginBottom: 5 }}>
              <Text style={{ fontWeight: "bold" }}>👤 User ID:</Text>{" "}
              {doc.userId}
            </Text>

            {doc.result && (
              <View style={{ marginTop: 10 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    marginBottom: 5,
                  }}
                >
                  📊 Result Data:
                </Text>
                <ScrollView
                  horizontal
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: 8,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontFamily: "monospace", fontSize: 12 }}>
                    {JSON.stringify(doc.result, null, 2)}
                  </Text>
                </ScrollView>
              </View>
            )}

            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#666",
                  marginBottom: 5,
                }}
              >
                🔧 Tüm Veri:
              </Text>
              <ScrollView
                horizontal
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: 8,
                  borderRadius: 5,
                }}
              >
                <Text style={{ fontFamily: "monospace", fontSize: 10 }}>
                  {JSON.stringify(doc, null, 2)}
                </Text>
              </ScrollView>
            </View>
          </View>
        ))}

        {documents.length === 0 && !loading && !error && (
          <View
            style={{
              alignItems: "center",
              padding: 40,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 48, marginBottom: 10 }}>📭</Text>
            <Text
              style={{
                fontSize: 16,
                color: "#666",
                textAlign: "center",
              }}
            >
              Henüz veri yok.{"\n"}
              &quot;Dokümanları Çek&quot; butonuna basarak başlayın.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
