import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { editingServices } from "@/components/data";
import { useContentCreation, useDeviceDimensions } from "@/hooks";
import Ionicon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

export const HomeServices: React.FC = () => {
  const router = useRouter();
  const { clearAllImages, resetUIState } = useContentCreation();
  const { isTablet, isSmallDevice } = useDeviceDimensions();

  const handleServicePress = (
    servicePrompt: string,
    aiRequestUrl: string,
    aiStatusUrl: string,
    aiResultUrl: string,
    hasMultipleInputImage: boolean,
    hasPreSelectedImage: boolean,
    gradient: string[],
    title: string,
    token: number,
  ) => {
    // Yeni servis seçildiğinde tüm görselleri ve UI state'ini temizle
    clearAllImages();
    resetUIState();

    router.push({
      pathname: "/(tabs)/creationPage",
      params: {
        servicePrompt: servicePrompt,
        aiRequestUrl: aiRequestUrl,
        aiStatusUrl: aiStatusUrl,
        aiResultUrl: aiResultUrl,
        hasMultipleInputImage: hasMultipleInputImage ? "true" : "false",
        hasPreSelectedImage: hasPreSelectedImage ? "true" : "false",
        gradient: JSON.stringify(gradient),
        title: title,
        token: token,
      },
    });
    console.log(aiRequestUrl, aiStatusUrl, aiResultUrl);
  };

  const renderServiceCard = (
    service: (typeof editingServices)[0],
    cardWidth: string,
  ) => {
    return (
      <TouchableOpacity
        key={service.id}
        onPress={() =>
          handleServicePress(
            service.prompt,
            service.aiRequestUrl as string,
            service.aiStatusUrl as string,
            service.aiResultUrl as string,
            service.hasMultipleInputImage as boolean,
            service.hasPreSelectedImage as boolean,
            service.gradient as string[],
            service.title as string,
            service.token as number,
          )
        }
        activeOpacity={0.8}
        style={[styles.serviceCardContainer, { width: cardWidth }]}
      >
        <LinearGradient
          colors={service.gradient as [string, string, ...string[]]}
          style={[styles.serviceGradient, { height: cardHeight }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.serviceCardContent}>
            <View style={styles.serviceHeader}>
              <View style={styles.serviceIconWrapper}>
                <Ionicon name={service.icon as any} size={20} color="#FFFFFF" />
              </View>
              {service.isPopular && (
                <View
                  style={[
                    styles.popularBadge,
                    { backgroundColor: "rgba(255,255,255,0.2)" },
                  ]}
                >
                  <Ionicon name="star" size={8} color="#FFD700" />
                  <ThemedText variant="caption" style={styles.popularText}>
                    {service.badge}
                  </ThemedText>
                </View>
              )}
            </View>

            <View style={styles.serviceContent}>
              <View style={styles.serviceTextContainer}>
                <ThemedText
                  variant="caption"
                  style={[
                    styles.serviceSubtitle,
                    { fontSize: subtitleFontSize },
                  ]}
                >
                  {service.subtitle}
                </ThemedText>
                <ThemedText
                  variant="h4"
                  weight="bold"
                  style={[styles.serviceTitle, { fontSize: titleFontSize }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {service.title}
                </ThemedText>
                <ThemedText
                  variant="caption"
                  style={[
                    styles.serviceDescription,
                    { fontSize: descriptionFontSize },
                  ]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {service.description}
                </ThemedText>
              </View>
            </View>

            <View style={styles.serviceFooter}>
              <View style={styles.serviceStats}>
                <Ionicon name="star" size={10} color="#FFD700" />
                <ThemedText
                  variant="caption"
                  style={[styles.rating, { fontSize: ratingFontSize }]}
                >
                  {service.rating}
                </ThemedText>
                <ThemedText
                  variant="caption"
                  style={[styles.usageCount, { fontSize: ratingFontSize }]}
                >
                  • {service.usageCount}
                </ThemedText>
              </View>
              <Ionicon
                name="arrow-forward"
                size={14}
                color="rgba(255,255,255,0.8)"
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Responsive grid ayarları
  const getGridColumns = () => {
    if (isTablet) return 3;
    if (isSmallDevice) return 2;
    return 2;
  };

  const getCardWidth = () => {
    if (isTablet) return "31%";
    if (isSmallDevice) return "48%";
    return "48%";
  };

  // Responsive font boyutları
  const titleFontSize = isTablet ? 18 : isSmallDevice ? 14 : 16;
  const subtitleFontSize = isTablet ? 14 : isSmallDevice ? 10 : 12;
  const descriptionFontSize = isTablet ? 15 : isSmallDevice ? 11 : 13;
  const ratingFontSize = isTablet ? 14 : isSmallDevice ? 10 : 12;

  // Responsive kart yüksekliği - daha yüksek
  const cardHeight = isTablet ? 200 : isSmallDevice ? 160 : 180;

  return (
    <ThemedView
      style={[styles.servicesSection, { paddingHorizontal: isTablet ? 0 : 12 }]}
    >
      <View style={styles.sectionHeader}>
        <ThemedText variant="h3" weight="bold">
          Tüm Servisler
        </ThemedText>
      </View>
      <View style={[styles.servicesGrid, { gap: isTablet ? 12 : 8 }]}>
        {editingServices.map((service) =>
          renderServiceCard(service, getCardWidth()),
        )}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  servicesSection: {
    paddingTop: Platform.OS === "ios" ? 5 : 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  // sectionTitle: {
  //   marginBottom: 16,
  // },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  serviceCardContainer: {
    marginBottom: 0,
  },
  serviceGradient: {
    borderRadius: 12,
    padding: 10,
    // Yükseklik dinamik olarak ayarlanacak
  },
  serviceCardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  serviceIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  popularBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  popularText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  serviceContent: {
    marginTop: 8,
    marginBottom: 8,
    flex: 1,
    justifyContent: "center", // İçeriği ortala
  },
  serviceTextContainer: {
    flex: 1,
    justifyContent: "flex-start", // Metinleri üstten başlat
    paddingVertical: 4, // Üst ve alt padding
  },
  serviceSubtitle: {
    color: "rgba(255,255,255,0.8)",
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
  serviceTitle: {
    color: "#FFFFFF",
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 20,
    numberOfLines: 1, // Tek satır
    ellipsizeMode: "tail", // Sonuna ... ekle
  },
  serviceDescription: {
    color: "rgba(255,255,255,0.9)",
    lineHeight: 18,
    fontSize: 13,
    marginTop: 6,
    numberOfLines: 2, // Maksimum 2 satır
    ellipsizeMode: "tail", // Sonuna ... ekle
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  usageCount: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
});
