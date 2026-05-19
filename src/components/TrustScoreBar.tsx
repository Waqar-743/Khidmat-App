import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { getTrustLevel } from '../types';

interface TrustScoreBarProps {
  score: number;
}

export const TrustScoreBar: React.FC<TrustScoreBarProps> = ({ score }) => {
  const level = getTrustLevel(score);
  
  let color: string = Colors.primary;
  let labelColor: string = Colors.primary;
  let bg = Colors.surfaceContainerLow;
  
  if (level === 'MEDIUM') {
    color = Colors.tertiaryContainer;
    labelColor = Colors.tertiaryContainer;
  } else if (level === 'LOW') {
    color = Colors.error;
    labelColor = Colors.error;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>BHAROSA Score</Text>
        <Text style={[styles.score, { color: labelColor }]}>{score}/100</Text>
      </View>
      <View style={[styles.track, { backgroundColor: bg }]}>
        <View style={[styles.fill, { width: `${score}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    ...Typography.codeSm,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  score: {
    ...Typography.codeSmBold,
  },
  track: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
