import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { editingServices } from "@/components/data";
import { useContentCreation, useDeviceDimensions, useTheme } from "@/hooks";
import Ionicon from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

export const HomeServices: React.FC = () => {
  const router = useRouter();
  const { isDark } = useTheme();
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
    serviceId?: string,
    isCustomPrompt?: boolean,
  ) => {
    // Tüm servisler creationPage'e yönlendirilir.
    // Auth kontrolü creationPage içindeki useAuthProtection hook'u tarafından yapılır.
    clearAllImages();
    resetUIState();

    router.push({
      pathname: "/creationPage",
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
        serviceId: serviceId || "",
        isCustomPrompt: isCustomPrompt ? "true" : "false",
      },
    });
  };

  // Responsive değerler
  const titleFontSize = isTablet ? 17 : isSmallDevice ? 14 : 15;
  const subtitleFontSize = isTablet ? 13 : isSmallDevice ? 10 : 11;
  const descriptionFontSize = isTablet ? 13 : isSmallDevice ? 10 : 11;
  const ratingFontSize = isTablet ? 12 : isSmallDevice ? 9 : 10;
  const cardHeight = isTablet ? 210 : isSmallDevice ? 185 : 195;

  const ServiceCard = ({
    service,
  }: {
    service: (typeof editingServices)[0];
    index: number;
  }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        friction: 8,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.serviceCardContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
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
              service.id,
              (service as any).isCustomPrompt,
            )
          }
          style={{ flex: 1 }}
        >
          <LinearGradient
            colors={service.gradient as [string, string, ...string[]]}
            style={[styles.serviceGradient, { height: cardHeight }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Dekoratif elementler */}
            <View style={styles.decorativeContainer}>
              <View style={styles.decorCircleSmall} />
              <View style={styles.decorCircleLarge} />
            </View>

            {/* Arka plan görseli */}
            <View style={styles.bgImageContainer}>
              <Image
                source={service.image2}
                style={styles.bgImage}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.5)"]}
                style={styles.imageOverlay}
              />
            </View>

            <View style={styles.serviceCardContent}>
              {/* Header */}
              <View style={styles.serviceHeader}>
                <View style={styles.serviceIconWrapper}>
                  <LinearGradient
                    colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.15)"]}
                    style={styles.iconGradient}
                  >
                    <Ionicon
                      name={service.icon as any}
                      size={18}
                      color="#FFFFFF"
                    />
                  </LinearGradient>
                </View>
                {service.isPopular && (
                  <View style={styles.popularBadge}>
                    <Ionicon name="star" size={8} color="#FFD700" />
                    <ThemedText variant="caption" style={styles.popularText}>
                      {service.badge}
                    </ThemedText>
                  </View>
                )}
              </View>

              {/* İçerik */}
              <View style={styles.serviceContent}>
                <ThemedText
                  variant="overline"
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
                  numberOfLines={2}
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

              {/* Footer */}
              <View style={styles.serviceFooter}>
                <View style={styles.serviceStats}>
                  <View style={styles.ratingContainer}>
                    <Ionicon name="star" size={10} color="#FFD700" />
                    <ThemedText
                      variant="caption"
                      style={[styles.rating, { fontSize: ratingFontSize }]}
                    >
                      {service.rating}
                    </ThemedText>
                  </View>
                  <View style={styles.divider} />
                  <ThemedText
                    variant="caption"
                    style={[styles.usageCount, { fontSize: ratingFontSize }]}
                  >
                    {service.usageCount}
                  </ThemedText>
                </View>
                <View style={styles.arrowButton}>
                  <Ionicon name="arrow-forward" size={14} color="white" />
                </View>
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <ThemedView
      backgroundColor="transparent"
      style={[
        styles.servicesSection,
        { paddingHorizontal: isTablet ? 8 : isSmallDevice ? 4 : 6 },
      ]}
    >
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <View
            style={[
              styles.sectionIcon,
              {
                backgroundColor: isDark
                  ? "rgba(16, 185, 129, 0.2)"
                  : "rgba(16, 185, 129, 0.12)",
              },
            ]}
          >
            <Ionicon name="grid" size={16} color="#10B981" />
          </View>
          <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>
            Tüm Servisler
          </ThemedText>
        </View>
        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: isDark
                ? "rgba(16, 185, 129, 0.15)"
                : "rgba(16, 185, 129, 0.1)",
            },
          ]}
        >
          <ThemedText
            variant="caption"
            weight="semiBold"
            style={{ color: "#10B981" }}
          >
            {editingServices.length} Servis
          </ThemedText>
        </View>
      </View>

      <FlatList
        data={editingServices}
        keyExtractor={(item) => String(item.id)}
        numColumns={isTablet ? 3 : 2}
        scrollEnabled={false}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        renderItem={({ item, index }) => (
          <ServiceCard service={item} index={index} />
        )}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  servicesSection: {
    paddingTop: Platform.OS === "ios" ? 12 : 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: 0,
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  columnWrapper: {
    gap: 10,
  },
  listContent: {
    gap: 10,
  },
  itemSeparator: {
    height: 0,
  },
  serviceCardContainer: {
    flex: 1,
  },
  serviceGradient: {
    borderRadius: 20,
    padding: 14,
    overflow: "hidden",
  },
  decorativeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorCircleSmall: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -20,
    right: -20,
  },
  decorCircleLarge: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -40,
    left: -30,
  },
  bgImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  bgImage: {
    width: "100%",
    height: "100%",
    opacity: 0.12,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  serviceCardContent: {
    flex: 1,
    justifyContent: "space-between",
    zIndex: 1,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  serviceIconWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconGradient: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  popularBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,215,0,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
  },
  popularText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },
  serviceContent: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 8,
  },
  serviceSubtitle: {
    color: "rgba(255,255,255,0.75)",
    marginBottom: 4,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  serviceTitle: {
    color: "#FFFFFF",
    lineHeight: 20,
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  serviceDescription: {
    color: "rgba(255,255,255,0.85)",
    lineHeight: 16,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  rating: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  divider: {
    width: 1,
    height: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  usageCount: {
    color: "rgba(255,255,255,0.85)",
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
});
