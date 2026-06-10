import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeuCard } from '@/components/NeuCard';
import { NEU, FONT, RADIUS, ROLES } from '@/constants/theme';

const ACCENT = ROLES.parent.accent;
const SUBJECTS = [
  { name: 'Mathematics', kavya: 88, arun: 72 },
  { name: 'Physics',     kavya: 76, arun: 68 },
  { name: 'Chemistry',   kavya: 82, arun: 75 },
  { name: 'English',     kavya: 91, arun: 80 },
];
const CHILDREN = ['Kavya', 'Arun'];

export default function ParentResults() {
  const [sel, setSel] = useState(0);
  const scores = SUBJECTS.map(s => ({ name: s.name, score: sel === 0 ? s.kavya : s.arun }));
  const avg = Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length);
  const grade = avg >= 90 ? 'A+' : avg >= 80 ? 'A' : avg >= 70 ? 'B+' : 'B';

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Results</Text>
        <View style={styles.tabs}>
          {CHILDREN.map((c, i) => (
            <TouchableOpacity key={c} style={[styles.tab, i === sel && styles.tabActive]} onPress={() => setSel(i)}>
              <Text style={[styles.tabText, i === sel && { color: ACCENT }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <NeuCard style={styles.summary}>
          <Text style={styles.avg}>{avg}%</Text>
          <Text style={[styles.grade, { color: avg >= 80 ? '#10B981' : '#F59E0B' }]}>Grade {grade}</Text>
        </NeuCard>
        {scores.map(s => (
          <NeuCard key={s.name} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.sub}>{s.name}</Text>
              <Text style={[styles.score, { color: s.score >= 80 ? '#10B981' : s.score >= 60 ? '#F59E0B' : '#EF4444' }]}>
                {s.score}/100
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${s.score}%`, backgroundColor: ACCENT }]} />
            </View>
          </NeuCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:     { flex: 1, backgroundColor: NEU.surface },
  scroll:   { padding: 20, paddingBottom: 40 },
  heading:  { fontSize: FONT.xl, fontWeight: '800', color: NEU.text.primary, marginBottom: 20 },
  tabs:     { flexDirection: 'row', gap: 12, marginBottom: 20 },
  tab:      { flex: 1, backgroundColor: NEU.surface, borderRadius: RADIUS.md, padding: 12, alignItems: 'center',
              shadowColor: NEU.shadow, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 3 },
  tabActive:{ borderWidth: 1.5, borderColor: ACCENT + '50' },
  tabText:  { fontSize: FONT.sm, fontWeight: '700', color: NEU.text.secondary },
  summary:  { alignItems: 'center', marginBottom: 20 },
  avg:      { fontSize: 40, fontWeight: '900', color: NEU.text.primary },
  grade:    { fontSize: FONT.lg, fontWeight: '700' },
  card:     { marginBottom: 12 },
  row:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sub:      { fontSize: FONT.md, fontWeight: '600', color: NEU.text.primary },
  score:    { fontSize: FONT.md, fontWeight: '800' },
  barTrack: { height: 8, backgroundColor: '#D1D9E6', borderRadius: 4, overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: 4 },
});
