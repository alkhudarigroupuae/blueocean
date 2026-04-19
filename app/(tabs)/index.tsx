import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { DestinationCard } from '../../components/DestinationCard';
import { Header, SearchBar } from '../../components/Header';
import { useStore } from '../../store';
import { sampleDestinations } from '../../services/api';
import { Colors, Destination } from '../../types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { destinations, setDestinations, searchQuery, setSearchQuery } = useStore();
  const [featured, setFeatured] = useState<Destination[]>([]);
  const [popular, setPopular] = useState<Destination[]>([]);

  useEffect(() => {
    // Load sample destinations
    setFeatured(sampleDestinations.slice(0, 3));
    setPopular(sampleDestinations.slice(3, 6));
  }, []);

  const handleDestinationPress = (id: string) => {
    router.push(`/destination/${id}`);
  };

  return (
    <View style={styles.container}>
      <Header />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Where do you want to go?"
        onSubmit={() => router.push('/search')}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Discover Your</Text>
          <Text style={styles.heroTitleAccent}>Dream Destination</Text>
          <Text style={styles.heroSubtitle}>Book exclusive travel packages with Blue Ocean</Text>
        </View>

        {/* Featured Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Destinations</Text>
            <Text style={styles.seeAll}>See All →</Text>
          </View>
          <FlatList
            data={featured}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <DestinationCard
                destination={item}
                onPress={() => handleDestinationPress(item.id)}
              />
            )}
            contentContainerStyle={styles.cardList}
          />
        </View>

        {/* Popular Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Packages</Text>
            <Text style={styles.seeAll}>See All →</Text>
          </View>
          <FlatList
            data={popular}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <DestinationCard
                destination={item}
                onPress={() => handleDestinationPress(item.id)}
              />
            )}
            contentContainerStyle={styles.cardList}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/search')}>
              <Text style={styles.actionIcon}>✈️</Text>
              <Text style={styles.actionText}>Flights</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/search')}>
              <Text style={styles.actionIcon}>🏨</Text>
              <Text style={styles.actionText}>Hotels</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/search')}>
              <Text style={styles.actionIcon}>🚗</Text>
              <Text style={styles.actionText}>Tours</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/bookings')}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionText}>My Bookings</Text>
            </TouchableOpacity>
          </View>
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
  hero: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.white,
  },
  heroTitleAccent: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  cardList: {
    paddingHorizontal: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  actionCard: {
    width: (width - 48) / 2 - 8,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  bottomPadding: {
    height: 100,
  },
});