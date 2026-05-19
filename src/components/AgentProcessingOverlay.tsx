import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { AGENT_CONFIGS, AgentId, Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

const { width, height } = Dimensions.get('window');

interface AgentProcessingOverlayProps {
  visible: boolean;
  agentId: AgentId;
  logLines?: string[];
  isComplete?: boolean;
}

export const AgentProcessingOverlay: React.FC<AgentProcessingOverlayProps> = ({
  visible,
  agentId,
  logLines = [],
  isComplete = false,
}) => {
  const agent = AGENT_CONFIGS[agentId];
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);

  // Animations
  const iconScale = useSharedValue(1);
  const iconRotate = useSharedValue(0);
  const glowOpacity = useSharedValue(0.4);
  const containerOpacity = useSharedValue(0);
  const iconBgScale = useSharedValue(0.5);

  useEffect(() => {
    if (visible) {
      setDisplayedLines([]);
      setCurrentMsgIndex(0);
      containerOpacity.value = withTiming(1, { duration: 300 });
      iconBgScale.value = withSpring(1, { damping: 12, stiffness: 120 });

      // Pulsing glow
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 900, easing: Easing.ease }),
          withTiming(0.3, { duration: 900, easing: Easing.ease }),
        ),
        -1,
        true,
      );

      // Rotating icon (for search/scan effects)
      if (agentId === 'DHOOND') {
        iconRotate.value = withRepeat(
          withTiming(360, { duration: 2000, easing: Easing.linear }),
          -1,
          false,
        );
      } else {
        // Pulse scale for other agents
        iconScale.value = withRepeat(
          withSequence(
            withTiming(1.15, { duration: 700, easing: Easing.ease }),
            withTiming(1, { duration: 700, easing: Easing.ease }),
          ),
          -1,
          true,
        );
      }

      // Cycle through status messages
      const interval = setInterval(() => {
        setCurrentMsgIndex(prev =>
          (prev + 1) % agent.statusMessages.length
        );
      }, 1400);

      // Stream log lines with delay
      logLines.forEach((line, i) => {
        setTimeout(() => {
          setDisplayedLines(prev => [...prev, line]);
        }, 600 + i * 400);
      });

      return () => clearInterval(interval);
    } else {
      containerOpacity.value = withTiming(0, { duration: 250 });
      iconBgScale.value = withTiming(0.5, { duration: 250 });
    }
  }, [visible, agentId]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotate.value}deg` },
    ],
  }));

  const iconBgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconBgScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} statusBarTranslucent>
      <Animated.View style={[styles.backdrop, containerStyle]}>
        {/* Glow behind icon */}
        <Animated.View
          style={[
            styles.glow,
            { backgroundColor: agent.glowColor },
            glowStyle,
          ]}
        />

        {/* Agent icon circle */}
        <Animated.View style={[styles.iconBgOuter, iconBgStyle]}>
          <View
            style={[
              styles.iconBg,
              { backgroundColor: agent.color },
            ]}
          >
            <Animated.View style={iconStyle}>
              <MaterialIcons
                name={agent.icon as any}
                size={40}
                color="#FFFFFF"
              />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Agent name */}
        <View style={styles.labelContainer}>
          <Text style={[styles.agentId, { color: agent.color }]}>
            {agent.name}
          </Text>
          <Text style={styles.agentDesc}>{agent.description}</Text>
        </View>

        {/* Animated status message */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: agent.color }]} />
          <Text style={[styles.statusText, { color: agent.color }]}>
            {isComplete ? '✓ Complete' : agent.statusMessages[currentMsgIndex]}
          </Text>
        </View>

        {/* Log lines terminal */}
        {displayedLines.length > 0 && (
          <View style={[styles.terminal, { borderColor: agent.color + '40' }]}>
            {displayedLines.map((line, i) => (
              <Text key={i} style={[styles.terminalLine, { color: agent.color }]}>
                {line}
              </Text>
            ))}
          </View>
        )}

        {/* Progress dots */}
        <View style={styles.dotsRow}>
          {[0, 1, 2].map(i => (
            <BounceDot key={i} color={agent.color} delay={i * 200} />
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
};

function BounceDot({ color, delay }: { color: string; delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 350, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 350, easing: Easing.in(Easing.ease) }),
        ),
        -1,
        false,
      );
    }, delay);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginHorizontal: 4 }, style]}
    />
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 12, 28, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    top: height / 2 - 200,
  },
  iconBgOuter: {
    marginBottom: 24,
  },
  iconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  labelContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  agentId: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: 'System',
    marginBottom: 4,
  },
  agentDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: 'System',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    minHeight: 22,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  terminal: {
    width: width - 64,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 32,
    gap: 4,
  },
  terminalLine: {
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 18,
    opacity: 0.9,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
