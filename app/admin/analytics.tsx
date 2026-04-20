import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store';

const { width } = Dimensions.get('window');

export default function TrafficAnalytics() {
  const router = useRouter();
  const { apiSettings } = useStore();
  const [loading, setLoading] = useState(true);
  
  // Simulation of real data from RapidAPI Analytics
  const [stats, setStats] = useState({
    totalCalls: 1250,
    errorRate: 0.5,
    latency: 145,
  });

  useEffect(() => {
    // Here we would call the RapidAPI Platform API using the Master Key
    // To get real traffic metrics for your Alkhudari Group Hub
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const timeFilters = ['1h', '3h', '12h', '24h', '7d', '30d', '90d'];
  const [activeFilter, setActiveTab] = useState('7d');

  return (
    <View style={styles.container}>
      {/* Header like in the image */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Imperial Analytics</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.tabContainer}>
          <Text style={[styles.tab, styles.activeTab]}>Traffic Analytics</Text>
          <Text style={styles.tab}>User Analytics</Text>
          <Text style={styles.tab}>Revenue</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Filters Row */}
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {timeFilters.map(f => (
              <TouchableOpacity 
                key={f} 
                style={[styles.filterChip, activeFilter === f && styles.activeFilterChip]}
                onPress={() => setActiveTab(f)}
              >
                <Text style={[styles.filterText, activeFilter === f && styles.activeFilterText]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Key Metrics like in the image */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total API calls</Text>
            <Text style={styles.metricValue}>{stats.totalCalls}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Average Error Rate</Text>
            <Text style={[styles.metricValue, { color: '#22C55E' }]}>{stats.errorRate}%</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Average Latency</Text>
            <Text style={styles.metricValue}>{stats.latency}ms</Text>
          </View>
        </View>

        {/* Chart Visualization (Simulated Refine/Shadcn style) */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
             <Text style={styles.chartTitle}>Request Traffic</Text>
             <View style={styles.chartLegend}>
                <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
                <Text style={styles.legendText}>API calls</Text>
                <View style={[styles.legendDot, { backgroundColor: '#EF4444', marginLeft: 10 }]} />
                <Text style={styles.legendText}>Errors</Text>
             </View>
          </View>
          
          <View style={styles.chartBody}>
            {/* Mock Chart Lines */}
            <View style={styles.chartGrid}>
               {[1, 2, 3, 4, 5].map(i => <View key={i} style={styles.gridLine} />)}
               
               {/* Animated-like Bar bars for visual parity with your image */}
               <View style={styles.barsContainer}>
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <View key={i} style={styles.barGroup}>
                       <View style={[styles.bar, { height: `${h}%`, backgroundColor: '#22C55E' }]} />
                       <View style={[styles.bar, { height: `${h/10}%`, backgroundColor: '#EF4444' }]} />
                    </View>
                  ))}
               </View>
            </View>
            
            <View style={styles.xAxis}>
               {['Apr 12', '14', '16', '18', '20'].map(d => (
                 <Text key={d} style={styles.axisText}>{d}</Text>
               ))}
            </View>
          </View>
        </View>

        {/* Footer Support Info */}
        <View style={styles.footer}>
           <Text style={styles.footerText}>Handshaking with RapidAPI Global Servers...</Text>
           <View style={styles.secureBadge}>
              <Text style={styles.secureText}>RSA-4096 SECURE</Text>
           </View>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFD400" />
          <Text style={styles.loadingText}>Syncing with RapidAPI...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray like RapidAPI Studio
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 24,
    color: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTab: {
    color: '#2563EB',
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  scrollContent: {
    padding: 20,
  },
  filterRow: {
    marginBottom: 24,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#F3F4F6',
    borderColor: '#374151',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  activeFilterText: {
    color: '#111827',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 400,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  chartBody: {
    flex: 1,
  },
  chartGrid: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'relative',
  },
  gridLine: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  barsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  barGroup: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  bar: {
    width: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 5,
  },
  axisText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  secureBadge: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#000',
    borderRadius: 4,
  },
  secureText: {
    color: '#FFD400',
    fontSize: 10,
    fontWeight: '900',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  }
});
