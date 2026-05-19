import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, AGENT_CONFIGS, AgentId } from '../constants/Colors';
import { Spacing, BorderRadius } from '../constants';
import { TypingIndicator } from './TypingIndicator';

interface ChatBubbleProps {
  type: 'user' | 'agent' | 'system';
  text?: string;
  timestamp: string;
  isTyping?: boolean;
  agentId?: AgentId;
  children?: React.ReactNode;
}

function renderFormattedText(text: string, isUser: boolean, agentColor?: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} style={{ fontWeight: '700', color: isUser ? Colors.onPrimary : (agentColor || Colors.primaryContainer) }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={i}>{part}</Text>;
  });
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ type, text, timestamp, isTyping, agentId, children }) => {
  const isUser = type === 'user';
  const agentConfig = agentId ? AGENT_CONFIGS[agentId] : null;
  const agentColor = agentConfig?.color;

  if (type === 'system') {
    return (
      <View style={styles.systemContainer}>
        <View style={styles.systemChip}>
          <Text style={styles.systemText}>{text}</Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[styles.container, isUser ? styles.containerUser : styles.containerAgent]}
      entering={isUser ? FadeInRight.duration(300) : FadeInLeft.duration(300)}
    >
      {/* Agent color accent stripe */}
      {!isUser && agentColor && (
        <View style={[styles.agentStripe, { backgroundColor: agentColor }]} />
      )}

      <View style={[
        styles.bubble,
        isUser ? styles.bubbleUser : styles.bubbleAgent,
        !isUser && agentColor && { borderColor: agentColor + '30' },
      ]}>
        {/* Agent label if has identity */}
        {!isUser && agentConfig && (
          <View style={styles.agentLabel}>
            <View style={[styles.agentDot, { backgroundColor: agentColor }]} />
            <Text style={[styles.agentLabelText, { color: agentColor }]}>{agentConfig.name}</Text>
          </View>
        )}

        {isTyping ? (
          <TypingIndicator />
        ) : (
          <>
            {text && (
              <Text style={[styles.text, isUser ? styles.textUser : styles.textAgent]}>
                {renderFormattedText(text, isUser, agentColor)}
              </Text>
            )}
            {children}
            {timestamp !== '' && (
              <View style={styles.meta}>
                <Text style={[styles.timestamp, isUser ? styles.tsUser : styles.tsAgent]}>
                  {timestamp}
                </Text>
                {isUser && (
                  <MaterialIcons name="done-all" size={12} color={Colors.onPrimary} style={{ opacity: 0.7, marginLeft: 2 }} />
                )}
              </View>
            )}
          </>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    maxWidth: '88%',
    alignItems: 'flex-end',
  },
  containerUser: { alignSelf: 'flex-end' },
  containerAgent: { alignSelf: 'flex-start' },
  agentStripe: {
    width: 3,
    borderRadius: 2,
    alignSelf: 'stretch',
    marginRight: 8,
    minHeight: 36,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.chatBubble,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: BorderRadius.chatBubbleFlat,
  },
  bubbleAgent: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderBottomLeftRadius: BorderRadius.chatBubbleFlat,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  agentLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 5,
  },
  agentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  agentLabelText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  text: { fontSize: 15, lineHeight: 22 },
  textUser: { color: Colors.onPrimary },
  textAgent: { color: Colors.onSurface },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 5 },
  timestamp: { fontSize: 10 },
  tsUser: { color: Colors.onPrimary, opacity: 0.7 },
  tsAgent: { color: Colors.onSurfaceVariant, opacity: 0.6 },
  systemContainer: { alignItems: 'center', marginVertical: Spacing.md },
  systemChip: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '60',
  },
  systemText: { fontSize: 11, color: Colors.onSurfaceVariant, fontWeight: '500' },
});
