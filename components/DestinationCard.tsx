import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Destination, Colors } from '../types';

interface DestinationCardProps {
  destination: Destination;
  onPress?: () => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: destination.image }} style={styles.image} />
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {destination.rating}</Text>
          </View>
          <Text style={styles.name}>{destination.name}</Text>
          <Text style={styles.location}>{destination.country}</Text>
          <View style={styles.priceTag}>
            <Text style={styles.priceLabel}>From</Text>
            <Text style={styles.price}>${destination.price}</Text>
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
  image: {
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
  ratingContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: 13,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
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
});