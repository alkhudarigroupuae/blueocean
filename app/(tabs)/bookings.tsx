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
    confirmationCode: 'BO2024MN',
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
    confirmationCode: 'BO2024ST',
    createdAt: '2026-02-15',
  },
];

export default function BookingsScreen() {
  const router = useRouter();
  const { bookings, setBookings, theme } = useStore();
  const displayBookings = bookings.length > 0 ? bookings : mockBookings;

  const isDark = theme === 'dark';
  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#000000' : Colors.backgroundLight },
    text: { color: isDark ? '#FFFFFF' : Colors.text },
    subText: { color: isDark ? '#888888' : Colors.textLight },
    card: { backgroundColor: isDark ? '#0A0A0A' : Colors.white, borderColor: isDark ? '#1A1A1A' : Colors.border },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return Colors.success;
      case 'pending': return Colors.warning;
      case 'completed': return Colors.secondary;
      case 'cancelled': return Colors.error;
      default: return Colors.textMuted;
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
    <TouchableOpacity style={styles.bookingCard}>
      <View style={styles.bookingImage}>
        <Text style={styles.bookingIcon}>✈️</Text>
      </View>
      <View style={styles.bookingContent}>
        <Text style={styles.bookingName}>{item.destinationName}</Text>
        <Text style={styles.bookingDate}>Date: {item.date}</Text>
        <Text style={styles.bookingGuests}>{item.guests} Guest(s)</Text>
        <View style={styles.bookingFooter}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
          <Text style={styles.bookingPrice}>${item.totalPrice}</Text>
        </View>
        {item.confirmationCode && (
          <Text style={styles.confirmationCode}>Code: {item.confirmationCode}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="My Bookings" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{displayBookings.length}</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {displayBookings.filter(b => b.status === 'confirmed').length}
            </Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {displayBookings.filter(b => b.status === 'completed').length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Bookings</Text>
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
            <Text style={styles.emptyText}>No bookings yet</Text>
            <Text style={styles.emptySubtext}>Book your first trip with Blue Ocean!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  bookingCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bookingImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: Colors.backgroundLight,
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
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  bookingDate: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 4,
  },
  bookingGuests: {
    fontSize: 13,
    color: Colors.textLight,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  confirmationCode: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 8,
  },
});