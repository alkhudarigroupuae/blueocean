import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header, Button } from '../../components/Header';
import { useStore } from '../../store';
import { Colors } from '../../types';

export default function PaymentsScreen() {
  const router = useRouter();
  const { theme, apiSettings } = useStore();
  const isDark = theme === 'dark';
  const primaryColor = apiSettings.branding.primaryColor || Colors.primary;

  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#000000' : '#FFFFFF' },
    card: { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#F3F4F6' },
    text: { color: isDark ? '#FFFFFF' : '#1A1A1A' },
    subText: { color: isDark ? '#A1A1AA' : '#666666' },
    input: { backgroundColor: isDark ? '#18181B' : '#F3F4F6', color: isDark ? '#FFFFFF' : '#1A1A1A', borderColor: isDark ? '#27272A' : '#E5E7EB' },
  };

  const [savedCards] = useState([
    { id: '1', type: 'Visa', last4: '4242', expiry: '12/26', brand: 'Imperial Preferred' },
    { id: '2', type: 'Mastercard', last4: '8888', expiry: '08/25', brand: 'Corporate' },
  ]);

  const [savedWallets] = useState([
    { id: 'w1', network: 'TRC20', address: 'TQx...', label: 'Main Savings' },
  ]);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Header title="Payment Methods" showBack onBack={() => router.back()} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, dynamicStyles.text]}>Saved Cards</Text>
        {savedCards.map(card => (
          <View key={card.id} style={[styles.paymentCard, dynamicStyles.card, { borderWidth: 1 }]}>
            <View style={styles.cardInfo}>
              <View style={[styles.cardIcon, { backgroundColor: isDark ? '#18181B' : '#F3F4F6' }]}>
                <Ionicons name="card" size={24} color={primaryColor} />
              </View>
              <View>
                <Text style={[styles.cardName, dynamicStyles.text]}>{card.type} •••• {card.last4}</Text>
                <Text style={[styles.cardSub, dynamicStyles.subText]}>{card.brand} · Expires {card.expiry}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Security Handshake', 'This card is verified and protected by Imperial Encryption.')}>
              <Ionicons name="shield-checkmark" size={20} color={primaryColor} />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert('Add Method', 'New card registration coming soon to your region.')}>
          <Ionicons name="add" size={20} color={primaryColor} />
          <Text style={[styles.addBtnText, { color: primaryColor }]}>Add New Card</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <Text style={[styles.sectionTitle, dynamicStyles.text]}>Crypto Wallets</Text>
        {savedWallets.map(wallet => (
          <View key={wallet.id} style={[styles.paymentCard, dynamicStyles.card, { borderWidth: 1 }]}>
            <View style={styles.cardInfo}>
              <View style={[styles.cardIcon, { backgroundColor: isDark ? '#18181B' : '#F3F4F6' }]}>
                <Ionicons name="logo-bitcoin" size={24} color={primaryColor} />
              </View>
              <View>
                <Text style={[styles.cardName, dynamicStyles.text]}>{wallet.label}</Text>
                <Text style={[styles.cardSub, dynamicStyles.subText]}>{wallet.network} · {wallet.address}</Text>
              </View>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert('Add Wallet', 'Wallet linking enabled for USDT (TRC20).')}>
          <Ionicons name="add" size={20} color={primaryColor} />
          <Text style={[styles.addBtnText, { color: primaryColor }]}>Link New Wallet</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, dynamicStyles.subText]}>
            All payment data is processed through our secure Imperial Handshake infrastructure and never stored on local compute.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSub: {
    fontSize: 12,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 8,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  spacer: {
    height: 32,
  },
  footer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});