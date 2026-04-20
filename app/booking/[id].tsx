import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Header, Button } from '../../components/Header';
import { useStore } from '../../store';
import { sampleDestinations } from '../../services/api';
import { Colors, PaymentInfo } from '../../types';

export default function BookingScreen() {
  const router = useRouter();
  const { id, provider, price } = useLocalSearchParams();
  const { addBooking } = useStore();
  const destination = sampleDestinations.find(d => d.id === id);

  const [guests, setGuests] = useState(2);
  const selectedPrice = price ? parseInt(price as string) : (destination?.price || 0);
  const selectedProvider = (provider as string) || 'Blue Ocean Standard';
  
  const [date, setDate] = useState('2026-06-15');
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = selectedPrice * guests;

  const handlePayment = async () => {
    if (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv) {
      Alert.alert('Error', 'Please fill in all payment details');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const confirmationCode = 'BO' + Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Add to store
      if (destination) {
        addBooking({
          id: Math.random().toString(36).substring(7),
          destinationId: destination.id,
          destinationName: `${destination.name} (${selectedProvider})`,
          date,
          guests,
          totalPrice,
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
          totalPrice: totalPrice.toString(),
          confirmationCode,
        }
      });
    }, 2000);
  };

  if (!destination) {
    return (
      <View style={styles.container}>
        <Header showBack onBack={() => router.back()} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Destination not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Book Trip" showBack onBack={() => router.back()} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Destination Summary */}
        <View style={styles.summaryCard}>
          <Image source={{ uri: destination.image }} style={styles.summaryImage} />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryName}>{destination.name}</Text>
            <Text style={styles.summaryLocation}>{destination.country} · {selectedProvider}</Text>
            <Text style={styles.summaryDuration}>{destination.duration}</Text>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          {/* Guests */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Number of Guests</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity 
                style={styles.counterButton}
                onPress={() => setGuests(Math.max(1, guests - 1))}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{guests}</Text>
              <TouchableOpacity 
                style={styles.counterButton}
                onPress={() => setGuests(Math.min(10, guests + 1))}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Travel Date</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
            />
          </View>
        </View>

        {/* Price Summary */}
        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Price Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>${destination.price} × {guests} guest(s)</Text>
            <Text style={styles.priceValue}>${totalPrice}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Taxes & Fees</Text>
            <Text style={styles.priceValue}>${Math.round(totalPrice * 0.1)}</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalPrice + Math.round(totalPrice * 0.1)}</Text>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <Text style={styles.sectionSubtitle}>Your payment is secured by Blue Ocean</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              value={paymentInfo.cardNumber}
              onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cardNumber: text })}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              value={paymentInfo.cardHolder}
              onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cardHolder: text })}
              placeholder="JOHN DOE"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                value={paymentInfo.expiryDate}
                onChangeText={(text) => setPaymentInfo({ ...paymentInfo, expiryDate: text })}
                placeholder="MM/YY"
                maxLength={5}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                value={paymentInfo.cvv}
                onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cvv: text })}
                placeholder="123"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        {/* Secure Payment Badge */}
        <View style={styles.secureBadge}>
          <Text style={styles.secureIcon}>🔒</Text>
          <Text style={styles.secureText}>Secure Payment by Blue Ocean</Text>
        </View>

        {/* Book Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={isProcessing ? 'Processing...' : `Pay $${totalPrice + Math.round(totalPrice * 0.1)}`}
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
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.textMuted,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  summaryImage: {
    width: 100,
    height: 100,
  },
  summaryContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  summaryName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  summaryLocation: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  summaryDuration: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 8,
  },
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: '600',
  },
  counterValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  row: {
    flexDirection: 'row',
  },
  priceCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  priceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  priceValue: {
    fontSize: 14,
    color: Colors.text,
  },
  priceDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  secureBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  secureIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  secureText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  bottomPadding: {
    height: 40,
  },
});