import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList, Modal, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store';
import { Logo } from '../../components/Logo';
import { Colors } from '../../types';

const { width } = Dimensions.get('window');

// Custom Card Component in Shadcn style
const ShadcnCard = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

export default function AdminDashboard() {
  const router = useRouter();
  const { theme, setTheme, updateApiSettings, bookings } = useStore();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  
  // Calculate Profit from Bookings
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalProfit = bookings.reduce((sum, b) => sum + (b.totalPrice * 0.15), 0); // 15% markup
  
  // Registration States
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyDomain, setNewCompanyDomain] = useState('');
  const [newApiKey, setNewApiKey] = useState('');

  const handleRegisterCompany = () => {
    if (!newCompanyName || !newApiKey) {
      Alert.alert('Incomplete Data', 'Imperial system requires at least a company name and a master API key.');
      return;
    }

    // In a real SaaS, this would create a new tenant. 
    // Here we update the current branding to simulate "onboarding" the first company.
    updateApiSettings({
      branding: {
        logoType: 'Hybrid',
        primaryColor: '#0066CC',
        companyName: newCompanyName,
        tagline: `Powered by Alkhudari Group | ${newCompanyDomain}`,
      },
      providers: {
        'Booking.com': { apiKey: newApiKey, apiHost: 'booking-com15.p.rapidapi.com', enabled: true },
        'Skyscanner': { apiKey: newApiKey, apiHost: 'skyscanner44.p.rapidapi.com', enabled: true },
        'TripAdvisor': { apiKey: newApiKey, apiHost: 'tripadvisor16.p.rapidapi.com', enabled: false },
        'Google Flights': { apiKey: newApiKey, apiHost: 'google-flights12.p.rapidapi.com', enabled: false },
      }
    });

    Alert.alert('Imperial Handshake Success', `${newCompanyName} has been registered and deployed on the cluster.`);
    setIsRegisterModalVisible(false);
  };

  const isDark = theme === 'dark';
  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#000000' : '#F9FAFB' },
    sidebar: { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderRightColor: isDark ? '#1A1A1A' : '#E5E7EB' },
    mainContent: { backgroundColor: isDark ? '#000000' : '#F9FAFB' },
    card: { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#1A1A1A' : '#E5E7EB' },
    text: { color: isDark ? '#FFFFFF' : '#111827' },
    subText: { color: isDark ? '#666666' : '#6B7280' },
    header: { borderBottomColor: isDark ? '#1A1A1A' : '#E5E7EB' },
    sidebarItemActive: { backgroundColor: isDark ? '#1A1A1A' : '#F3F4F6', borderColor: isDark ? '#333333' : '#E5E7EB' },
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: 'grid', route: '/admin' },
    { name: 'Orders', icon: 'cart', route: '/admin' },
    { name: 'News', icon: 'newspaper', route: '/admin/news' },
    { name: 'Trips', icon: 'airplane', route: '/admin' },
    { name: 'Inspector', icon: 'search', route: '/admin/inspector' },
    { name: 'Billing', icon: 'card', route: '/admin/billing' },
    { name: 'Analytics', icon: 'trending-up', route: '/admin/analytics' },
    { name: 'Settings', icon: 'settings', route: '/admin/settings' },
  ];

  const stats = [
    { label: 'Revenue', value: `$${(totalRevenue/1000).toFixed(1)}k`, change: '+12%', icon: 'stats-chart' },
    { label: 'Broker Profit', value: `$${(totalProfit/1000).toFixed(1)}k`, change: '+8%', icon: 'cash' },
    { label: 'Growth', value: '45%', change: '+5%', icon: 'flame' },
  ];

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Sidebar - Desktop style but mobile adapted */}
      <View style={[styles.sidebar, dynamicStyles.sidebar]}>
        <View style={styles.sidebarLogo}>
          <Logo mode="icon" size="small" />
        </View>
        {sidebarItems.map((item) => (
          <TouchableOpacity 
            key={item.name} 
            style={[styles.sidebarItem, activeTab === item.name && styles.sidebarItemActive, activeTab === item.name && dynamicStyles.sidebarItemActive]}
            onPress={() => {
              setActiveTab(item.name);
              if (item.route !== '/admin') {
                router.push(item.route as any);
              }
            }}
          >
            <Ionicons name={item.icon as any} size={20} color={activeTab === item.name ? (isDark ? '#FFD400' : Colors.primary) : (isDark ? '#444' : '#999')} />
          </TouchableOpacity>
        ))}
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.sidebarProfile}>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarTextMini}>B</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={[styles.mainContent, dynamicStyles.mainContent]}>
        {/* Top Header */}
        <View style={[styles.topHeader, dynamicStyles.header]}>
          <View style={styles.logoTitleRow}>
             {/* Imperial Company Logo - High Quality Component */}
             <Logo mode="icon" size="small" />
             <View style={[styles.verticalDivider, { backgroundColor: isDark ? '#333' : '#E5E7EB' }]} />
             <View>
               <View style={styles.statusIndicatorRow}>
                  <View style={styles.livePulse} />
                  <Text style={[styles.liveText, { color: isDark ? '#22C55E' : '#166534' }]}>SYSTEM LIVE</Text>
               </View>
               <Text style={[styles.welcomeText, dynamicStyles.text]}>Dr. Belal</Text>
             </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.themeToggle} 
              onPress={() => setTheme(isDark ? 'light' : 'dark')}
            >
              <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.createBtn}
              onPress={() => setIsRegisterModalVisible(true)}
            >
              <Text style={styles.createBtnText}>+ Register Company</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
          {/* Quick Stats Section */}
          <View style={styles.statsRow}>
            {stats.map((stat, i) => (
              <ShadcnCard key={i} style={[styles.statCard, dynamicStyles.card]}>
                <View style={styles.statHeader}>
                  <Text style={[styles.statLabel, dynamicStyles.subText]}>{stat.label}</Text>
                  <Ionicons name={stat.icon as any} size={14} color={isDark ? '#FFD400' : Colors.primary} />
                </View>
                <Text style={[styles.statValue, dynamicStyles.text]}>{stat.value}</Text>
                <Text style={styles.statChange}>{stat.change} from last month</Text>
              </ShadcnCard>
            ))}
          </View>

          {/* Main Display Area (The "Refine" look) */}
          <ShadcnCard style={[styles.mainDisplayCard, dynamicStyles.card]}>
            <View style={styles.displayHeader}>
              <Text style={[styles.displayTitle, dynamicStyles.text]}>Legacy Growth</Text>
              <View style={[styles.displayTabs, { backgroundColor: isDark ? '#1A1A1A' : '#F3F4F6' }]}>
                <Text style={[styles.displayTabActive, { backgroundColor: isDark ? '#333333' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#000000' }]}>Forever</Text>
                <Text style={styles.displayTab}>Current</Text>
              </View>
            </View>
            
            {/* Mock Chart Area */}
            <View style={styles.chartPlaceholder}>
               <View style={[styles.bar, {height: '40%', backgroundColor: isDark ? '#1A1A1A' : '#E5E7EB'}]} />
               <View style={[styles.bar, {height: '70%', backgroundColor: '#FFD400'}]} />
               <View style={[styles.bar, {height: '55%', backgroundColor: isDark ? '#1A1A1A' : '#E5E7EB'}]} />
               <View style={[styles.bar, {height: '90%', backgroundColor: '#FFD400'}]} />
               <View style={[styles.bar, {height: '60%', backgroundColor: isDark ? '#1A1A1A' : '#E5E7EB'}]} />
            </View>
          </ShadcnCard>

          {/* Biometric Imperial Guard Section */}
          <View style={styles.imperialSection}>
            <Text style={[styles.sectionTitle, dynamicStyles.text]}>Imperial Security</Text>
            <ShadcnCard style={[styles.securityCard, { backgroundColor: isDark ? '#FFD40005' : '#FFD40010' }]}>
               <View style={styles.securityIconContainer}>
                  <Text style={styles.securityEmoji}>👑</Text>
               </View>
               <View style={styles.securityText}>
                  <Text style={styles.securityTitle}>Crown Prince Access</Text>
                  <Text style={[styles.securitySubtitle, dynamicStyles.subText]}>Biometric encryption: RSA-4096 & AES-256 active.</Text>
               </View>
               <View style={styles.statusDot} />
            </ShadcnCard>
          </View>

          {/* Quick Links / Navigation Like in Image */}
          <View style={styles.bottomNav}>
             <TouchableOpacity style={[styles.navItem, dynamicStyles.card]}>
                <Text style={styles.navText}>Refine: Enterprise Grade</Text>
             </TouchableOpacity>
             <TouchableOpacity style={[styles.navItem, dynamicStyles.card]}>
                <Text style={styles.navText}>Dashboard | Alkhudari Group</Text>
             </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Exit Button - Floating */}
      <TouchableOpacity 
        style={styles.floatingExit} 
        onPress={() => router.replace('/(tabs)/profile')}
      >
        <Text style={styles.exitIcon}>✕</Text>
      </TouchableOpacity>

      {/* Register Company Modal */}
      <Modal
        visible={isRegisterModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.card]}>
             <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, dynamicStyles.text]}>Register New Company</Text>
                <TouchableOpacity onPress={() => setIsRegisterModalVisible(false)}>
                   <Ionicons name="close" size={24} color={isDark ? '#FFF' : '#000'} />
                </TouchableOpacity>
             </View>

             <View style={styles.modalBody}>
                <View style={styles.inputGroup}>
                   <Text style={[styles.inputLabel, dynamicStyles.subText]}>Company Name</Text>
                   <TextInput 
                      style={[styles.input, { backgroundColor: isDark ? '#000' : '#F3F4F6', color: isDark ? '#FFF' : '#000' }]} 
                      placeholder="e.g. Alkhudari Express"
                      placeholderTextColor="#666"
                      value={newCompanyName}
                      onChangeText={setNewCompanyName}
                   />
                </View>

                <View style={styles.inputGroup}>
                   <Text style={[styles.inputLabel, dynamicStyles.subText]}>Domain / Brand</Text>
                   <TextInput 
                      style={[styles.input, { backgroundColor: isDark ? '#000' : '#F3F4F6', color: isDark ? '#FFF' : '#000' }]} 
                      placeholder="e.g. travel.alkhudari.com"
                      placeholderTextColor="#666"
                      value={newCompanyDomain}
                      onChangeText={setNewCompanyDomain}
                   />
                </View>

                <View style={styles.inputGroup}>
                   <Text style={[styles.inputLabel, dynamicStyles.subText]}>Master API Key (RapidAPI)</Text>
                   <TextInput 
                      style={[styles.input, { backgroundColor: isDark ? '#000' : '#F3F4F6', color: isDark ? '#FFF' : '#000' }]} 
                      placeholder="Paste your master key here..."
                      placeholderTextColor="#666"
                      secureTextEntry
                      value={newApiKey}
                      onChangeText={setNewApiKey}
                   />
                </View>

                <TouchableOpacity 
                   style={styles.deployBtn}
                   onPress={handleRegisterCompany}
                >
                   <Text style={styles.deployBtnText}>DEPLOY NEW TENANT</Text>
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
    flexDirection: 'row',
  },
  sidebar: {
    width: 70,
    borderRightWidth: 1,
    alignItems: 'center',
    paddingVertical: 40,
  },
  sidebarLogo: {
    marginBottom: 40,
  },
  logoEmoji: {
    fontSize: 28,
  },
  sidebarItem: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  sidebarItemActive: {
    borderWidth: 1,
  },
  sidebarIcon: {
    fontSize: 20,
  },
  spacer: {
    flex: 1,
  },
  sidebarProfile: {
    marginBottom: 20,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD400',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTextMini: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 16,
  },
  mainContent: {
    flex: 1,
  },
  topHeader: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  logoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogoHeader: {
    width: 100,
    height: 40,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#333',
    marginHorizontal: 15,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  themeIcon: {
    fontSize: 18,
  },
  createBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  createBtnText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 13,
  },
  scrollPadding: {
    padding: 24,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 70 - 48 - 16) / 2,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
  statChange: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: '700',
  },
  mainDisplayCard: {
    marginBottom: 30,
    height: 250,
  },
  displayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  displayTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  displayTabs: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 8,
  },
  displayTabActive: {
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '700',
  },
  displayTab: {
    color: '#888888',
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontWeight: '600',
  },
  chartPlaceholder: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  bar: {
    width: 30,
    borderRadius: 6,
  },
  imperialSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#FFD40030',
    borderRadius: 20,
    padding: 20,
  },
  securityIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD40020',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  securityEmoji: {
    fontSize: 24,
  },
  securityText: {
    flex: 1,
  },
  securityTitle: {
    color: '#FFD400',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 2,
  },
  securitySubtitle: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E',
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  bottomNav: {
     marginTop: 10,
     gap: 10,
  },
  navItem: {
     padding: 12,
     borderRadius: 10,
     borderLeftWidth: 3,
     borderLeftColor: '#333333',
  },
  navText: {
     color: '#888888',
     fontSize: 12,
     fontWeight: '600',
  },
  floatingExit: {
    position: 'absolute',
    top: 55,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  exitIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalBody: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  input: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  deployBtn: {
    backgroundColor: '#FFD400',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  deployBtnText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
});
