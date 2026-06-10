import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeuCard } from '@/components/NeuCard';
import { AttendanceBar } from '@/components/AttendanceBar';
import { NEU, FONT, RADIUS, ROLES } from '@/constants/theme';

const ACCENT = ROLES.parent.accent;
const CHILDREN = ['Kavya (10-A)', 'Arun (7-B)'];
const DATA = [
  [{ month: 'Apr', pct: 92 }, { month: 'May', pct: 88 }, { month: 'Jun', pct: 85 }],
  [{ month: 'Apr', pct: 78 }, { month: 'May', pct: 72 }, { month: 'Jun', pct: 69 }],
];

export default function ParentAttendance() {
  const [sel, setSel] = useState(0);
  const monthly = DATA[sel];

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Attendance</Text>
        <View style={styles.tabs}>
          {CHILDREN.map((c, i) => (
            <TouchableOpacity key={c} style={[styles.tab, i === sel && styles.tabActive]} onPress={() => setSel(i)}>
              <Text style={[styles.tabText, i === sel && { color: ACCENT }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <NeuCard style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Breakdown</Text>
          {monthly.map(m => (
            <AttendanceBar key={m.month} percentage={m.pct} accent={ACCENT} label={m.month} />
          ))}
          {monthly[monthly.length-1].pct < 75 && (
            <View style={styles.alert}>
              <Text style={styles.alertText}>⚠️ Attendance below 75% — risk of detention</Text>
            </View>
          )}
        </NeuCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: NEU.surface },
  scroll:    { padding: 20, paddingBottom: 40 },
  heading:   { fontSize: FONT.xl, fontWeight: '800', color: NEU.text.primary, marginBottom: 20 },
  tabs:      { flexDirection: 'row', gap: 12, marginBottom: 20 },
  tab:       { flex: 1, backgroundColor: NEU.surface, borderRadius: RADIUS.md, padding: 12, alignItems: 'center',
               shadowColor: NEU.shadow, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 3 },
  tabActive: { borderWidth: 1.5, borderColor: ACCENT + '50' },
  tabText:   { fontSize: FONT.sm, fontWeight: '700', color: NEU.text.secondary },
  card:      { marginBottom: 16 },
  cardTitle: { fontSize: FONT.md, fontWeight: '700', color: NEU.text.primary, marginBottom: 14 },
  alert:     { marginTop: 12, backgroundColor: '#EF444415', borderRadius: RADIUS.md, padding: 12 },
  alertText: { fontSize: FONT.sm, color: '#EF4444', fontWeight: '600' },
});
