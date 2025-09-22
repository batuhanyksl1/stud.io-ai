import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface FilterPreviewProps {
  name: string;
  previewImage: string;
  isSelected: boolean;
  onSelect: () => void;
  backgroundColor?: string;
}

export default function FilterPreview({
  name,
  previewImage,
  isSelected,
  onSelect,
  backgroundColor = '#E5E7EB',
}: FilterPreviewProps) {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerActive]}
      onPress={onSelect}
    >
      <View style={[styles.preview, { backgroundColor }]}>
        <Image source={{ uri: previewImage }} style={styles.previewImage} />
      </View>
      <Text style={[styles.name, isSelected && styles.nameActive]}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
  },
  containerActive: {
    backgroundColor: '#EBF8FF',
    borderColor: '#0077B5',
  },
  preview: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  nameActive: {
    color: '#0077B5',
    fontFamily: 'Inter-SemiBold',
  },
});
