import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeuCard } from '@/components/NeuCard';
import { NEU, FONT, RADIUS, ROLES } from '@/constants/theme';

const ACCENT = ROLES.student.accent;

const EXAMS = [
  { name: 'Mid-Term Exam', date: 'March 2024', subjects: [
    { n: 'Mathematics', s: 88 }, { n: 'Physics', s: 76 },
    { n: 'Chemistry', s: 82 }, { n: 'English', s: 91 },
  ]},
  { name: 'Unit Test 1', date: 'Jan 2024', subjects: [
    { n: 'Mathematics', s: 74 }, { n: 'Physics', s: 68 },
    { n: 'Chemistry', s: 79 }, { n: 'English', s: 85 },
  ]},
];

const grade = (s: number) => s >= 90 ? 'A+' : s >= 80 ? 'A' : s >= 70 ? 'B+' : s >= 60 ? 'B' : 'C';

export default function StudentResults() {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>My Results</Text>
        {EXAMS.map(exam => {
          const avg = Math.round(exam.subjects.reduce((s, x) => s + x.s, 0) / exam.subjects.length);
          return (
            <NeuCard key={exam.name} style={styles.card}>
              <Text style={styles.examName}>{exam.name}</Text>
              <Text style={styles.examDate}>{exam.date}</Text>
              <View style={styles.avgRow}>
                <Text style={styles.avgLabel}>Overall</Text>
                <Text style={[styles.avgVal, { color: avg >= 80 ? '#10B981' : '#F59E0B' }]}>
                  {avg}% · Grade {grade(avg)}
                </Text>
              </View>
              {exam.subjects.map(s => (
                <View key={s.n} style={styles.subRow}>
                  <Text style={styles.subName}>{s.n}</Text>
                  <View style={styles.barWrap}>
                    <View style={[styles.barFill, { width: `${s.s}%`, backgroundColor: ACCENT }]} />
                  </View>
                  <Text style={styles.subScore}>{s.s}</Text>
                  <Text style={[styles.subGrade, { color: ACCENT }]}>{grade(s.s)}</Text>
                </View>
              ))}
            </NeuCard>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:     { flex: 1, backgroundColor: NEU.surface },
  scroll:   { padding: 20, paddingBottom: 40 },
  heading:  { fontSize: FONT.xl, fontWeight: '800', color: NEU.text.primary, marginBottom: 20 },
  card:     { marginBottom: 16 },
  examName: { fontSize: FONT.lg, fontWeight: '800', color: NEU.text.primary },
  examDate: { fontSize: FONT.sm, color: NEU.text.muted, marginBottom: 12 },
  avgRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8,
              borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E8EDF4', marginBottom: 12 },
  avgLabel: { fontSize: FONT.sm, color: NEU.text.secondary, fontWeight: '600' },
  avgVal:   { fontSize: FONT.sm, fontWeight: '800' },
  subRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  subName:  { width: 90, fontSize: FONT.sm, color: NEU.text.secondary },
  barWrap:  { flex: 1, height: 8, backgroundColor: '#D1D9E6', borderRadius: 4, overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: 4 },
  subScore: { width: 28, fontSize: FONT.sm, fontWeight: '700', color: NEU.text.primary, textAlign: 'right' },
  subGrade: { width: 24, fontSize: FONT.xs, fontWeight: '800' },
});
