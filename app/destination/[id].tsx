import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Header, Button } from '../../components/Header';
import { sampleDestinations } from '../../services/api';
import { Colors } from '../../types';

const { width } = Dimensions.get('window');

export default function DestinationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const destination = sampleDestinations.find(d => d.id === id);

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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: destination.image }} style={styles.heroImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Text style={styles.favoriteButtonText}>❤️</Text>
          </TouchableOpacity>
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
            <View style={styles.ratingRow}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {destination.rating}</Text>
              </View>
              <Text style={styles.reviewCount}>Excellent · 2,450 reviews</Text>
            </View>
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
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonText: {
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