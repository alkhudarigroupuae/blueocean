import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '../store';
import { Destination, Colors } from '../types';

interface DestinationCardProps {
  destination: Destination;
  onPress?: () => void;
  size?: 'normal' | 'small';
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onPress, size = 'normal' }) => {
  const { theme, apiSettings } = useStore();
  const isDark = theme === 'dark';
  const primaryColor = apiSettings.branding.primaryColor || Colors.primary;

  return (
    <TouchableOpacity 
      style={[
        size === 'small' ? styles.cardSmall : styles.card,
        isDark ? { 
          backgroundColor: '#0A0A0A', 
          borderColor: '#1A1A1A',
          borderWidth: 1,
        } : {
          backgroundColor: '#FFFFFF',
          borderColor: '#F3F4F6',
          borderWidth: 1,
        }
      ]} 
      onPress={onPress} 
      activeOpacity={0.9}
    >
      <Image source={{ uri: destination.image }} style={size === 'small' ? styles.imageSmall : styles.image} />
      <View style={styles.overlay}>
        <View style={size === 'small' ? styles.contentSmall : styles.content}>
          <View style={[size === 'small' ? styles.ratingContainerSmall : styles.ratingContainer, isDark && { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
            <Text style={[size === 'small' ? styles.ratingSmall : styles.rating, { color: primaryColor }]}>★ {destination.rating}</Text>
          </View>
          <Text style={size === 'small' ? styles.nameSmall : styles.name}>{destination.name}</Text>
          <Text style={size === 'small' ? styles.locationSmall : styles.location}>{destination.country}</Text>
          <View style={styles.priceTag}>
            <View>
              <Text style={styles.priceLabel}>Starting from</Text>
              <Text style={styles.price}>${destination.price.toFixed(2)}</Text>
            </View>
            {destination.highestPrice && (
              <View style={[styles.highestPriceContainer, isDark && { borderLeftColor: '#333' }]}>
                <Text style={styles.highestPriceLabel}>Up to</Text>
                <Text style={styles.highestPrice}>${destination.highestPrice.toFixed(2)}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: Colors.backgroundLight,
  },
  cardSmall: {
    width: 200,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: Colors.backgroundLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageSmall: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  content: {
    padding: 16,
  },
  contentSmall: {
    padding: 12,
  },
  ratingContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingContainerSmall: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  rating: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: 13,
  },
  ratingSmall: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: 11,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  nameSmall: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 1,
  },
  location: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  locationSmall: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 6,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginRight: 4,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  highestPriceContainer: {
    marginLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.3)',
    paddingLeft: 16,
  },
  highestPriceLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  highestPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textDecorationLine: 'line-through',
  },
});