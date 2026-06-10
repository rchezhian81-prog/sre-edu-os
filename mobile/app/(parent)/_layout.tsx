import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { NEU, ROLES } from '@/constants/theme';

const accent = ROLES.parent.accent;

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <Text style={{ fontSize: focused ? 24 : 20 }}>{emoji}</Text>
      <Text style={[styles.iconLabel, { color: focused ? accent : NEU.text.muted }]}>{label}</Text>
    </View>
  );
}

export default function ParentLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: NEU.surface,
        borderTopColor: '#C8D0DC',
        height: 72,
        paddingBottom: 8,
        paddingTop: 6,
      },
      tabBarActiveTintColor:   accent,
      tabBarInactiveTintColor: NEU.text.muted,
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen name="dashboard" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home"       focused={focused} /> }} />
      <Tabs.Screen name="attendance" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📅" label="Attendance" focused={focused} /> }} />
      <Tabs.Screen name="results"    options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📊" label="Results"    focused={focused} /> }} />
      <Tabs.Screen name="fees"       options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💳" label="Fees"       focused={focused} /> }} />
      <Tabs.Screen name="messages"   options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Messages"   focused={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap:  { alignItems: 'center', gap: 2 },
  iconLabel: { fontSize: 9, fontWeight: '600' },
});
