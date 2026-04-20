import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store';
import { Colors } from '../../types';

function TabIcon({ name, label, focused }: { name: any; label: string; focused: boolean }) {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <View style={styles.tabItem}>
      <Ionicons 
        name={name} 
        size={24} 
        color={focused ? Colors.primary : (isDark ? '#444' : '#999')} 
      />
      <Text style={[
        styles.tabLabel, 
        focused && styles.tabLabelActive,
        isDark && { color: focused ? Colors.primary : '#444' }
      ]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, isDark && { backgroundColor: '#0A0A0A', borderTopColor: '#1A1A1A' }],
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? "home" : "home-outline"} label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? "search" : "search-outline"} label="Search" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? "list" : "list-outline"} label="Bookings" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? "person" : "person-outline"} label="Profile" focused={focused} />,
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
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});