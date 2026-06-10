import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NEU, FONT, RADIUS } from '@/constants/theme';

interface Props { percentage: number; accent: string; label?: string }

export function AttendanceBar({ percentage, accent, label }: Props) {
  const color = percentage >= 75 ? accent : percentage >= 60 ? '#F59E0B' : '#EF4444';
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(percentage, 100)}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.pct, { color }]}>{percentage}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:  { marginVertical: 4 },
  label: { fontSize: FONT.sm, color: NEU.text.secondary, marginBottom: 4 },
  track: { height: 10, backgroundColor: '#D1D9E6', borderRadius: RADIUS.sm, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: RADIUS.sm },
  pct:   { fontSize: FONT.xs, fontWeight: '700', marginTop: 2, textAlign: 'right' },
});
