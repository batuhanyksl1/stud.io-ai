import { Tabs } from 'expo-router';
import {
  Camera,
  Image as ImageIcon,
  CreditCard as Edit3,
  User,
  Settings,
} from 'lucide-react-native';
import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

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
          title: 'Camera',
          tabBarIcon: ({ size, color }) => <Camera size={size} color={color} strokeWidth={2} />,
        }}
      />
      {/* <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ size, color }) => (
            <ImageIcon size={size} color={color} strokeWidth={2} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name='editor'
        options={{
          title: 'Editor',
          tabBarIcon: ({ size, color }) => <Edit3 size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => <Settings size={size} color={color} strokeWidth={2} />,
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
