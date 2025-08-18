import { ThemedCard, ThemedText, ThemedView } from '@/components';
import { recentActivity } from '@/components/data';
import { useTheme } from '@/hooks';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export const HomeRecentActivity: React.FC = () => {
  const { colors } = useTheme();

  const renderActivityItem = (item: (typeof recentActivity)[0]) => {
    return (
      <TouchableOpacity key={item.id} style={styles.activityItem} activeOpacity={0.7}>
        <View style={styles.activityThumbnail}>
          <ThemedText variant="h3">{item.thumbnail}</ThemedText>
        </View>
        <View style={styles.activityContent}>
          <ThemedText variant="body" weight="semiBold">
            {item.title}
          </ThemedText>
          <ThemedText variant="caption" color="secondary">
            {item.service} • {item.timestamp}
          </ThemedText>
        </View>
        <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.recentSection}>
      <View style={styles.sectionHeader}>
        <ThemedText variant="h3" weight="bold" style={styles.sectionTitle}>
          Son Aktiviteler
        </ThemedText>
        <TouchableOpacity>
          <ThemedText variant="body" color="primary" weight="semiBold">
            Tümünü Gör
          </ThemedText>
        </TouchableOpacity>
      </View>
      <ThemedCard
        style={[styles.recentCard, { backgroundColor: colors.surface }] as any}
        padding="sm"
        elevation="sm"
      >
        {recentActivity.map(renderActivityItem)}
      </ThemedCard>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  recentSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  recentCard: {
    borderRadius: 16,
    marginTop: 16,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  activityThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});
