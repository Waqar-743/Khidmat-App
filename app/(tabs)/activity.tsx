import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Platform, StatusBar,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, AGENT_CONFIGS } from '../../src/constants/Colors';
import { Spacing, BorderRadius } from '../../src/constants';
import { PulsingDot } from '../../src/components/PulsingDot';

type Status = 'Completed' | 'In Progress' | 'Cancelled';

interface HistoryItem {
  id: string;
  service: string;
  provider: string;
  date: string;
  amount: number | null;
  status: Status;
  icon: string;
  bookingId: string;
}

const HISTORY: HistoryItem[] = [
  { id: '1', service: 'AC Repair & Maintenance', provider: 'Ali AC Services', date: 'Today, 2:00 PM', amount: 2200, status: 'In Progress', icon: 'ac-unit', bookingId: 'KHD-2026-0391' },
  { id: '2', service: 'Plumbing', provider: 'Ali Ahmed', date: '12 May 2026', amount: 1100, status: 'Completed', icon: 'plumbing', bookingId: 'KHD-2026-0384' },
  { id: '3', service: 'Electrician', provider: 'Bilal Hussain', date: '8 May 2026', amount: 1500, status: 'Completed', icon: 'electrical-services', bookingId: 'KHD-2026-0371' },
  { id: '4', service: 'Deep Cleaning', provider: 'CleanSweep Bros', date: '2 May 2026', amount: 4500, status: 'Completed', icon: 'cleaning-services', bookingId: 'KHD-2026-0355' },
  { id: '5', service: 'Carpenter', provider: 'Ustad Carpenter Works', date: '24 Apr 2026', amount: null, status: 'Cancelled', icon: 'handyman', bookingId: 'KHD-2026-0340' },
];

const STATUS_CONFIG: Record<Status, { color: string; bg: string; label: string; icon: string }> = {
  'Completed': { color: Colors.agentBharosa, bg: Colors.agentBharosaBg, label: 'Completed', icon: 'check-circle' },
  'In Progress': { color: Colors.agentDhoond, bg: Colors.agentDhoondBg, label: 'In Progress', icon: 'sync' },
  'Cancelled': { color: Colors.error, bg: Colors.errorContainer, label: 'Cancelled', icon: 'cancel' },
};

const FILTER_TABS: Array<'All' | Status> = ['All', 'In Progress', 'Completed', 'Cancelled'];

