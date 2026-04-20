import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Switch, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components/Header';
import { useStore } from '../../store';
import { Logo } from '../../components/Logo';
import { translations } from '../../services/translations';
import { Colors } from '../../types';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser, language, setLanguage, theme, setTheme, apiSettings } = useStore();
  const [notifications, setNotifications] = React.useState(true);
  
  const isDark = theme === 'dark';
  const primaryColor = apiSettings.branding.primaryColor || Colors.primary;
  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#000000' : '#FFFFFF' },
    text: { color: isDark ? '#FFFFFF' : '#111827' },
    subText: { color: isDark ? '#A1A1AA' : '#71717A' },
    card: { 
      backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', 
      borderColor: isDark ? '#27272A' : '#F4F4F5',
      borderWidth: 1,
      shadowOpacity: isDark ? 0 : 0.02,
    },
    header: { backgroundColor: isDark ? '#000000' : '#FFFFFF' },
  };

  // Translation Helper
  const t = translations[language];

  // Language Modal State
  const [isLanguageModalVisible, setIsLanguageModalVisible] = React.useState(false);
  
  // Edit Profile States
  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
  const [editName, setEditName] = React.useState(user?.name || '');
  const [editEmail, setEditEmail] = React.useState(user?.email || '');

  const handleUpdateProfile = () => {
    setUser({ ...user!, name: editName, email: editEmail });
    setIsEditModalVisible(false);
  };

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇦🇪' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  const menuItems = [
    { icon: 'person-outline', title: t.editProfile, onPress: () => setIsEditModalVisible(true) },
    { icon: isDark ? 'sunny-outline' : 'moon-outline', title: isDark ? 'Day Mode' : 'Night Mode', onPress: () => setTheme(isDark ? 'light' : 'dark') },
    { icon: 'card-outline', title: 'Payment Methods', onPress: () => router.push('/profile/payments') },
    { icon: 'notifications-outline', title: 'Notifications', onPress: () => {}, hasSwitch: true },
    { icon: 'globe-outline', title: t.language, onPress: () => setIsLanguageModalVisible(true), right: languages.find(l => l.code === language)?.name },
    { icon: 'cash-outline', title: 'Currency', onPress: () => {}, right: 'USD' },
    { icon: 'shield-outline', title: t.adminDashboard, onPress: () => router.push('/admin'), textColor: primaryColor },
    { icon: 'help-circle-outline', title: 'Help & Support', onPress: () => {} },
    { icon: 'document-text-outline', title: 'Terms & Conditions', onPress: () => {} },
    { icon: 'lock-closed-outline', title: 'Privacy Policy', onPress: () => {} },
    { icon: 'log-out-outline', title: 'Log Out', onPress: () => {}, textColor: Colors.error },
  ];

  return (
    <View style={[styles.container, dynamicStyles.container]}>
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
          <Text style={[styles.userName, dynamicStyles.text]}>{user?.name || 'Imperial User'}</Text>
          <Text style={[styles.userEmail, dynamicStyles.subText]}>{user?.email || 'user@ecommerco.ai'}</Text>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, dynamicStyles.card]}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={[styles.statLabel, dynamicStyles.subText]}>Trips</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: isDark ? '#1A1A1A' : Colors.border }]} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={[styles.statLabel, dynamicStyles.subText]}>Countries</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: isDark ? '#1A1A1A' : Colors.border }]} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={[styles.statLabel, dynamicStyles.subText]}>Reviews</Text>
          </View>
        </View>

        {/* ecommerco.ai Brand Section */}
        <View style={[styles.brandCard, dynamicStyles.card, { alignItems: 'center', backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderWidth: isDark ? 1 : 0, shadowOpacity: isDark ? 0 : 0.05 }]}>
          <Logo size="large" />
          <Text style={[styles.brandTagline, dynamicStyles.subText, { marginTop: 15, fontWeight: '700', letterSpacing: 1 }]}>ESTABLISHING IMPERIAL CONNECTION</Text>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuSection, dynamicStyles.card]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.menuItem, { borderBottomColor: isDark ? '#1A1A1A' : '#F4F4F5' }]}
              onPress={item.onPress}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon as any} size={22} color={item.textColor || (isDark ? '#FFFFFF' : '#111827')} style={styles.menuIcon} />
                <Text style={[styles.menuTitle, dynamicStyles.text, item.textColor && { color: item.textColor }]}>
                  {item.title}
                </Text>
              </View>
              {item.hasSwitch ? (
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: isDark ? '#222' : Colors.border, true: Colors.primary }}
                />
              ) : (
                <View style={styles.menuRight}>
                  {item.right && <Text style={[styles.menuRightText, dynamicStyles.subText]}>{item.right}</Text>}
                  <Text style={[styles.chevron, dynamicStyles.subText]}>›</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <Text style={[styles.version, dynamicStyles.subText]}>ecommerco.ai v1.0.0</Text>
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={isLanguageModalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.card]}>
            <View style={[styles.modalHeader, dynamicStyles.header]}>
              <Text style={[styles.modalTitle, dynamicStyles.text]}>{t.selectLanguage}</Text>
              <TouchableOpacity onPress={() => setIsLanguageModalVisible(false)}>
                <Text style={[styles.closeIcon, dynamicStyles.text]}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {languages.map((lang) => (
                <TouchableOpacity 
                  key={lang.code} 
                  style={[styles.languageItem, language === lang.code && styles.activeLanguageItem, { borderColor: isDark ? '#1A1A1A' : Colors.border }]}
                  onPress={() => {
                    setLanguage(lang.code as any);
                    setIsLanguageModalVisible(false);
                  }}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[styles.languageName, dynamicStyles.text, language === lang.code && styles.activeLanguageName]}>
                    {lang.name}
                  </Text>
                  {language === lang.code && <Text style={styles.checkIcon}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.card]}>
            <View style={[styles.modalHeader, dynamicStyles.header]}>
              <Text style={[styles.modalTitle, dynamicStyles.text]}>{t.editProfile}</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Text style={[styles.closeIcon, dynamicStyles.text]}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, dynamicStyles.text]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: isDark ? '#000' : Colors.backgroundLight, color: isDark ? '#FFF' : Colors.text, borderColor: isDark ? '#1A1A1A' : Colors.border }]}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your name"
                  placeholderTextColor={isDark ? '#444' : '#999'}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, dynamicStyles.text]}>Email Address</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: isDark ? '#000' : Colors.backgroundLight, color: isDark ? '#FFF' : Colors.text, borderColor: isDark ? '#1A1A1A' : Colors.border }]}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={isDark ? '#444' : '#999'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateProfile}>
                <Text style={styles.saveBtnText}>{t.saveChanges}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeLanguageItem: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  activeLanguageName: {
    color: Colors.primary,
    fontWeight: '700',
  },
  checkIcon: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  version: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  closeIcon: {
    fontSize: 20,
    color: Colors.textLight,
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  bottomPadding: {
    height: 100,
  },
});