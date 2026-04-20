import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Head from 'expo-router/head';
import { Header } from '../components/Header';
import { Colors } from '../types';
import { useStore } from '../store';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const blogPosts = [
  {
    id: '1',
    title: 'How to find the cheapest MEA flights from Dubai?',
    excerpt: 'Discover the secret timing and booking strategies to get the best deals on Middle East Airlines for your next Beirut trip...',
    image: 'https://images.unsplash.com/photo-1590076214537-1e3c7c996e41?w=800&q=80',
    date: 'April 20, 2026',
    category: 'Travel Tips',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Top 5 Luxury Hotels in Maldives for 2026',
    excerpt: 'We compared all major booking APIs to bring you the definitive list of Maldivian paradise spots that offer the best value...',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    date: 'April 18, 2026',
    category: 'Destinations',
    readTime: '8 min read',
  },
  {
    id: '3',
    title: 'Why Alkhudari Group is Revolutionizing Travel Brokerage',
    excerpt: 'The new API-centric model is allowing small offices to compete with giants. Here is how you can join the revolution...',
    image: 'https://images.unsplash.com/photo-1502602898657-3e917247a184?w=800&q=80',
    date: 'April 15, 2026',
    category: 'Business',
    readTime: '6 min read',
  }
];

export default function BlogScreen() {
  const router = useRouter();
  const { theme, news } = useStore();
  const isDark = theme === 'dark';

  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#000' : '#F9FAFB' },
    card: { backgroundColor: isDark ? '#0A0A0A' : '#FFF', borderColor: isDark ? '#1A1A1A' : '#E5E7EB' },
    text: { color: isDark ? '#FFF' : '#111827' },
    subText: { color: isDark ? '#888' : '#6B7280' },
  };

  // Combine static and dynamic news
  const allPosts = [...blogPosts, ...news];

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Head>
        <title>Imperial Travel Blog | Alkhudari Group Insights</title>
        <meta name="description" content="Stay updated with the latest travel trends, luxury hotel reviews, and brokerage news from Alkhudari Group." />
      </Head>
      <Header title="Imperial Blog" showBack onBack={() => router.back()} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.mainTitle, dynamicStyles.text]}>Latest Travel Insights</Text>
        <Text style={[styles.subtitle, dynamicStyles.subText]}>Expert advice and news from the Alkhudari Imperial Hub</Text>

        {allPosts.map((post: any) => (
          <TouchableOpacity 
            key={post.id} 
            style={[styles.blogCard, dynamicStyles.card]}
            onPress={() => router.push(`/blog/${post.id}`)}
          >
            <Image source={{ uri: post.image }} style={styles.blogImage} />
            <View style={styles.cardContent}>
              <View style={styles.metaRow}>
                <Text style={styles.category}>{post.category || 'Travel'}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.date}>{post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Today')}</Text>
              </View>
              <Text style={[styles.postTitle, dynamicStyles.text]}>{post.title}</Text>
              <Text style={[styles.excerpt, dynamicStyles.subText]} numberOfLines={2}>
                {post.excerpt || post.subtitle || post.content}
              </Text>
              <View style={styles.footerRow}>
                <Text style={styles.readMore}>Read Article</Text>
                <Text style={styles.readTime}>{post.readTime || '4 min read'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 30,
  },
  blogCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  blogImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  category: {
    color: '#ed7430',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  dot: {
    color: '#666',
    marginHorizontal: 8,
  },
  date: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 10,
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  readMore: {
    color: '#ed7430',
    fontWeight: '700',
    fontSize: 13,
  },
  readTime: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  }
});
