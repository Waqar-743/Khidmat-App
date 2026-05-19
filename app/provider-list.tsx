import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Elevation, BorderRadius } from '../src/constants';
import { ProviderCard } from '../src/components/ProviderCard';
import { getProvidersByCategory } from '../src/data/providers';
import { useAgentPipeline } from '../src/hooks/useAgentPipeline';

export default function ProviderListScreen() {
  const router = useRouter();
  const { startPipeline, pipelineState } = useAgentPipeline();
  const [showProviders, setShowProviders] = useState(false);
  const providers = getProvidersByCategory('AC'); // Mock initial filter

  useEffect(() => {
    const runAgents = async () => {
      await startPipeline(); // Runs FAHAM -> DHOOND -> BHAROSA
      setShowProviders(true);
    };
    runAgents();
  }, []);

  const handleBook = (providerId: string) => {
    // Nav to negotiation S7
    router.push({ pathname: '/negotiation', params: { providerId } });
  };

  if (!showProviders) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="search" size={48} color={Colors.primary} />
        <Text style={styles.loadingText}>Dhoond raha hai...</Text>
        <Text style={styles.loadingSubtext}>Analyzing {pipelineState}...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.onPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Select Provider</Text>
          <Text style={styles.headerSubtitle}>AC Technicians near G-13</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color={Colors.onPrimary} />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={providers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <ProviderCard 
            provider={item} 
            isTopRecommendation={index === 0} 
            onPressBook={() => handleBook(item.id)}
            onPressProfile={() => {}} // would open S6
          />
        )}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.resultCount}>{providers.length} providers found</Text>
            <View style={styles.sortPill}>
              <Text style={styles.sortText}>Sorted by Trust Score</Text>
              <MaterialIcons name="keyboard-arrow-down" size={16} color={Colors.onSurfaceVariant} />
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    marginTop: Spacing.md,
  },
  loadingSubtext: {
    ...Typography.codeSm,
    color: Colors.outline,
    marginTop: Spacing.sm,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56, // StatusBar height approx
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
    ...Elevation.sm,
  },
  backButton: {
    padding: Spacing.sm,
  },
  filterButton: {
    padding: Spacing.sm,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  headerTitle: {
    ...Typography.headlineMd,
    color: Colors.onPrimary,
  },
  headerSubtitle: {
    ...Typography.bodyMd,
    color: Colors.primaryFixedDim,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 100, // Safe area for bottom tabs
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resultCount: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  sortText: {
    ...Typography.codeSm,
    color: Colors.onSurfaceVariant,
  },
});
