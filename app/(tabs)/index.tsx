import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Head from 'expo-router/head';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '../../components/Logo';
import { DestinationCard } from '../../components/DestinationCard';
import { Header, SearchBar } from '../../components/Header';
import { useStore } from '../../store';
import { getFeaturedDestinations, sampleDestinations } from '../../services/api';
import { SEO_CONFIG } from '../../services/seo';
import { Colors, Destination } from '../../types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { destinations, setDestinations, searchQuery, setSearchQuery, theme } = useStore();
  const [featured, setFeatured] = useState<Destination[]>([]);
  const [popular, setPopular] = useState<Destination[]>([]);
  const [newsIndex, setNewsIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark';
  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#000000' : '#FFFFFF' },
    text: { color: isDark ? '#FFFFFF' : Colors.text },
    subText: { color: isDark ? '#888888' : Colors.textLight },
    sectionTitle: { color: isDark ? '#FFFFFF' : '#1A1A1A' },
  };

  const travelNews = [
    { title: 'Global Travel Update', subtitle: 'New visa-free routes for 2026', image: 'https://images.unsplash.com/photo-1502602898657-3e917247a184?w=800&q=80' },
    { title: 'Dubai Luxury Deals', subtitle: 'Save 40% on Burj Al Arab packages', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' },
    { title: 'Beirut Summer Spirit', subtitle: 'Festivals starting in Lebanon soon', image: 'https://images.unsplash.com/photo-1590076214537-1e3c7c996e41?w=800&q=80' },
    { title: 'Bali Eco-Resorts', subtitle: 'New sustainable stay options open', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80' },
    { title: 'Santorini Sunsets', subtitle: 'Best spots for 2026 revealed', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80' },
    { title: 'Swiss Alps Winter', subtitle: 'Early booking discounts now live', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a2?w=800&q=80' },
    { title: 'Tokyo Tech Expo', subtitle: 'Explore the future of travel tech', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80' },
    { title: 'Maldives Marine Life', subtitle: 'Snorkeling with whale sharks guide', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80' },
    { title: 'London Culture Week', subtitle: 'Museums opening late this month', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80' },
    { title: 'Paris Fashion Escape', subtitle: 'Luxury hotel stays during fashion week', image: 'https://images.unsplash.com/photo-1502602898657-3e917247a184?w=800&q=80' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % travelNews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadRealData = async () => {
      setLoading(true);
      try {
        const realData = await getFeaturedDestinations();
        setFeatured(realData.slice(0, 5));
        setPopular(realData.slice(5, 10));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadRealData();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filteredSuggestions = sampleDestinations.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSuggestionPress = (destination: Destination) => {
    setSearchQuery(destination.name);
    setShowSuggestions(false);
    router.push(`/destination/${destination.id}`);
  };

  const handleDestinationPress = (id: string) => {
    router.push(`/destination/${id}`);
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Head>
        <title>{SEO_CONFIG.metaTags.home.title}</title>
        <meta name="description" content={SEO_CONFIG.metaTags.home.description} />
        <meta name="google-site-verification" content={SEO_CONFIG.googleSiteVerification} />
      </Head>
      <View style={styles.headerRow}>
        <Logo size="small" />
        <TouchableOpacity style={[styles.profileIcon, { backgroundColor: isDark ? '#1A1A1A' : '#F3F4F6' }]} onPress={() => router.push('/profile')}>
           <Ionicons name="person-outline" size={20} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search destinations, countries..."
        onSubmit={() => {
          setShowSuggestions(false);
          router.push('/search');
        }}
      />

      {showSuggestions && suggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#1A1A1A' : Colors.border }]}>
          {suggestions.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(item)}
            >
              <Text style={styles.suggestionIcon}>📍</Text>
              <View>
                <Text style={[styles.suggestionName, dynamicStyles.text]}>{item.name}</Text>
                <Text style={[styles.suggestionCountry, dynamicStyles.subText]}>{item.country}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero News Carousel */}
        <View style={styles.hero}>
          <Image 
            source={{ uri: travelNews[newsIndex].image }} 
            style={StyleSheet.absoluteFill} 
            resizeMode="cover"
          />
          {/* Enhanced Overlay with Gradient-like shadow */}
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
          <View style={[StyleSheet.absoluteFill, { 
            backgroundColor: 'transparent',
            borderBottomWidth: 100,
            borderBottomColor: 'rgba(0,0,0,0.8)',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
          }]} />
          
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>{travelNews[newsIndex].title}</Text>
            <Text style={styles.heroTitleAccent}>{travelNews[newsIndex].subtitle}</Text>
            <Text style={styles.heroSubtitle}>Exclusive Imperial Packages by Blue Ocean</Text>
          </View>
          
          <View style={styles.carouselDots}>
            {travelNews.map((_, i) => (
              <View 
                key={i} 
                style={[styles.dot, newsIndex === i && styles.activeDot]} 
              />
            ))}
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Featured Destinations</Text>
            <Text style={styles.seeAll}>See All →</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 20 }} />
          ) : (
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
          )}
        </View>

        {/* Popular Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Popular Packages</Text>
            <Text style={styles.seeAll}>See All →</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 20 }} />
          ) : (
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
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Latest Travel Insights</Text>
            <TouchableOpacity onPress={() => router.push('/blog')}>
              <Text style={styles.seeAll}>Read Blog →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={travelNews.slice(0, 3)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.newsCard, { backgroundColor: isDark ? '#0A0A0A' : '#FFF', borderColor: isDark ? '#1A1A1A' : '#EEE' }]}
                onPress={() => router.push('/blog')}
              >
                <Image source={{ uri: item.image }} style={styles.newsCardImage} />
                <View style={styles.newsCardContent}>
                  <Text style={[styles.newsCardTitle, dynamicStyles.text]} numberOfLines={1}>{item.title}</Text>
                  <Text style={[styles.newsCardSub, dynamicStyles.subText]} numberOfLines={1}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.cardList}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#1A1A1A' : '#F3F4F6' }]} onPress={() => router.push('/search')}>
              <Ionicons name="airplane" size={24} color={Colors.primary} style={styles.actionIconIonic} />
              <Text style={[styles.actionText, dynamicStyles.text]}>Flights</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#1A1A1A' : '#F3F4F6' }]} onPress={() => router.push('/search')}>
              <Ionicons name="business" size={24} color={Colors.primary} style={styles.actionIconIonic} />
              <Text style={[styles.actionText, dynamicStyles.text]}>Hotels</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#1A1A1A' : '#F3F4F6' }]} onPress={() => router.push('/search')}>
              <Ionicons name="map" size={24} color={Colors.primary} style={styles.actionIconIonic} />
              <Text style={[styles.actionText, dynamicStyles.text]}>Packages</Text>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    height: 200,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  carouselDots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    left: 28,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginRight: 6,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
  heroTextContainer: {
    zIndex: 2,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 130, // Just below the search bar
    left: 20,
    right: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  suggestionIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  suggestionCountry: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
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
    justifyContent: 'space-between',
    gap: 10,
  },
  actionCard: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionIconIonic: {
    marginBottom: 4,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  newsCard: {
    width: 200,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 16,
  },
  newsCardImage: {
    width: '100%',
    height: 100,
  },
  newsCardContent: {
    padding: 12,
  },
  newsCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  newsCardSub: {
    fontSize: 11,
  },
  bottomPadding: {
    height: 100,
  },
});