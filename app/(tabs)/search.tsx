import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, Image, Modal, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header, SearchBar } from '../../components/Header';
import { useStore } from '../../store';
import { searchFlights, sampleDestinations } from '../../services/api';
import { Colors, Destination } from '../../types';

export default function SearchScreen() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, theme, apiSettings } = useStore();
  const [results, setResults] = useState<Destination[]>([]);
  const [visibleResults, setVisibleResults] = useState<Destination[]>([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'low' | 'high'>('low');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const ITEMS_PER_PAGE = 20;
  
  const isDark = theme === 'dark';
  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#000000' : Colors.backgroundLight },
    text: { color: isDark ? '#FFFFFF' : Colors.text },
    subText: { color: isDark ? '#888888' : Colors.textLight },
    card: { backgroundColor: isDark ? '#0A0A0A' : Colors.white, borderColor: isDark ? '#1A1A1A' : Colors.border },
    header: { backgroundColor: isDark ? '#0A0A0A' : Colors.white },
  };

  // Advanced Filters State like Booking.com
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Recent Searches for Professional Look
  const [recentSearches, setRecentSearches] = useState(['London', 'Beirut', 'Dubai']);

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

  const fetchResults = async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else setIsLoading(true);

    try {
      let data;
      if (searchQuery.length > 0) {
        data = await searchFlights('DXB', searchQuery, apiSettings.branding.companyName);
      } else {
        data = sampleDestinations;
      }

      // Apply Advanced Filters
      let filtered = data.filter(item => {
        const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
        const matchesRating = !selectedRating || item.rating >= selectedRating;
        return matchesPrice && matchesRating;
      });

      // Sort logic
      const sorted = [...filtered].sort((a, b) => {
        return sortBy === 'low' ? a.price - b.price : (b.highestPrice || b.price) - (a.highestPrice || a.price);
      });

      setResults(sorted);
      setDestinations(sorted); // Store in global state
      setPage(1);
      setVisibleResults(sorted.slice(0, ITEMS_PER_PAGE));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchQuery, sortBy, priceRange, selectedRating]);

  const onRefresh = React.useCallback(() => {
    fetchResults(true);
  }, [searchQuery, sortBy, priceRange, selectedRating]);

  const handleDestinationPress = (id: string) => {
    router.push(`/destination/${id}`);
  };

  const loadMore = () => {
    if (visibleResults.length < results.length) {
      const nextPage = page + 1;
      const nextBatch = results.slice(0, nextPage * ITEMS_PER_PAGE);
      setVisibleResults(nextBatch);
      setPage(nextPage);
    }
  };

  const renderItem = ({ item }: { item: Destination }) => (
    <TouchableOpacity style={styles.resultCard} onPress={() => handleDestinationPress(item.id)}>
      <Image source={{ uri: item.image }} style={styles.resultImage} />
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultName}>{item.name}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {item.rating}</Text>
          </View>
        </View>
        <Text style={styles.resultLocation}>{item.country}</Text>
        <View style={styles.priceComparisonRow}>
           <View>
              <Text style={styles.priceLabel}>Min</Text>
              <Text style={styles.minPrice}>${item.price}</Text>
           </View>
           {item.highestPrice && (
              <View style={styles.priceDivider} />
           )}
           {item.highestPrice && (
              <View>
                <Text style={styles.priceLabel}>Max</Text>
                <Text style={styles.maxPrice}>${item.highestPrice}</Text>
              </View>
           )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Header title="Search" />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search destinations, countries..."
        onSubmit={() => setShowSuggestions(false)}
      />

      {showSuggestions && suggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#1A1A1A' : Colors.border }]}>
          {suggestions.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(item)}
            >
              <Ionicons name="location-outline" size={20} color={isDark ? '#FFD400' : Colors.primary} style={styles.suggestionIconIonic} />
              <View>
                <Text style={[styles.suggestionName, dynamicStyles.text]}>{item.name}</Text>
                <Text style={[styles.suggestionCountry, dynamicStyles.subText]}>{item.country}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Recent Searches Row */}
      {!showSuggestions && searchQuery.length === 0 && (
        <View style={styles.recentSection}>
          <Text style={[styles.recentTitle, dynamicStyles.subText]}>RECENT SEARCHES</Text>
          <View style={styles.recentRow}>
            {recentSearches.map((s, i) => (
              <TouchableOpacity key={i} style={[styles.recentBadge, { backgroundColor: isDark ? '#111' : '#F3F4F6' }]} onPress={() => setSearchQuery(s)}>
                <Text style={[styles.recentText, dynamicStyles.text]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.filterIconButton, isDark && { backgroundColor: '#0A0A0A', borderColor: '#333' }]}
            onPress={() => setIsFilterVisible(true)}
          >
            <Text style={styles.filterIconText}>⚙️ Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, sortBy === 'low' && styles.filterChipActive, isDark && { backgroundColor: '#0A0A0A', borderColor: '#1A1A1A' }]}
            onPress={() => setSortBy('low')}
          >
            <Text style={sortBy === 'low' ? styles.filterTextActive : [styles.filterText, isDark && { color: '#888' }]}>Price: Low to High</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, sortBy === 'high' && styles.filterChipActive, isDark && { backgroundColor: '#0A0A0A', borderColor: '#1A1A1A' }]}
            onPress={() => setSortBy('high')}
          >
            <Text style={sortBy === 'high' ? styles.filterTextActive : [styles.filterText, isDark && { color: '#888' }]}>Price: High to Low</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Advanced Filter Modal like Booking.com */}
      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.card]}>
            <View style={[styles.modalHeader, dynamicStyles.header]}>
              <Text style={[styles.modalTitle, dynamicStyles.text]}>Filter by</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <Text style={[styles.closeIcon, dynamicStyles.text]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.filterSectionTitle, dynamicStyles.text]}>Your budget (per person)</Text>
              <View style={styles.priceFilterRow}>
                {[500, 1000, 2000, 5000].map(p => (
                  <TouchableOpacity 
                    key={p} 
                    style={[styles.priceChip, priceRange[1] === p && styles.activePriceChip, isDark && { backgroundColor: '#111', borderColor: '#222' }]}
                    onPress={() => setPriceRange([0, p])}
                  >
                    <Text style={[styles.priceChipText, dynamicStyles.text, priceRange[1] === p && styles.activePriceChipText]}>Up to ${p}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.filterSectionTitle, dynamicStyles.text]}>Star rating</Text>
              <View style={styles.ratingFilterRow}>
                {[5, 4, 3].map(r => (
                  <TouchableOpacity 
                    key={r} 
                    style={[styles.ratingFilterChip, selectedRating === r && styles.activeRatingChip, isDark && { backgroundColor: '#111', borderColor: '#222' }]}
                    onPress={() => setSelectedRating(selectedRating === r ? null : r)}
                  >
                    <Text style={[styles.ratingFilterText, dynamicStyles.text, selectedRating === r && styles.activeRatingText]}>{r} ★ & up</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={[styles.modalFooter, dynamicStyles.header]}>
              <TouchableOpacity 
                style={[styles.clearBtn, isDark && { borderColor: '#1A1A1A' }]}
                onPress={() => {
                  setPriceRange([0, 5000]);
                  setSelectedRating(null);
                }}
              >
                <Text style={[styles.clearBtnText, dynamicStyles.subText]}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyBtn}
                onPress={() => setIsFilterVisible(false)}
              >
                <Text style={styles.applyBtnText}>Show {results.length} results</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={visibleResults}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          isLoading ? <ActivityIndicator size="small" color={Colors.primary} style={{ margin: 20 }} /> : null
        )}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={Colors.primary}
            colors={[Colors.primary]} 
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔄</Text>
              <Text style={[styles.emptyText, dynamicStyles.text]}>Fetching live prices...</Text>
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={[styles.emptyText, dynamicStyles.text]}>No destinations found</Text>
              <Text style={[styles.emptySubtext, dynamicStyles.subText]}>Try a different search term</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  filters: {
    paddingHorizontal: 20,
    marginBottom: 12,
    zIndex: 1,
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
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recentTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  recentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  recentBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  recentText: {
    fontSize: 13,
    fontWeight: '600',
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
  suggestionIconIonic: {
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
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.white,
    borderRadius: 15,
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterIconButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.white,
    borderRadius: 15,
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterIconText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
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
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    marginTop: 10,
  },
  priceFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  priceChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activePriceChip: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  priceChipText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
  },
  activePriceChipText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  ratingFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  ratingFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeRatingChip: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  ratingFilterText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
  },
  activeRatingText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textLight,
  },
  applyBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.white,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: Colors.textLight,
    fontWeight: '600',
    fontSize: 11,
  },
  filterTextActive: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 11,
  },
  list: {
    paddingHorizontal: 20,
  },
  resultCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resultImage: {
    width: '100%',
    height: 150,
  },
  resultContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  resultLocation: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 12,
  },
  priceComparisonRow: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  priceLabel: {
    fontSize: 10,
    color: Colors.textLight,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 2,
  },
  minPrice: {
    fontSize: 16,
    fontWeight: '800', 
    color: Colors.primary,
  },
  maxPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  priceDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#eee',
    marginHorizontal: 15,
  },
  ratingBadge: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: Colors.accent,
    fontWeight: '700',
  },
  resultPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 8,
  },
});