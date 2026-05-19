import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, Platform, StatusBar, FlatList,
} from 'react-native';
import Animated, {
  FadeInDown, useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, AGENT_CONFIGS } from '../../src/constants/Colors';
import { Spacing, BorderRadius } from '../../src/constants';
import { ProviderCard } from '../../src/components/ProviderCard';
import { providers } from '../../src/data/providers';
import { Provider } from '../../src/types';
import { PulsingDot } from '../../src/components/PulsingDot';

interface ServiceCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  count: number;
}

const getCount = (label: string) => providers.filter(p => p.category.toLowerCase().includes(label.toLowerCase().split(' ')[0])).length;

const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'ac', label: 'AC Repair', icon: 'ac-unit', color: Colors.agentFaham, bg: Colors.agentFahamBg, count: getCount('AC Repair') },
  { id: 'plumber', label: 'Plumbing', icon: 'plumbing', color: Colors.agentBharosa, bg: Colors.agentBharosaBg, count: getCount('Plumbing') },
  { id: 'electric', label: 'Electrician', icon: 'electrical-services', color: Colors.agentDhoond, bg: Colors.agentDhoondBg, count: getCount('Electrician') },
  { id: 'clean', label: 'Cleaning', icon: 'cleaning-services', color: Colors.agentBook, bg: Colors.agentBookBg, count: getCount('Cleaning') },
  { id: 'beauty', label: 'Beautician', icon: 'face', color: Colors.agentMolBhaav, bg: Colors.agentMolBhaavBg, count: getCount('Beautician') },
  { id: 'carpenter', label: 'Carpenter', icon: 'handyman', color: Colors.agentYaadDahani, bg: Colors.agentYaadDahaniBg, count: getCount('Carpenter') },
  { id: 'tutor', label: 'Tutor', icon: 'school', color: Colors.agentFaham, bg: Colors.agentFahamBg, count: getCount('Tutor') },
  { id: 'painter', label: 'Painter', icon: 'format-paint', color: Colors.agentBharosa, bg: Colors.agentBharosaBg, count: getCount('Painter') },
  { id: 'mechanic', label: 'Mechanic', icon: 'car-repair', color: Colors.agentDhoond, bg: Colors.agentDhoondBg, count: getCount('Mechanic') },
  { id: 'pest', label: 'Pest Control', icon: 'pest-control', color: Colors.agentMolBhaav, bg: Colors.agentMolBhaavBg, count: getCount('Pest Control') },
  { id: 'chef', label: 'Home Chef', icon: 'restaurant', color: Colors.agentBook, bg: Colors.agentBookBg, count: getCount('Home Chef') },
];

export default function ServicesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const dhoondConfig = AGENT_CONFIGS['DHOOND'];

  const filteredProviders = selectedCategory
    ? providers.filter(p => {
        const cat = SERVICE_CATEGORIES.find(c => c.id === selectedCategory);
        return cat ? p.category.toLowerCase().includes(cat.label.toLowerCase().split(' ')[0]) : true;
      })
    : providers;

  const searchFiltered = searchQuery
    ? filteredProviders.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredProviders;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* DHOOND agent banner */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.agentBanner}>
            <View style={[styles.agentBannerIcon, { backgroundColor: dhoondConfig.color }]}>
              <MaterialIcons name={dhoondConfig.icon as any} size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.agentBannerTitle, { color: dhoondConfig.color }]}>DHOOND Agent Active</Text>
              <Text style={styles.agentBannerSub}>{providers.length} verified technicians in your area</Text>
            </View>
            <PulsingDot color={dhoondConfig.color} size={8} />
          </Animated.View>

          {/* Search bar */}
          <Animated.View entering={FadeInDown.duration(400).delay(80)} style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color={Colors.onSurfaceVariant} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services or providers..."
              placeholderTextColor={Colors.onSurfaceVariant + '80'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={18} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Service category grid */}
          <Animated.View entering={FadeInDown.duration(400).delay(120)}>
            <Text style={styles.sectionTitle}>Browse Services</Text>
            <View style={styles.categoryGrid}>
              {SERVICE_CATEGORIES.map((cat, idx) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    { backgroundColor: cat.bg, borderColor: cat.color + '30' },
                    selectedCategory === cat.id && { borderColor: cat.color, borderWidth: 2 },
                  ]}
                  onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                    <MaterialIcons name={cat.icon as any} size={18} color="#fff" />
                  </View>
                  <Text style={[styles.categoryLabel, { color: cat.color }]}>{cat.label}</Text>
                  <Text style={styles.categoryCount}>{cat.count} providers</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Provider list */}
          <View style={styles.providersSection}>
            <View style={styles.providersSectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedCategory
                  ? `${SERVICE_CATEGORIES.find(c => c.id === selectedCategory)?.label} Providers`
                  : 'All Verified Providers'}
              </Text>
              <View style={[styles.countBadge, { backgroundColor: dhoondConfig.color }]}>
                <Text style={styles.countText}>{searchFiltered.length}</Text>
              </View>
            </View>

            {searchFiltered.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="search-off" size={40} color={Colors.outlineVariant} />
                <Text style={styles.emptyText}>No providers found</Text>
              </View>
            ) : (
              searchFiltered.map((provider, idx) => (
                <Animated.View
                  key={provider.id}
                  entering={FadeInDown.duration(350).delay(160 + idx * 60)}
                >
                  <ProviderCard
                    provider={provider}
                    rank={idx + 1}
                    isTopRecommendation={idx === 0 && !selectedCategory && !searchQuery}
                    onPressBook={() => router.push('/booking-summary')}
                    onPressProfile={() => router.push('/agent-logs')}
                  />
                </Animated.View>
              ))
            )}
          </View>
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
  agentBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.agentDhoondBg,
    borderRadius: BorderRadius.xl, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.agentDhoond + '30',
    marginBottom: Spacing.md,
  },
  agentBannerIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  agentBannerTitle: { fontSize: 14, fontWeight: '800' },
  agentBannerSub: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 1 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.full, borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    gap: Spacing.sm, marginBottom: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  searchInput: {
    flex: 1, fontSize: 15, color: Colors.onSurface,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: '800', color: Colors.onSurface,
    marginBottom: Spacing.md,
  },
  categoryGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  categoryCard: {
    width: '22%', alignItems: 'center',
    paddingVertical: Spacing.md, borderRadius: BorderRadius.xl,
    borderWidth: 1, gap: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  categoryIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  categoryLabel: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  categoryCount: { fontSize: 9, color: Colors.onSurfaceVariant },
  providersSection: {},
  providersSectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: Spacing.md,
  },
  countBadge: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  countText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: Spacing.md },
  emptyText: { fontSize: 14, color: Colors.onSurfaceVariant },
});
