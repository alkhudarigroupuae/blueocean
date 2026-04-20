import React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components/Header';
import { useStore } from '../../store';
import { Colors, Booking } from '../../types';

const mockBookings: Booking[] = [
  {
    id: '1',
    destinationId: '1',
    destinationName: 'Maldives Paradise',
    date: '2026-05-15',
    guests: 2,
    totalPrice: 4998,
    status: 'confirmed',
    confirmationCode: 'ECO2024MN',
    createdAt: '2026-04-01',
  },
  {
    id: '2',
    destinationId: '3',
    destinationName: 'Santorini Escape',
    date: '2026-03-20',
    guests: 2,
    totalPrice: 3798,
    status: 'completed',
    confirmationCode: 'ECO2024ST',
    createdAt: '2026-02-15',
  },
];

export default function BookingsScreen() {
  const router = useRouter();
  const { bookings, theme, apiSettings } = useStore();
  const primaryColor = apiSettings.branding.primaryColor || Colors.primary;
  const displayBookings = bookings.length > 0 ? bookings : mockBookings;

  const isDark = theme === 'dark';
  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#000000' : '#FFFFFF' },
    text: { color: isDark ? '#FFFFFF' : '#1A1A1A' },
    subText: { color: isDark ? '#A1A1AA' : '#666666' },
    card: { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#F3F4F6' },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'completed': return primaryColor;
      case 'cancelled': return '#EF4444';
      default: return '#666666';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const renderItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity style={[styles.bookingCard, dynamicStyles.card, { borderWidth: 1 }]}>
      <View style={[styles.bookingImage, { backgroundColor: isDark ? '#18181B' : '#F3F4F6' }]}>
        <Text style={styles.bookingIcon}>✈️</Text>
      </View>
      <View style={styles.bookingContent}>
        <Text style={[styles.bookingName, dynamicStyles.text]}>{item.destinationName}</Text>
        <Text style={[styles.bookingDate, dynamicStyles.subText]}>Date: {item.date}</Text>
        <Text style={[styles.bookingGuests, dynamicStyles.subText]}>{item.guests} Guest(s)</Text>
        <View style={styles.bookingFooter}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
          <Text style={[styles.bookingPrice, { color: primaryColor }]}>${item.totalPrice.toFixed(2)}</Text>
        </View>
        {item.confirmationCode && (
          <Text style={[styles.confirmationCode, dynamicStyles.subText]}>Code: {item.confirmationCode}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Header title="My Bookings" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, dynamicStyles.card, { borderWidth: 1 }]}>
            <Text style={[styles.statNumber, { color: primaryColor }]}>{displayBookings.length}</Text>
            <Text style={[styles.statLabel, dynamicStyles.subText]}>Total Bookings</Text>
          </View>
          <View style={[styles.statCard, dynamicStyles.card, { borderWidth: 1 }]}>
            <Text style={[styles.statNumber, { color: primaryColor }]}>
              {displayBookings.filter(b => b.status === 'confirmed').length}
            </Text>
            <Text style={[styles.statLabel, dynamicStyles.subText]}>Upcoming</Text>
          </View>
          <View style={[styles.statCard, dynamicStyles.card, { borderWidth: 1 }]}>
            <Text style={[styles.statNumber, { color: primaryColor }]}>
              {displayBookings.filter(b => b.status === 'completed').length}
            </Text>
            <Text style={[styles.statLabel, dynamicStyles.subText]}>Completed</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.text]}>Your Bookings</Text>
        </View>

        <FlatList
          data={displayBookings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
        />

        {displayBookings.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={[styles.emptyText, dynamicStyles.text]}>No bookings yet</Text>
            <Text style={[styles.emptySubtext, dynamicStyles.subText]}>Book your first trip with ecommerco.ai!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  bookingCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
  },
  bookingImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingIcon: {
    fontSize: 32,
  },
  bookingContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  bookingName: {
    fontSize: 17,
    fontWeight: '800',
  },
  bookingDate: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  bookingGuests: {
    fontSize: 13,
    fontWeight: '500',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  bookingPrice: {
    fontSize: 18,
    fontWeight: '900',
  },
  confirmationCode: {
    fontSize: 11,
    marginTop: 8,
    fontWeight: '600',
    letterSpacing: 1,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '800',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
});