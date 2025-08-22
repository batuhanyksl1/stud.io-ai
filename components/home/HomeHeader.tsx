import Logo from "@/components/Logo";
import ThemedText from "@/components/ThemedText";
import { useTheme } from "@/hooks";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const HomeHeader: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Logo size="md" font="poppins" />
          <ThemedText
            variant="caption"
            color="secondary"
            style={styles.headerSubtitle}
          >
            AI destekli görsel düzenleme
          </ThemedText>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <View
            style={[styles.profileAvatar, { backgroundColor: colors.primary }]}
          >
            <ThemedText variant="body" weight="bold" color="onPrimary">
              B
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
  },
  headerSubtitle: {
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
