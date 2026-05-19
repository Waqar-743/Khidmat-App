import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../src/constants';
import Animated, { FadeIn, FadeOut, Easing, withTiming, useSharedValue, useAnimatedStyle, withRepeat, withSequence } from 'react-native-reanimated';

export default function SplashScreen() {
  const router = useRouter();
  
  // Minimal animation for logo
  const scale = useSharedValue(0.9);
  
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Auto navigate to main app after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <View style={styles.container}>
      <Animated.View 
        entering={FadeIn.duration(1000)}
        exiting={FadeOut.duration(500)}
        style={[styles.content, animatedStyle]}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>K</Text>
        </View>
        <Text style={styles.titleUrdu}>خدمت</Text>
        <Text style={styles.titleEnglish}>KHIDMAT</Text>
        <Text style={styles.tagline}>Aapki khidmat mein, hamesha.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    ...Typography.headlineLg,
    color: Colors.primaryContainer,
    fontSize: 48,
    lineHeight: 56,
  },
  titleUrdu: {
    ...Typography.urduDisplay,
    fontSize: 48,
    lineHeight: 64,
    color: Colors.onPrimaryContainer,
    marginBottom: -8,
  },
  titleEnglish: {
    ...Typography.headlineLg,
    color: Colors.onPrimary,
    letterSpacing: 4,
    marginBottom: 16,
  },
  tagline: {
    ...Typography.bodyLg,
    color: Colors.primaryFixedDim,
  },
});
