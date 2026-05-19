import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Text,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  FadeInDown,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, AGENT_CONFIGS } from '../../src/constants/Colors';
import { Spacing, BorderRadius } from '../../src/constants';
import { Typography } from '../../src/constants/Typography';
import { ChatBubble } from '../../src/components/ChatBubble';
import { SuggestionChips } from '../../src/components/SuggestionChips';
import { useChatMessages, RichChatMessage } from '../../src/hooks/useChatMessages';
import { IntentCard } from '../../src/components/IntentCard';
import { BookingReceipt } from '../../src/components/BookingReceipt';
import { AgentProcessingOverlay } from '../../src/components/AgentProcessingOverlay';
import { AgentResultCard } from '../../src/components/AgentResultCard';
import { PulsingDot } from '../../src/components/PulsingDot';

const { width } = Dimensions.get('window');

const SUGGESTIONS = [
  'AC Technician',
  'Plumber',
  'Electrician',
  'Tutor',
  'Beautician',
  'Deep Cleaning',
];

export default function ChatScreen() {
  const router = useRouter();
  const {
    messages,
    isAgentTyping,
    activeAgentId,
    activeAgentLogs,
    lastParsedRequest,
    orchestrate,
    confirmAndExecute,
    restartFromDhoond,
    addAgentMessage,
  } = useChatMessages();

  const [inputText, setInputText] = useState('');
  const [hasConfirmedIntent, setHasConfirmedIntent] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Send button animation
  const sendScale = useSharedValue(1);
  const sendStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendScale.value }],
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [messages, isAgentTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    // Animate button press
    sendScale.value = withSequence(
      withTiming(0.85, { duration: 80 }),
      withSpring(1, { damping: 10 }),
    );
    const text = inputText;
    setInputText('');
    setHasConfirmedIntent(false);
    await orchestrate(text);
  };

  const handleSuggestion = (text: string) => setInputText(text);

  const handleIntentConfirm = async () => {
    if (hasConfirmedIntent) return;
    setHasConfirmedIntent(true);
    await confirmAndExecute();
  };

  const handleIntentEdit = () => {
    addAgentMessage('Koi baat nahi! Apni request dobara bataein ✏️');
  };

  const renderMessage = (msg: RichChatMessage) => {
    // Rich negotiation card
    if (msg.type === 'agent' && msg.negotiation) {
      return (
        <Animated.View key={msg.id} entering={FadeInDown.duration(350).springify()}>
          <AgentResultCard
            agentId="MOL-BHAAV"
            negotiation={msg.negotiation}
            onAcceptDeal={() => {}} // already executed in pipeline
            onFindAnother={restartFromDhoond}
          />
        </Animated.View>
      );
    }

    // Rich provider discovery card
    if (msg.type === 'agent' && msg.providers) {
      return (
        <Animated.View key={msg.id} entering={FadeInDown.duration(350).springify()}>
          <AgentResultCard
            agentId="BHAROSA"
            providers={msg.providers}
            summaryText={msg.text}
            onSelectProvider={() => {}}
            onChooseBest={() => {}}
          />
        </Animated.View>
      );
    }

    // System date chip
    if (msg.type === 'system') {
      return (
        <View key={msg.id} style={styles.systemChipRow}>
          <View style={styles.systemChip}>
            <Text style={styles.systemChipText}>{msg.text}</Text>
          </View>
        </View>
      );
    }

    // Intent confirmation card
    if (msg.type === 'intent-card' && msg.intent) {
      return (
        <Animated.View key={msg.id} style={styles.cardContainer} entering={FadeInDown.duration(400).springify()}>
          <IntentCard
            intent={msg.intent}
            onConfirm={handleIntentConfirm}
            onEdit={handleIntentEdit}
          />
        </Animated.View>
      );
    }

    // Booking receipt card
    if (msg.type === 'receipt' && msg.receipt) {
      return (
        <Animated.View key={msg.id} style={styles.cardContainer} entering={FadeInDown.duration(400).springify()}>
          <BookingReceipt
            receipt={msg.receipt}
            onViewBookings={() => router.push('/agent-logs')}
            onShare={() => {}}
          />
        </Animated.View>
      );
    }

    // Standard agent/user bubbles
    return (
      <Animated.View key={msg.id} entering={FadeInDown.duration(300)}>
        <ChatBubble
          type={msg.type as any}
          text={msg.text}
          timestamp={msg.timestamp}
          agentId={msg.agentId}
        />
      </Animated.View>
    );
  };

  // Active agent config for the inline indicator
  const activeAgent = activeAgentId ? AGENT_CONFIGS[activeAgentId] : null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Agent processing overlay (full-screen modal) */}
      {activeAgentId && (
        <AgentProcessingOverlay
          visible={!!activeAgentId}
          agentId={activeAgentId}
          logLines={activeAgentLogs}
        />
      )}

      {/* Messages area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}

        {/* Inline agent status row when typing (no overlay) */}
        {isAgentTyping && !activeAgentId && (
          <Animated.View entering={FadeInDown.duration(200)} style={styles.typingRow}>
            <View style={styles.typingDots}>
              <View style={[styles.typingDot, { backgroundColor: Colors.primary }]} />
              <View style={[styles.typingDot, { backgroundColor: Colors.primary, opacity: 0.6 }]} />
              <View style={[styles.typingDot, { backgroundColor: Colors.primary, opacity: 0.3 }]} />
            </View>
          </Animated.View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom input area */}
      <View style={styles.inputArea}>
        {/* Suggestion chips when fresh */}
        {messages.length <= 2 && (
          <SuggestionChips suggestions={SUGGESTIONS} onSelect={handleSuggestion} />
        )}

        <View style={styles.inputRow}>
          {/* Add button */}
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="add-circle-outline" size={24} color={Colors.outline} />
          </TouchableOpacity>

          {/* Text input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={Colors.onSurfaceVariant + '99'}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              multiline
              maxLength={300}
            />
          </View>

          {/* Mic or Send */}
          {inputText.length > 0 ? (
            <Animated.View style={sendStyle}>
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <MaterialIcons name="send" size={20} color={Colors.onPrimary} />
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialIcons name="mic" size={24} color={Colors.outline} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messagesContainer: { flex: 1 },
  messagesContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  systemChipRow: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  systemChip: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '60',
  },
  systemChipText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  cardContainer: {
    marginBottom: Spacing.md,
    maxWidth: '97%',
    alignSelf: 'flex-start',
  },
  typingRow: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  inputArea: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant + '80',
    paddingBottom: Platform.OS === 'ios' ? 92 : 72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    color: Colors.onSurface,
    maxHeight: 120,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
