import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  dark?: boolean;
  borderColor?: string;
  padding?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  dark = false,
  borderColor,
  padding = 16,
}) => {
  return (
    <View
      style={[
        styles.glass,
        dark ? styles.glassDark : styles.glassLight,
        {
          borderColor: borderColor ?? (dark ? Colors.glassBorderDark : Colors.glassBorder),
          padding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  glass: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  glassLight: {
    backgroundColor: Colors.glassWhite,
  },
  glassDark: {
    backgroundColor: Colors.glassDark,
  },
});
