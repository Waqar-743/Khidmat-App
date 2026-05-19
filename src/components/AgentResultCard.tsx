import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { AGENT_CONFIGS, AgentId, Colors } from '../constants/Colors';
import { Spacing, BorderRadius } from '../constants';
import { AnimatedCounter } from './AnimatedCounter';
import { Provider } from '../types';

interface AgentResultCardProps {
  agentId: AgentId;
  /** For DHOOND+BHAROSA results */
  providers?: Provider[];
  /** For MOL-BHAAV results */
  negotiation?: {
    providerQuote: number;
    counterOffer: number;
    finalPrice: number;
    saved: number;
    rounds?: Array<{ actor: 'agent' | 'provider'; amount: number; note: string }>;
  };
  summaryText?: string;
  onSelectProvider?: (provider: Provider) => void;
  onChooseBest?: () => void;
  onAcceptDeal?: () => void;
  onFindAnother?: () => void;
}

export const AgentResultCard: React.FC<AgentResultCardProps> = ({
  agentId,
  providers,
  negotiation,
  summaryText,
  onSelectProvider,
  onChooseBest,
  onAcceptDeal,
  onFindAnother,
}) => {
  const agent = AGENT_CONFIGS[agentId];
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 16, stiffness: 120 });
    opacity.value = withTiming(1, { duration: 400 });
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.card, { borderColor: agent.color + '40' }, animStyle]}>
      {/* Agent header strip */}
      <View style={[styles.header, { backgroundColor: agent.color + '18' }]}>
        <View style={[styles.agentIcon, { backgroundColor: agent.color }]}>
          <MaterialIcons name={agent.icon as any} size={14} color="#fff" />
        </View>
        <Text style={[styles.agentLabel, { color: agent.color }]}>{agent.name}</Text>
        <View style={[styles.doneChip, { backgroundColor: agent.color + '25' }]}>
          <MaterialIcons name="check-circle" size={12} color={agent.color} />
          <Text style={[styles.doneText, { color: agent.color }]}>Done</Text>
        </View>
      </View>

      {/* Negotiation display */}
      {negotiation && (
        <View style={styles.negBody}>
          <View style={styles.priceRow}>
            <View style={styles.priceCol}>
              <Text style={styles.priceLabel}>Provider Asked</Text>
              <Text style={styles.priceStrike}>Rs. {negotiation.providerQuote.toLocaleString()}</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color={Colors.outline} />
            <View style={styles.priceCol}>
              <Text style={styles.priceLabel}>You Pay</Text>
              <AnimatedCounter
                from={negotiation.providerQuote}
                to={negotiation.finalPrice}
                prefix="Rs. "
                duration={1200}
                style={[styles.priceValue, { color: agent.color }]}
              />
            </View>
          </View>
          <View style={[styles.savingsBadge, { backgroundColor: agent.color + '20', borderColor: agent.color + '40' }]}>
            <MaterialIcons name="savings" size={14} color={agent.color} />
            <Text style={[styles.savingsText, { color: agent.color }]}>
              You saved Rs. {negotiation.saved.toLocaleString()} via MOL-BHAAV!
            </Text>
          </View>
          {/* Action buttons for negotiation */}
          {(onAcceptDeal || onFindAnother) && (
            <View style={styles.actionRow}>
              {onFindAnother && (
                <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline, { borderColor: agent.color }]} onPress={onFindAnother}>
                  <MaterialIcons name="refresh" size={16} color={agent.color} />
                  <Text style={[styles.actionBtnText, { color: agent.color }]}>Find Another</Text>
                </TouchableOpacity>
              )}
              {onAcceptDeal && (
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: agent.color, flex: 1.5 }]} onPress={onAcceptDeal}>
                  <MaterialIcons name="check-circle" size={16} color="#fff" />
                  <Text style={[styles.actionBtnText, { color: '#fff' }]}>Accept Deal</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}

      {/* Provider list */}
      {providers && providers.length > 0 && (
        <View style={styles.providersBody}>
          {providers.slice(0, 3).map((p, idx) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.providerRow, idx === 0 && { backgroundColor: agent.color + '0F' }]}
              onPress={() => onSelectProvider?.(p)}
            >
              <View style={[styles.rankBadge, { backgroundColor: idx === 0 ? agent.color : Colors.surfaceContainerHigh }]}>
                <Text style={[styles.rankText, { color: idx === 0 ? '#fff' : Colors.onSurface }]}>
                  {idx === 0 ? '★' : `#${idx + 1}`}
                </Text>
              </View>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{p.name}</Text>
                <Text style={styles.providerMeta}>{p.location} · {p.responseTimeMinutes} min</Text>
              </View>
              <View style={styles.scoreCol}>
                <AnimatedCounter from={0} to={p.trustScore} suffix="/100" duration={1000} style={[styles.trustScore, { color: agent.color }]} />
                <Text style={styles.starText}>★ {p.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {onChooseBest && (
            <TouchableOpacity style={[styles.chooseBestBtn, { backgroundColor: agent.color }]} onPress={onChooseBest}>
              <MaterialIcons name="auto-awesome" size={16} color="#fff" />
              <Text style={styles.chooseBestText}>Choose Best Technician For Me</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Simple summary text */}
      {summaryText && !negotiation && !providers && (
        <Text style={styles.summaryText}>{summaryText}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: 8,
  },
  agentIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  doneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    gap: 4,
  },
  doneText: {
    fontSize: 11,
    fontWeight: '600',
  },
  negBody: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
  },
  priceCol: { alignItems: 'center' },
  priceLabel: { fontSize: 11, color: Colors.onSurfaceVariant, marginBottom: 4 },
  priceStrike: {
    fontSize: 16,
    color: Colors.error,
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  priceValue: { fontSize: 22, fontWeight: '800' },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    gap: 6,
    alignSelf: 'center',
  },
  savingsText: { fontSize: 13, fontWeight: '600' },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BorderRadius.button,
    gap: 6,
  },
  actionBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  actionBtnText: { fontSize: 14, fontWeight: '700' },
  providersBody: { padding: Spacing.md, gap: Spacing.sm },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutter,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: { fontSize: 13, fontWeight: '700' },
  providerInfo: { flex: 1 },
  providerName: { fontSize: 14, fontWeight: '600', color: Colors.onSurface },
  providerMeta: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  scoreCol: { alignItems: 'flex-end' },
  trustScore: { fontSize: 13, fontWeight: '700' },
  starText: { fontSize: 11, color: Colors.outline, marginTop: 2 },
  chooseBestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BorderRadius.button,
    gap: 8,
    marginTop: Spacing.xs,
  },
  chooseBestText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  summaryText: {
    padding: Spacing.md,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 20,
  },
});
