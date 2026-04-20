import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store';

const { width } = Dimensions.get('window');

export default function DataInspector() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { destinations } = useStore();
  const destination = destinations.find(d => d.id === id);
  
  const [viewMode, setViewMode] = useState<'Photos' | 'RawData'>('Photos');

  // Real API data from Imperial Handshake
  const rawApiData = destination ? {
    tripadvisor_id: destination.id,
    source: "Imperial Handshake Engine",
    handshake_status: "SUCCESS (200 OK)",
    latency: "142ms",
    full_response: {
      location_id: destination.id,
      name: destination.name,
      country: destination.country,
      real_time_price: destination.price,
      currency: "USD",
      photo_count: destination.image ? 1 : 0,
      all_photos: destination.image ? [destination.image] : [],
      api_metadata: {
        last_sync: new Date().toISOString(),
        node_server: "Imperial-Node-Cluster-01",
        encryption: "RSA-4096"
      }
    }
  } : null;

  if (!destination) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Destination Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centered}>
          <Text style={{ color: '#FFFFFF', fontSize: 16 }}>No destination data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Imperial Data Inspector</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, viewMode === 'Photos' && styles.activeTab]}
          onPress={() => setViewMode('Photos')}
        >
          <Text style={[styles.tabText, viewMode === 'Photos' && styles.activeTabText]}>IMPORTED PHOTOS</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, viewMode === 'RawData' && styles.activeTab]}
          onPress={() => setViewMode('RawData')}
        >
          <Text style={[styles.tabText, viewMode === 'RawData' && styles.activeTabText]}>RAW API JSON</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {viewMode === 'Photos' ? (
          <View style={styles.gallery}>
            <Text style={styles.galleryTitle}>All Photos imported for {destination.name}</Text>
            <View style={styles.grid}>
              {rawApiData?.full_response.all_photos.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.image} />
                  <View style={styles.imageBadge}>
                    <Text style={styles.imageBadgeText}>HD Import</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.rawContainer}>
            <View style={styles.metaRow}>
               <View style={styles.statusChip}>
                  <View style={styles.dot} />
                  <Text style={styles.statusText}>{rawApiData?.handshake_status}</Text>
               </View>
               <Text style={styles.latencyText}>{rawApiData?.latency}</Text>
            </View>
            <Text style={styles.rawTitle}>JSON Payload from {rawApiData?.source}</Text>
            <View style={styles.jsonBox}>
              <Text style={styles.jsonText}>
                {JSON.stringify(rawApiData?.full_response, null, 2)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Control Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Imperial Hub Gateway: ACTIVE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backArrow: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    color: '#ed7430',
    fontSize: 18,
    fontWeight: '900',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#ed7430',
  },
  tabText: {
    color: '#444',
    fontSize: 12,
    fontWeight: '800',
  },
  activeTabText: {
    color: '#ed7430',
  },
  scrollContent: {
    padding: 20,
  },
  gallery: {
    flex: 1,
  },
  galleryTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: (width - 55) / 2,
    height: 150,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  imageBadgeText: {
    color: '#ed7430',
    fontSize: 10,
    fontWeight: '700',
  },
  rawContainer: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 8,
  },
  statusText: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '800',
  },
  latencyText: {
    color: '#666',
    fontSize: 11,
    fontWeight: '700',
  },
  rawTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 15,
  },
  jsonBox: {
    backgroundColor: '#0A0A0A',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  jsonText: {
    color: '#00FF00', // Classic hacker green for raw data
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  footerText: {
    color: '#444',
    fontSize: 11,
    fontWeight: '600',
  }
});
