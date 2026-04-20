import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../types';

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const confirmationCode = (params.confirmationCode as string) || 'BO-UNKNOWN';

  const handleDone = () => {
    // Navigate to the bookings tab
    router.replace('/(tabs)/bookings');
  };

  return (
    <View style={styles.container}>
      {/* Success Animation */}
      <View style={styles.successContainer}>
        <View style={styles.successCircle}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.subtitle}>Your adventure awaits with Blue Ocean</Text>

      {/* Confirmation Code Card */}
      <View style={styles.codeCard}>
        <Text style={styles.codeLabel}>Confirmation Code</Text>
        <Text style={styles.codeValue}>{confirmationCode}</Text>
        <Text style={styles.codeNote}>Save this code for your records</Text>
      </View>

      {/* Booking Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Booking Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Destination</Text>
          <Text style={styles.detailValue}>{params.destinationName || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{params.date || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Guests</Text>
          <Text style={styles.detailValue}>{params.guests || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Paid</Text>
          <Text style={styles.detailValuePrice}>${params.totalPrice || 'N/A'}</Text>
        </View>
      </View>

      {/* Blue Ocean Branding */}
      <View style={styles.brandSection}>
        <Text style={styles.brandEmoji}>🌊</Text>
        <Text style={styles.brandName}>Blue Ocean</Text>
        <Text style={styles.brandTagline}>Thank you for traveling with us!</Text>
      </View>

      {/* Done Button */}
      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneButtonText}>View My Bookings</Text>
      </TouchableOpacity>

      {/* Support Text */}
      <Text style={styles.supportText}>
        Need help? Contact Blue Ocean Support
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    padding: 20,
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 48,
    color: Colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  codeCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  codeValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 4,
  },
  codeNote: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
  },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  detailValuePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  brandSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  brandEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  brandTagline: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  doneButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  supportText: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 20,
  },
});