import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '../constants';
import { NegotiationStep as NegotiationStepType } from '../types';

interface NegotiationStepProps {
  step: NegotiationStepType;
  index: number;
}

export const NegotiationStep: React.FC<NegotiationStepProps> = ({ step, index }) => {
  const getTheme = () => {
    switch (step.type) {
      case 'market-analysis':
        return {
          color: '#B0EFDB', // light green border for dot
          cardBorder: '#B0EFDB',
          icon: 'insert-chart-outlined' as const,
          iconColor: '#B0EFDB',
          valueColor: Colors.onSurface, // standard dark text for value
        };
      case 'provider-quote':
        return {
          color: '#FFB869', // orange
          cardBorder: '#FFB869',
          icon: 'person-outline' as const,
          iconColor: '#FFB869',
          valueColor: '#BA1A1A', // red text for initial high quote value
        };
      case 'counter-offer':
        return {
          color: Colors.primary, // dark green
          cardBorder: Colors.primary,
          icon: 'reply' as const,
          iconColor: Colors.primary,
          valueColor: Colors.primary,
        };
      case 'provider-response':
        return {
          color: Colors.primary, // dark green
          cardBorder: Colors.primary,
          icon: 'check-circle-outline' as const,
          iconColor: Colors.primary,
          valueColor: Colors.primary,
        };
      default:
        return {
          color: Colors.outline,
          cardBorder: Colors.outline,
          icon: 'info' as const,
          iconColor: Colors.outline,
          valueColor: Colors.onSurface,
        };
    }
  };

  const theme = getTheme();

  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 600).duration(400)}
      style={styles.container}
    >
      {/* Dot on the timeline */}
      <View style={[styles.dot, { borderColor: theme.color }]} />

      <View style={styles.card}>
        {/* Left Border */}
        <View style={[styles.cardLeftBorder, { backgroundColor: theme.cardBorder }]} />
        
        <View style={styles.contentWrapper}>
          <View style={styles.headerRow}>
            <MaterialIcons 
              name={theme.icon} 
              size={18} 
              color={theme.iconColor} 
              style={styles.icon} 
            />
            <Text style={styles.title}>{step.title}</Text>
            
            {step.tag && (
              <View style={[
                styles.tag, 
                step.tagType === 'error' && { backgroundColor: '#FFDAD6' }
              ]}>
                <Text style={[
                  styles.tagText,
                  step.tagType === 'error' && { color: '#93000A' }
                ]}>
                  {step.tag}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={styles.description}>
            {step.description}
            {step.value && <Text style={{ color: theme.valueColor, fontWeight: 'bold' }}>{step.value}</Text>}
            {step.type === 'counter-offer' && <Text style={{ color: Colors.onSurface }}> citing standard market rates.</Text>}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 24,
    position: 'relative',
    marginBottom: Spacing.md,
  },
  dot: {
    position: 'absolute',
    left: -10, // Centers exactly on the border line
    top: 24,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FCF8FF',
    borderWidth: 3,
    zIndex: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Elevation.sm,
    borderColor: Colors.outlineVariant,
    borderWidth: 1,
  },
  cardLeftBorder: {
    width: 6,
    height: '100%',
  },
  contentWrapper: {
    flex: 1,
    padding: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 6,
  },
  title: {
    ...Typography.bodySerif,
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  description: {
    ...Typography.bodySerif,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    ...Typography.codeSm,
  },
});
