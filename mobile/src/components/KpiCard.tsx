import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NeuCard } from './NeuCard';
import { NEU, FONT, RADIUS } from '@/constants/theme';

interface Props {
  label: string;
  value: string | number;
  accent: string;
  icon?: string;
  sub?: string;
}

export function KpiCard({ label, value, accent, icon, sub }: Props) {
  return (
    <NeuCard style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: accent + '20' }]}>
        <Text style={{ fontSize: 22 }}>{icon ?? '📊'}</Text>
      </View>
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </NeuCard>
  );
}

const styles = StyleSheet.create({
  card:    { alignItems: 'center', gap: 6, minWidth: 100, flex: 1 },
  iconWrap:{ width: 48, height: 48, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  value:   { fontSize: FONT.xl, fontWeight: '800' },
  label:   { fontSize: FONT.xs, color: NEU.text.secondary, textAlign: 'center' },
  sub:     { fontSize: FONT.xs, color: NEU.text.muted },
});
