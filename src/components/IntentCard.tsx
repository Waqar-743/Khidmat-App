import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated as RNAnimated } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, FadeInDown,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, AGENT_CONFIGS } from '../constants/Colors';
import { Spacing, BorderRadius } from '../constants';
import { ParsedIntent } from '../types';

interface IntentCardProps {
  intent: ParsedIntent;
  onConfirm: () => void;
  onEdit?: () => void;
  onNewChat?: () => void;
}

interface EditableField {
  key: keyof ParsedIntent;
  label: string;
  icon: string;
  value: string;
  color: string;
}

export const IntentCard: React.FC<IntentCardProps> = ({ intent, onConfirm, onEdit, onNewChat }) => {
  const fahamConfig = AGENT_CONFIGS['FAHAM'];
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [editingField, setEditingField] = useState<keyof ParsedIntent | null>(null);
  const [localIntent, setLocalIntent] = useState<ParsedIntent>(intent);

  const confirmScale = useSharedValue(1);
  const confirmStyle = useAnimatedStyle(() => ({
    transform: [{ scale: confirmScale.value }],
  }));

  const handleConfirm = () => {
    confirmScale.value = withSpring(0.95, { damping: 10 }, () => {
      confirmScale.value = withSpring(1);
    });
    setIsConfirmed(true);
    onConfirm();
  };

  const fields: EditableField[] = [
    { key: 'serviceType', label: 'SERVICE', icon: 'build-circle', value: localIntent.serviceType, color: fahamConfig.color },
    { key: 'location', label: 'LOCATION', icon: 'location-on', value: localIntent.location, color: Colors.agentDhoond },
    { key: 'time', label: 'TIME', icon: 'schedule', value: localIntent.time, color: Colors.agentBharosa },
    { key: 'urgency', label: 'URGENCY', icon: 'priority-high', value: localIntent.urgency, color: localIntent.urgency === 'HIGH' ? Colors.error : localIntent.urgency === 'MEDIUM' ? Colors.agentDhoond : Colors.agentBharosa },
    { key: 'budget', label: 'BUDGET', icon: 'payments', value: localIntent.budget ? `Rs. ${Number(localIntent.budget).toLocaleString()}` : 'Market rate', color: Colors.agentMolBhaav },
  ];

  return (
    <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.card}>
      {/* FAHAM agent header */}
      <View style={[styles.header, { backgroundColor: fahamConfig.color }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.agentIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <MaterialIcons name={fahamConfig.icon as any} size={16} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerAgent}>{fahamConfig.name}</Text>
            <Text style={styles.headerDesc}>Request understood!</Text>
          </View>
        </View>
        <View style={styles.langBadge}>
          <Text style={styles.langText}>Urdu/English</Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Yeh Samjha Maine</Text>
        <Text style={styles.titleHint}>Tap any field to edit</Text>
      </View>

      {/* Editable fields */}
      <View style={styles.fieldsGrid}>
        {fields.map(field => (
          <TouchableOpacity
            key={field.key}
            style={[
              styles.fieldRow,
              editingField === field.key && { borderColor: field.color, backgroundColor: field.color + '08' },
            ]}
            onPress={() => !isConfirmed && setEditingField(editingField === field.key ? null : field.key)}
            disabled={isConfirmed}
          >
            <View style={[styles.fieldIcon, { backgroundColor: field.color + '15' }]}>
              <MaterialIcons name={field.icon as any} size={14} color={field.color} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              {editingField === field.key ? (
                <TextInput
                  autoFocus
                  style={[styles.fieldInput, { color: field.color, borderBottomColor: field.color }]}
                  value={field.key === 'budget' ? String(localIntent.budget || '') : String(localIntent[field.key])}
                  onChangeText={val => {
                    setLocalIntent(prev => ({ ...prev, [field.key]: field.key === 'budget' ? Number(val) : val }));
                  }}
                  onBlur={() => setEditingField(null)}
                />
              ) : (
                <Text style={[styles.fieldValue, { color: field.color }]}>{field.value}</Text>
              )}
            </View>
            {!isConfirmed && (
              <MaterialIcons
                name={editingField === field.key ? 'check' : 'edit'}
                size={14}
                color={editingField === field.key ? field.color : Colors.outlineVariant}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Action buttons */}
      {!isConfirmed ? (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.newChatBtn} onPress={onNewChat}>
            <MaterialIcons name="refresh" size={16} color={Colors.onSurfaceVariant} />
            <Text style={styles.newChatText}>New Chat</Text>
          </TouchableOpacity>
          <Animated.View style={[styles.confirmBtnWrapper, confirmStyle]}>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: fahamConfig.color }]}
              onPress={handleConfirm}
            >
              <MaterialIcons name="auto-awesome" size={16} color="#fff" />
              <Text style={styles.confirmText}>Dhundna Shuru Karo!</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      ) : (
        <View style={[styles.confirmedBanner, { backgroundColor: fahamConfig.color + '12', borderColor: fahamConfig.color + '30' }]}>
          <MaterialIcons name="check-circle" size={16} color={fahamConfig.color} />
          <Text style={[styles.confirmedText, { color: fahamConfig.color }]}>
            Confirmed! Agents working...
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.outlineVariant,
    shadowColor: Colors.agentFaham,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 16, elevation: 6,
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  agentIcon: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  headerAgent: { fontSize: 13, fontWeight: '800', color: '#fff' },
  headerDesc: { fontSize: 10, color: 'rgba(255,255,255,0.75)' },
  langBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99,
  },
  langText: { fontSize: 10, color: '#fff', fontWeight: '600' },
  titleRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  title: { fontSize: 16, fontWeight: '800', color: Colors.onSurface },
  titleHint: { fontSize: 11, color: Colors.onSurfaceVariant },
  fieldsGrid: { paddingHorizontal: Spacing.md, gap: Spacing.xs, marginBottom: Spacing.md },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.gutter,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.outlineVariant + '80',
  },
  fieldIcon: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  fieldContent: { flex: 1 },
  fieldLabel: {
    fontSize: 9, fontWeight: '700', letterSpacing: 0.8,
    color: Colors.onSurfaceVariant, marginBottom: 1,
  },
  fieldValue: { fontSize: 14, fontWeight: '700' },
  fieldInput: {
    fontSize: 14, fontWeight: '700',
    borderBottomWidth: 1, paddingBottom: 2, paddingTop: 0,
  },
  actions: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, alignItems: 'center',
  },
  newChatBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: BorderRadius.button, borderWidth: 1, borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLow,
  },
  newChatText: { fontSize: 12, color: Colors.onSurfaceVariant, fontWeight: '600' },
  confirmBtnWrapper: { flex: 1 },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 13, borderRadius: BorderRadius.button,
    shadowColor: Colors.agentFaham, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  confirmText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  confirmedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    margin: Spacing.md, padding: Spacing.md,
    borderRadius: BorderRadius.md, borderWidth: 1,
  },
  confirmedText: { fontSize: 13, fontWeight: '700' },
});
