import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '../src/constants';
import { AgentLogEntry as LogEntryType } from '../src/types';

const MOCK_LOGS: LogEntryType[] = [
  {
    id: '1',
    agent: 'DHOOND',
    timestamp: '',
    duration: '0.8s',
    lines: [
      '> Scanning 5km radius for AC Technicians in G-13...',
      '> Found 12, filtered 4 available.',
    ],
    status: 'complete',
  },
  {
    id: '2',
    agent: 'BHAROSA',
    timestamp: '',
    duration: '1.2s',
    lines: [
      '> Calculating trust scores...',
      '> Ali AC Services (87/100) prioritized based on 98% completion rate.',
    ],
    status: 'complete',
  },
  {
    id: '3',
    agent: 'MOL-BHAAV',
    timestamp: '',
    duration: '1.5s',
    lines: [
      '> Initial quote Rs. 2,800.',
      '> Comparing with DHA Phase 5 market rates (Rs. 1,500-2,500).',
      '> Counter-offering Rs. 2,100.',
    ],
    status: 'complete',
  },
  {
    id: '4',
    agent: 'BOOK',
    timestamp: '',
    duration: '0.7s',
    lines: [
      '> Securing slot for 15 May 10:00 AM.',
      '> Generating secure transaction ID KHD-2026-0391.',
    ],
    status: 'complete',
  },
];

export default function AgentLogsScreen() {
  const router = useRouter();

  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case 'DHOOND': return 'search';
      case 'BHAROSA': return 'shield';
      case 'MOL-BHAAV': return 'handshake';
      case 'BOOK': return 'check-circle-outline';
      default: return 'circle';
    }
  };

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'BHAROSA': return '#FFB869'; // Orange
      default: return '#B0EFDB'; // Light Green
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <MaterialIcons name="smart-toy" size={20} color={Colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Agent Trace Logs</Text>
          <TouchableOpacity style={styles.moreButton}>
            <MaterialIcons name="more-vert" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Overview Section */}
          <View style={styles.overviewContainer}>
            <Text style={styles.sectionTitle}>Orchestration Overview</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Time</Text>
                <Text style={styles.statValue}>4.2s</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Agents Involved</Text>
                <Text style={styles.statValue}>4</Text>
              </View>
            </View>
          </View>

          {/* Terminal Window */}
          <View style={styles.terminal}>
            <View style={styles.terminalHeader}>
              <View style={styles.macButtons}>
                <View style={[styles.macBtn, { backgroundColor: '#FF5F56' }]} />
                <View style={[styles.macBtn, { backgroundColor: '#FFBD2E' }]} />
                <View style={[styles.macBtn, { backgroundColor: '#27C93F' }]} />
              </View>
              <Text style={styles.terminalTitle}>khidmat_orchestrator_tty1</Text>
            </View>

            <View style={styles.terminalBody}>
              {MOCK_LOGS.map((log, index) => {
                const isLast = index === MOCK_LOGS.length - 1;
                const iconColor = getAgentColor(log.agent);

                return (
                  <View key={log.id} style={styles.logRow}>
                    {/* Timeline side */}
                    <View style={styles.timelineSide}>
                      <View style={[styles.iconCircle, { borderColor: iconColor }]}>
                        <MaterialIcons name={getAgentIcon(log.agent)} size={14} color={iconColor} />
                      </View>
                      {!isLast && <View style={[styles.timelineLine, { backgroundColor: '#1E2C2A' }]} />}
                      {isLast && <View style={[styles.timelineLine, { backgroundColor: '#1E2C2A', height: 80 }]} />}
                    </View>

                    {/* Content side */}
                    <View style={styles.logContent}>
                      <View style={styles.logHeader}>
                        <Text style={[styles.agentName, { color: iconColor }]}>[{log.agent} Agent]</Text>
                        <Text style={styles.logTime}>{log.timestamp}</Text>
                      </View>
                      {log.lines.map((line, i) => (
                        <Text key={i} style={[styles.logText, { color: iconColor }]}>
                          {line}
                        </Text>
                      ))}
                    </View>
                  </View>
                );
              })}

              <Text style={styles.terminalFooter}>
                - Orchestration Complete. Waiting for user input...
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Mock Bottom Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.replace('/(tabs)')}>
            <MaterialIcons name="chat-bubble-outline" size={24} color={Colors.onSurfaceVariant} />
            <Text style={styles.tabText}>Chat</Text>
          </TouchableOpacity>
          <View style={styles.tabItem}>
            <View style={styles.activeTabPill}>
              <MaterialIcons name="grid-view" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.activeTabText}>Services</Text>
          </View>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.replace('/(tabs)/activity')}>
            <MaterialIcons name="history" size={24} color={Colors.onSurfaceVariant} />
            <Text style={styles.tabText}>Activity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.replace('/(tabs)/profile')}>
            <MaterialIcons name="person-outline" size={24} color={Colors.onSurfaceVariant} />
            <Text style={styles.tabText}>Profile</Text>
          </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
    backgroundColor: '#FCF8FF', // Light purple background
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.onPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryContainer,
    marginLeft: 8,
  },
  headerTitle: {
    flex: 1,
    ...Typography.headlineMd,
    color: Colors.white,
    marginLeft: Spacing.gutter,
    fontSize: 18,
  },
  moreButton: {
    padding: Spacing.sm,
  },
  content: {
    padding: Spacing.md,
  },
  overviewContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E8E5FF',
  },
  sectionTitle: {
    ...Typography.headlineSerifMd,
    color: Colors.primary, // Dark green
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F5F2FF', // light purple card
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  statLabel: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.xs,
  },
  statValue: {
    ...Typography.headlineLgMobile,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  terminal: {
    backgroundColor: '#191A23', // Dark background for terminal
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    backgroundColor: '#1E1E2C', // Slightly lighter header
  },
  macButtons: {
    flexDirection: 'row',
    gap: 6,
    marginRight: Spacing.md,
  },
  macBtn: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  terminalTitle: {
    ...Typography.codeSm,
    color: '#6B7280',
    flex: 1,
  },
  terminalBody: {
    padding: Spacing.lg,
  },
  logRow: {
    flexDirection: 'row',
  },
  timelineSide: {
    width: 32,
    alignItems: 'center',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191A23', // Match terminal bg
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: -4,
    marginBottom: -4,
  },
  logContent: {
    flex: 1,
    paddingLeft: Spacing.sm,
    paddingBottom: Spacing.xl, // Space between logs
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  agentName: {
    ...Typography.codeSmBold,
  },
  logTime: {
    ...Typography.codeSm,
    color: '#6B7280',
  },
  logText: {
    ...Typography.codeSm,
    lineHeight: 20,
    marginTop: 2,
  },
  terminalFooter: {
    ...Typography.codeSm,
    color: '#6B7280',
    marginTop: Spacing.xl,
    paddingLeft: 40,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FCF8FF', // Match main bg
    borderTopWidth: 1,
    borderTopColor: '#E8E5FF',
    paddingBottom: Platform.OS === 'ios' ? 24 : Spacing.sm,
    paddingTop: Spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabPill: {
    backgroundColor: '#B0EFDB', // Light green pill
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: 4,
  },
  tabText: {
    ...Typography.codeSm,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  activeTabText: {
    ...Typography.codeSm,
    color: Colors.primary,
  },
});
