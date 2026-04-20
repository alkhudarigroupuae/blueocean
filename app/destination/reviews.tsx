import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Header } from '../../components/Header';
import { getDestinationReviews } from '../../services/api';
import { useStore } from '../../store';
import { Colors, Review } from '../../types';

export default function ReviewsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { destinations } = useStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const destination = destinations.find(d => d.id === id);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const realReviews = await getDestinationReviews(id as string);
        setReviews(realReviews);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  if (!destination) {
    return (
      <View style={styles.container}>
        <Header showBack onBack={() => router.back()} title="Reviews" />
        <View style={styles.centered}>
          <Text>Destination not found</Text>
        </View>
      </View>
    );
  }

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.userName.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {item.rating}</Text>
        </View>
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        showBack 
        onBack={() => router.back()} 
        title={`${destination.rating} Excellent`} 
      />
      
      <View style={styles.summarySection}>
        <Text style={styles.totalReviews}>{destination.reviewCount} Reviews</Text>
        <View style={styles.ratingBars}>
           {/* Visual representation of rating distribution */}
           {[5, 4, 3, 2, 1].map(star => (
             <View key={star} style={styles.ratingBarRow}>
                <Text style={styles.starLabel}>{star} ★</Text>
                <View style={styles.barContainer}>
                   <View style={[styles.barFill, { width: star === 5 ? '80%' : star === 4 ? '15%' : '5%' }]} />
                </View>
             </View>
           ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Fetching real reviews...</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.noReviews}>No detailed reviews available yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  summarySection: {
    backgroundColor: Colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  totalReviews: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 15,
  },
  ratingBars: {
    gap: 8,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starLabel: {
    width: 30,
    fontSize: 12,
    color: Colors.textLight,
  },
  barContainer: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginLeft: 10,
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  listContent: {
    padding: 20,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  ratingBadge: {
    backgroundColor: Colors.accent + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '800',
  },
  comment: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  noReviews: {
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '600',
  }
});
