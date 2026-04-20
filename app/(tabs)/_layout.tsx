import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store';
import { Colors } from '../../types';

function TabIcon({ name, focused }: { name: any; focused: boolean }) {
  const { theme, apiSettings } = useStore();
  const isDark = theme === 'dark';
  const primaryColor = apiSettings.branding.primaryColor || Colors.primary;

  return (
    <View style={styles.tabItem}>
      <Ionicons 
        name={name} 
        size={24} 
        color={focused ? primaryColor : (isDark ? '#444' : '#999')} 
      />
    </View>
  );
}

export default function TabLayout() {
  const { theme, apiSettings } = useStore();
  const isDark = theme === 'dark';
  const primaryColor = apiSettings.branding.primaryColor || Colors.primary;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // This will hide the names (Home, Search, etc.)
        tabBarStyle: {
          backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF',
          borderTopColor: isDark ? '#1A1A1A' : '#E5E7EB',
          height: 60,
          paddingBottom: 0,
        },
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: isDark ? '#444' : '#999',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? "home" : "home-outline"} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? "search" : "search-outline"} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? "list" : "list-outline"} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? "person" : "person-outline"} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    height: 85,
    paddingTop: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});