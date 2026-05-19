import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '../src/constants';
import { useChatMessages } from '../src/hooks/useChatMessages';
import { BookingReceipt } from '../src/types';

const MOCK_RECEIPT = {
  bookingId: 'KHD-2026-0391',
  service: 'AC Technician',
  provider: {
    id: 'P001',
    name: 'Ali AC Services',
    category: 'AC Repair & Maintenance' as any,
    location: 'G-13, Islamabad',
    lat: 33.6844,
    lng: 73.0479,
    rating: 4.8,
    reviewCount: 120,
    completionRate: 0.98,
    responseTimeMinutes: 12,
    communityVouches: 14,
    cancellationsLast7d: 0,
    priceMin: 1500,
    priceMax: 2500,
    availableSlots: ['10:00'],
    trustScore: 87,
    phone: '+92 300 1234567',
  },
  location: 'G-13, Islamabad',
  date: 'Kal, 15 May 2026',
  time: '10:00 AM - 12:00 PM',
  originalPrice: 2800,
  finalPrice: 2200,
  savedAmount: 600,
} as any as BookingReceipt;

export default function BookingSummaryScreen() {
  const router = useRouter();
  const { addReceipt } = useChatMessages();

  const handleConfirm = () => {
    // Inject receipt into chat
    addReceipt(MOCK_RECEIPT);
    // Go back to chat
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
          <View style={styles.headerAvatar}>
            <MaterialIcons name="smart-toy" size={20} color={Colors.primary} />
          </View>
          <Text style={styles.headerTitle}>KHIDMAT Agent</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="more-vert" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.mainTitle}>Review Booking</Text>
          <Text style={styles.subtitle}>
            Please confirm your service details before proceeding.
          </Text>

          <View style={styles.receiptContainer}>
            <View style={styles.receiptHeader}>
              <MaterialIcons name="receipt-long" size={20} color={Colors.primary} />
              <Text style={styles.receiptTitle}>Booking Summary</Text>
            </View>

            <View style={styles.receiptBody}>
              <View style={styles.row}>
                <Text style={styles.label}>Service</Text>
                <Text style={styles.value}>AC Technician</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Location</Text>
                <Text style={styles.value}>G-13, Islamabad</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>Kal, 15 May 2026</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Time</Text>
                <Text style={styles.value}>10:00 AM – 12:00 PM</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <View style={styles.totalValueContainer}>
                  <View style={styles.priceRow}>
                    <Text style={styles.strikethrough}>Rs. 2,800</Text>
                    <Text style={styles.totalValue}>Rs. 2,200</Text>
                  </View>
                  <View style={styles.savingsBadge}>
                    <MaterialIcons name="savings" size={12} color={Colors.primary} />
                    <Text style={styles.savingsText}>saved Rs. 600</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Provider Mini Card */}
          <View style={styles.providerCard}>
            <View style={styles.avatar}>
              <MaterialIcons name="person-outline" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.providerName}>Ali AC Services</Text>
              <View style={styles.ratingRow}>
                <MaterialIcons name="star-border" size={14} color={Colors.tertiaryContainer} />
                <Text style={styles.ratingText}>4.8 (120+ reviews)</Text>
              </View>
            </View>
          </View>

          {/* Status Checklist */}
          <View style={styles.statusBox}>
            <Text style={styles.statusHeader}>ORCHESTRATOR STATUS</Text>
            <View style={styles.statusItem}>
              <MaterialIcons name="check-circle" size={20} color={Colors.primary} />
              <Text style={styles.statusText}>Slot blocked</Text>
            </View>
            <View style={styles.statusItem}>
              <MaterialIcons name="check-circle" size={20} color={Colors.primary} />
              <Text style={styles.statusText}>Provider notified</Text>
            </View>
            <View style={styles.statusItem}>
              <MaterialIcons name="radio-button-unchecked" size={20} color={Colors.primary} />
              <Text style={styles.statusText}>Confirmation generating...</Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleConfirm}>
            <Text style={styles.primaryButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>Wapas jao</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#FCF8FF', // Light purple
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    ...Elevation.sm,
  },
  iconButton: {
    padding: Spacing.sm,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.onPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryContainer,
  },
  headerTitle: {
    flex: 1,
    ...Typography.headlineMd,
    color: Colors.onPrimary,
    marginLeft: Spacing.gutter,
    fontSize: 18,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  mainTitle: {
    ...Typography.headlineLgMobile,
    color: Colors.primaryContainer, // Dark Green
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.xl,
  },
  receiptContainer: {
    backgroundColor: Colors.white, // White inside receipt
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: '#E8E5FF',
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Elevation.sm,
  },
  receiptHeader: {
    backgroundColor: '#F0FDF4', // Very light green background
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  receiptTitle: {
    ...Typography.headlineMd,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  receiptBody: {
    padding: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  value: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },
  divider: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginVertical: Spacing.sm,
    borderRadius: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Centered alignment to match screenshot
    marginTop: Spacing.md,
  },
  totalLabel: {
    ...Typography.bodyLg,
    color: Colors.onSurface,
  },
  totalValueContainer: {
    alignItems: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  strikethrough: {
    ...Typography.codeSm,
    color: Colors.outline,
    textDecorationLine: 'line-through',
  },
  totalValue: {
    ...Typography.headlineLgMobile,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B0EFDB', // secondaryFixed light green
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    gap: 4,
    marginTop: 4,
  },
  savingsText: {
    ...Typography.codeSm,
    color: Colors.primary,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: '#E8E5FF',
    marginBottom: Spacing.lg,
    ...Elevation.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8E5FF', // light purple background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  providerName: {
    ...Typography.bodyLg,
    color: Colors.onSurface,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  statusBox: {
    backgroundColor: '#E8E5FF', // Light purple
    padding: Spacing.md,
    borderRadius: BorderRadius.card,
  },
  statusHeader: {
    ...Typography.codeSm,
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  statusText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: '#FCF8FF', // Light purple
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  primaryButtonText: {
    ...Typography.bodyLg,
    color: Colors.white,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    paddingVertical: 14,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    ...Typography.bodyLg,
    color: Colors.primary,
  },
});
