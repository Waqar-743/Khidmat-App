import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  withSequence, withRepeat, Easing, FadeInDown,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, AGENT_CONFIGS } from '../constants/Colors';
import { Spacing, BorderRadius } from '../constants';
import { BookingReceipt as ReceiptType } from '../types';
import { AnimatedCounter } from './AnimatedCounter';

interface BookingReceiptProps {
  receipt: ReceiptType;
  onViewBookings?: () => void;
  onShare?: () => void;
}

export const BookingReceipt: React.FC<BookingReceiptProps> = ({
  receipt,
  onViewBookings,
  onShare,
}) => {
  const bookConfig = AGENT_CONFIGS['BOOK'];

  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.94);
  const ringScale = useSharedValue(0.8);
  const ringOpacity = useSharedValue(0.6);

  useEffect(() => {
    setTimeout(() => {
      cardScale.value = withSpring(1, { damping: 14, stiffness: 100 });
      checkScale.value = withSpring(1, { damping: 10, stiffness: 120 });
      checkOpacity.value = withTiming(1, { duration: 300 });
      // Ripple rings
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1.6, { duration: 1000, easing: Easing.out(Easing.ease) }),
          withTiming(0.8, { duration: 0 }),
        ), 3, false,
      );
      ringOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) }),
          withTiming(0.5, { duration: 0 }),
        ), 3, false,
      );
    }, 150);
  }, []);

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: cardScale.value }] }));
  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }], opacity: checkOpacity.value,
  }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }], opacity: ringOpacity.value,
  }));

  const handleCall = () => {
    Linking.openURL(`tel:${receipt.provider.phone}`);
  };

  const handleWhatsApp = () => {
    const num = receipt.provider.phone.replace(/\s+/g, '').replace('+', '');
    Linking.openURL(`https://wa.me/${num}`);
  };

  return (
    <Animated.View style={[styles.wrapper, cardStyle]}>

      {/* Confirmation checkmark hero */}
      <View style={styles.checkHero}>
        <Animated.View style={[styles.ring, { borderColor: bookConfig.color }, ringStyle]} />
        <Animated.View style={[styles.checkCircle, { backgroundColor: bookConfig.color }, checkStyle]}>
          <MaterialIcons name="check" size={30} color="#fff" />
        </Animated.View>
      </View>

      {/* Main receipt card */}
      <View style={styles.card}>
        {/* Header banner */}
        <View style={[styles.header, { backgroundColor: bookConfig.color }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.agentPill, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <MaterialIcons name={bookConfig.icon as any} size={12} color="#fff" />
              <Text style={styles.agentPillText}>{bookConfig.name}</Text>
            </View>
            <Text style={styles.confirmedText}>BOOKING CONFIRMED</Text>
            <Text style={styles.bookingIdText}>{receipt.bookingId}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.savedLabel}>You saved</Text>
            <AnimatedCounter
              from={0}
              to={receipt.savedAmount}
              prefix="Rs. "
              duration={1200}
              style={styles.savedAmount}
            />
          </View>
        </View>

        {/* Service + Provider */}
        <View style={styles.body}>
          <Text style={styles.serviceName}>{receipt.service}</Text>
          <View style={styles.providerRow}>
            <View style={[styles.providerAvatar, { borderColor: bookConfig.color + '50' }]}>
              <Text style={[styles.providerInitials, { color: bookConfig.color }]}>
                {receipt.provider.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.providerName}>{receipt.provider.name}</Text>
              <Text style={styles.providerPhone}>{receipt.provider.phone}</Text>
            </View>
            <View style={[styles.verifiedBadge, { backgroundColor: bookConfig.color + '15', borderColor: bookConfig.color + '30' }]}>
              <MaterialIcons name="verified" size={12} color={bookConfig.color} />
              <Text style={[styles.verifiedText, { color: bookConfig.color }]}>Verified</Text>
            </View>
          </View>

          {/* Details grid */}
          <View style={styles.detailsGrid}>
            <DetailRow icon="location-on" label="Location" value={receipt.location} color={bookConfig.color} />
            <DetailRow icon="calendar-today" label="Date" value={receipt.date} color={bookConfig.color} />
            <DetailRow icon="schedule" label="Time" value={receipt.time} color={bookConfig.color} />
          </View>

          {/* Perforated divider */}
          <View style={styles.perforation}>
            <View style={[styles.circle, styles.circleLeft]} />
            {Array.from({ length: 18 }).map((_, i) => (
              <View key={i} style={[styles.dash, { backgroundColor: bookConfig.color + '30' }]} />
            ))}
            <View style={[styles.circle, styles.circleRight]} />
          </View>

          {/* Pricing section */}
          <View style={styles.pricing}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Original Price</Text>
              <Text style={styles.priceStrike}>Rs. {receipt.originalPrice.toLocaleString()}</Text>
            </View>
            <View style={styles.priceRow}>
              <View style={styles.molBhaavChip}>
                <MaterialIcons name="handshake" size={10} color={Colors.agentMolBhaav} />
                <Text style={styles.molBhaavText}>MOL-BHAAV Discount</Text>
              </View>
              <Text style={[styles.discount, { color: bookConfig.color }]}>
                - Rs. {receipt.savedAmount.toLocaleString()}
              </Text>
            </View>
            <View style={[styles.totalRow, { borderTopColor: bookConfig.color + '30' }]}>
              <Text style={styles.totalLabel}>Total</Text>
              <AnimatedCounter
                from={receipt.originalPrice}
                to={receipt.finalPrice}
                prefix="Rs. "
                duration={1400}
                style={[styles.totalValue, { color: bookConfig.color }]}
              />
            </View>
          </View>
        </View>

        {/* Quick action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.agentBharosaBg, borderColor: Colors.agentBharosa + '30' }]} onPress={handleCall}>
            <MaterialIcons name="call" size={18} color={Colors.agentBharosa} />
            <Text style={[styles.actionText, { color: Colors.agentBharosa }]}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.agentDhoondBg, borderColor: Colors.agentDhoond + '30' }]} onPress={handleWhatsApp}>
            <MaterialIcons name="chat" size={18} color={Colors.agentDhoond} />
            <Text style={[styles.actionText, { color: Colors.agentDhoond }]}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.agentFahamBg, borderColor: Colors.agentFaham + '30' }]} onPress={onShare}>
            <MaterialIcons name="share" size={18} color={Colors.agentFaham} />
            <Text style={[styles.actionText, { color: Colors.agentFaham }]}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Track button */}
        <TouchableOpacity
          style={[styles.trackBtn, { backgroundColor: bookConfig.color }]}
          onPress={onViewBookings}
        >
          <MaterialIcons name="my-location" size={18} color="#fff" />
          <Text style={styles.trackBtnText}>Track Live</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

function DetailRow({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={styles.detailRow}>
      <View style={[styles.detailIcon, { backgroundColor: color + '15' }]}>
        <MaterialIcons name={icon as any} size={14} color={color} />
      </View>
      <View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.md },
  checkHero: { alignItems: 'center', marginBottom: -28, zIndex: 2 },
  ring: {
    position: 'absolute',
    width: 80, height: 80, borderRadius: 40, borderWidth: 2,
  },
  checkCircle: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.agentBook, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.outlineVariant,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 6,
  },
  header: {
    paddingTop: 36, paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerLeft: {},
  agentPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 99, marginBottom: 6,
  },
  agentPillText: { fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  confirmedText: { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  bookingIdText: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2, fontFamily: 'monospace' },
  headerRight: { alignItems: 'flex-end' },
  savedLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.5 },
  savedAmount: { fontSize: 20, fontWeight: '900', color: '#fff' },
  body: { padding: Spacing.lg },
  serviceName: { fontSize: 20, fontWeight: '800', color: Colors.onSurface, marginBottom: Spacing.sm },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.gutter, marginBottom: Spacing.md },
  providerAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  providerInitials: { fontSize: 13, fontWeight: '900' },
  providerName: { fontSize: 14, fontWeight: '700', color: Colors.onSurface },
  providerPhone: { fontSize: 11, color: Colors.onSurfaceVariant },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    marginLeft: 'auto', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 99, borderWidth: 1,
  },
  verifiedText: { fontSize: 10, fontWeight: '700' },
  detailsGrid: { gap: Spacing.sm, marginBottom: Spacing.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.gutter },
  detailIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  detailLabel: { fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 0.3 },
  detailValue: { fontSize: 13, fontWeight: '600', color: Colors.onSurface },
  perforation: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: -Spacing.lg, marginBottom: Spacing.md, position: 'relative',
  },
  circle: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.background, zIndex: 1,
  },
  circleLeft: { marginLeft: -10 },
  circleRight: { marginRight: -10 },
  dash: { flex: 1, height: 2, marginHorizontal: 1 },
  pricing: { gap: Spacing.sm },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 13, color: Colors.onSurfaceVariant },
  priceStrike: { fontSize: 13, color: Colors.error, textDecorationLine: 'line-through' },
  molBhaavChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.agentMolBhaavBg,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99,
  },
  molBhaavText: { fontSize: 11, color: Colors.agentMolBhaav, fontWeight: '600' },
  discount: { fontSize: 13, fontWeight: '700' },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Spacing.sm, marginTop: Spacing.xs, borderTopWidth: 1,
  },
  totalLabel: { fontSize: 15, fontWeight: '800', color: Colors.onSurface },
  totalValue: { fontSize: 22, fontWeight: '900' },
  actions: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
  },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 5, paddingVertical: 11,
    borderRadius: BorderRadius.button, borderWidth: 1,
  },
  actionText: { fontSize: 12, fontWeight: '700' },
  trackBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: Spacing.lg, marginBottom: Spacing.lg,
    paddingVertical: 14, borderRadius: BorderRadius.full,
    shadowColor: Colors.agentBook, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  trackBtnText: { fontSize: 15, fontWeight: '800', color: '#fff', flex: 1, textAlign: 'center' },
});
