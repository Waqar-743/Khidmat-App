import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { MaterialIcons } from '@expo/vector-icons';
import { UrgencyLevel } from '../types';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ level }) => {
  const getStyles = () => {
    switch (level) {
      case 'HIGH':
        return {
          bg: Colors.errorContainer,
          text: Colors.onErrorContainer,
          icon: 'bolt' as const,
          label: 'HIGH',
        };
      case 'MEDIUM':
        return {
          bg: Colors.tertiaryFixed,
          text: Colors.onTertiaryFixedVariant,
          icon: 'warning' as const,
          label: 'MEDIUM',
        };
      case 'LOW':
      default:
        return {
          bg: Colors.secondaryFixed,
          text: Colors.onSecondaryFixedVariant,
          icon: 'schedule' as const,
          label: 'FLEXIBLE',
        };
    }
  };

  const theme = getStyles();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <MaterialIcons name={theme.icon} size={14} color={theme.text} />
      <Text style={[styles.text, { color: theme.text }]}>{theme.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    gap: 2,
  },
  text: {
    ...Typography.codeSmBold,
  },
});
