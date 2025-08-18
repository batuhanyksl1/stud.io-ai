import { ScrollContainer, ThemedCard, ThemedText, ThemedView } from '@/components';
import { useTheme } from '@/hooks';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Download, Plus, Settings, Share, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface SavedProfile {
  id: string;
  uri: string;
  timestamp: number;
  filterName: string;
}

export default function ProfileTab() {
  const { colors } = useTheme();
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);

  const mockProfiles: SavedProfile[] = [
    {
      id: '1',
      uri: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: Date.now() - 86400000,
      filterName: 'Professional',
    },
    {
      id: '2',
      uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: Date.now() - 172800000,
      filterName: 'Corporate',
    },
  ];

  useEffect(() => {
    setSavedProfiles(mockProfiles);
  }, []);

  const createNewProfile = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/');
  };

  const shareProfile = (profile: SavedProfile) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Share functionality would be implemented here
  };

  const deleteProfile = (profileId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSavedProfiles((prev) => prev.filter((p) => p.id !== profileId));
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerContent}>
          <ThemedText variant="h2" weight="bold">
            Your Profiles
          </ThemedText>
          <ThemedText variant="body" color="secondary">
            Manage your professional profile pictures
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: colors.secondarySubtle }]}
        >
          <Settings size={24} color={colors.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollContainer>
        <View style={styles.statsContainer}>
          <ThemedCard style={styles.statCard} padding="lg" elevation="sm">
            <ThemedText variant="h3" weight="bold" color="primary" align="center">
              {savedProfiles.length}
            </ThemedText>
            <ThemedText variant="caption" weight="medium" color="secondary" align="center">
              Created
            </ThemedText>
          </ThemedCard>
          <ThemedCard style={styles.statCard} padding="lg" elevation="sm">
            <ThemedText variant="h3" weight="bold" color="primary" align="center">
              2.4K
            </ThemedText>
            <ThemedText variant="caption" weight="medium" color="secondary" align="center">
              Profile Views
            </ThemedText>
          </ThemedCard>
          <ThemedCard style={styles.statCard} padding="lg" elevation="sm">
            <ThemedText variant="h3" weight="bold" color="primary" align="center">
              95%
            </ThemedText>
            <ThemedText variant="caption" weight="medium" color="secondary" align="center">
              Professional Score
            </ThemedText>
          </ThemedCard>
        </View>

        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={createNewProfile}
        >
          <Plus size={24} color={colors.textOnPrimary} strokeWidth={2} />
          <ThemedText variant="body" weight="semiBold" color="onPrimary" style={{ marginLeft: 8 }}>
            Create New Profile Picture
          </ThemedText>
        </TouchableOpacity>

        <View style={styles.historyHeader}>
          <ThemedText variant="h4" weight="semiBold">
            Recent Creations
          </ThemedText>
          <ThemedText variant="caption" color="secondary">
            {savedProfiles.length} pictures
          </ThemedText>
        </View>

        {savedProfiles.map((profile) => (
          <ThemedCard key={profile.id} style={styles.profileCard} padding="md" elevation="sm">
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: profile.uri }} style={styles.profileImage} />
            </View>

            <View style={styles.profileInfo}>
              <ThemedText variant="body" weight="semiBold">
                {profile.filterName} Filter
              </ThemedText>
              <ThemedText variant="caption" color="secondary" style={{ marginTop: 4 }}>
                {formatDate(profile.timestamp)}
              </ThemedText>
            </View>

            <View style={styles.profileActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.secondarySubtle }]}
                onPress={() => shareProfile(profile)}
              >
                <Share size={18} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.errorSubtle }]}
                onPress={() => deleteProfile(profile.id)}
              >
                <Trash2 size={18} color={colors.error} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </ThemedCard>
        ))}

        {savedProfiles.length === 0 && (
          <View style={styles.emptyState}>
            <Download size={48} color={colors.textTertiary} strokeWidth={1.5} />
            <ThemedText
              variant="bodyLarge"
              weight="semiBold"
              align="center"
              style={{ marginTop: 16, marginBottom: 8 }}
            >
              No Profile Pictures Yet
            </ThemedText>
            <ThemedText variant="body" color="secondary" align="center" style={{ lineHeight: 24 }}>
              Create your first professional profile picture using the camera or gallery
            </ThemedText>
          </View>
        )}
      </ScrollContainer>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#0077B5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0077B5',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#0077B5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  historyCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  profilesList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
  },
  profileFilterName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  profileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
