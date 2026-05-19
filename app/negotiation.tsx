import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Platform, StatusBar, Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  withRepeat, withSequence, FadeInDown, SlideInUp,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, AGENT_CONFIGS } from '../src/constants/Colors';
import { Spacing, BorderRadius } from '../src/constants';
import { AnimatedCounter } from '../src/components/AnimatedCounter';
import { PulsingDot } from '../src/components/PulsingDot';

const { width } = Dimensions.get('window');

interface NegRound {
  actor: 'agent' | 'provider';
  label: string;
  amount: number;
  note: string;
  color: string;
}

const MOCK_ROUNDS: NegRound[] = [
  { actor: 'provider', label: 'Provider Quote', amount: 2800, note: 'Initial asking price', color: Colors.error },
  { actor: 'agent', label: 'Market Analysis', amount: 0, note: 'Standard rate: Rs. 1,500–2,500 in this area', color: Colors.agentMolBhaav },
  { actor: 'agent', label: 'MOL-BHAAV Counter', amount: 2100, note: 'Based on market data + demand', color: Colors.agentMolBhaav },
  { actor: 'provider', label: 'Provider Response', amount: 2200, note: 'Accepted with minor revision', color: Colors.agentBook },
];

export default function NegotiationScreen() {
  const router = useRouter();
  const { providerId } = useLocalSearchParams<{ providerId?: string }>();
  const agentConfig = AGENT_CONFIGS['MOL-BHAAV'];

  const [visibleRounds, setVisibleRounds] = useState<NegRound[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const progressWidth = useSharedValue(0);
  const successScale = useSharedValue(0.8);
  const successOpacity = useSharedValue(0);

  useEffect(() => {
    const reveal = async () => {
      for (let i = 0; i < MOCK_ROUNDS.length; i++) {
        await new Promise(r => setTimeout(r, i === 0 ? 600 : 900));
        setVisibleRounds(prev => [...prev, MOCK_ROUNDS[i]]);
        progressWidth.value = withTiming(((i + 1) / MOCK_ROUNDS.length) * 100, { duration: 500 });
      }
      await new Promise(r => setTimeout(r, 600));
      setIsComplete(true);
      setShowActions(true);
      successScale.value = withSpring(1, { damping: 12, stiffness: 100 });
      successOpacity.value = withTiming(1, { duration: 400 });
    };
    reveal();
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const successStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <MaterialIcons name="smart-toy" size={20} color={Colors.primary} />
          </View>
          <Text style={styles.headerTitle}>KHIDMAT Agent</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="more-vert" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Agent identity badge */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.agentBadge}>
            <View style={[styles.agentBadgeIcon, { backgroundColor: agentConfig.color }]}>
              <MaterialIcons name={agentConfig.icon as any} size={18} color="#fff" />
            </View>
            <View>
              <Text style={[styles.agentBadgeName, { color: agentConfig.color }]}>{agentConfig.name}</Text>
              <Text style={styles.agentBadgeDesc}>{agentConfig.description}</Text>
            </View>
            <PulsingDot color={agentConfig.color} size={8} />
          </Animated.View>

          {/* Title */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.titleSection}>
            <Text style={styles.mainTitle}>
              {isComplete ? '🎉 Deal Secured!' : '⚡ Negotiating...'}
            </Text>
            <Text style={styles.subtitle}>
              {isComplete
                ? 'Best price locked in for you'
                : 'AI is negotiating the best price based on market data'}
            </Text>
          </Animated.View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { backgroundColor: agentConfig.color }, progressStyle]} />
          </View>

          {/* Negotiation timeline */}
          <View style={styles.timeline}>
            {visibleRounds.map((round, idx) => (
              <Animated.View
                key={idx}
                entering={FadeInDown.duration(350).springify()}
                style={[
                  styles.roundRow,
                  round.actor === 'agent' && styles.roundRowAgent,
                ]}
              >
                <View style={[styles.roundDot, { backgroundColor: round.color }]} />
                {idx < visibleRounds.length - 1 && (
                  <View style={[styles.roundLine, { backgroundColor: round.color + '40' }]} />
                )}
                <View style={[
                  styles.roundCard,
                  { borderColor: round.color + '40', backgroundColor: round.color + '0A' },
                ]}>
                  <View style={styles.roundHeader}>
                    <Text style={[styles.roundLabel, { color: round.color }]}>{round.label}</Text>
                    {round.amount > 0 && (
                      <AnimatedCounter
                        from={0}
                        to={round.amount}
                        prefix="Rs. "
                        duration={800}
                        style={[styles.roundAmount, {
                          color: round.actor === 'provider' ? Colors.error : agentConfig.color,
                          textDecorationLine: (round.actor === 'provider' && idx === 0) ? 'line-through' : 'none',
                        }]}
                      />
                    )}
                  </View>
                  <Text style={styles.roundNote}>{round.note}</Text>
                </View>
              </Animated.View>
            ))}
          </View>

          {/* Success banner */}
          {isComplete && (
            <Animated.View style={[styles.successBanner, successStyle]}>
              <View style={styles.successTop}>
                <View>
                  <Text style={styles.successLabel}>Final Price</Text>
                  <AnimatedCounter
                    from={2800}
                    to={2200}
                    prefix="Rs. "
                    duration={1400}
                    style={styles.successPrice}
                  />
                </View>
                <View style={styles.savingsBubble}>
                  <MaterialIcons name="savings" size={16} color={Colors.agentBharosa} />
                  <Text style={styles.savingsText}>Saved: Rs. 600</Text>
                </View>
              </View>
              <View style={styles.savingsTag}>
                <Text style={styles.savingsTagText}>💡 Saved via MOL-BHAAV negotiation</Text>
              </View>
            </Animated.View>
          )}

          {/* Action buttons */}
          {showActions && (
            <Animated.View entering={SlideInUp.duration(400).springify()} style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.findOtherBtn]}
                onPress={() => router.back()}
              >
                <MaterialIcons name="refresh" size={18} color={agentConfig.color} />
                <Text style={[styles.actionBtnText, { color: agentConfig.color }]}>Find Another</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={() => router.replace('/(tabs)')}
              >
                <MaterialIcons name="close" size={18} color={Colors.error} />
                <Text style={[styles.actionBtnText, { color: Colors.error }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.acceptBtn, { backgroundColor: agentConfig.color }]}
                onPress={() => router.replace('/(tabs)')}
              >
                <MaterialIcons name="check-circle" size={18} color="#fff" />
                <Text style={[styles.actionBtnText, { color: '#fff' }]}>Accept Deal</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
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
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 64,
  },
  headerAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.onPrimary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.primaryContainer,
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: Colors.onPrimary, marginLeft: 12 },
  iconBtn: { padding: Spacing.sm },
  content: { padding: Spacing.md, paddingBottom: 60 },
  agentBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.agentMolBhaavBg,
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.agentMolBhaav + '30',
    marginBottom: Spacing.lg,
  },
  agentBadgeIcon: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  agentBadgeName: { fontSize: 15, fontWeight: '700' },
  agentBadgeDesc: { fontSize: 12, color: Colors.onSurfaceVariant },
  titleSection: { marginBottom: Spacing.md },
  mainTitle: { fontSize: 24, fontWeight: '800', color: Colors.onSurface, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 20 },
  progressTrack: {
    height: 6, backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 3, overflow: 'hidden', marginBottom: Spacing.xl,
  },
  progressFill: { height: '100%', borderRadius: 3 },
  timeline: { gap: 0, marginBottom: Spacing.lg },
  roundRow: { flexDirection: 'row', alignSelf: 'flex-start', gap: 10, width: '90%', marginBottom: Spacing.md },
  roundRowAgent: { alignSelf: 'flex-end' },
  roundDot: {
    width: 14, height: 14, borderRadius: 7,
    marginTop: 14, flexShrink: 0,
  },
  roundLine: { position: 'absolute', left: 6, top: 28, width: 2, height: 40 },
  roundCard: {
    flex: 1, borderRadius: BorderRadius.md, borderWidth: 1,
    padding: Spacing.md,
  },
  roundHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4,
  },
  roundLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  roundAmount: { fontSize: 16, fontWeight: '800' },
  roundNote: { fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 16 },
  successBanner: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  successTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.15)',
    marginBottom: Spacing.md,
  },
  successLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, textTransform: 'uppercase' },
  successPrice: { fontSize: 30, fontWeight: '900', color: '#fff', marginTop: 2 },
  savingsBubble: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.agentBharosaBg,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99,
  },
  savingsText: { fontSize: 13, fontWeight: '700', color: Colors.agentBharosa },
  savingsTag: { alignItems: 'center' },
  savingsTagText: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  actions: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: BorderRadius.button, gap: 6, flex: 1,
  },
  findOtherBtn: {
    borderWidth: 1.5, borderColor: Colors.agentMolBhaav,
    backgroundColor: Colors.agentMolBhaavBg,
  },
  cancelBtn: {
    borderWidth: 1.5, borderColor: Colors.error,
    backgroundColor: Colors.errorContainer + '50',
  },
  acceptBtn: { flex: 1.8 },
  actionBtnText: { fontSize: 13, fontWeight: '700' },
});
