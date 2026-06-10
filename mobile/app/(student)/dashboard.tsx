import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth.store';
import { NeuCard } from '@/components/NeuCard';
import { KpiCard } from '@/components/KpiCard';
import { AttendanceBar } from '@/components/AttendanceBar';
import { NEU, FONT, RADIUS, ROLES, raiseShadow } from '@/constants/theme';

const ACCENT = ROLES.student.accent;

const SUBJECTS = [
  { name: 'Mathematics',  score: 88, max: 100 },
  { name: 'Physics',      score: 76, max: 100 },
  { name: 'Chemistry',    score: 82, max: 100 },
  { name: 'English',      score: 91, max: 100 },
  { name: 'Computer Sc.', score: 95, max: 100 },
];

const UPCOMING = [
  { subject: 'Mathematics', date: 'Jun 12', type: 'Unit Test' },
  { subject: 'Physics',     date: 'Jun 15', type: 'Practical' },
];

export default function StudentDashboard() {
  const { user, logout } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const avgScore = Math.round(SUBJECTS.reduce((s, x) => s + x.score, 0) / SUBJECTS.length);
  const grade = avgScore >= 90 ? 'A+' : avgScore >= 80 ? 'A' : avgScore >= 70 ? 'B+' : 'B';

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ACCENT} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello 👋</Text>
            <Text style={styles.name}>{user?.name ?? 'Student'}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={[styles.avatar, raiseShadow('sm')]}>
            <Text style={{ color: ACCENT, fontWeight: '800', fontSize: FONT.md }}>
              {(user?.name ?? 'S')[0]}
            </Text>
          </TouchableOpacity>
        </View>

        {/* KPIs */}
        <View style={styles.kpiRow}>
          <KpiCard label="Attendance" value="87%"        accent={ACCENT}    icon="📅" />
          <KpiCard label="Avg Score"  value={`${avgScore}%`} accent="#7C3AED" icon="📊" />
          <KpiCard label="Grade"      value={grade}       accent="#F59E0B"   icon="🏆" />
        </View>

        {/* Attendance */}
        <NeuCard style={styles.card}>
          <Text style={styles.cardTitle}>Attendance This Month</Text>
          <AttendanceBar percentage={87} accent={ACCENT} />
        </NeuCard>

        {/* Subject scores */}
        <NeuCard style={styles.card}>
          <Text style={styles.cardTitle}>Subject Performance</Text>
          {SUBJECTS.map(s => (
            <View key={s.name} style={styles.subjectRow}>
              <Text style={styles.subjectName}>{s.name}</Text>
              <View style={styles.subjectBarWrap}>
                <View style={[styles.subjectBar, { width: `${s.score}%`, backgroundColor: ACCENT }]} />
              </View>
              <Text style={styles.subjectScore}>{s.score}</Text>
            </View>
          ))}
        </NeuCard>

        {/* Upcoming exams */}
        <NeuCard style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Exams</Text>
          {UPCOMING.map(e => (
            <View key={e.subject} style={styles.examRow}>
              <View style={[styles.examDot, { backgroundColor: ACCENT }]} />
              <View>
                <Text style={styles.examSubject}>{e.subject}</Text>
                <Text style={styles.examDate}>{e.type} · {e.date}</Text>
              </View>
            </View>
          ))}
        </NeuCard>

        {/* Achievements */}
        <NeuCard style={styles.card}>
          <Text style={styles.cardTitle}>Achievements</Text>
          <View style={styles.badges}>
            {['🏆 Top Scorer', '📚 Perfect Attendance', '⭐ Subject Topper'].map(b => (
              <View key={b} style={[styles.badge, { backgroundColor: ACCENT + '18' }]}>
                <Text style={[styles.badgeText, { color: ACCENT }]}>{b}</Text>
              </View>
            ))}
          </View>
        </NeuCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:          { flex: 1, backgroundColor: NEU.surface },
  scroll:        { padding: 20, paddingBottom: 40 },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting:      { fontSize: FONT.sm, color: NEU.text.secondary },
  name:          { fontSize: FONT.xl, fontWeight: '800', color: NEU.text.primary },
  avatar:        { width: 44, height: 44, borderRadius: 22, backgroundColor: NEU.surface, alignItems: 'center', justifyContent: 'center' },
  kpiRow:        { flexDirection: 'row', gap: 10, marginBottom: 16 },
  card:          { marginBottom: 16 },
  cardTitle:     { fontSize: FONT.md, fontWeight: '700', color: NEU.text.primary, marginBottom: 14 },
  subjectRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  subjectName:   { width: 90, fontSize: FONT.sm, color: NEU.text.secondary },
  subjectBarWrap:{ flex: 1, height: 8, backgroundColor: '#D1D9E6', borderRadius: 4, overflow: 'hidden' },
  subjectBar:    { height: '100%', borderRadius: 4 },
  subjectScore:  { width: 30, fontSize: FONT.sm, fontWeight: '700', color: NEU.text.primary, textAlign: 'right' },
  examRow:       { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  examDot:       { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  examSubject:   { fontSize: FONT.md, fontWeight: '700', color: NEU.text.primary },
  examDate:      { fontSize: FONT.sm, color: NEU.text.muted, marginTop: 2 },
  badges:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge:         { paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.sm },
  badgeText:     { fontSize: FONT.xs, fontWeight: '700' },
});
