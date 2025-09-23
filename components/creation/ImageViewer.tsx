import { BorderRadius, Spacing, Typography } from "@/constants/DesignTokens";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ImageViewerProps {
  visible: boolean;
  imageUrl?: string;
  onClose: () => void;
  onDownload: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  visible,
  imageUrl,
  onClose,
  onDownload,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.viewerContainer, { backgroundColor: colors.background }]}
      >
        <ScrollView
          contentContainerStyle={styles.viewerScrollViewContent}
          maximumZoomScale={4}
          minimumZoomScale={1}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={{ uri: imageUrl || "" }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </ScrollView>

        <View
          style={[styles.viewerHeader, { backgroundColor: colors.overlay }]}
        >
          <Pressable
            style={[styles.viewerButton, { backgroundColor: colors.primary }]}
            onPress={onDownload}
          >
            <Text
              style={[styles.viewerButtonText, { color: colors.textOnPrimary }]}
            >
              İndir
            </Text>
          </Pressable>
          <Pressable
            style={[styles.viewerButton, { backgroundColor: colors.secondary }]}
            onPress={onClose}
          >
            <Text
              style={[styles.viewerButtonText, { color: colors.textOnPrimary }]}
            >
              Kapat
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  viewerContainer: {
    flex: 1,
  },
  viewerScrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  fullscreenImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  viewerHeader: {
    position: "absolute",
    top: 40,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  viewerButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 100,
    alignItems: "center",
  },
  viewerButtonText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
  },
});
