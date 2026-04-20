import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Image, Alert, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header, Button } from '../../components/Header';
import { useStore } from '../../store';

import { Colors, PaymentInfo } from '../../types';

export default function BookingScreen() {
  const router = useRouter();
  const { id, provider, price } = useLocalSearchParams();
  const { addBooking, apiSettings, theme, destinations } = useStore();
  const primaryColor = apiSettings.branding.primaryColor || Colors.primary;
  const isDark = theme === 'dark';
  
  // Look in global store first
  const destination = destinations.find(d => d.id === id);

  const { paymentGateways } = apiSettings;
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | 'applePay' | 'googlePay' | 'crypto'>(
    paymentGateways.activeGateway === 'PayPal' ? 'paypal' : 
    paymentGateways.activeGateway === 'Manual' ? 'crypto' : 'card'
  );

  const [guests, setGuests] = useState(2);
  const selectedPrice = price ? parseInt(price as string) : (destination?.price || 0);
  const selectedProvider = (provider as string) || 'ecommerco.ai Standard';
  
  const [date, setDate] = useState('2026-06-15');
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [passportNumber, setPassportNumber] = useState('');
  const [visaNumber, setVisaNumber] = useState('');

  const totalPrice = selectedPrice * guests;
  const grandTotal = totalPrice + Math.round(totalPrice * 0.1);

  const handlePayment = async () => {
    if (!passportNumber || !visaNumber) {
      Alert.alert('Security Requirement', 'Passport and Visa numbers are mandatory for Imperial bookings.');
      return;
    }

    if (selectedMethod === 'card' && (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv)) {
      Alert.alert('Error', 'Please fill in all payment details');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing with "Imperial Handshake"
    setTimeout(() => {
      const confirmationCode = 'ECO' + Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Add to store
      if (destination) {
        addBooking({
          id: Math.random().toString(36).substring(7),
          destinationId: destination.id,
          destinationName: `${destination.name} (${selectedProvider})`,
          date,
          guests,
          totalPrice: grandTotal,
          status: 'confirmed',
          confirmationCode,
          createdAt: new Date().toISOString().split('T')[0],
        });
      }

      setIsProcessing(false);
      router.replace({
        pathname: '/confirmation',
        params: { 
          destinationId: destination?.id,
          destinationName: `${destination?.name} via ${selectedProvider}`,
          guests: guests.toString(),
          date,
          totalPrice: grandTotal.toString(),
          confirmationCode,
        }
      });
    }, 2000);
  };

  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#000000' : '#FFFFFF' },
    card: { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E5E7EB' },
    text: { color: isDark ? '#FFFFFF' : '#1A1A1A' },
    subText: { color: isDark ? '#A1A1AA' : '#666666' },
    input: { backgroundColor: isDark ? '#18181B' : '#F3F4F6', color: isDark ? '#FFFFFF' : '#1A1A1A', borderColor: isDark ? '#27272A' : '#E5E7EB' },
  };

  if (!destination) {
    return (
      <View style={[styles.container, dynamicStyles.container]}>
        <Header showBack onBack={() => router.back()} />
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, dynamicStyles.text]}>Destination not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Header title="Imperial Checkout" showBack onBack={() => router.back()} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Destination Summary */}
        <View style={[styles.summaryCard, dynamicStyles.card, { borderWidth: 1 }]}>
          <Image source={{ uri: destination.image }} style={styles.summaryImage} />
          <View style={styles.summaryContent}>
            <Text style={[styles.summaryName, dynamicStyles.text]}>{destination.name}</Text>
            <Text style={[styles.summaryLocation, dynamicStyles.subText]}>{destination.country} · {selectedProvider}</Text>
            <Text style={[styles.summaryDuration, dynamicStyles.subText]}>{destination.duration}</Text>
          </View>
        </View>

        {/* Booking Details */}
        <View style={[styles.section, dynamicStyles.card, { borderWidth: 1 }]}>
          <Text style={[styles.sectionTitle, dynamicStyles.text]}>Booking Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, dynamicStyles.subText]}>Number of Guests</Text>
            <View style={[styles.counterContainer, dynamicStyles.input]}>
              <TouchableOpacity 
                style={[styles.counterButton, { backgroundColor: isDark ? '#27272A' : '#FFFFFF' }]}
                onPress={() => setGuests(Math.max(1, guests - 1))}
              >
                <Text style={[styles.counterButtonText, dynamicStyles.text]}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.counterValue, dynamicStyles.text]}>{guests}</Text>
              <TouchableOpacity 
                style={[styles.counterButton, { backgroundColor: isDark ? '#27272A' : '#FFFFFF' }]}
                onPress={() => setGuests(Math.min(10, guests + 1))}
              >
                <Text style={[styles.counterButtonText, dynamicStyles.text]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, dynamicStyles.subText]}>Travel Date</Text>
            <TextInput
              style={[styles.input, dynamicStyles.input, { borderWidth: 1 }]}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={isDark ? "#52525B" : "#999999"}
            />
          </View>
        </View>

        {/* Traveler Security Details */}
        <View style={[styles.section, dynamicStyles.card, { borderWidth: 1 }]}>
          <Text style={[styles.sectionTitle, dynamicStyles.text]}>Traveler Security Details</Text>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, dynamicStyles.subText]}>Passport Number</Text>
            <TextInput 
              style={[styles.input, dynamicStyles.input, { borderWidth: 1 }]} 
              placeholder="e.g. A1234567" 
              placeholderTextColor={isDark ? "#52525B" : "#999999"}
              value={passportNumber}
              onChangeText={setPassportNumber}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, dynamicStyles.subText]}>Visa Number</Text>
            <TextInput 
              style={[styles.input, dynamicStyles.input, { borderWidth: 1 }]} 
              placeholder="e.g. V9876543" 
              placeholderTextColor={isDark ? "#52525B" : "#999999"}
              value={visaNumber}
              onChangeText={setVisaNumber}
            />
          </View>
        </View>

        {/* Price Summary */}
        <View style={[styles.priceCard, dynamicStyles.card, { borderWidth: 1 }]}>
          <Text style={[styles.priceTitle, dynamicStyles.text]}>Price Summary</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, dynamicStyles.subText]}>${selectedPrice.toFixed(2)} × {guests} guest(s)</Text>
            <Text style={[styles.priceValue, dynamicStyles.text]}>${totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, dynamicStyles.subText]}>Taxes & Fees</Text>
            <Text style={[styles.priceValue, dynamicStyles.text]}>${(totalPrice * 0.1).toFixed(2)}</Text>
          </View>
          <View style={[styles.priceDivider, { backgroundColor: dynamicStyles.card.borderColor }]} />
          <View style={styles.priceRow}>
            <Text style={[styles.totalLabel, dynamicStyles.text]}>Total</Text>
            <Text style={[styles.totalValue, { color: primaryColor }]}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Section */}
        <View style={[styles.section, dynamicStyles.card, { borderWidth: 1 }]}>
          <Text style={[styles.sectionTitle, dynamicStyles.text]}>Payment Method</Text>
          <Text style={[styles.sectionSubtitle, dynamicStyles.subText]}>
            Your payment is secured by {apiSettings.branding.companyName}
          </Text>

          <View style={styles.unifiedMethodsRow}>
            {paymentGateways.enabledMethods.card && (
              <TouchableOpacity 
                style={[styles.methodBtn, dynamicStyles.card, { borderWidth: 1 }, selectedMethod === 'card' && { borderColor: primaryColor }]} 
                onPress={() => setSelectedMethod('card')}
              >
                <Ionicons name="card-outline" size={20} color={selectedMethod === 'card' ? primaryColor : (isDark ? '#A1A1AA' : '#999')} />
                <Text style={[styles.methodLabel, { color: selectedMethod === 'card' ? primaryColor : (isDark ? '#A1A1AA' : '#999') }]}>Card</Text>
              </TouchableOpacity>
            )}
            {paymentGateways.enabledMethods.paypal && (
              <TouchableOpacity 
                style={[styles.methodBtn, dynamicStyles.card, { borderWidth: 1 }, selectedMethod === 'paypal' && { borderColor: primaryColor }]} 
                onPress={() => setSelectedMethod('paypal')}
              >
                <Ionicons name="logo-paypal" size={20} color={selectedMethod === 'paypal' ? primaryColor : (isDark ? '#A1A1AA' : '#999')} />
                <Text style={[styles.methodLabel, { color: selectedMethod === 'paypal' ? primaryColor : (isDark ? '#A1A1AA' : '#999') }]}>PayPal</Text>
              </TouchableOpacity>
            )}
            {paymentGateways.enabledMethods.crypto && (
              <TouchableOpacity 
                style={[styles.methodBtn, dynamicStyles.card, { borderWidth: 1 }, selectedMethod === 'crypto' && { borderColor: primaryColor }]} 
                onPress={() => setSelectedMethod('crypto')}
              >
                <Ionicons name="logo-bitcoin" size={20} color={selectedMethod === 'crypto' ? primaryColor : (isDark ? '#A1A1AA' : '#999')} />
                <Text style={[styles.methodLabel, { color: selectedMethod === 'crypto' ? primaryColor : (isDark ? '#A1A1AA' : '#999') }]}>Crypto</Text>
              </TouchableOpacity>
            )}
          </View>

          {selectedMethod === 'card' ? (
            <View>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, dynamicStyles.subText]}>Card Number</Text>
                <TextInput
                  style={[styles.input, dynamicStyles.input, { borderWidth: 1 }]}
                  value={paymentInfo.cardNumber}
                  onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cardNumber: text })}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={isDark ? "#52525B" : "#999999"}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={[styles.inputLabel, dynamicStyles.subText]}>Expiry</Text>
                  <TextInput
                    style={[styles.input, dynamicStyles.input, { borderWidth: 1 }]}
                    value={paymentInfo.expiryDate}
                    onChangeText={(text) => setPaymentInfo({ ...paymentInfo, expiryDate: text })}
                    placeholder="MM/YY"
                    placeholderTextColor={isDark ? "#52525B" : "#999999"}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, dynamicStyles.subText]}>CVV</Text>
                  <TextInput
                    style={[styles.input, dynamicStyles.input, { borderWidth: 1 }]}
                    value={paymentInfo.cvv}
                    onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cvv: text })}
                    placeholder="123"
                    placeholderTextColor={isDark ? "#52525B" : "#999999"}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          ) : selectedMethod === 'crypto' ? (
            <View style={[styles.alternativePaymentBox, { backgroundColor: isDark ? '#18181B' : '#F3F4F6', borderColor: dynamicStyles.card.borderColor, borderWidth: 1 }]}>
              <Ionicons name="wallet-outline" size={48} color={primaryColor} />
              <Text style={[styles.alternativePaymentText, dynamicStyles.text]}>
                Send <Text style={{ fontWeight: '800', color: primaryColor }}>${grandTotal} USDT</Text> to:
              </Text>
              <View style={[styles.addressBox, { backgroundColor: isDark ? '#000' : '#FFFFFF', borderColor: dynamicStyles.card.borderColor, borderWidth: 1 }]}>
                 <Text style={[styles.addressText, { color: primaryColor }]}>{paymentGateways.manualCryptoAddress || 'TQx...'}</Text>
                 <Text style={[styles.networkText, dynamicStyles.subText]}>Network: {paymentGateways.manualCryptoNetwork}</Text>
              </View>
            </View>
          ) : (
            <View style={[styles.alternativePaymentBox, { backgroundColor: isDark ? '#18181B' : '#F3F4F6', borderColor: dynamicStyles.card.borderColor, borderWidth: 1 }]}>
              <Ionicons name="logo-paypal" size={48} color="#0070BA" />
              <Text style={[styles.alternativePaymentText, dynamicStyles.text]}>
                You will be redirected to PayPal to complete your payment of <Text style={{ fontWeight: '800' }}>${grandTotal}</Text>.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title={isProcessing ? "Handshaking..." : `Confirm & Pay $${grandTotal}`}
            onPress={handlePayment}
            disabled={isProcessing}
          />
        </View>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: 18 },
  summaryCard: { flexDirection: 'row', margin: 20, borderRadius: 20, overflow: 'hidden' },
  summaryImage: { width: 100, height: 100 },
  summaryContent: { flex: 1, padding: 16, justifyContent: 'center' },
  summaryName: { fontSize: 18, fontWeight: '700' },
  summaryLocation: { fontSize: 14, marginTop: 4 },
  summaryDuration: { fontSize: 12, marginTop: 4 },
  section: { marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  sectionSubtitle: { fontSize: 13, marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  counterContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
  counterButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  counterButtonText: { fontSize: 24, fontWeight: '600' },
  counterValue: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '700' },
  row: { flexDirection: 'row' },
  priceCard: { marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 16 },
  priceTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  priceLabel: { fontSize: 14 },
  priceValue: { fontSize: 14 },
  priceDivider: { height: 1, marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: '700' },
  totalValue: { fontSize: 20, fontWeight: '800' },
  unifiedMethodsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  methodBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  methodLabel: { fontSize: 10, fontWeight: '700', marginTop: 4 },
  alternativePaymentBox: { borderRadius: 16, padding: 24, alignItems: 'center' },
  alternativePaymentText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  addressBox: { padding: 12, borderRadius: 12, width: '100%', marginVertical: 15 },
  addressText: { fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', textAlign: 'center', fontWeight: '700' },
  networkText: { fontSize: 10, textAlign: 'center', marginTop: 4, fontWeight: '600' },
  buttonContainer: { paddingHorizontal: 20, marginBottom: 16 },
  bottomPadding: { height: 40 },
});