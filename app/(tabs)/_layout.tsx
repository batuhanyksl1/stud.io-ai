import { useTheme } from '@/hooks/useTheme';
import { Tabs } from 'expo-router';
import { CreditCard as Edit3, Hammer, Settings, User } from 'lucide-react-native';
import { Platform, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Create',
          tabBarIcon: ({ size, color }) => <Hammer size={size} color={color} strokeWidth={2} />,
        }}
      />

      <Tabs.Screen
        name='editor'
        options={{
          title: 'Galeri',
          tabBarIcon: ({ size, color }) => <Edit3 size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name='service-detail'
        options={{
          href: null, // Bu sayfa tab olarak görünmeyecek
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => <Settings size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});
