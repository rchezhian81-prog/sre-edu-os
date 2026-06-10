import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { NEU, RADIUS, raiseShadow } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  sunken?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function NeuCard({ children, style, sunken = false, size = 'md' }: Props) {
  return (
    <View style={[styles.card, sunken && styles.sunken, raiseShadow(size), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: NEU.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
  },
  sunken: {
    backgroundColor: '#D1D9E6',
    shadowColor: NEU.white,
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
