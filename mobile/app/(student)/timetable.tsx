import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeuCard } from '@/components/NeuCard';
import { NEU, FONT, RADIUS, ROLES } from '@/constants/theme';

const ACCENT = ROLES.student.accent;
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const SCHEDULE: Record<string, { time: string; subject: string; teacher: string }[]> = {
  Mon: [
    { time: '08:00', subject: 'Mathematics',  teacher: 'Mr. Kumar' },
    { time: '09:00', subject: 'Physics',       teacher: 'Ms. Priya' },
    { time: '10:00', subject: 'English',       teacher: 'Mrs. Sharma' },
    { time: '11:30', subject: 'Chemistry',     teacher: 'Mr. Rajan' },
    { time: '12:30', subject: 'Lunch Break',   teacher: '' },
    { time: '13:30', subject: 'Computer Sc.',  teacher: 'Ms. Divya' },
    { time: '14:30', subject: 'Free Period',   teacher: '' },
  ],
  Tue: [
    { time: '08:00', subject: 'Chemistry',     teacher: 'Mr. Rajan' },
    { time: '09:00', subject: 'Mathematics',   teacher: 'Mr. Kumar' },
    { time: '10:00', subject: 'Computer Sc.',  teacher: 'Ms. Divya' },
    { time: '11:30', subject: 'Physics',       teacher: 'Ms. Priya' },
    { time: '12:30', subject: 'Lunch Break',   teacher: '' },
    { time: '13:30', subject: 'English',       teacher: 'Mrs. Sharma' },
  ],
  Wed: [
    { time: '08:00', subject: 'Physics',       teacher: 'Ms. Priya' },
    { time: '09:00', subject: 'English',       teacher: 'Mrs. Sharma' },
    { time: '11:30', subject: 'Mathematics',   teacher: 'Mr. Kumar' },
    { time: '12:30', subject: 'Lunch Break',   teacher: '' },
    { time: '13:30', subject: 'Physical Ed.',  teacher: 'Coach Anil' },
  ],
  Thu: [
    { time: '08:00', subject: 'Computer Sc.',  teacher: 'Ms. Divya' },
    { time: '09:00', subject: 'Chemistry',     teacher: 'Mr. Rajan' },
    { time: '10:00', subject: 'Physics',       teacher: 'Ms. Priya' },
    { time: '11:30', subject: 'Mathematics',   teacher: 'Mr. Kumar' },
    { time: '12:30', subject: 'Lunch Break',   teacher: '' },
    { time: '13:30', subject: 'English',       teacher: 'Mrs. Sharma' },
  ],
  Fri: [
    { time: '08:00', subject: 'English',       teacher: 'Mrs. Sharma' },
    { time: '09:00', subject: 'Mathematics',   teacher: 'Mr. Kumar' },
    { time: '10:00', subject: 'Chemistry',     teacher: 'Mr. Rajan' },
    { time: '11:30', subject: 'Computer Sc.',  teacher: 'Ms. Divya' },
    { time: '12:30', subject: 'Lunch Break',   teacher: '' },
    { time: '13:30', subject: 'Library',       teacher: '' },
  ],
};

const today = DAYS[new Date().getDay() - 1] ?? 'Mon';

export default function TimetableScreen() {
  const [day, setDay] = useState(today);
  const periods = SCHEDULE[day] ?? [];

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Timetable</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
          {DAYS.map(d => (
            <TouchableOpacity key={d} style={[styles.dayBtn, d === day && styles.dayBtnActive]} onPress={() => setDay(d)}>
              <Text style={[styles.dayText, d === day && { color: ACCENT }]}>{d}</Text>
              {d === today && <View style={[styles.todayDot, { backgroundColor: d === day ? ACCENT : '#A3B1C6' }]} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
        {periods.map((p, i) => (
          <View key={i} style={styles.periodRow}>
            <Text style={styles.periodTime}>{p.time}</Text>
            <NeuCard style={[
              styles.periodCard,
              (p.subject === 'Lunch Break' || p.subject === 'Free Period' || p.subject === 'Library') && styles.breakCard,
            ]}>
              <Text style={[styles.periodSubject,
                p.subject === 'Lunch Break' ? { color: '#F59E0B' } :
                p.subject === 'Free Period' ? { color: NEU.text.muted } : {}
              ]}>{p.subject}</Text>
              {p.teacher ? <Text style={styles.periodTeacher}>{p.teacher}</Text> : null}
            </NeuCard>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:          { flex: 1, backgroundColor: NEU.surface },
  scroll:        { padding: 20, paddingBottom: 40 },
  heading:       { fontSize: FONT.xl, fontWeight: '800', color: NEU.text.primary, marginBottom: 20 },
  dayScroll:     { marginBottom: 20 },
  dayBtn:        { paddingHorizontal: 18, paddingVertical: 10, borderRadius: RADIUS.md, marginRight: 10,
                   backgroundColor: NEU.surface, shadowColor: NEU.shadow,
                   shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.5, shadowRadius: 4, elevation: 2 },
  dayBtnActive:  { borderWidth: 1.5, borderColor: ACCENT },
  dayText:       { fontSize: FONT.md, fontWeight: '700', color: NEU.text.secondary },
  todayDot:      { width: 6, height: 6, borderRadius: 3, alignSelf: 'center', marginTop: 2 },
  periodRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  periodTime:    { width: 48, fontSize: FONT.sm, color: NEU.text.muted, fontWeight: '600', marginTop: 16 },
  periodCard:    { flex: 1, paddingVertical: 12 },
  breakCard:     { opacity: 0.7 },
  periodSubject: { fontSize: FONT.md, fontWeight: '700', color: NEU.text.primary },
  periodTeacher: { fontSize: FONT.sm, color: NEU.text.muted, marginTop: 2 },
});
