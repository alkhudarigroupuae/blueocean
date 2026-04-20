import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Header } from '../../components/Header';
import { useStore } from '../../store';
import { Colors } from '../../types';

const { width } = Dimensions.get('window');

export default function BlogPostDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { theme, news } = useStore();
  const isDark = theme === 'dark';

  // Static posts to match blog.tsx
  const blogPosts = [
    {
      id: '1',
      title: 'How to find the cheapest MEA flights from Dubai?',
      content: 'Discover the secret timing and booking strategies to get the best deals on Middle East Airlines for your next Beirut trip. We analyzed months of data to find that booking 3 weeks in advance on a Tuesday afternoon yields the best results for the DXB-BEY route.',
      image: 'https://images.unsplash.com/photo-1590076214537-1e3c7c996e41?w=800&q=80',
      createdAt: '2026-04-20T10:00:00Z',
      author: 'Imperial Hub',
    },
    {
      id: '2',
      title: 'Top 5 Luxury Hotels in Maldives for 2026',
      content: 'We compared all major booking APIs to bring you the definitive list of Maldivian paradise spots that offer the best value. From underwater villas to private island retreats, these are the must-visit locations for your next luxury getaway.',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
      createdAt: '2026-04-18T10:00:00Z',
      author: 'Travel Experts',
    },
    {
      id: '3',
      title: 'Why Alkhudari Group is Revolutionizing Travel Brokerage',
      content: 'The new API-centric model is allowing small offices to compete with giants. By leveraging global distribution systems through simple Imperial handshakes, Alkhudari Group is empowering brokers everywhere to provide world-class service.',
      image: 'https://images.unsplash.com/photo-1502602898657-3e917247a184?w=800&q=80',
      createdAt: '2026-04-15T10:00:00Z',
      author: 'Executive Team',
    }
  ];

  // Find post in store news OR static blogPosts
  const post = news.find(n => n.id === id) || blogPosts.find(b => b.id === id);

  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#000' : '#F9FAFB' },
    card: { backgroundColor: isDark ? '#0A0A0A' : '#FFF' },
    text: { color: isDark ? '#FFF' : '#111827' },
    subText: { color: isDark ? '#888' : '#6B7280' },
  };

  if (!post) {
    return (
      <View style={[styles.container, dynamicStyles.container]}>
        <Header showBack onBack={() => router.back()} />
        <View style={styles.center}>
          <Text style={[styles.errorText, dynamicStyles.text]}>Article not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={{ color: Colors.primary }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Header title="Imperial Insight" showBack onBack={() => router.back()} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: post.image }} style={styles.heroImage} />
        
        <View style={styles.contentContainer}>
          <View style={styles.metaRow}>
            <Text style={styles.category}>TRAVEL NEWS</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</Text>
          </View>

          <Text style={[styles.title, dynamicStyles.text]}>{post.title}</Text>
          <Text style={[styles.author, dynamicStyles.subText]}>By {post.author}</Text>

          <View style={[styles.divider, { backgroundColor: isDark ? '#1A1A1A' : '#E5E7EB' }]} />

          <Text style={[styles.content, dynamicStyles.text]}>
            {post.content}
          </Text>
          
          {/* Default long content if short */}
          {post.content.length < 200 && (
             <Text style={[styles.content, dynamicStyles.text, { marginTop: 20 }]}>
                Experience the world like never before with Alkhudari Group's premium travel services. 
                Our platform provides exclusive access to real-time booking data, luxury destination insights, 
                and seamless travel management. Whether you are planning a business trip or a family 
                vacation, our Imperial brokerage system ensures you get the best value and highest 
                security standards in the industry.
             </Text>
          )}
        </View>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  backLink: { padding: 10 },
  heroImage: { width: '100%', height: 300, backgroundColor: '#F3F4F6' },
  contentContainer: { padding: 25 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  category: { color: Colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  dot: { marginHorizontal: 8, color: '#888' },
  date: { color: '#888', fontSize: 12 },
  title: { fontSize: 26, fontWeight: '900', lineHeight: 34, marginBottom: 10 },
  author: { fontSize: 14, fontStyle: 'italic', marginBottom: 20 },
  divider: { height: 1, width: '100%', marginBottom: 25 },
  content: { fontSize: 16, lineHeight: 28, opacity: 0.9 },
  bottomPadding: { height: 100 },
});
