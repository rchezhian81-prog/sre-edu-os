import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeuCard } from '@/components/NeuCard';
import { AttendanceBar } from '@/components/AttendanceBar';
import { NEU, FONT, RADIUS, ROLES } from '@/constants/theme';

const ACCENT = ROLES.student.accent;

const MONTHLY = [
  { month: 'Feb', pct: 92 }, { month: 'Mar', pct: 88 },
  { month: 'Apr', pct: 80 }, { month: 'May', pct: 87 }, { month: 'Jun', pct: 75 },
];

const RECENT = [
  { date: 'Jun 5',  day: 'Wed', status: 'P' },
  { date: 'Jun 4',  day: 'Tue', status: 'P' },
  { date: 'Jun 3',  day: 'Mon', status: 'A' },
  { date: 'Jun 2',  day: 'Sun', status: '-' },
  { date: 'May 31', day: 'Fri', status: 'P' },
  { date: 'May 30', day: 'Thu', status: 'L' },
];

const statusColor = (s: string) =>
  s === 'P' ? '#10B981' : s === 'A' ? '#EF4444' : s === 'L' ? '#F59E0B' : NEU.text.muted;
const statusLabel = (s: string) =>
  s === 'P' ? 'Present' : s === 'A' ? 'Absent' : s === 'L' ? 'Leave' : 'Holiday';

export default function AttendanceScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>My Attendance</Text>

        {/* Overall */}
        <NeuCard style={styles.card}>
          <Text style={styles.cardTitle}>Overall — 87%</Text>
          <AttendanceBar percentage={87} accent={ACCENT} label="This Academic Year" />
          <View style={styles.legend}>
            {[['Present','87','#10B981'],['Absent','9','#EF4444'],['Leave','4','#F59E0B']].map(([l,v,c]) => (
              <View key={l} style={styles.legItem}>
                <View style={[styles.legDot, { backgroundColor: c }]} />
                <Text style={styles.legLabel}>{l}</Text>
                <Text style={[styles.legVal, { color: c }]}>{v}</Text>
              </View>
            ))}
          </View>
        </NeuCard>

        {/* Monthly trend */}
        <NeuCard style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Trend</Text>
          {MONTHLY.map(m => (
            <AttendanceBar key={m.month} percentage={m.pct} accent={ACCENT} label={m.month} />
          ))}
        </NeuCard>

        {/* Recent days */}
        <NeuCard style={styles.card}>
          <Text style={styles.cardTitle}>Recent Days</Text>
          {RECENT.map(d => (
            <View key={d.date} style={styles.dayRow}>
              <Text style={styles.dayDate}>{d.date}</Text>
              <Text style={styles.dayDay}>{d.day}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor(d.status) + '20' }]}>
                <Text style={[styles.statusText, { color: statusColor(d.status) }]}>
                  {statusLabel(d.status)}
                </Text>
              </View>
            </View>
          ))}
        </NeuCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: NEU.surface },
  scroll:      { padding: 20, paddingBottom: 40 },
  heading:     { fontSize: FONT.xl, fontWeight: '800', color: NEU.text.primary, marginBottom: 20 },
  card:        { marginBottom: 16 },
  cardTitle:   { fontSize: FONT.md, fontWeight: '700', color: NEU.text.primary, marginBottom: 14 },
  legend:      { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },
  legItem:     { alignItems: 'center', gap: 4 },
  legDot:      { width: 10, height: 10, borderRadius: 5 },
  legLabel:    { fontSize: FONT.xs, color: NEU.text.secondary },
  legVal:      { fontSize: FONT.lg, fontWeight: '800' },
  dayRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
                 borderBottomWidth: 1, borderBottomColor: '#E8EDF4' },
  dayDate:     { width: 60, fontSize: FONT.sm, color: NEU.text.primary, fontWeight: '600' },
  dayDay:      { flex: 1, fontSize: FONT.sm, color: NEU.text.muted },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.sm },
  statusText:  { fontSize: FONT.xs, fontWeight: '700' },
});
