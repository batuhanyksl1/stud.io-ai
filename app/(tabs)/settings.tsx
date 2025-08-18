import { ScrollContainer, ThemedCard, ThemedText, ThemedView } from '@/components';
import { BorderRadius, Spacing } from '@/constants';
import { useAuth, useTheme } from '@/hooks';
import { authService } from '@/services';

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Bell,
  Camera,
  ChevronRight,
  Download,
  ExternalLink,
  CircleHelp as HelpCircle,
  Monitor,
  Moon,
  RefreshCw,
  Settings as SettingsIcon,
  Share2,
  Shield,
  Smartphone,
  Star,
  Sun,
  Trash2,
  User,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Platform, Share, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  type: 'toggle' | 'navigation' | 'action' | 'theme';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  destructive?: boolean;
}

export default function SettingsTab() {
  const { colors, mode, setTheme, isDark } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [highQuality, setHighQuality] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const handleToggle = (setter: (value: boolean) => void, currentValue: boolean) => {
    if (Platform.OS !== 'web' && hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setter(!currentValue);
  };

  const handleThemeChange = (newMode: ThemeMode) => {
    if (Platform.OS !== 'web' && hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTheme(newMode);
  };

  const handleShare = async () => {
    if (Platform.OS !== 'web' && hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      await Share.share({
        message:
          'Check out LinkedIn Profile Creator - the best app for creating professional profile pictures!',
        url: 'https://linkedinprofilecreator.app',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRateApp = () => {
    if (Platform.OS !== 'web' && hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert(
      'Rate Our App',
      'Thank you for using LinkedIn Profile Creator! Would you like to rate us on the App Store?',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Rate Now', onPress: () => console.log('Navigate to app store') },
      ],
    );
  };

  const handleClearCache = () => {
    if (Platform.OS !== 'web' && hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      'Clear Cache',
      'This will clear all cached images and temporary files. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully!');
          },
        },
      ],
    );
  };

  const handleResetSettings = () => {
    if (Platform.OS !== 'web' && hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to their default values. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setTheme('system');
            setNotifications(true);
            setAutoSave(true);
            setHighQuality(true);
            setHapticFeedback(true);
            Alert.alert('Success', 'Settings reset to defaults!');
          },
        },
      ],
    );
  };

  const handleSignOut = async () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          try {
            await authService.signOut();
            router.replace('/');
          } catch (error) {
            Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
          }
        },
      },
    ]);
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: user?.displayName || 'Profil Ayarları',
          subtitle: user?.email || 'Hesap bilgilerinizi yönetin',
          icon: <User size={22} color={colors.primary} strokeWidth={2} />,
          type: 'navigation' as const,
          onPress: () => console.log('Navigate to profile'),
        },
        {
          id: 'signout',
          title: 'Çıkış Yap',
          subtitle: 'Hesabınızdan güvenli şekilde çıkış yapın',
          icon: <ExternalLink size={22} color={colors.error} strokeWidth={2} />,
          type: 'action' as const,
          onPress: handleSignOut,
          destructive: true,
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          title: 'Theme',
          subtitle: 'Choose your preferred theme',
          icon: isDark ? (
            <Moon size={22} color={colors.primary} strokeWidth={2} />
          ) : (
            <Sun size={22} color={colors.primary} strokeWidth={2} />
          ),
          type: 'theme' as const,
        },
      ],
    },
    {
      title: 'Camera & Photo',
      items: [
        {
          id: 'camera-quality',
          title: 'High Quality Photos',
          subtitle: 'Use maximum resolution for better results',
          icon: <Camera size={22} color={colors.primary} strokeWidth={2} />,
          type: 'toggle' as const,
          value: highQuality,
          onToggle: (value: boolean) => handleToggle(setHighQuality, highQuality),
        },
        {
          id: 'auto-save',
          title: 'Auto-Save Originals',
          subtitle: 'Keep original photos when editing',
          icon: <Download size={22} color={colors.primary} strokeWidth={2} />,
          type: 'toggle' as const,
          value: autoSave,
          onToggle: (value: boolean) => handleToggle(setAutoSave, autoSave),
        },
      ],
    },
    {
      title: 'Notifications & Feedback',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Get updates about new features',
          icon: <Bell size={22} color={colors.primary} strokeWidth={2} />,
          type: 'toggle' as const,
          value: notifications,
          onToggle: (value: boolean) => handleToggle(setNotifications, notifications),
        },
        {
          id: 'haptic',
          title: 'Haptic Feedback',
          subtitle: 'Feel vibrations for interactions',
          icon: <Smartphone size={22} color={colors.primary} strokeWidth={2} />,
          type: 'toggle' as const,
          value: hapticFeedback,
          onToggle: (value: boolean) => handleToggle(setHapticFeedback, hapticFeedback),
        },
      ],
    },
    {
      title: 'Support & Feedback',
      items: [
        {
          id: 'rate',
          title: 'Rate Our App',
          subtitle: 'Help us improve with your feedback',
          icon: <Star size={22} color={colors.primary} strokeWidth={2} />,
          type: 'action' as const,
          onPress: handleRateApp,
        },
        {
          id: 'share',
          title: 'Share App',
          subtitle: 'Tell your friends about us',
          icon: <Share2 size={22} color={colors.primary} strokeWidth={2} />,
          type: 'action' as const,
          onPress: handleShare,
        },
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          icon: <HelpCircle size={22} color={colors.primary} strokeWidth={2} />,
          type: 'navigation' as const,
          onPress: () => console.log('Navigate to help'),
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          subtitle: 'Learn how we protect your data',
          icon: <Shield size={22} color={colors.primary} strokeWidth={2} />,
          type: 'navigation' as const,
          onPress: () => console.log('Navigate to privacy'),
        },
      ],
    },
    {
      title: 'Advanced',
      items: [
        {
          id: 'clear-cache',
          title: 'Clear Cache',
          subtitle: 'Free up storage space',
          icon: <Trash2 size={22} color={colors.error} strokeWidth={2} />,
          type: 'action' as const,
          onPress: handleClearCache,
          destructive: true,
        },
        {
          id: 'reset',
          title: 'Reset Settings',
          subtitle: 'Restore all settings to defaults',
          icon: <RefreshCw size={22} color={colors.error} strokeWidth={2} />,
          type: 'action' as const,
          onPress: handleResetSettings,
          destructive: true,
        },
      ],
    },
  ];

  const renderThemeSelector = () => {
    const themeOptions = [
      {
        mode: 'light' as ThemeMode,
        label: 'Light',
        icon: <Sun size={18} color={colors.textSecondary} strokeWidth={2} />,
      },
      {
        mode: 'dark' as ThemeMode,
        label: 'Dark',
        icon: <Moon size={18} color={colors.textSecondary} strokeWidth={2} />,
      },
      {
        mode: 'system' as ThemeMode,
        label: 'System',
        icon: <Monitor size={18} color={colors.textSecondary} strokeWidth={2} />,
      },
    ];

    return (
      <View style={[styles.themeSelector, { backgroundColor: colors.surface }]}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.mode}
            style={[
              styles.themeOption,
              {
                backgroundColor: mode === option.mode ? colors.primary : 'transparent',
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleThemeChange(option.mode)}
          >
            {React.cloneElement(option.icon, {
              color: mode === option.mode ? colors.textOnPrimary : colors.textSecondary,
            })}
            <ThemedText
              variant="caption"
              weight="medium"
              color={mode === option.mode ? 'onPrimary' : 'secondary'}
              style={{ marginTop: 4 }}
            >
              {option.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.settingItem,
          { borderBottomColor: colors.borderSubtle },
          item.destructive && { backgroundColor: colors.errorSubtle },
        ]}
        onPress={item.onPress}
        disabled={item.type === 'toggle' || item.type === 'theme'}
      >
        <View style={[styles.settingIcon, { backgroundColor: colors.secondarySubtle }]}>
          {item.icon}
        </View>

        <View style={styles.settingContent}>
          <ThemedText
            variant="body"
            weight="semiBold"
            color={item.destructive ? 'error' : 'primary'}
          >
            {item.title}
          </ThemedText>
          {item.subtitle && (
            <ThemedText variant="caption" color="secondary" style={{ marginTop: 2 }}>
              {item.subtitle}
            </ThemedText>
          )}

          {item.type === 'theme' && <View style={{ marginTop: 12 }}>{renderThemeSelector()}</View>}
        </View>

        <View style={styles.settingAction}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
              ios_backgroundColor={colors.border}
            />
          )}
          {item.type === 'navigation' && (
            <ChevronRight size={20} color={colors.textTertiary} strokeWidth={2} />
          )}
          {item.type === 'action' && (
            <ExternalLink
              size={18}
              color={item.destructive ? colors.error : colors.textTertiary}
              strokeWidth={2}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? [colors.surface, colors.surfaceElevated] : ['#0077B5', '#004182']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={[styles.headerIcon, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
            <SettingsIcon size={28} color="#FFFFFF" strokeWidth={2} />
          </View>
          <View style={styles.headerText}>
            <ThemedText variant="h2" color="inverse">
              Settings
            </ThemedText>
            <ThemedText variant="body" color="inverse" style={{ opacity: 0.8 }}>
              Customize your experience
            </ThemedText>
          </View>
        </View>
      </LinearGradient>

      {/* Settings List */}
      <ScrollContainer style={styles.scrollView}>
        {settingSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <ThemedText
              variant="bodyLarge"
              weight="semiBold"
              color="secondary"
              style={styles.sectionTitle}
            >
              {section.title}
            </ThemedText>

            <ThemedCard style={styles.sectionContent} padding="none" elevation="sm">
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  {renderSettingItem(item)}
                  {itemIndex < section.items.length - 1 && (
                    <View style={[styles.separator, { backgroundColor: colors.borderSubtle }]} />
                  )}
                </View>
              ))}
            </ThemedCard>
          </View>
        ))}

        {/* App Info */}
        <ThemedCard style={styles.appInfo} elevation="sm">
          <View style={styles.appInfoContent}>
            <ThemedText variant="bodyLarge" weight="semiBold" color="primary" align="center">
              LinkedIn Profile Creator
            </ThemedText>
            <ThemedText variant="caption" color="secondary" align="center" style={{ marginTop: 4 }}>
              Version 1.0.0
            </ThemedText>
            <ThemedText variant="caption" color="tertiary" align="center" style={{ marginTop: 2 }}>
              © 2025 Professional Photos Inc.
            </ThemedText>
          </View>
        </ThemedCard>
      </ScrollContainer>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerText: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  sectionContent: {
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 64,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  settingContent: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  settingAction: {
    marginLeft: Spacing.sm,
    marginTop: 2,
  },
  separator: {
    height: 1,
    marginLeft: 76,
  },
  themeSelector: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: 4,
    gap: 4,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  appInfo: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  appInfoContent: {
    alignItems: 'center',
  },
});
