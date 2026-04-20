import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions, Share, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { Header, Button } from '../../components/Header';
import { sampleDestinations } from '../../services/api';
import { generateTripSchema } from '../../services/seo';
import { Colors, PriceOffer } from '../../types';

const { width } = Dimensions.get('window');

export default function DestinationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const destination = sampleDestinations.find(d => d.id === id);

  const [selectedOffer, setSelectedOffer] = useState<PriceOffer | null>(null);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this amazing trip to ${destination?.name} on Blue Ocean! 🌊\n\nBook now at: http://localhost:8081/destination/${id}`,
        url: `http://localhost:8081/destination/${id}`,
        title: `Blue Ocean - ${destination?.name}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  if (!destination) {
    return (
      <View style={styles.container}>
        <Header showBack onBack={() => router.back()} title="Trip" />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Destination not found</Text>
        </View>
      </View>
    );
  }

  const tripSchema = generateTripSchema(destination);

  return (
    <View style={styles.container}>
      <Head>
        <title>{`${destination.name} - Alkhudari Group`}</title>
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
            <Text style={styles.destinationName}>{destination.name}</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>{destination.country}</Text>
            </View>
            <TouchableOpacity 
              style={styles.ratingRow}
              onPress={() => router.push({ pathname: '/destination/reviews', params: { id: destination.id } })}
            >
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {destination.rating}</Text>
              </View>
              <Text style={styles.reviewCount}>Excellent · {destination.reviewCount} reviews</Text>
            </TouchableOpacity>
          </View>

          {/* Duration */}
          <View style={styles.durationCard}>
            <View style={styles.durationItem}>
              <Text style={styles.durationIcon}>🕐</Text>
              <Text style={styles.durationLabel}>Duration</Text>
              <Text style={styles.durationValue}>{destination.duration}</Text>
            </View>
            <View style={styles.durationDivider} />
            <View style={styles.durationItem}>
              <Text style={styles.durationIcon}>👥</Text>
              <Text style={styles.durationLabel}>Group Size</Text>
              <Text style={styles.durationValue}>Max 20</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Trip</Text>
            <Text style={styles.description}>{destination.description}</Text>
          </View>

          {/* Price Comparison Section */}
          <View style={styles.section}>
            <View style={styles.comparisonHeader}>
              <Text style={styles.sectionTitle}>Price Comparison</Text>
              <View style={styles.bestPriceBadge}>
                <Text style={styles.bestPriceText}>Save up to 60%</Text>
              </View>
            </View>
            <View style={styles.offersContainer}>
              {destination.offers?.sort((a, b) => a.price - b.price).map((offer) => (
                <TouchableOpacity 
                  key={offer.id} 
                  style={styles.offerCard}
                  onPress={() => setSelectedOffer(offer)}
                >
                  <View style={styles.offerLeft}>
                    <View style={styles.providerIcon}>
                      <Text style={styles.providerEmoji}>{offer.type === 'Flight' ? '✈️' : '🏨'}</Text>
                    </View>
                    <View>
                      <Text style={styles.providerName}>{offer.provider}</Text>
                      <Text style={styles.offerType}>{offer.type} · View Details</Text>
                    </View>
                  </View>
                  <View style={styles.offerRight}>
                    <Text style={styles.offerPrice}>${offer.price}</Text>
                    <TouchableOpacity 
                      style={[styles.selectBtn, offer.price === destination.price && styles.bestOfferBtn]}
                      onPress={() => router.push({ pathname: '/booking/[id]', params: { id: destination.id, provider: offer.provider, price: offer.price.toString() } })}
                    >
                      <Text style={[styles.selectBtnText, offer.price === destination.price && styles.bestOfferBtnText]}>
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
            <Text style={styles.sectionTitle}>Highlights</Text>
            <View style={styles.highlightsGrid}>
              {destination.highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <View style={styles.highlightCheck}>
                    <Text style={styles.highlightCheckText}>✓</Text>
                  </View>
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>Total Price</Text>
              <Text style={styles.priceValue}>${destination.price}</Text>
              <Text style={styles.priceNote}>per person</Text>
            </View>
            <Button
              title="Book Now"
              onPress={() => router.push({ pathname: '/booking/[id]', params: { id: destination.id } })}
            />
          </View>
        </View>
      </ScrollView>

      {/* Offer Details Modal like in image */}
      <Modal
        visible={!!selectedOffer}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Flight Details</Text>
              <TouchableOpacity onPress={() => setSelectedOffer(null)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedOffer && (
              <View style={styles.modalBody}>
                <View style={styles.providerInfoLarge}>
                   <Text style={styles.providerEmojiLarge}>{selectedOffer.type === 'Flight' ? '✈️' : '🏨'}</Text>
                   <View>
                      <Text style={styles.providerNameLarge}>{selectedOffer.provider}</Text>
                      <Text style={styles.offerTypeLarge}>{selectedOffer.type} Offer</Text>
                   </View>
                </View>

                <View style={styles.detailsGrid}>
                   <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Flight No</Text>
                      <Text style={styles.detailValue}>{selectedOffer.details?.flightNo || 'N/A'}</Text>
                   </View>
                   <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Stops</Text>
                      <Text style={styles.detailValue}>{selectedOffer.details?.stops === 0 ? 'Direct' : selectedOffer.details?.stops + ' Stop'}</Text>
                   </View>
                   <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Baggage</Text>
                      <Text style={styles.detailValue}>{selectedOffer.details?.baggage || 'Not included'}</Text>
                   </View>
                   <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>Cabin</Text>
                      <Text style={styles.detailValue}>{selectedOffer.details?.cabin || 'Economy'}</Text>
                   </View>
                </View>

                <View style={styles.timeRow}>
                   <View>
                      <Text style={styles.timeLabel}>Departure</Text>
                      <Text style={styles.timeValue}>{selectedOffer.details?.departureTime || 'TBA'}</Text>
                   </View>
                   <View style={styles.timeDivider} />
                   <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.timeLabel}>Arrival</Text>
                      <Text style={styles.timeValue}>{selectedOffer.details?.arrivalTime || 'TBA'}</Text>
                   </View>
                </View>

                <TouchableOpacity 
                  style={styles.bookNowBtn}
                  onPress={() => {
                    const offer = selectedOffer;
                    setSelectedOffer(null);
                    router.push({ pathname: '/booking/[id]', params: { id: destination.id, provider: offer.provider, price: offer.price.toString() } });
                  }}
                >
                  <Text style={styles.bookNowBtnText}>Book this offer for ${selectedOffer.price}</Text>
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
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
  heroContainer: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.text,
  },
  topActions: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 20,
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  destinationName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  locationText: {
    fontSize: 16,
    color: Colors.textLight,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
  },
  ratingText: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: 14,
  },
  reviewCount: {
    color: Colors.textLight,
    fontSize: 14,
  },
  durationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  durationItem: {
    flex: 1,
    alignItems: 'center',
  },
  durationIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  durationLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  durationValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  durationDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  section: {
    marginBottom: 24,
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bestPriceBadge: {
    backgroundColor: Colors.success + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestPriceText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  offersContainer: {
    gap: 12,
  },
  offerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  offerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  providerEmoji: {
    fontSize: 20,
  },
  providerName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  offerType: {
    fontSize: 12,
    color: Colors.textLight,
  },
  offerRight: {
    alignItems: 'flex-end',
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
  },
  selectBtn: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  bestOfferBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectBtnText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  bestOfferBtnText: {
    color: Colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  closeIcon: {
    fontSize: 20,
    color: Colors.textLight,
  },
  modalBody: {
    padding: 20,
  },
  providerInfoLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  providerEmojiLarge: {
    fontSize: 32,
    marginRight: 16,
  },
  providerNameLarge: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  offerTypeLarge: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  detailBox: {
    width: (width - 80 - 12) / 2,
    backgroundColor: Colors.backgroundLight,
    padding: 12,
    borderRadius: 12,
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: Colors.backgroundLight,
    padding: 15,
    borderRadius: 12,
  },
  timeLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  timeDivider: {
    height: 2,
    backgroundColor: Colors.border,
    flex: 1,
    marginHorizontal: 15,
  },
  bookNowBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookNowBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textLight,
    lineHeight: 24,
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  highlightCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  highlightCheckText: {
    color: Colors.success,
    fontWeight: '700',
  },
  highlightText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  priceSection: {
    backgroundColor: Colors.white,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textMuted,
    marginRight: 8,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    marginRight: 8,
  },
  priceNote: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});