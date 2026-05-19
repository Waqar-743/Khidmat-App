import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Platform, StatusBar, Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  withRepeat, withSequence, FadeInDown, SlideInUp, Easing,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, AGENT_CONFIGS } from '../src/constants/Colors';
import { Spacing, BorderRadius } from '../src/constants';
import { PulsingDot } from '../src/components/PulsingDot';
import { AnimatedCounter } from '../src/components/AnimatedCounter';

const { width } = Dimensions.get('window');

const STEPS = [
  { id: 1, title: 'Booking Confirmed', subtitle: 'May 15 · 10:30 AM', status: 'complete', icon: 'check-circle' },
  { id: 2, title: 'Agent Assigned', subtitle: 'Ali is heading to your location', status: 'complete', icon: 'person-pin' },
  { id: 3, title: 'En Route', subtitle: '1.2 km away · ETA 12 min', status: 'active', icon: 'directions-car' },
  { id: 4, title: 'Service in Progress', subtitle: 'Estimated 90 min', status: 'pending', icon: 'build' },
  { id: 5, title: 'Completed & Paid', subtitle: 'Feedback requested', status: 'pending', icon: 'done-all' },
];

export default function ServiceTimelineScreen() {
  const router = useRouter();
  const bookConfig = AGENT_CONFIGS['BOOK'];
  const [eta, setEta] = useState(12);

  // ETA countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setEta(prev => Math.max(prev - 1, 0));
    }, 10000); // decrement every 10s for demo
    return () => clearInterval(interval);
  }, []);

  // Animated map vehicle
  const vehicleX = useSharedValue(0);
  useEffect(() => {
    vehicleX.value = withRepeat(
      withSequence(
        withTiming(width * 0.45, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, false,
    );
  }, []);
  const vehicleStyle = useAnimatedStyle(() => ({ transform: [{ translateX: vehicleX.value }] }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Tracking</Text>
          <TouchableOpacity style={styles.backBtn}>
            <MaterialIcons name="share" size={22} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* ETA hero card */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.etaCard}>
            <View style={styles.etaLeft}>
              <Text style={styles.etaLabel}>Estimated Arrival</Text>
              <View style={styles.etaRow}>
                <Text style={styles.etaValue}>{eta}</Text>
                <Text style={styles.etaUnit}> min</Text>
              </View>
              <View style={styles.etaDistRow}>
                <PulsingDot color={bookConfig.color} size={7} />
                <Text style={styles.etaDist}>1.2 km away</Text>
              </View>
            </View>
            <View style={[styles.providerCircle, { borderColor: bookConfig.color }]}>
              <Text style={[styles.providerInitials, { color: bookConfig.color }]}>AA</Text>
              <View style={[styles.verifiedDot, { backgroundColor: bookConfig.color }]}>
                <MaterialIcons name="verified" size={8} color="#fff" />
              </View>
            </View>
          </Animated.View>

          {/* Animated map placeholder */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.mapCard}>
            <View style={styles.mapBg}>
              {/* Grid lines */}
              {[0,1,2,3].map(i => (
                <View key={`h${i}`} style={[styles.mapGridH, { top: 30 + i * 30 }]} />
              ))}
              {[0,1,2,3,4].map(i => (
                <View key={`v${i}`} style={[styles.mapGridV, { left: 30 + i * 50 }]} />
              ))}
              {/* Route line */}
              <View style={styles.routeLine}>
                <View style={[styles.routeDash, { backgroundColor: bookConfig.color + '60' }]} />
              </View>
              {/* Moving vehicle */}
              <Animated.View style={[styles.vehicleMarker, vehicleStyle]}>
                <View style={[styles.vehicleIcon, { backgroundColor: bookConfig.color }]}>
                  <MaterialIcons name="two-wheeler" size={14} color="#fff" />
                </View>
              </Animated.View>
              {/* Destination pin */}
              <View style={styles.destPin}>
                <MaterialIcons name="location-pin" size={28} color={Colors.error} />
                <Text style={styles.destLabel}>You</Text>
              </View>
            </View>

            {/* Quick actions row */}
            <View style={styles.mapActions}>
              <TouchableOpacity style={[styles.mapAction, { backgroundColor: Colors.agentBharosaBg }]}>
                <MaterialIcons name="call" size={18} color={Colors.agentBharosa} />
                <Text style={[styles.mapActionText, { color: Colors.agentBharosa }]}>Call Ali</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.mapAction, { backgroundColor: Colors.agentDhoondBg }]}>
                <MaterialIcons name="chat" size={18} color={Colors.agentDhoond} />
                <Text style={[styles.mapActionText, { color: Colors.agentDhoond }]}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.mapAction, { backgroundColor: bookConfig.bgColor }]}>
                <MaterialIcons name="share-location" size={18} color={bookConfig.color} />
                <Text style={[styles.mapActionText, { color: bookConfig.color }]}>Share Location</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Provider info strip */}
          <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.providerStrip}>
            <View style={[styles.providerAvatar, { borderColor: bookConfig.color }]}>
              <Text style={[styles.providerAvatarText, { color: bookConfig.color }]}>AA</Text>
            </View>
            <View style={styles.providerDetails}>
              <Text style={styles.providerName}>Ali AC Services</Text>
              <View style={styles.providerMeta}>
                <Text style={styles.providerMetaText}>⭐ 4.8 · 120 jobs</Text>
                <View style={[styles.verifiedChip, { backgroundColor: bookConfig.bgColor }]}>
                  <MaterialIcons name="verified" size={11} color={bookConfig.color} />
                  <Text style={[styles.verifiedChipText, { color: bookConfig.color }]}>VERIFIED</Text>
                </View>
              </View>
            </View>
            <View style={styles.bookingId}>
              <Text style={styles.bookingIdLabel}>Booking</Text>
              <Text style={styles.bookingIdValue}>KHD-0391</Text>
            </View>
          </Animated.View>

          {/* Timeline steps */}
          <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.timelineCard}>
            <Text style={styles.timelineTitle}>Service Timeline</Text>
            {STEPS.map((step, idx) => {
              const isComplete = step.status === 'complete';
              const isActive = step.status === 'active';
              const isPending = step.status === 'pending';
              const isLast = idx === STEPS.length - 1;
              const dotColor = isComplete ? bookConfig.color : isActive ? Colors.agentDhoond : Colors.outlineVariant;

              return (
                <View key={step.id} style={styles.stepRow}>
                  <View style={styles.stepLeft}>
                    <View style={[styles.stepDot, { backgroundColor: dotColor, borderColor: dotColor }]}>
                      {isComplete && <MaterialIcons name="check" size={10} color="#fff" />}
                      {isActive && <View style={styles.activeDotInner} />}
                    </View>
                    {!isLast && (
                      <View style={[styles.stepLine, { backgroundColor: isComplete ? bookConfig.color + '60' : Colors.outlineVariant + '40' }]} />
                    )}
                  </View>
                  <View style={[styles.stepContent, isActive && { backgroundColor: Colors.agentDhoondBg, borderColor: Colors.agentDhoond + '40' }]}>
                    <View style={styles.stepHeader}>
                      <MaterialIcons name={step.icon as any} size={16} color={isActive ? Colors.agentDhoond : isComplete ? bookConfig.color : Colors.outlineVariant} />
                      <Text style={[
                        styles.stepTitle,
                        isComplete && { color: Colors.onSurface },
                        isActive && { color: Colors.agentDhoond, fontWeight: '800' },
                        isPending && { color: Colors.onSurfaceVariant },
                      ]}>{step.title}</Text>
                      {isActive && <PulsingDot color={Colors.agentDhoond} size={7} />}
                    </View>
                    {step.subtitle !== '' && (
                      <Text style={[styles.stepSubtitle, isActive && { color: Colors.agentDhoond + 'CC' }]}>
                        {step.subtitle}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </Animated.View>

          {/* YAAD-DAHANI reminders card */}
          <Animated.View entering={FadeInDown.duration(400).delay(250)} style={styles.reminderCard}>
            <View style={[styles.reminderIcon, { backgroundColor: Colors.agentYaadDahani }]}>
              <MaterialIcons name="notifications-active" size={18} color="#fff" />
            </View>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTitle}>YAAD-DAHANI Active</Text>
              <Text style={styles.reminderSubtitle}>You'll get reminders before & after service</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.onSurfaceVariant} />
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
  header: {
    backgroundColor: Colors.primary, flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: Spacing.md,
    height: 64, justifyContent: 'space-between',
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.onPrimary },
  content: { padding: Spacing.md, paddingBottom: 80 },
  etaCard: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  etaLeft: {},
  etaLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, textTransform: 'uppercase' },
  etaRow: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 4 },
  etaValue: { fontSize: 48, fontWeight: '900', color: '#fff', lineHeight: 52 },
  etaUnit: { fontSize: 18, color: 'rgba(255,255,255,0.7)', marginBottom: 6 },
  etaDistRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  etaDist: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  providerCircle: {
    width: 64, height: 64, borderRadius: 32,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.glassWhite, position: 'relative',
  },
  providerInitials: { fontSize: 20, fontWeight: '900' },
  verifiedDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.primary,
  },
  mapCard: {
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.outlineVariant,
    overflow: 'hidden', marginBottom: Spacing.md,
  },
  mapBg: {
    height: 160, backgroundColor: '#E8F4F8',
    position: 'relative', overflow: 'hidden',
  },
  mapGridH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#D0E8F0' },
  mapGridV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: '#D0E8F0' },
  routeLine: {
    position: 'absolute', left: '10%', right: '15%', top: '50%',
    height: 3, justifyContent: 'center',
  },
  routeDash: { height: 3, borderRadius: 2 },
  vehicleMarker: { position: 'absolute', top: '38%', left: '8%' },
  vehicleIcon: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  destPin: { position: 'absolute', right: '12%', top: '25%', alignItems: 'center' },
  destLabel: { fontSize: 10, fontWeight: '700', color: Colors.error },
  mapActions: {
    flexDirection: 'row', padding: Spacing.md,
    gap: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.outlineVariant,
  },
  mapAction: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 5,
    paddingVertical: 9, borderRadius: BorderRadius.button,
  },
  mapActionText: { fontSize: 11, fontWeight: '700' },
  providerStrip: {
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.outlineVariant,
    padding: Spacing.md, flexDirection: 'row',
    alignItems: 'center', gap: Spacing.gutter,
    marginBottom: Spacing.md,
  },
  providerAvatar: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerLow,
  },
  providerAvatarText: { fontSize: 16, fontWeight: '800' },
  providerDetails: { flex: 1 },
  providerName: { fontSize: 15, fontWeight: '700', color: Colors.onSurface },
  providerMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  providerMetaText: { fontSize: 12, color: Colors.onSurfaceVariant },
  verifiedChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99,
  },
  verifiedChipText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  bookingId: { alignItems: 'flex-end' },
  bookingIdLabel: { fontSize: 10, color: Colors.onSurfaceVariant },
  bookingIdValue: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  timelineCard: {
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.outlineVariant,
    padding: Spacing.lg, marginBottom: Spacing.md,
  },
  timelineTitle: { fontSize: 14, fontWeight: '800', color: Colors.onSurface, marginBottom: Spacing.md, letterSpacing: 0.3 },
  stepRow: { flexDirection: 'row', gap: Spacing.md, minHeight: 56 },
  stepLeft: { width: 20, alignItems: 'center' },
  stepDot: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    zIndex: 1,
  },
  activeDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.agentDhoond },
  stepLine: { width: 2, flex: 1, marginVertical: 2 },
  stepContent: {
    flex: 1, paddingBottom: Spacing.md, paddingHorizontal: Spacing.sm,
    paddingVertical: 4, borderRadius: BorderRadius.md, borderWidth: 0,
  },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepTitle: { fontSize: 14, fontWeight: '600', flex: 1 },
  stepSubtitle: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2, marginLeft: 22 },
  reminderCard: {
    backgroundColor: Colors.agentYaadDahaniBg, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.agentYaadDahani + '30',
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
  },
  reminderIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  reminderInfo: { flex: 1 },
  reminderTitle: { fontSize: 14, fontWeight: '700', color: Colors.agentYaadDahani },
  reminderSubtitle: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
});
