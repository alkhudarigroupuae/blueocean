import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions, Share, Modal, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { Header, Button } from '../../components/Header';

import { generateTripSchema } from '../../services/seo';
import { useStore } from '../../store';
import { Colors, PriceOffer } from '../../types';

const { width } = Dimensions.get('window');

export default function DestinationDetailScreen() {
  const router = useRouter();
  const { theme, apiSettings, destinations } = useStore();
  const primaryColor = apiSettings.branding.primaryColor || Colors.primary;
  const isDark = theme === 'dark';
  const { id } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(!destinations.length);
  const [activeDestination, setActiveDestination] = useState<Destination | undefined>(
    destinations.find(d => d.id === id)
  );

  useEffect(() => {
    // If destination not found in memory (e.g. direct link), trigger a fetch
    if (!activeDestination && id) {
      const autoFetch = async () => {
        setLoading(true);
        try {
          // This will fetch featured data which includes Beirut/Dubai/Maldives
          // and populate the global store
          const realData = await getFeaturedDestinations();
          const found = realData.find(d => d.id === id);
          if (found) setActiveDestination(found);
        } catch (error) {
          console.error('[Imperial Engine] Auto-fetch failed for direct link:', error);
        } finally {
          setLoading(false);
        }
      };
      autoFetch();
    }
  }, [id, activeDestination]);

  const destination = activeDestination;

  const [selectedOffer, setSelectedOffer] = useState<PriceOffer | null>(null);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this amazing trip to ${destination?.name} on ecommerco.ai! 🌊\n\nBook now at: https://travel.ecommerco.ai/destination/${id}`,
        url: `https://travel.ecommerco.ai/destination/${id}`,
        title: `ecommerco.ai - ${destination?.name}`,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#000000' : '#FFFFFF' },
    text: { color: isDark ? '#FFFFFF' : '#1A1A1A' },
    subText: { color: isDark ? '#A1A1AA' : '#666666' },
    card: { backgroundColor: isDark ? '#0A0A0A' : '#F9FAFB', borderColor: isDark ? '#27272A' : '#E5E7EB' },
  };

  if (loading) {
    return (
      <View style={[styles.container, dynamicStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={[dynamicStyles.text, { marginTop: 20 }]}>Establishing Handshake...</Text>
      </View>
    );
  }

  if (!destination) {
    return (
      <View style={[styles.container, dynamicStyles.container]}>
        <Header showBack onBack={() => router.back()} title="Trip" />
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, dynamicStyles.text]}>Destination not found</Text>
        </View>
      </View>
    );
  }

  const tripSchema = generateTripSchema(destination);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Head>
        <title>{`${destination.name} - ecommerco.ai`}</title>
        <meta name="description" content={destination.description} />
        <script type="application/ld+json">
          {JSON.stringify(tripSchema)}
        </script>
      </Head>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: destination.image }} style={styles.heroImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Text style={styles.actionButtonText}>🔗</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>❤️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={[styles.destinationName, dynamicStyles.text]}>{destination.name}</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={[styles.locationText, dynamicStyles.subText]}>{destination.country}</Text>
            </View>
            <TouchableOpacity 
              style={styles.ratingRow}
              onPress={() => router.push({ pathname: '/destination/reviews', params: { id: destination.id } })}
            >
              <View style={[styles.ratingBadge, { backgroundColor: primaryColor }]}>
                <Text style={[styles.ratingText, { color: '#000' }]}>★ {destination.rating}</Text>
              </View>
              <Text style={[styles.reviewCount, dynamicStyles.subText]}>Excellent · {destination.reviewCount} reviews</Text>
            </TouchableOpacity>
          </View>

          {/* Duration */}
          <View style={[styles.durationCard, dynamicStyles.card, { borderWidth: 1 }]}>
            <View style={styles.durationItem}>
              <Text style={styles.durationIcon}>🕐</Text>
              <Text style={[styles.durationLabel, dynamicStyles.subText]}>Duration</Text>
              <Text style={[styles.durationValue, dynamicStyles.text]}>{destination.duration}</Text>
            </View>
            <View style={[styles.durationDivider, { backgroundColor: dynamicStyles.card.borderColor }]} />
            <View style={styles.durationItem}>
              <Text style={styles.durationIcon}>👥</Text>
              <Text style={[styles.durationLabel, dynamicStyles.subText]}>Group Size</Text>
              <Text style={[styles.durationValue, dynamicStyles.text]}>Max 20</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicStyles.text]}>About This Trip</Text>
            <Text style={[styles.description, dynamicStyles.subText]}>{destination.description}</Text>
          </View>

          {/* Price Comparison Section */}
          <View style={styles.section}>
            <View style={styles.comparisonHeader}>
              <Text style={[styles.sectionTitle, dynamicStyles.text]}>Price Comparison</Text>
              <View style={[styles.bestPriceBadge, { backgroundColor: primaryColor + '20' }]}>
                <Text style={[styles.bestPriceText, { color: primaryColor }]}>Save up to 60%</Text>
              </View>
            </View>
            <View style={styles.offersContainer}>
              {destination.offers?.sort((a, b) => a.price - b.price).map((offer) => (
                <TouchableOpacity 
                  key={offer.id} 
                  style={[styles.offerCard, dynamicStyles.card, { borderWidth: 1 }]}
                  onPress={() => setSelectedOffer(offer)}
                >
                  <View style={styles.offerLeft}>
                    <View style={[styles.providerIcon, { backgroundColor: isDark ? '#18181B' : '#F3F4F6' }]}>
                      <Text style={styles.providerEmoji}>{offer.type === 'Flight' ? '✈️' : '🏨'}</Text>
                    </View>
                    <View>
                      <Text style={[styles.providerName, dynamicStyles.text]}>{offer.provider}</Text>
                      <Text style={[styles.offerType, dynamicStyles.subText]}>{offer.type} · View Details</Text>
                    </View>
                  </View>
                  <View style={styles.offerRight}>
                    <Text style={[styles.offerPrice, dynamicStyles.text]}>${offer.price.toFixed(2)}</Text>
                    <TouchableOpacity 
                      style={[styles.selectBtn, { borderColor: primaryColor }, offer.price === destination.price && { backgroundColor: primaryColor }]}
                      onPress={() => router.push({ pathname: '/booking/[id]', params: { id: destination.id, provider: offer.provider, price: offer.price.toString() } })}
                    >
                      <Text style={[styles.selectBtnText, { color: offer.price === destination.price ? '#000' : primaryColor }]}>
                        Select
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Highlights */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicStyles.text]}>Highlights</Text>
            <View style={styles.highlightsGrid}>
              {destination.highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <View style={[styles.highlightCheck, { backgroundColor: primaryColor + '20' }]}>
                    <Text style={[styles.highlightCheckText, { color: primaryColor }]}>✓</Text>
                  </View>
                  <Text style={[styles.highlightText, dynamicStyles.text]}>{highlight}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Price Section */}
          <View style={[styles.priceSection, { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderTopColor: isDark ? '#1A1A1A' : '#F3F4F6' }]}>
            <View style={styles.priceInfo}>
              <Text style={[styles.priceLabel, dynamicStyles.subText]}>Total Price</Text>
              <Text style={[styles.priceValue, { color: primaryColor }]}>${destination.price.toFixed(2)}</Text>
              <Text style={[styles.priceNote, dynamicStyles.subText]}>per person</Text>
            </View>
            <Button
              title="Book Now"
              onPress={() => router.push({ pathname: '/booking/[id]', params: { id: destination.id } })}
            />
          </View>
        </View>
      </ScrollView>

      {/* Offer Details Modal */}
      <Modal
        visible={!!selectedOffer}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.card, { borderWidth: 1 }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, dynamicStyles.text]}>Flight Details</Text>
              <TouchableOpacity onPress={() => setSelectedOffer(null)}>
                <Text style={dynamicStyles.text}>✕</Text>
              </TouchableOpacity>
            </View>
            {selectedOffer && (
              <View style={styles.modalBody}>
                <View style={styles.modalOfferRow}>
                  <Text style={[styles.modalOfferLabel, dynamicStyles.subText]}>Provider</Text>
                  <Text style={[styles.modalOfferValue, dynamicStyles.text]}>{selectedOffer.provider}</Text>
                </View>
                <View style={styles.modalOfferRow}>
                  <Text style={[styles.modalOfferLabel, dynamicStyles.subText]}>Price</Text>
                  <Text style={[styles.modalOfferValue, { color: primaryColor }]}>${selectedOffer.price.toFixed(2)}</Text>
                </View>
                {selectedOffer.details && (
                  <>
                    <View style={styles.modalOfferRow}>
                      <Text style={[styles.modalOfferLabel, dynamicStyles.subText]}>Flight No</Text>
                      <Text style={[styles.modalOfferValue, dynamicStyles.text]}>{selectedOffer.details.flightNo}</Text>
                    </View>
                    <View style={styles.modalOfferRow}>
                      <Text style={[styles.modalOfferLabel, dynamicStyles.subText]}>Cabin</Text>
                      <Text style={[styles.modalOfferValue, dynamicStyles.text]}>{selectedOffer.details.cabin}</Text>
                    </View>
                  </>
                )}
                <TouchableOpacity 
                  style={[styles.modalBookBtn, { backgroundColor: primaryColor }]}
                  onPress={() => {
                    const offer = selectedOffer;
                    setSelectedOffer(null);
                    router.push({ pathname: '/booking/[id]', params: { id: destination.id, provider: offer.provider, price: offer.price.toString() } });
                  }}
                >
                  <Text style={styles.modalBookBtnText}>Continue with this offer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: 18 },
  heroContainer: { height: 350, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  backButtonText: { color: '#FFF', fontSize: 24 },
  topActions: { position: 'absolute', top: 50, right: 20, flexDirection: 'row' },
  actionButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  actionButtonText: { fontSize: 18 },
  content: { padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, backgroundColor: 'transparent' },
  titleSection: { marginBottom: 24 },
  destinationName: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  locationIcon: { fontSize: 16, marginRight: 6 },
  locationText: { fontSize: 16 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 10 },
  ratingText: { fontWeight: '700', fontSize: 14 },
  reviewCount: { fontSize: 14 },
  durationCard: { flexDirection: 'row', padding: 20, borderRadius: 20, marginBottom: 24 },
  durationItem: { flex: 1, alignItems: 'center' },
  durationIcon: { fontSize: 24, marginBottom: 8 },
  durationLabel: { fontSize: 12, marginBottom: 4 },
  durationValue: { fontSize: 16, fontWeight: '700' },
  durationDivider: { width: 1, height: '100%', marginHorizontal: 10 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  description: { fontSize: 15, lineHeight: 24 },
  comparisonHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  bestPriceBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  bestPriceText: { fontSize: 12, fontWeight: '700' },
  offersContainer: { gap: 12 },
  offerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16 },
  offerLeft: { flexDirection: 'row', alignItems: 'center' },
  providerIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  providerEmoji: { fontSize: 20 },
  providerName: { fontSize: 15, fontWeight: '700' },
  offerType: { fontSize: 12, marginTop: 2 },
  offerRight: { alignItems: 'flex-end' },
  offerPrice: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  selectBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  selectBtnText: { fontSize: 13, fontWeight: '700' },
  highlightsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  highlightItem: { flexDirection: 'row', alignItems: 'center', width: '47%' },
  highlightCheck: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  highlightCheckText: { fontSize: 12, fontWeight: '800' },
  highlightText: { fontSize: 14, fontWeight: '500' },
  priceSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, paddingBottom: 40, borderTopWidth: 1 },
  priceInfo: { flex: 1 },
  priceLabel: { fontSize: 12, marginBottom: 4 },
  priceValue: { fontSize: 24, fontWeight: '800' },
  priceNote: { fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { padding: 24, borderTopLeftRadius: 30, borderTopRightRadius: 30, minHeight: 300 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  modalBody: { gap: 16 },
  modalOfferRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalOfferLabel: { fontSize: 15 },
  modalOfferValue: { fontSize: 16, fontWeight: '700' },
  modalBookBtn: { marginTop: 20, paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  modalBookBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },
});