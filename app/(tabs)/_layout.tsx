import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../src/constants/Colors';
import { Spacing, BorderRadius } from '../../src/constants';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface TabIconProps {
  icon: IconName;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  const scale = useSharedValue(focused ? 1 : 0.9);
  const pillWidth = useSharedValue(focused ? 56 : 0);
  const pillOpacity = useSharedValue(focused ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 0.9, { damping: 14, stiffness: 140 });
    pillWidth.value = withSpring(focused ? 56 : 0, { damping: 16, stiffness: 120 });
    pillOpacity.value = withSpring(focused ? 1 : 0, { damping: 16 });
  }, [focused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pillStyle = useAnimatedStyle(() => ({
    width: pillWidth.value,
    opacity: pillOpacity.value,
  }));

  return (
    <View style={styles.tabItem}>
      {/* Active pill background */}
      <Animated.View style={[styles.activePill, pillStyle]} />
      {/* Icon */}
      <Animated.View style={iconStyle}>
        <MaterialIcons
          name={icon}
          size={24}
          color={focused ? Colors.primary : Colors.onSurfaceVariant}
        />
      </Animated.View>
      {/* Label */}
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.onPrimary,
        headerTitleStyle: { fontSize: 18, fontWeight: '700' },
        headerLeft: () => (
          <View style={styles.headerAvatar}>
            <MaterialIcons name="smart-toy" size={20} color={Colors.primary} />
          </View>
        ),
        headerTitle: 'KHIDMAT Agent',
        headerTitleContainerStyle: { marginLeft: -8 },
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="chat-bubble-outline" label="Chat" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="build-circle" label="Services" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="history" label="History" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="person-outline" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.onPrimary,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: Spacing.md,
    borderWidth: 1, borderColor: Colors.primaryContainer,
  },
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: Colors.glassWhite,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 4,
    // Glassmorphism via shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    gap: 3,
    minWidth: 60,
  },
  activePill: {
    position: 'absolute',
    top: -2,
    height: 32,
    backgroundColor: Colors.secondaryFixed,
    borderRadius: 99,
  },
  tabLabel: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
