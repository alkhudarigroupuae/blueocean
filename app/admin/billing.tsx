import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store';

const { width } = Dimensions.get('window');

export default function AdminBilling() {
  const router = useRouter();
  const { apiSettings, bookings } = useStore();
  
  const [activeTab, setActiveTab] = useState('Transactions History');

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, { flex: 2 }]}>Destination</Text>
      <Text style={[styles.headerCell, { flex: 1.5 }]}>Revenue</Text>
      <Text style={[styles.headerCell, { flex: 1 }]}>Profit (15%)</Text>
      <Text style={[styles.headerCell, { flex: 2 }]}>Date</Text>
      <Text style={[styles.headerCell, { flex: 1.5 }]}>Confirmation</Text>
    </View>
  );

  const renderBookingRow = ({ item }: { item: any }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cell, { flex: 2, fontWeight: '700' }]}>{item.destinationName}</Text>
      <Text style={[styles.cell, { flex: 1.5, color: '#166534', fontWeight: '700' }]}>${item.totalPrice.toFixed(2)}</Text>
      <Text style={[styles.cell, { flex: 1, color: '#2563EB', fontWeight: '700' }]}>${(item.totalPrice * 0.15).toFixed(2)}</Text>
      <Text style={[styles.cell, { flex: 2, color: '#666' }]}>{item.createdAt}</Text>
      <Text style={[styles.cell, { flex: 1.5, fontWeight: '600', fontFamily: 'monospace' }]}>{item.confirmationCode}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header like in the image */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Broker Billing</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setActiveTab('Billing information')}>
            <Text style={[styles.tab, activeTab === 'Billing information' && styles.activeTab]}>Billing information</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('Subscriptions & Usage')}>
            <Text style={[styles.tab, activeTab === 'Subscriptions & Usage' && styles.activeTab]}>Subscriptions & Usage</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('Transactions History')}>
            <Text style={[styles.tab, activeTab === 'Transactions History' && styles.activeTab]}>Transactions History</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} horizontal={false}>
        {activeTab === 'Transactions History' ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Real Transaction Log</Text>
              <Text style={styles.sectionSubtitle}>Every booking made by your clients, with your 15% markup calculated automatically.</Text>
            </View>

            {/* The Table */}
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View style={styles.tableContainer}>
                {renderTableHeader()}
                {bookings.length > 0 ? (
                  <FlatList
                    data={bookings}
                    renderItem={renderBookingRow}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                  />
                ) : (
                  <View style={styles.emptyBox}>
                     <Text style={styles.emptyText}>No transactions recorded yet.</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Section: {activeTab} coming soon.</Text>
          </View>
        )}
        
        <View style={styles.footer}>
           <Text style={styles.footerText}>Imperial Profit Engine: ACTIVE</Text>
           <Text style={styles.idText}>Connected to {apiSettings.branding.companyName}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 24,
    color: '#374151',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTab: {
    color: '#111827',
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  scrollContent: {
    padding: 24,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },
  filterLabel: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  tableContainer: {
    width: 900, // Fixed width for horizontal scroll
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  cell: {
    fontSize: 13,
    color: '#111827',
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyBox: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  idText: {
    fontSize: 10,
    color: '#D1D5DB',
    marginTop: 4,
  }
});
