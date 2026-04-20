import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, ActivityIndicator, Animated, RefreshControl, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Head from 'expo-router/head';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '../../components/Logo';
import { DestinationCard } from '../../components/DestinationCard';
import { Header, SearchBar } from '../../components/Header';
import { useStore } from '../../store';
import { getFeaturedDestinations, searchFlights } from '../../services/api';
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
    text: { color: isDark ? '#FFFFFF' : '#111827' },
    subText: { color: isDark ? '#A1A1AA' : '#71717A' },
    sectionTitle: { color: isDark ? '#FFFFFF' : '#111827' },
    card: { 
      backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', 
      borderColor: isDark ? '#27272A' : '#F4F4F5',
      borderWidth: 1,
      shadowOpacity: isDark ? 0 : 0.02,
    },
  };

  const loadRealData = async () => {
    try {
      const realData = await getFeaturedDestinations();
      setFeatured(realData.slice(0, 20));
      setPopular(realData.slice(20, 30));
      setDestinations(realData);
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
    loadRealData();
  }, [apiSettings.branding.companyName]);

  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filteredSuggestions = destinations.filter((d: Destination) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, destinations]);

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
      </Head>
      <View style={styles.headerRow}>
        <Logo size="small" />
        <TouchableOpacity style={[styles.profileIcon, { backgroundColor: isDark ? '#1A1A1A' : '#F4F4F5' }]} onPress={() => router.push('/profile')}>
           <Ionicons name="person-outline" size={20} color={isDark ? '#FFFFFF' : '#111827'} />
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
        <View style={[styles.suggestionsContainer, { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#F4F4F5' }]}>
          {suggestions.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(item)}
            >
              <Ionicons name="location-outline" size={18} color={primaryColor} style={{ marginRight: 12 }} />
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
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
              
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>{item.title.toUpperCase()}</Text>
                <Text style={[styles.heroTitleAccent, { color: primaryColor }]}>{item.subtitle}</Text>
                <Text style={styles.heroSubtitle}>Establishing Imperial Connection</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.carouselDots}>
          {news.map((_, i) => (
            <View 
              key={i} 
              style={[styles.dot, newsIndex === i ? { backgroundColor: primaryColor, width: 20 } : { backgroundColor: 'rgba(255,255,255,0.3)' }]} 
            />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, { paddingHorizontal: 20, marginBottom: 16 }]}>QUICK ACTIONS</Text>
          <View style={[styles.actionGrid, { paddingHorizontal: 20 }]}>
            {[
              { label: 'Flights', icon: 'airplane', route: '/search' },
              { label: 'Hotels', icon: 'business', route: '/search' },
              { label: 'Packages', icon: 'map', route: '/search' },
              { label: 'Dining', icon: 'restaurant', route: '/search' },
            ].map((action, i) => (
              <Animated.View key={i} style={{ flex: 1, transform: [{ scale: scaleAnim }], marginLeft: i === 0 ? 0 : 10 }}>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  style={[styles.actionCard, dynamicStyles.card]} 
                  onPress={() => {
                    if (action.route) {
                      setSearchQuery(action.label);
                      router.push(action.route as any);
                    }
                  }}
                >
                  <Ionicons name={action.icon as any} size={24} color={primaryColor} style={styles.actionIconIonic} />
                  <Text style={[styles.actionText, dynamicStyles.text]}>{action.label}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Imperial Dining Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>IMPERIAL DINING</Text>
            <TouchableOpacity onPress={() => Alert.alert('Dining Hub', 'Establishing Imperial Handshake...')}>
              <Text style={[styles.seeAll, { color: primaryColor }]}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardList}>
            {[
              { name: 'Lebanese Mezze', location: 'Beirut, Lebanon', img: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?w=400&q=80' },
              { name: 'Imperial Grill', location: 'Dubai, UAE', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
              { name: 'Al Mahara', location: 'Dubai, UAE', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80' },
              { name: 'Sushi Zen', location: 'Tokyo, Japan', img: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80' },
              { name: 'Bella Vista', location: 'Rome, Italy', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80' },
              { name: 'Spice Garden', location: 'Mumbai, India', img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80' },
              { name: 'La Petite', location: 'Paris, France', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80' },
              { name: 'Taco Libre', location: 'Mexico City, Mexico', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80' },
              { name: 'Golden Dragon', location: 'Beijing, China', img: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&q=80' },
              { name: 'Nordic Kitchen', location: 'Stockholm, Sweden', img: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&q=80' },
            ].map((item, i) => (
              <TouchableOpacity 
                key={i} 
                style={[styles.foodCardSmall, dynamicStyles.card]} 
                onPress={() => {
                  setSearchQuery(item.name);
                  router.push('/search');
                }}
              >
                <Image source={{ uri: item.img }} style={styles.foodImageSmall} />
                <View style={{ padding: 8 }}>
                    <Text style={[styles.foodNameSmall, dynamicStyles.text]}>{item.name}</Text>
                    <Text style={[styles.foodLocationSmall, dynamicStyles.subText]}>{item.location}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>FEATURED DESTINATIONS</Text>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text style={[styles.seeAll, { color: primaryColor }]}>See All →</Text>
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
              snapToInterval={width * 0.6 + 16}
              decelerationRate="fast"
              renderItem={({ item }) => (
                <DestinationCard
                  destination={item}
                  onPress={() => handleDestinationPress(item.id)}
                  size="small"
                />
              )}
              contentContainerStyle={styles.cardList}
            />
          )}
        </View>

        {/* Popular Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>POPULAR PACKAGES</Text>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text style={[styles.seeAll, { color: primaryColor }]}>See All →</Text>
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

        {/* Blog Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>IMPERIAL INSIGHTS</Text>
            <TouchableOpacity onPress={() => router.push('/blog')}>
              <Text style={[styles.seeAll, { color: primaryColor }]}>Full Blog →</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.verticalNewsList}>
            {news.slice(0, 5).map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.newsRow, dynamicStyles.card]}
                onPress={() => router.push('/blog')}
              >
                <Image source={{ uri: item.image }} style={styles.newsRowImage} />
                <View style={styles.newsRowContent}>
                  <Text style={[styles.newsRowTitle, dynamicStyles.text]} numberOfLines={2}>{item.title}</Text>
                  <Text style={[styles.newsRowTime, dynamicStyles.subText]} numberOfLines={1}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={isDark ? '#27272A' : '#D1D5DB'} />
              </TouchableOpacity>
            ))}
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
    borderRadius: 12,
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
    left: 48,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  heroTextContainer: {
    zIndex: 2,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 130,
    left: 20,
    right: 20,
    borderRadius: 16,
    padding: 8,
    zIndex: 1000,
    elevation: 5,
    borderWidth: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: '700',
  },
  suggestionCountry: {
    fontSize: 12,
  },
  heroTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  heroTitleAccent: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardList: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  foodCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  foodCardSmall: {
    width: 140,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: 120,
  },
  foodImageSmall: {
    width: '100%',
    height: 80,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '800',
  },
  foodNameSmall: {
    fontSize: 13,
    fontWeight: '700',
  },
  foodLocation: {
    fontSize: 12,
    marginTop: 2,
  },
  foodLocationSmall: {
    fontSize: 10,
    marginTop: 1,
  },
  actionGrid: {
    flexDirection: 'row',
  },
  actionCard: {
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 20,
  },
  actionIconIonic: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  verticalNewsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  newsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
  },
  newsRowImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  newsRowContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  newsRowTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  newsRowTime: {
    fontSize: 11,
    marginTop: 4,
  },
  bottomPadding: {
    height: 100,
  },
});