import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, AGENT_CONFIGS } from '../constants/Colors';
import { Spacing, BorderRadius } from '../constants';
import { Provider } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import { PulsingDot } from './PulsingDot';

interface ProviderCardProps {
  provider: Provider;
  isTopRecommendation?: boolean;
  rank?: number;
  onPressProfile?: () => void;
  onPressBook?: () => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  isTopRecommendation,
  rank = 1,
  onPressProfile,
  onPressBook,
}) => {
  const bharosaConfig = AGENT_CONFIGS['BHAROSA'];
  const cardScale = useSharedValue(0.96);
  const cardOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    const delay = rank * 120;
    setTimeout(() => {
      cardScale.value = withSpring(1, { damping: 14, stiffness: 120 });
      cardOpacity.value = withTiming(1, { duration: 350 });
      if (isTopRecommendation) {
        glowOpacity.value = withTiming(1, { duration: 500 });
      }
    }, delay);
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const trustLevel = provider.trustScore >= 80 ? 'HIGH' : provider.trustScore >= 50 ? 'MED' : 'LOW';
  const trustColor = trustLevel === 'HIGH' ? bharosaConfig.color : trustLevel === 'MED' ? Colors.agentDhoond : Colors.error;

  return (
    <Animated.View style={[styles.container, isTopRecommendation && styles.containerTop, cardStyle]}>
      {/* Top recommendation glow band */}
      {isTopRecommendation && (
        <View style={[styles.topBand, { backgroundColor: bharosaConfig.color }]}>
          <MaterialIcons name="auto-awesome" size={12} color="#fff" />
          <Text style={styles.topBandText}>BHAROSA's Top Pick</Text>
          <PulsingDot color="#fff" size={6} />
        </View>
      )}

      <View style={styles.body}>
        {/* Header row */}
        <View style={styles.headerRow}>
          {/* Avatar */}
          <View style={[styles.avatar, { backgroundColor: trustColor + '20', borderColor: trustColor + '40' }]}>
            <Text style={[styles.avatarText, { color: trustColor }]}>
              {provider.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </Text>
          </View>

          <View style={styles.nameBlock}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <View style={styles.metaRow}>
              <MaterialIcons name="location-on" size={12} color={Colors.onSurfaceVariant} />
              <Text style={styles.metaText}>{provider.location}</Text>
              <Text style={styles.dot}>·</Text>
              <MaterialIcons name="timer" size={12} color={Colors.onSurfaceVariant} />
              <Text style={styles.metaText}>{provider.responseTimeMinutes} min</Text>
            </View>
          </View>

          {/* Trust score badge */}
          <View style={[styles.trustBadge, { backgroundColor: trustColor + '15', borderColor: trustColor + '40' }]}>
            <AnimatedCounter
              from={0}
              to={provider.trustScore}
              suffix=""
              duration={900}
              style={[styles.trustScore, { color: trustColor }]}
            />
            <Text style={[styles.trustDenom, { color: trustColor }]}>/100</Text>
          </View>
        </View>

        {/* BHAROSA metrics card */}
        <View style={[styles.metricsCard, { borderColor: bharosaConfig.color + '25', backgroundColor: bharosaConfig.color + '08' }]}>
          <View style={styles.metricsHeader}>
            <View style={[styles.agentPill, { backgroundColor: bharosaConfig.color }]}>
              <MaterialIcons name="verified-user" size={10} color="#fff" />
              <Text style={styles.agentPillText}>BHAROSA Score</Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <MetricBox
              icon="check-circle-outline"
              value={`${Math.round(provider.completionRate * 100)}%`}
              label="COMPLETION"
              color={bharosaConfig.color}
              highlight
            />
            <MetricBox
              icon="timer"
              value={`${provider.responseTimeMinutes}m`}
              label="RESPONSE"
              color={Colors.agentDhoond}
            />
            <MetricBox
              icon="thumb-up-alt"
              value={`${provider.communityVouches}`}
              label="VOUCHES"
              color={Colors.agentMolBhaav}
            />
            <MetricBox
              icon="star"
              value={`${provider.rating}`}
              label="RATING"
              color={Colors.agentBook}
            />
          </View>

          {/* Red flags */}
          {provider.redFlags && provider.redFlags.length > 0 && (
            <View style={styles.redFlagBox}>
              <MaterialIcons name="warning" size={13} color={Colors.error} />
              <Text style={styles.redFlagText}>{provider.redFlags[0]}</Text>
            </View>
          )}

          {/* Price range */}
          <View style={styles.priceRow}>
            <MaterialIcons name="payments" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.priceText}>
              Est. Rs. {provider.priceMin.toLocaleString()} – {provider.priceMax.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.profileBtn} onPress={onPressProfile}>
            <Text style={styles.profileBtnText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bookBtn, { backgroundColor: bharosaConfig.color }]} onPress={onPressBook}>
            <MaterialIcons name="event-available" size={16} color="#fff" />
            <Text style={styles.bookBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

function MetricBox({ icon, value, label, color, highlight }: {
  icon: string; value: string; label: string; color: string; highlight?: boolean;
}) {
  return (
    <View style={[styles.metricBox, highlight && { backgroundColor: color + '18', borderColor: color + '40' }]}>
      <MaterialIcons name={icon as any} size={14} color={color} />
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  containerTop: {
    borderColor: Colors.agentBharosa + '60',
    shadowColor: Colors.agentBharosa,
    shadowOpacity: 0.15,
    elevation: 8,
  },
  topBand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: Spacing.md,
  },
  topBandText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  body: { padding: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.gutter, marginBottom: Spacing.md },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5,
  },
  avatarText: { fontSize: 16, fontWeight: '800' },
  nameBlock: { flex: 1 },
  providerName: { fontSize: 16, fontWeight: '700', color: Colors.onSurface, marginBottom: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 12, color: Colors.onSurfaceVariant },
  dot: { color: Colors.onSurfaceVariant, marginHorizontal: 2 },
  trustBadge: {
    flexDirection: 'row', alignItems: 'flex-end',
    borderRadius: BorderRadius.md, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  trustScore: { fontSize: 20, fontWeight: '900' },
  trustDenom: { fontSize: 11, fontWeight: '600', marginBottom: 2, marginLeft: 1 },
  metricsCard: {
    borderRadius: BorderRadius.lg, borderWidth: 1,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  metricsHeader: { marginBottom: Spacing.sm },
  agentPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99,
  },
  agentPillText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  metricsGrid: { flexDirection: 'row', gap: Spacing.sm },
  metricBox: {
    flex: 1, alignItems: 'center', paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md, borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
  },
  metricValue: { fontSize: 14, fontWeight: '800', marginTop: 3, marginBottom: 1 },
  metricLabel: { fontSize: 8, color: Colors.onSurfaceVariant, fontWeight: '600', letterSpacing: 0.5 },
  redFlagBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.errorContainer + '60', borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: 6, marginTop: Spacing.sm,
  },
  redFlagText: { fontSize: 11, color: Colors.error, flex: 1 },
  priceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginTop: Spacing.sm,
  },
  priceText: { fontSize: 12, color: Colors.onSurfaceVariant, fontWeight: '500' },
  footer: { flexDirection: 'row', gap: Spacing.sm },
  profileBtn: {
    flex: 1, backgroundColor: Colors.surfaceContainerHigh,
    paddingVertical: 12, borderRadius: BorderRadius.button,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.outlineVariant,
  },
  profileBtnText: { fontSize: 14, fontWeight: '700', color: Colors.onSurface },
  bookBtn: {
    flex: 1.2, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 12,
    borderRadius: BorderRadius.button, gap: 6,
    shadowColor: Colors.agentBharosa,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  bookBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
