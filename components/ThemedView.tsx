import { Spacing } from "@/constants/DesignTokens";
import { useTheme } from "@/hooks/useTheme";
import React, { ReactNode } from "react";
import { SafeAreaView, StyleProp, ViewStyle } from "react-native";

// ThemedView bileşeninin alabileceği özellikler
interface ThemedViewProps {
  children: ReactNode; // İçeride gösterilecek bileşenler
  style?: StyleProp<ViewStyle>; // Ek stil özellikleri
  backgroundColor?:
    | "background"
    | "surface"
    | "surfaceElevated"
    | "primary"
    | "transparent"; // Arka plan rengi seçenekleri
  padding?: keyof typeof Spacing; // İç boşluk (padding) değeri
  margin?: keyof typeof Spacing; // Dış boşluk (margin) değeri
}

/**
 * ThemedView Bileşeni
 *
 * Bu bileşen, uygulamanın temasına (açık/koyu) göre otomatik olarak
 * doğru renkleri uygulayan bir konteyner bileşenidir.
 *
 * Özellikler:
 * - Otomatik tema desteği (açık/koyu mod)
 * - Önceden tanımlanmış arka plan renkleri
 * - Kolay padding ve margin ayarları
 * - SafeAreaView ile güvenli alan desteği
 *
 * Kullanım örnekleri:
 * <ThemedView backgroundColor="surface" padding="md">
 *   <Text>İçerik buraya</Text>
 * </ThemedView>
 */
export default function ThemedView({
  children,
  style,
  backgroundColor = "background", // Varsayılan olarak ana arka plan rengi
  padding,
  margin,
}: ThemedViewProps) {
  // Mevcut temayı al (açık/koyu)
  const { colors } = useTheme();

  // Stil dizisini oluştur
  const viewStyle: StyleProp<ViewStyle> = [
    // 1. Arka plan rengini ayarla
    {
      backgroundColor:
        backgroundColor === "transparent"
          ? "transparent"
          : colors[backgroundColor],
    },
    // 2. Margin (dış boşluk) varsa ekle
    margin && { margin: Spacing[margin] },
    // 3. Padding (iç boşluk) varsa ekle
    padding && { padding: Spacing[padding] },
    // 4. Kullanıcının verdiği ek stilleri ekle
    style,
  ].filter(Boolean) as ViewStyle[]; // Boş değerleri filtrele

  return <SafeAreaView style={viewStyle}>{children}</SafeAreaView>;
}
