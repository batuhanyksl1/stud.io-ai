import { ThemedView } from "@/components";
import { ImageEditor } from "@/components/ImageEditor";
import React from "react";
import { StyleSheet } from "react-native";

export default function EditorTab() {
  return (
    <ThemedView style={styles.container}>
      <ImageEditor />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
