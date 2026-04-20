import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store';
import { Colors } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_DESKTOP = SCREEN_WIDTH > 1024;

export default function AnalyticsScreen() {
  const router = useRouter();
  const { theme, bookings } = useStore();
  const isDark = theme === 'dark';

  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#050505' : '#F9FAFB' },
    card: { backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#1A1A1A' : '#E5E7EB' },
    text: { color: isDark ? '#FFFFFF' : '#111827' },
    subText: { color: isDark ? '#9CA3AF' : '#6B7280' },
  };

  // Mock data for charts (Simulating real metrics)
  const monthlyStats = [
    { month: 'Jan', revenue: 4500, profit: 675 },
    { month: 'Feb', revenue: 5200, profit: 780 },
    { month: 'Mar', revenue: 4800, profit: 720 },
    { month: 'Apr', revenue: 6100, profit: 915 },
  ];

  const maxRevenue = Math.max(...monthlyStats.map(s => s.revenue));

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[styles.header, dynamicStyles.card]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={dynamicStyles.text.color} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, dynamicStyles.text]}>Imperial Analytics</Text>
          <Text style={[styles.headerSub, dynamicStyles.subText]}>Real-time performance metrics</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Revenue Chart (Visualized with simple bars for maximum performance) */}
        <View style={[styles.chartCard, dynamicStyles.card]}>
          <Text style={[styles.cardTitle, dynamicStyles.text]}>Revenue Performance (2026)</Text>
          <View style={styles.chartContainer}>
            {monthlyStats.map((item, index) => (
              <View key={index} style={styles.chartColumn}>
                <View style={[styles.chartBar, { height: (item.revenue / maxRevenue) * 150, backgroundColor: Colors.primary }]} />
                <Text style={[styles.chartLabel, dynamicStyles.subText]}>{item.month}</Text>
                <Text style={[styles.chartValue, dynamicStyles.text]}>${item.revenue}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.grid}>
          {/* Booking Sources */}
          <View style={[styles.gridCard, dynamicStyles.card]}>
            <Text style={[styles.cardTitle, dynamicStyles.text]}>Booking Sources</Text>
            {[
              { label: 'Direct App', value: '65%', color: '#10B981' },
              { label: 'Sub-Brokers', value: '25%', color: '#6366F1' },
              { label: 'External API', value: '10%', color: '#F59E0B' },
            ].map((source, i) => (
              <View key={i} style={styles.sourceRow}>
                <View style={styles.sourceInfo}>
                  <View style={[styles.colorDot, { backgroundColor: source.color }]} />
                  <Text style={[styles.sourceLabel, dynamicStyles.text]}>{source.label}</Text>
                </View>
                <Text style={[styles.sourceValue, dynamicStyles.text]}>{source.value}</Text>
              </View>
            ))}
          </View>

          {/* User Retention */}
          <View style={[styles.gridCard, dynamicStyles.card]}>
            <Text style={[styles.cardTitle, dynamicStyles.text]}>Node Latency</Text>
            <View style={styles.latencyContainer}>
              <View style={styles.latencyCircle}>
                <Text style={[styles.latencyValue, { color: '#10B981' }]}>12ms</Text>
                <Text style={[styles.latencyLabel, dynamicStyles.subText]}>Global Average</Text>
              </View>
              <Text style={[styles.latencyStatus, { color: '#10B981' }]}>● SYSTEM OPTIMIZED</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingHorizontal: 25, 
    paddingBottom: 25, 
    borderBottomWidth: 1 
  },
  backBtn: { marginRight: 20, padding: 8, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.03)' },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  headerSub: { fontSize: 13, marginTop: 2 },
  scrollContent: { padding: 25 },
  chartCard: { padding: 25, borderRadius: 24, borderWidth: 1, marginBottom: 25 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 30 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 200 },
  chartColumn: { alignItems: 'center', flex: 1 },
  chartBar: { width: 30, borderRadius: 8, marginBottom: 15 },
  chartLabel: { fontSize: 12, fontWeight: '600' },
  chartValue: { fontSize: 10, marginTop: 4, fontWeight: '700' },
  grid: { flexDirection: IS_DESKTOP ? 'row' : 'column', gap: 25 },
  gridCard: { flex: 1, padding: 25, borderRadius: 24, borderWidth: 1 },
  sourceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sourceInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  sourceLabel: { fontSize: 14, fontWeight: '600' },
  sourceValue: { fontSize: 14, fontWeight: '700' },
  latencyContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  latencyCircle: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    borderWidth: 8, 
    borderColor: '#10B98120', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  latencyValue: { fontSize: 24, fontWeight: '900' },
  latencyLabel: { fontSize: 10, fontWeight: '700', marginTop: 4 },
  latencyStatus: { marginTop: 20, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
});
