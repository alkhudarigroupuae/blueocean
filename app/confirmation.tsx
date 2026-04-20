import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../store';
import { Colors } from '../types';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { apiSettings } = useStore();
  const primaryColor = apiSettings.branding.primaryColor || Colors.primary;
  const params = useLocalSearchParams();
  const confirmationCode = (params.confirmationCode as string) || 'ECO-UNKNOWN';

  const handleDone = () => {
    // Navigate to the bookings tab
    router.replace('/(tabs)/bookings');
  };

  const isDark = true;
  const dynamicStyles = {
    container: { backgroundColor: '#000000' },
    card: { backgroundColor: '#0A0A0A', borderColor: '#27272A' },
    text: { color: '#FFFFFF' },
    subText: { color: '#A1A1AA' },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Success Animation */}
      <View style={styles.successContainer}>
        <View style={[styles.successCircle, { backgroundColor: primaryColor }]}>
          <Text style={[styles.checkmark, { color: '#000' }]}>✓</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={[styles.title, dynamicStyles.text]}>Booking Confirmed!</Text>
      <Text style={[styles.subtitle, dynamicStyles.subText]}>Your adventure awaits with ecommerco.ai</Text>

      {/* Confirmation Code Card */}
      <View style={[styles.codeCard, { backgroundColor: primaryColor }]}>
        <Text style={[styles.codeLabel, { color: '#000', opacity: 0.7 }]}>Confirmation Code</Text>
        <Text style={[styles.codeValue, { color: '#000' }]}>{confirmationCode}</Text>
        <Text style={[styles.codeNote, { color: '#000', opacity: 0.5 }]}>Save this code for your records</Text>
      </View>

      {/* Booking Details */}
      <View style={[styles.detailsCard, dynamicStyles.card, { borderWidth: 1 }]}>
        <Text style={[styles.detailsTitle, dynamicStyles.text]}>Booking Details</Text>
        
        <View style={[styles.detailRow, { borderBottomColor: '#27272A' }]}>
          <Text style={[styles.detailLabel, dynamicStyles.subText]}>Destination</Text>
          <Text style={[styles.detailValue, dynamicStyles.text]}>{params.destinationName || 'N/A'}</Text>
        </View>
        
        <View style={[styles.detailRow, { borderBottomColor: '#27272A' }]}>
          <Text style={[styles.detailLabel, dynamicStyles.subText]}>Date</Text>
          <Text style={[styles.detailValue, dynamicStyles.text]}>{params.date || 'N/A'}</Text>
        </View>
        
        <View style={[styles.detailRow, { borderBottomColor: '#27272A' }]}>
          <Text style={[styles.detailLabel, dynamicStyles.subText]}>Guests</Text>
          <Text style={[styles.detailValue, dynamicStyles.text]}>{params.guests || 'N/A'}</Text>
        </View>
        
        <View style={[styles.detailRow, { borderBottomColor: 'transparent' }]}>
          <Text style={[styles.detailLabel, dynamicStyles.subText]}>Total Paid</Text>
          <Text style={[styles.detailValuePrice, { color: primaryColor }]}>${params.totalPrice || 'N/A'}</Text>
        </View>
      </View>

      {/* ecommerco.ai Branding */}
      <View style={styles.brandSection}>
        <Image 
          source={require('../assets/icon.png')} 
          style={styles.brandIconImage}
          resizeMode="contain"
        />
        <Text style={[styles.brandName, { color: primaryColor }]}>ecommerco.ai</Text>
        <Text style={[styles.brandTagline, dynamicStyles.subText]}>Thank you for choosing Imperial Solutions!</Text>
      </View>

      {/* Done Button */}
      <TouchableOpacity style={[styles.doneButton, { backgroundColor: primaryColor }]} onPress={handleDone}>
        <Text style={[styles.doneButtonText, { color: '#000' }]}>View My Bookings</Text>
      </TouchableOpacity>

      {/* Support Text */}
      <Text style={[styles.supportText, dynamicStyles.subText]}>
        Need help? Contact Imperial Support
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  successCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 32,
    fontWeight: '900',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1,
  },
  codeCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 4,
  },
  codeNote: {
    fontSize: 9,
    marginTop: 4,
    fontWeight: '600',
  },
  detailsCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  detailValuePrice: {
    fontSize: 16,
    fontWeight: '900',
  },
  brandSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  brandIconImage: {
    width: 40,
    height: 40,
    marginBottom: 12,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  brandTagline: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  doneButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 8,
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  supportText: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 16,
  },
});