import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Switch } from 'react-native';
import { Header } from '../../components/Header';
import { useStore } from '../../store';
import { Colors } from '../../types';

export default function ProfileScreen() {
  const { user } = useStore();
  const [notifications, setNotifications] = React.useState(true);

  const menuItems = [
    { icon: '👤', title: 'Edit Profile', onPress: () => {} },
    { icon: '💳', title: 'Payment Methods', onPress: () => {} },
    { icon: '🔔', title: 'Notifications', onPress: () => {}, hasSwitch: true },
    { icon: '🌐', title: 'Language', onPress: () => {}, right: 'English' },
    { icon: '💰', title: 'Currency', onPress: () => {}, right: 'USD' },
    { icon: '❓', title: 'Help & Support', onPress: () => {} },
    { icon: '📜', title: 'Terms & Conditions', onPress: () => {} },
    { icon: '🔒', title: 'Privacy Policy', onPress: () => {} },
    { icon: '🚪', title: 'Log Out', onPress: () => {}, textColor: Colors.error },
  ];

  return (
    <View style={styles.container}>
      <Header title="Profile" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>BO</Text>
            </View>
            <TouchableOpacity style={styles.editAvatar}>
              <Text style={styles.editAvatarText}>✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || 'Blue Ocean User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@blueocean.com'}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Countries</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Blue Ocean Brand Section */}
        <View style={styles.brandCard}>
          <View style={styles.brandContent}>
            <Text style={styles.brandEmoji}>🌊</Text>
            <View style={styles.brandText}>
              <Text style={styles.brandTitle}>Blue Ocean</Text>
              <Text style={styles.brandSubtitle}>Travel & Booking</Text>
            </View>
          </View>
          <Text style={styles.brandTagline}>Your journey begins with us</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={[styles.menuTitle, item.textColor && { color: item.textColor }]}>
                  {item.title}
                </Text>
              </View>
              {item.hasSwitch ? (
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                />
              ) : (
                <View style={styles.menuRight}>
                  {item.right && <Text style={styles.menuRightText}>{item.right}</Text>}
                  <Text style={styles.chevron}>›</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <Text style={styles.version}>Blue Ocean v1.0.0</Text>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.white,
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editAvatarText: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  brandCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  brandContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  brandText: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  brandSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  brandTagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 12,
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundLight,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 16,
    color: Colors.text,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuRightText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginRight: 8,
  },
  chevron: {
    fontSize: 20,
    color: Colors.textMuted,
  },
  version: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 20,
  },
  bottomPadding: {
    height: 100,
  },
});