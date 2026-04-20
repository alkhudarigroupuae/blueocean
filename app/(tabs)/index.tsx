import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, ActivityIndicator, Animated, RefreshControl, Alert } from 'react-native';
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
  const { destinations, setDestinations, searchQuery, setSearchQuery, theme, news, apiSettings } = useStore();
  const primaryColor = apiSettings.branding.primaryColor || Colors.primary;
  const [featured, setFeatured] = useState<Destination[]>([]);
  const [popular, setPopular] = useState<Destination[]>([]);
  
  // Animation for Quick Actions
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  const [newsIndex, setNewsIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isDark = theme === 'dark';
  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#000000' : '#FFFFFF' },
    text: { color: isDark ? '#FFFFFF' : Colors.text },
    subText: { color: isDark ? '#A1A1AA' : Colors.textLight },
    sectionTitle: { color: isDark ? '#FFFFFF' : '#111827' },
  };

  const travelNews = [
    { title: 'ecommerco.ai V2 Launch', subtitle: 'The new standard in Enterprise SaaS', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80' },
    { title: 'Imperial Engine Handshake', subtitle: 'Real-time price brokerage activated', image: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800&q=80' },
    { title: 'Global Node Clusters', subtitle: 'New low-latency servers in Beirut & Dubai', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=800&q=80' },
    { title: 'Zero-Compute Architecture', subtitle: 'The future of local IDE development', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80' },
  ];

  const loadRealData = async () => {
    try {
      const realData = await getFeaturedDestinations();
      setFeatured(realData.slice(0, 5));
      setPopular(realData.slice(5, 10));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadRealData();
  }, []);

  useEffect(() => {
    if (news && news.length > 0) {
      const timer = setInterval(() => {
        setNewsIndex((prev) => (prev + 1) % news.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [news]);

  useEffect(() => {
    const loadRealData = async () => {
      setLoading(true);
      try {
        const brandingName = apiSettings.branding.companyName;
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
  }, [apiSettings.branding.companyName]);

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
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={primaryColor}
            colors={[primaryColor]} 
          />
        }
      >
        <ScrollView 
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setNewsIndex(index);
          }}
          style={styles.newsCarousel}
        >
          {news.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              activeOpacity={0.9}
              style={[styles.hero, { width }]}
            >
              <Image 
                source={{ uri: item.image }} 
                style={StyleSheet.absoluteFill} 
                resizeMode="cover"
              />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
              
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>{item.title}</Text>
                <Text style={styles.heroTitleAccent}>{item.subtitle}</Text>
                <Text style={styles.heroSubtitle}>Exclusive Imperial News by {apiSettings.branding.companyName}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.carouselDots}>
          {news.map((_, i) => (
            <View 
              key={i} 
              style={[styles.dot, newsIndex === i && styles.activeDot]} 
            />
          ))}
        </View>

        {/* Quick Actions moved over Featured Destinations */}
        {/* Imperial Dining Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Imperial Dining (Bon Appétit!)</Text>
            <TouchableOpacity onPress={() => Alert.alert('Dining Hub', 'Booking a table at Raouche Rocks or Burj Al Arab? Coming soon!')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardList}>
            <TouchableOpacity style={styles.foodCard} onPress={() => Alert.alert('Raouche Rocks', 'Booking available from June 2026')}>
               <Image source={{ uri: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?w=400&q=80' }} style={styles.foodImage} />
               <Text style={[styles.foodName, dynamicStyles.text]}>Lebanese Mezze</Text>
               <Text style={styles.foodLocation}>Beirut, Lebanon</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.foodCard} onPress={() => Alert.alert('Imperial Grill', 'Private chef sessions available')}>
               <Image source={{ uri: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' }} style={styles.foodImage} />
               <Text style={[styles.foodName, dynamicStyles.text]}>Imperial Grill</Text>
               <Text style={styles.foodLocation}>Dubai, UAE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.foodCard} onPress={() => Alert.alert('Luxury Dining', 'Undersea restaurant booking')}>
               <Image source={{ uri: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80' }} style={styles.foodImage} />
               <Text style={[styles.foodName, dynamicStyles.text]}>Luxury Cocktails</Text>
               <Text style={styles.foodLocation}>Maldives</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.foodCard} onPress={() => Alert.alert('Sky Dining', 'Dinner in the sky experience')}>
               <Image source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80' }} style={styles.foodImage} />
               <Text style={[styles.foodName, dynamicStyles.text]}>Sky Terrace</Text>
               <Text style={styles.foodLocation}>London, UK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.foodCard} onPress={() => Alert.alert('Authentic Pasta', 'Traditional Italian cuisine')}>
               <Image source={{ uri: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400&q=80' }} style={styles.foodImage} />
               <Text style={[styles.foodName, dynamicStyles.text]}>Italian Bistro</Text>
               <Text style={styles.foodLocation}>Rome, Italy</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, { paddingHorizontal: 20, marginBottom: 12 }]}>Quick Actions</Text>
          <View style={[styles.actionGrid, { paddingHorizontal: 20 }]}>
            <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.actionCard, { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#1A1A1A' : '#F3F4F6' }]} 
                onPress={() => router.push('/search')}
              >
                <Ionicons name="airplane" size={24} color={primaryColor} style={styles.actionIconIonic} />
                <Text style={[styles.actionText, dynamicStyles.text]}>Flights</Text>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }], marginLeft: 10 }}>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.actionCard, { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#1A1A1A' : '#F3F4F6' }]} 
                onPress={() => router.push('/search')}
              >
                <Ionicons name="business" size={24} color={primaryColor} style={styles.actionIconIonic} />
                <Text style={[styles.actionText, dynamicStyles.text]}>Hotels</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }], marginLeft: 10 }}>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.actionCard, { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#1A1A1A' : '#F3F4F6' }]} 
                onPress={() => router.push('/search')}
              >
                <Ionicons name="map" size={24} color={primaryColor} style={styles.actionIconIonic} />
                <Text style={[styles.actionText, dynamicStyles.text]}>Packages</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }], marginLeft: 10 }}>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.actionCard, { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#1A1A1A' : '#F3F4F6' }]} 
                onPress={() => Alert.alert('Imperial Dining', 'Exclusive restaurants and food tours coming soon! Bon appétit!')}
              >
                <Ionicons name="restaurant" size={24} color="#EF4444" style={styles.actionIconIonic} />
                <Text style={[styles.actionText, dynamicStyles.text]}>Dining</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Featured Destinations</Text>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color={primaryColor} style={{ marginVertical: 20 }} />
          ) : (
            <FlatList
              data={featured}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              snapToInterval={width * 0.8 + 20}
              decelerationRate="fast"
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
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color={primaryColor} style={{ marginVertical: 20 }} />
          ) : (
            <FlatList
              data={popular}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              snapToInterval={width * 0.8 + 20}
              decelerationRate="fast"
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
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Imperial Travel Insights</Text>
            <TouchableOpacity onPress={() => router.push('/blog')}>
              <Text style={styles.seeAll}>Full Blog →</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.verticalNewsList}>
            {news && news.length > 0 ? (
              news.slice(0, 5).map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.newsRow, { backgroundColor: isDark ? '#0A0A0A' : '#FFF', borderColor: isDark ? '#1A1A1A' : '#F3F4F6' }]}
                  onPress={() => router.push('/blog')}
                >
                  <Image source={{ uri: item.image }} style={styles.newsRowImage} />
                  <View style={styles.newsRowContent}>
                    <Text style={[styles.newsRowTitle, dynamicStyles.text]} numberOfLines={2}>{item.title}</Text>
                    <Text style={[styles.newsRowTime, dynamicStyles.subText]} numberOfLines={1}>{item.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={isDark ? '#444' : '#CCC'} />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={[styles.emptyNews, dynamicStyles.subText]}>No news available.</Text>
            )}
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
    height: 250,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  newsCarousel: {
    height: 250,
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
    paddingBottom: 10,
  },
  foodCard: {
    width: 150,
    marginRight: 15,
  },
  foodImage: {
    width: 150,
    height: 100,
    borderRadius: 16,
    marginBottom: 8,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '700',
  },
  foodLocation: {
    fontSize: 12,
    color: '#666',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    transform: [{ scale: 1 }],
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
  verticalNewsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  newsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  newsRowTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  newsRowTime: {
    fontSize: 12,
  },
  newsRowImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 15,
  },
  newsRowContent: {
    flex: 1,
  },
  emptyNews: {
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 100,
  },
});