export default function ActivityScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<typeof FILTER_TABS[number]>('All');

  const yaadConfig = AGENT_CONFIGS['YAAD-DAHANI'];
  const bookConfig = AGENT_CONFIGS['BOOK'];

  const filtered = activeFilter === 'All'
    ? HISTORY
    : HISTORY.filter(h => h.status === activeFilter);

  const totalSpent = HISTORY
    .filter(h => h.status === 'Completed' && h.amount)
    .reduce((sum, h) => sum + (h.amount || 0), 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Stats banner */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.statsBanner}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{HISTORY.filter(h => h.status === 'Completed').length}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{HISTORY.filter(h => h.status === 'In Progress').length}</Text>
              <Text style={[styles.statLabel, { color: Colors.agentDhoond }]}>In Progress</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Rs. {totalSpent.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </Animated.View>

          {/* Active booking CTA */}
          {HISTORY.some(h => h.status === 'In Progress') && (
            <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.activeCard}>
              <View style={styles.activeLeft}>
                <PulsingDot color={Colors.agentDhoond} size={8} />
                <View>
                  <Text style={styles.activeTitle}>AC Repair in Progress</Text>
                  <Text style={styles.activeSubtitle}>Ali is 1.2 km away · ETA 12 min</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.trackBtn, { backgroundColor: Colors.agentDhoond }]}
                onPress={() => router.push('/service-timeline')}
              >
                <MaterialIcons name="my-location" size={14} color="#fff" />
                <Text style={styles.trackBtnText}>Track</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Filter chips */}
          <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.filterRow}>
            {FILTER_TABS.map(tab => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.filterChip,
                  activeFilter === tab && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(tab)}
              >
                <Text style={[
                  styles.filterChipText,
                  activeFilter === tab && styles.filterChipTextActive,
                ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* History list */}
          {filtered.map((item, idx) => {
            const sc = STATUS_CONFIG[item.status];
            return (
              <Animated.View
                key={item.id}
                entering={FadeInDown.duration(350).delay(200 + idx * 70)}
              >
                <TouchableOpacity
                  style={styles.historyCard}
                  onPress={() => item.status === 'In Progress' && router.push('/service-timeline')}
                  activeOpacity={0.8}
                >
                  {/* Icon column */}
                  <View style={[styles.serviceIcon, { backgroundColor: sc.bg, borderColor: sc.color + '40' }]}>
                    <MaterialIcons name={item.icon as any} size={22} color={sc.color} />
                  </View>

                  {/* Content */}
                  <View style={styles.cardContent}>
                    <View style={styles.cardTop}>
                      <Text style={styles.serviceName} numberOfLines={1}>{item.service}</Text>
                      <View style={[styles.statusChip, { backgroundColor: sc.bg }]}>
                        {item.status === 'In Progress' && <PulsingDot color={sc.color} size={5} />}
                        {item.status !== 'In Progress' && <MaterialIcons name={sc.icon as any} size={10} color={sc.color} />}
                        <Text style={[styles.statusText, { color: sc.color }]}>{sc.label}</Text>
                      </View>
                    </View>
                    <Text style={styles.providerText}>{item.provider}</Text>
                    <View style={styles.cardBottom}>
                      <View style={styles.dateRow}>
                        <MaterialIcons name="schedule" size={12} color={Colors.onSurfaceVariant} />
                        <Text style={styles.dateText}>{item.date}</Text>
                      </View>
                      {item.amount && (
                        <Text style={[styles.amountText, { color: sc.color }]}>
                          Rs. {item.amount.toLocaleString()}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.bookingIdText}>{item.bookingId}</Text>
                  </View>

                  {/* Chevron */}
                  <MaterialIcons name="chevron-right" size={20} color={Colors.onSurfaceVariant} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}

          {/* YAAD-DAHANI footer */}
          <Animated.View entering={FadeInDown.duration(400).delay(500)} style={styles.yaadCard}>
            <View style={[styles.yaadIcon, { backgroundColor: yaadConfig.color }]}>
              <MaterialIcons name="notifications-active" size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.yaadTitle, { color: yaadConfig.color }]}>YAAD-DAHANI Agent</Text>
              <Text style={styles.yaadSubtitle}>Monitoring all your active bookings</Text>
            </View>
            <View style={[styles.yaadBadge, { backgroundColor: yaadConfig.color }]}>
              <Text style={styles.yaadBadgeText}>ACTIVE</Text>
            </View>
          </Animated.View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: 100 },
  statsBanner: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-around',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '900', color: Colors.onPrimary },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },
  activeCard: {
    backgroundColor: Colors.agentDhoondBg, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.agentDhoond + '40',
    padding: Spacing.md, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  activeLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  activeTitle: { fontSize: 14, fontWeight: '700', color: Colors.agentDhoond },
  activeSubtitle: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 1 },
  trackBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99,
  },
  trackBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  filterRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md, flexWrap: 'wrap' },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 99,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: Colors.outlineVariant,
  },
  filterChipActive: {
    backgroundColor: Colors.primary, borderColor: Colors.primary,
  },
  filterChipText: { fontSize: 13, color: Colors.onSurfaceVariant, fontWeight: '500' },
  filterChipTextActive: { color: Colors.onPrimary, fontWeight: '700' },
  historyCard: {
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.outlineVariant,
    padding: Spacing.md, flexDirection: 'row',
    alignItems: 'center', gap: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
  },
  serviceIcon: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, flexShrink: 0,
  },
  cardContent: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  serviceName: { fontSize: 14, fontWeight: '700', color: Colors.onSurface, flex: 1, marginRight: 8 },
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99,
  },
  statusText: { fontSize: 10, fontWeight: '700' },
  providerText: { fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 4 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  dateText: { fontSize: 11, color: Colors.onSurfaceVariant },
  amountText: { fontSize: 14, fontWeight: '800' },
  bookingIdText: { fontSize: 10, color: Colors.onSurfaceVariant + '80', marginTop: 3, fontFamily: 'monospace' },
  yaadCard: {
    backgroundColor: Colors.agentYaadDahaniBg, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.agentYaadDahani + '30',
    padding: Spacing.md, flexDirection: 'row',
    alignItems: 'center', gap: Spacing.md, marginTop: Spacing.sm,
  },
  yaadIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  yaadTitle: { fontSize: 14, fontWeight: '700' },
  yaadSubtitle: { fontSize: 12, color: Colors.onSurfaceVariant },
  yaadBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  yaadBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 1 },
});
