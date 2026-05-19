import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface TypewriterTextProps {
  text: string;
  style?: any;
  speed?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  style,
  speed = 30,
}) => {
  const [displayText, setDisplayText] = React.useState('');
  const cursorOpacity = useSharedValue(1);

  useEffect(() => {
    setDisplayText('');
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  useEffect(() => {
    cursorOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500, easing: Easing.ease }),
        withTiming(1, { duration: 500, easing: Easing.ease }),
      ),
      -1,
      true,
    );
  }, []);

  const cursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }));

  return (
    <Text style={style}>
      {displayText}
      <Animated.Text style={[{ color: style?.color || '#3B82F6' }, cursorStyle]}>
        ▊
      </Animated.Text>
    </Text>
  );
};
