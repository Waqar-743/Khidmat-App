import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { AgentLogEntry as AgentLogEntryType } from '../types';
import { agentColors, agentIcons } from '../data/mockAgentLogs';

interface AgentLogEntryProps {
  entry: AgentLogEntryType;
  isLast?: boolean;
}

export const AgentLogEntry: React.FC<AgentLogEntryProps> = ({ entry, isLast }) => {
  const color = agentColors[entry.agent] || Colors.primary;
  const iconName = agentIcons[entry.agent] || 'smart-toy';

  return (
    <View style={styles.container}>
      {/* Vertical Line Connecting Nodes */}
      {!isLast && <View style={[styles.connectingLine, { backgroundColor: color }]} />}
      
      {/* Icon Circle */}
      <View style={[styles.iconCircle, { borderColor: color }]}>
        <MaterialIcons name={iconName as any} size={16} color={color} />
      </View>

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.agentName, { color }]}>[{entry.agent} Agent]</Text>
          <Text style={styles.duration}>{entry.duration}</Text>
        </View>
        
        {/* Log Lines */}
        <View style={styles.linesContainer}>
          {entry.lines.map((line, idx) => (
            <Text key={idx} style={styles.logLine}>
              {line}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingLeft: Spacing.md,
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  connectingLine: {
    position: 'absolute',
    left: 16 + 14, // md spacing + half icon width
    top: 32,
    bottom: -Spacing.lg,
    width: 2,
    opacity: 0.3,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inverseSurface,
    marginRight: Spacing.md,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 6,
  },
  agentName: {
    ...Typography.codeSmBold,
  },
  duration: {
    ...Typography.codeSm,
    color: Colors.outlineVariant,
  },
  linesContainer: {
    gap: 4,
  },
  logLine: {
    ...Typography.codeSm,
    color: Colors.inverseOnSurface,
    opacity: 0.9,
  },
});
