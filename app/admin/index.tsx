import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Modal, TextInput, Alert, Platform, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store';
import { Colors } from '../../types';
import { Logo } from '../../components/Logo';
import { getImperialAnalytics } from '../../services/api';

const SIDEBAR_WIDTH = 280;

export default function AdminDashboard() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const { theme, setTheme, updateApiSettings, bookings, apiSettings } = useStore();
  const primaryColor = apiSettings.branding.primaryColor || Colors.primary;
  
  const isDesktop = useMemo(() => windowWidth > 1024, [windowWidth]);
  const isTablet = useMemo(() => windowWidth > 768 && windowWidth <= 1024, [windowWidth]);
  const isMobile = useMemo(() => windowWidth <= 768, [windowWidth]);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarVisible, setIsSidebarVisible] = useState(isDesktop);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isSwitchModalVisible, setIsSwitchModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  const fetchHealthData = async () => {
    setLoadingHealth(true);
    try {
      const data = await getImperialAnalytics('24h');
      setSystemHealth(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    if (isStatusModalVisible) {
      fetchHealthData();
    }
  }, [isStatusModalVisible]);

  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyDomain, setNewCompanyDomain] = useState('');
  const [newApiKey, setNewApiKey] = useState('');

  const isDark = theme === 'dark';
  const sidebarAnim = React.useRef(new Animated.Value(isDesktop ? 0 : -SIDEBAR_WIDTH)).current;

  useEffect(() => {
    Animated.timing(sidebarAnim, {
      toValue: isSidebarVisible ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [isSidebarVisible, isDesktop]);

  // Sync sidebar visibility with screen size changes
  useEffect(() => {
    setIsSidebarVisible(isDesktop);
  }, [isDesktop]);
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalProfit = bookings.reduce((sum, b) => sum + (b.totalPrice * (apiSettings.markupPercentage / 100)), 0);

  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#000000' : '#FFFFFF' },
    card: { 
      backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', 
      borderColor: isDark ? '#27272A' : '#F3F4F6', // Much more subtle border in light mode
      borderWidth: 1 
    },
    text: { color: isDark ? '#FFFFFF' : '#111827' },
    subText: { color: isDark ? '#A1A1AA' : '#6B7280' },
  };

  const handleSwitchTenant = (tenant: any) => {
    updateApiSettings({
      activeTenantId: tenant.id,
      branding: { ...tenant.branding, companyName: tenant.companyName },
      providers: {
        ...apiSettings.providers,
        'Booking.com': { ...apiSettings.providers['Booking.com'], apiKey: tenant.apiKey },
        'Skyscanner': { ...apiSettings.providers['Skyscanner'], apiKey: tenant.apiKey },
      }
    });
    setIsSwitchModalVisible(false);
    if (!isDesktop) setIsSidebarVisible(false);
    Alert.alert('Imperial Handshake', `Switched to ${tenant.companyName} workspace.`);
  };

  const handleRegisterCompany = () => {
    if (!newCompanyName || !newApiKey) {
      Alert.alert('Incomplete Data', 'Please provide company name and API key.');
      return;
    }
    const newTenant = {
      id: Date.now().toString(),
      companyName: newCompanyName,
      domain: newCompanyDomain,
      apiKey: newApiKey,
      branding: {
        logoType: 'Hybrid' as const,
        primaryColor: '#ed7430',
        tagline: `Powered by ecommerco.ai | ${newCompanyDomain}`,
      }
    };
    updateApiSettings({ tenants: [...(apiSettings.tenants || []), newTenant] });
    handleSwitchTenant(newTenant);
    setIsRegisterModalVisible(false);
    setNewCompanyName('');
    setNewCompanyDomain('');
    setNewApiKey('');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <>
            <View style={[styles.statsGrid, isMobile && styles.statsGridMobile]}>
              {[
                { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: 'cash', color: '#10B981' },
                { label: 'Net Profit', value: `$${totalProfit.toLocaleString()}`, icon: 'trending-up', color: '#6366F1' },
                { label: 'Active Bookings', value: bookings.length, icon: 'calendar', color: '#F59E0B' },
                { label: 'Total Clients', value: apiSettings.tenants?.length || 0, icon: 'people', color: '#3B82F6' },
              ].map((stat, i) => (
                <View key={i} style={[styles.statCard, dynamicStyles.card, isMobile && styles.statCardMobile]}>
                  <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
                    <Ionicons name={stat.icon as any} size={isMobile ? 20 : 24} color={stat.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.statLabel, dynamicStyles.subText]} numberOfLines={1}>{stat.label}</Text>
                    <Text style={[styles.statValue, dynamicStyles.text, isMobile && styles.statValueMobile]} numberOfLines={1}>{stat.value}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={[styles.dashboardRow, (isMobile || isTablet) && styles.dashboardRowMobile]}>
              <View style={[styles.mainCard, dynamicStyles.card, (isMobile || isTablet) && styles.cardFullWidth]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, dynamicStyles.text]}>Recent Activity</Text>
                  <TouchableOpacity><Text style={styles.seeAllText}>View All</Text></TouchableOpacity>
                </View>
                {bookings.length > 0 ? (
                  bookings.slice(0, 5).map((b, i) => (
                    <View key={i} style={[styles.activityItem, i !== 4 && styles.borderBottom]}>
                      <View style={styles.activityIcon}>
                        <Ionicons name="airplane" size={18} color={Colors.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.activityText, dynamicStyles.text]} numberOfLines={1}>New booking for {b.destinationName}</Text>
                        <Text style={styles.activityDate}>{new Date(b.createdAt).toLocaleDateString()}</Text>
                      </View>
                      <Text style={[styles.activityAmount, dynamicStyles.text]}>+${b.totalPrice}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="file-tray-outline" size={48} color={dynamicStyles.subText.color} />
                    <Text style={[styles.emptyText, dynamicStyles.subText]}>No recent bookings found</Text>
                  </View>
                )}
              </View>

              <View style={[styles.sideCard, dynamicStyles.card, (isMobile || isTablet) && styles.cardFullWidth]}>
                <Text style={[styles.cardTitle, dynamicStyles.text]}>Imperial Deployment</Text>
                <Text style={[styles.sideDesc, dynamicStyles.subText]}>Manage your white-label infrastructure and node clusters.</Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={() => setIsRegisterModalVisible(true)}>
                  <Text style={styles.primaryBtnText}>Register Company</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.secondaryBtn, { borderColor: dynamicStyles.card.borderColor }]} onPress={() => setIsStatusModalVisible(true)}>
                  <Text style={[styles.secondaryBtnText, dynamicStyles.text]}>System Status</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );
      case 'Analytics':
        return (
          <View style={[styles.mainCard, dynamicStyles.card, { minHeight: 500 }]}>
            <Text style={[styles.cardTitle, dynamicStyles.text]}>Performance Metrics</Text>
            <View style={styles.chartPlaceholder}>
              <Ionicons name="stats-chart" size={64} color={primaryColor} />
              <Text style={[styles.emptyText, dynamicStyles.subText]}>Live Analytics Connected</Text>
              <View style={styles.latencyIndicator}>
                <View style={styles.tenantDot} />
                <Text style={[styles.statLabel, dynamicStyles.text]}>Node Latency: 12ms</Text>
              </View>
            </View>
          </View>
        );
      case 'Branding':
        return (
          <View style={[styles.mainCard, dynamicStyles.card]}>
            <Text style={[styles.cardTitle, dynamicStyles.text]}>Imperial Branding & Theme</Text>
            
            <View style={styles.brandingSection}>
              <Text style={[styles.inputLabel, dynamicStyles.subText]}>LOGO STYLE</Text>
              <View style={[styles.logoStyleRow, isMobile && styles.flexColumn]}>
                {['Icon', 'FullText', 'Hybrid'].map((style) => (
                  <TouchableOpacity 
                    key={style}
                    style={[styles.styleBtn, apiSettings.branding.logoType === style && styles.activeStyleBtn, dynamicStyles.card, isMobile && styles.mb10]}
                    onPress={() => updateApiSettings({ branding: { ...apiSettings.branding, logoType: style as any } })}
                  >
                    <Text style={[styles.styleBtnText, dynamicStyles.text, apiSettings.branding.logoType === style && { color: primaryColor }]}>{style}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.inputLabel, dynamicStyles.subText, { marginTop: 30 }]}>PRIMARY BRAND COLOR</Text>
              <View style={styles.colorRow}>
                {['#ed7430', '#FFFFFF', '#10B981', '#6366F1', '#F59E0B', '#EF4444'].map((color) => (
                  <TouchableOpacity 
                    key={color}
                    style={[styles.colorCircle, { backgroundColor: color }, apiSettings.branding.primaryColor === color && styles.activeColorCircle]}
                    onPress={() => updateApiSettings({ branding: { ...apiSettings.branding, primaryColor: color } })}
                  >
                    {apiSettings.branding.primaryColor === color && (
                      <Ionicons name="checkmark" size={20} color={color === '#FFFFFF' || color === '#ed7430' ? '#000' : '#FFF'} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={[styles.primaryBtn, { marginTop: 40, backgroundColor: primaryColor }]} onPress={() => Alert.alert('Branding Updated', 'Global Imperial styles have been redeployed.')}>
                <Text style={[styles.primaryBtnText, { color: '#000' }]}>Save Branding Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return (
          <View style={[styles.mainCard, dynamicStyles.card]}>
            <Text style={[styles.cardTitle, dynamicStyles.text]}>{activeTab} coming soon...</Text>
          </View>
        );
    }
  };

  const Sidebar = () => (
    <Animated.View style={[
      styles.sidebar, 
      dynamicStyles.card, 
      { 
        transform: [{ translateX: sidebarAnim }],
        position: isDesktop ? 'relative' : 'absolute',
      }
    ]}>
      <View style={styles.sidebarHeader}>
        <Logo size="small" mode="full" />
        {!isDesktop && (
          <TouchableOpacity onPress={() => setIsSidebarVisible(false)}>
            <Ionicons name="close" size={24} color={dynamicStyles.text.color} />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView style={styles.sidebarContent}>
        <Text style={styles.sidebarLabel}>MANAGEMENT</Text>
        {[
          { name: 'Dashboard', icon: 'grid' },
          { name: 'Orders', icon: 'cart' },
          { name: 'News', icon: 'newspaper', route: '/admin/news' },
          { name: 'Analytics', icon: 'trending-up' },
        ].map((item) => (
          <TouchableOpacity 
            key={item.name} 
            style={[styles.menuItem, activeTab === item.name && { backgroundColor: primaryColor }]}
            onPress={() => {
              setActiveTab(item.name);
              if (item.route) router.push(item.route as any);
              if (!isDesktop) setIsSidebarVisible(false);
            }}
          >
            <Ionicons name={item.icon as any} size={20} color={activeTab === item.name ? '#000' : dynamicStyles.subText.color} />
            <Text style={[styles.menuText, { color: activeTab === item.name ? '#000' : dynamicStyles.text.color }]}>{item.name}</Text>
          </TouchableOpacity>
        ))}
        <Text style={[styles.sidebarLabel, { marginTop: 30 }]}>SYSTEM</Text>
        {[
          { name: 'Settings', icon: 'settings' },
          { name: 'Branding', icon: 'color-palette' },
          { name: 'Billing', icon: 'card' },
        ].map((item) => (
          <TouchableOpacity 
            key={item.name} 
            style={[styles.menuItem, activeTab === item.name && { backgroundColor: primaryColor }]} 
            onPress={() => {
              setActiveTab(item.name);
              if (!isDesktop) setIsSidebarVisible(false);
            }}
          >
            <Ionicons name={item.icon as any} size={20} color={activeTab === item.name ? '#000' : dynamicStyles.subText.color} />
            <Text style={[styles.menuText, { color: activeTab === item.name ? '#000' : dynamicStyles.text.color }]}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.sidebarFooter}>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/')}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Exit Admin</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {!isDesktop && isSidebarVisible && (
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.overlay} 
          onPress={() => setIsSidebarVisible(false)} 
        />
      )}
      <Sidebar />
      <View style={styles.mainContent}>
        {/* Top Header */}
        <View style={[styles.topHeader, { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderBottomColor: isDark ? '#1A1A1A' : '#F3F4F6' }]}>
          <View style={styles.headerLeft}>
            {!isDesktop && (
              <TouchableOpacity onPress={() => setIsSidebarVisible(true)} style={[styles.menuToggle, { backgroundColor: isDark ? '#1A1A1A' : '#F3F4F6' }]}>
                <Ionicons name="menu" size={24} color={dynamicStyles.text.color} />
              </TouchableOpacity>
            )}
            <View style={styles.headerTitleContainer}>
               {isDesktop && <Logo size="small" />}
               <View style={styles.titleWrapper}>
                  {isDesktop && <View style={[styles.titleDivider, { backgroundColor: isDark ? '#333' : '#E5E7EB' }]} />}
                  <Text style={[styles.pageTitle, dynamicStyles.text, isMobile && { fontSize: 16 }]}>{activeTab}</Text>
               </View>
            </View>
          </View>

          <View style={styles.headerRight}>
            {!isMobile && (
              <TouchableOpacity 
                style={[styles.tenantSelector, { backgroundColor: isDark ? '#111' : '#F3F4F6' }]} 
                onPress={() => setIsSwitchModalVisible(true)}
              >
                <View style={[styles.tenantDot, { backgroundColor: '#10B981' }]} />
                <Text style={[styles.tenantSelectorText, dynamicStyles.text]} numberOfLines={1}>{apiSettings.branding.companyName}</Text>
                <Ionicons name="chevron-down" size={16} color={dynamicStyles.subText.color} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.iconBtn, { backgroundColor: Colors.primary, borderColor: Colors.primary }]} 
              onPress={() => setTheme(isDark ? 'light' : 'dark')}
            >
              <Ionicons name={isDark ? "sunny" : "moon"} size={20} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={[styles.scrollBody, isMobile && { padding: 15 }]} showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      </View>

      {/* Modals - Simplified for responsiveness */}
      <Modal visible={isStatusModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.card, { maxWidth: 500 }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, dynamicStyles.text]}>Imperial System Health</Text>
              <TouchableOpacity onPress={() => setIsStatusModalVisible(false)}><Ionicons name="close" size={24} color={dynamicStyles.text.color} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {loadingHealth ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={[dynamicStyles.subText, { marginTop: 10, color: Colors.primary }]}>Establishing Handshake...</Text>
                </View>
              ) : systemHealth ? (
                <>
                  <View style={styles.statusItem}>
                    <View style={styles.statusHeader}>
                      <Text style={[styles.statusName, dynamicStyles.text]}>Node Latency</Text>
                      <Text style={[styles.statusPercent, { color: systemHealth.latency < 200 ? '#10B981' : primaryColor }]}>{systemHealth.latency}ms</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${Math.max(10, 100 - (systemHealth.latency / 10))}%`, backgroundColor: systemHealth.latency < 200 ? '#10B981' : primaryColor }]} />
                    </View>
                    <Text style={[styles.statusLabel, dynamicStyles.subText]}>REAL-TIME HANDSHAKE STATUS</Text>
                  </View>

                  <View style={styles.statusItem}>
                    <View style={styles.statusHeader}>
                      <Text style={[styles.statusName, dynamicStyles.text]}>System Status</Text>
                      <Text style={[styles.statusPercent, { color: systemHealth.status === 'Operational' ? '#10B981' : '#EF4444' }]}>{systemHealth.status}</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: '100%', backgroundColor: systemHealth.status === 'Operational' ? '#10B981' : '#EF4444' }]} />
                    </View>
                    <Text style={[styles.statusLabel, dynamicStyles.subText]}>MASTER KEY VERIFICATION</Text>
                  </View>

                  <View style={styles.statusItem}>
                    <View style={styles.statusHeader}>
                      <Text style={[styles.statusName, dynamicStyles.text]}>Total API Handshakes</Text>
                      <Text style={[styles.statusPercent, { color: primaryColor }]}>{systemHealth.totalCalls}</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: '85%', backgroundColor: primaryColor }]} />
                    </View>
                    <Text style={[styles.statusLabel, dynamicStyles.subText]}>MONTHLY QUOTA USAGE</Text>
                  </View>

                  <TouchableOpacity style={[styles.primaryBtn, { marginTop: 10, backgroundColor: primaryColor }]} onPress={fetchHealthData}>
                    <Text style={[styles.primaryBtnText, { color: '#000' }]}>Refresh Handshake</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={dynamicStyles.text}>Failed to fetch real-time health data.</Text>
                  <TouchableOpacity style={styles.primaryBtn} onPress={fetchHealthData}>
                    <Text style={styles.primaryBtnText}>Retry Handshake</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={isRegisterModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.card]}>
            <View style={styles.modalHeader}><Text style={[styles.modalTitle, dynamicStyles.text]}>Register Company</Text><TouchableOpacity onPress={() => setIsRegisterModalVisible(false)}><Ionicons name="close" size={24} color={dynamicStyles.text.color} /></TouchableOpacity></View>
            <ScrollView contentContainerStyle={styles.modalBody}>
              <TextInput style={[styles.input, dynamicStyles.card, dynamicStyles.text]} placeholder="Company Name" placeholderTextColor="#666" value={newCompanyName} onChangeText={setNewCompanyName} />
              <TextInput style={[styles.input, dynamicStyles.card, dynamicStyles.text]} placeholder="Domain" placeholderTextColor="#666" value={newCompanyDomain} onChangeText={setNewCompanyDomain} />
              <TextInput style={[styles.input, dynamicStyles.card, dynamicStyles.text]} placeholder="API Key" placeholderTextColor="#666" secureTextEntry value={newApiKey} onChangeText={setNewApiKey} />
              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: primaryColor }]} onPress={handleRegisterCompany}>
                <Text style={[styles.primaryBtnText, { color: '#000' }]}>Deploy Infrastructure</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={isSwitchModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.card, { maxWidth: 450 }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, dynamicStyles.text]}>Switch Workspace</Text>
              <TouchableOpacity onPress={() => setIsSwitchModalVisible(false)}><Ionicons name="close" size={24} color={dynamicStyles.text.color} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {apiSettings.tenants?.map((tenant) => (
                <TouchableOpacity 
                  key={tenant.id} 
                  style={[styles.tenantItem, apiSettings.activeTenantId === tenant.id && styles.activeTenantItem, { backgroundColor: isDark ? '#111' : '#F3F4F6' }]} 
                  onPress={() => handleSwitchTenant(tenant)}
                >
                  <View style={styles.tenantIcon}><Text style={styles.tenantIconText}>{tenant.companyName[0].toUpperCase()}</Text></View>
                  <View style={{ flex: 1 }}><Text style={[styles.tenantName, dynamicStyles.text]}>{tenant.companyName}</Text><Text style={styles.tenantDomain}>{tenant.domain}</Text></View>
                  {apiSettings.activeTenantId === tenant.id && <Ionicons name="checkmark-circle" size={20} color={primaryColor} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 15 },
  sidebar: { width: SIDEBAR_WIDTH, height: '100%', zIndex: 20, borderRightWidth: 1, paddingVertical: 20 },
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, marginBottom: 40 },
  sidebarContent: { flex: 1, paddingHorizontal: 15 },
  sidebarLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1, marginBottom: 15, paddingHorizontal: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 12, marginBottom: 5 },
  menuItemActive: { backgroundColor: Colors.primary },
  menuText: { marginLeft: 12, fontSize: 15, fontWeight: '600' },
  sidebarFooter: { paddingHorizontal: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  logoutText: { marginLeft: 10, color: '#EF4444', fontWeight: '700' },
  mainContent: { flex: 1 },
  topHeader: { height: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  titleWrapper: { flexDirection: 'row', alignItems: 'center' },
  titleDivider: { width: 1, height: 20, marginHorizontal: 12 },
  menuToggle: { marginRight: 15, padding: 8, borderRadius: 10 },
  pageTitle: { fontSize: 18, fontWeight: '800' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tenantSelector: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 8, maxWidth: 180 },
  tenantDot: { width: 8, height: 8, borderRadius: 4 },
  tenantSelectorText: { fontSize: 12, fontWeight: '700' },
  iconBtn: { padding: 8, borderRadius: 10, borderWidth: 1 },
  scrollBody: { padding: 25 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 25 },
  statsGridMobile: { gap: 10 },
  statCard: { flex: 1, minWidth: 200, padding: 20, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 15 },
  statCardMobile: { minWidth: '47%', padding: 15, gap: 10 },
  statIconContainer: { padding: 12, borderRadius: 12 },
  statLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '800' },
  statValueMobile: { fontSize: 16 },
  dashboardRow: { flexDirection: 'row', gap: 20 },
  dashboardRowMobile: { flexDirection: 'column' },
  mainCard: { flex: 2, borderRadius: 20, padding: 20, borderWidth: 1, minHeight: 300 },
  sideCard: { flex: 1, borderRadius: 20, padding: 20, borderWidth: 1 },
  cardFullWidth: { flex: 0, width: '100%' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  seeAllText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  activityIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.primary + '15', justifyContent: 'center', alignItems: 'center' },
  activityText: { fontSize: 13, fontWeight: '600' },
  activityDate: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  activityAmount: { fontSize: 13, fontWeight: '700', color: '#10B981' },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15, minHeight: 200 },
  emptyText: { fontSize: 13, fontWeight: '600' },
  sideDesc: { fontSize: 13, lineHeight: 18, marginTop: 10, marginBottom: 20 },
  primaryBtn: { backgroundColor: Colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 0, overflow: 'hidden' },
  primaryBtnText: { color: '#000', fontWeight: '800', fontSize: 14 },
  secondaryBtn: { marginTop: 10, paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
  secondaryBtnText: { fontWeight: '700', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 500, maxHeight: '90%', borderRadius: 24, padding: 20, borderWidth: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '900' },
  modalBody: { gap: 15 },
  input: { padding: 12, borderRadius: 10, borderWidth: 1, fontSize: 15 },
  tenantItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 10, borderWidth: 2, borderColor: 'transparent' },
  activeTenantItem: { borderColor: Colors.primary },
  tenantIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  tenantIconText: { color: '#000', fontWeight: '900', fontSize: 16 },
  tenantName: { fontSize: 14, fontWeight: '700' },
  tenantDomain: { fontSize: 11, color: '#9CA3AF', marginTop: 1 },
  statusItem: { marginBottom: 15 },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  statusName: { fontSize: 13, fontWeight: '700' },
  statusPercent: { fontSize: 11, fontWeight: '800' },
  progressBarBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 2 },
  statusLabel: { fontSize: 9, fontWeight: '700', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  chartPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15, minHeight: 300 },
  latencyIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  brandingSection: { paddingVertical: 10 },
  logoStyleRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  styleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10, borderWidth: 1 },
  activeStyleBtn: { borderColor: Colors.primary },
  styleBtnText: { fontSize: 13, fontWeight: '700' },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10 },
  colorCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  activeColorCircle: { borderWidth: 2, borderColor: '#FFF' },
  inputLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  flexColumn: { flexDirection: 'column' },
  mb10: { marginBottom: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
});