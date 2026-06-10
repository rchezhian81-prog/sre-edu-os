import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  RefreshControl, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth.store';
import { parentApi } from '@/lib/api';
import { NeuCard } from '@/components/NeuCard';
import { KpiCard } from '@/components/KpiCard';
import { AttendanceBar } from '@/components/AttendanceBar';
import { NEU, FONT, RADIUS, ROLES, raiseShadow } from '@/constants/theme';

const ACCENT = ROLES.parent.accent;

const DEMO_CHILDREN = [
  { id: 'c1', name: 'Kavya', class: '10-A', attendance: 88, fees: 'Paid', nextExam: 'Math - Jun 12' },
  { id: 'c2', name: 'Arun',  class: '7-B',  attendance: 72, fees: 'Due ₹4,500', nextExam: 'Science - Jun 10' },
];

export default function ParentDashboard() {
  const { user, logout } = useAuthStore();
  const [selected, setSelected] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const child = DEMO_CHILDREN[selected];
  const feesPaid = child.fees === 'Paid';

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ACCENT} />}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.name}>{user?.name ?? 'Parent'}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={[styles.avatar, raiseShadow('sm')]}>
            <Text style={{ color: ACCENT, fontWeight: '800', fontSize: FONT.md }}>
              {(user?.name ?? 'P')[0]}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Child selector */}
        <View style={styles.tabs}>
          {DEMO_CHILDREN.map((c, i) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.tab, i === selected && styles.tabActive]}
              onPress={() => setSelected(i)}
            >
              <Text style={[styles.tabText, i === selected && { color: ACCENT }]}>
                {c.name}
              </Text>
              <Text style={styles.tabSub}>{c.class}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* KPIs */}
        <View style={styles.kpiRow}>
          <KpiCard label="Attendance" value={`${child.attendance}%`} accent={ACCENT} icon="📅" />
          <KpiCard label="Fees" value={feesPaid ? '✓ Paid' : 'Due'} accent={feesPaid ? '#10B981' : '#EF4444'} icon="💳" />
        </View>

        {/* Attendance card */}
        <NeuCard style={styles.card}>
          <Text style={styles.cardTitle}>Attendance Overview</Text>
          <AttendanceBar percentage={child.attendance} accent={ACCENT} label="This month" />
          <Text style={[styles.warn, { display: child.attendance < 75 ? 'flex' : 'none' }]}>
            ⚠️ Below 75% — contact school
          </Text>
        </NeuCard>

        {/* Upcoming exam */}
        <NeuCard style={styles.card}>
          <Text style={styles.cardTitle}>Next Exam</Text>
          <View style={[styles.examBadge, { backgroundColor: ACCENT + '15' }]}>
            <Text style={{ fontSize: 28 }}>📝</Text>
            <View>
              <Text style={[styles.examName, { color: ACCENT }]}>{child.nextExam}</Text>
              <Text style={styles.examSub}>Tap Results to see previous scores</Text>
            </View>
          </View>
        </NeuCard>

        {/* Fees status */}
        {!feesPaid && (
          <NeuCard style={[styles.card, { borderWidth: 1.5, borderColor: '#EF444440' }]}>
            <Text style={styles.cardTitle}>Fee Alert</Text>
            <Text style={styles.feeAmt}>{child.fees}</Text>
            <Text style={styles.feeSub}>Tap Fees tab to pay online</Text>
          </NeuCard>
        )}

        {/* Bus tracking teaser */}
        <NeuCard style={styles.card}>
          <Text style={styles.cardTitle}>🚌 Bus Tracking</Text>
          <View style={styles.busRow}>
            <View style={[styles.busDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.busText}>Bus 04 — 2.3 km away · ETA 8 min</Text>
          </View>
        </NeuCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: NEU.surface },
  scroll:    { padding: 20, paddingBottom: 40 },
  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting:  { fontSize: FONT.sm, color: NEU.text.secondary },
  name:      { fontSize: FONT.xl, fontWeight: '800', color: NEU.text.primary },
  avatar:    { width: 44, height: 44, borderRadius: 22, backgroundColor: NEU.surface, alignItems: 'center', justifyContent: 'center' },
  tabs:      { flexDirection: 'row', gap: 12, marginBottom: 20 },
  tab:       { flex: 1, backgroundColor: NEU.surface, borderRadius: RADIUS.md, padding: 12, alignItems: 'center',
               shadowColor: NEU.shadow, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 3 },
  tabActive: { backgroundColor: '#0EA5E910', borderWidth: 1.5, borderColor: '#0EA5E940' },
  tabText:   { fontSize: FONT.md, fontWeight: '700', color: NEU.text.primary },
  tabSub:    { fontSize: FONT.xs, color: NEU.text.muted },
  kpiRow:    { flexDirection: 'row', gap: 12, marginBottom: 16 },
  card:      { marginBottom: 16 },
  cardTitle: { fontSize: FONT.md, fontWeight: '700', color: NEU.text.primary, marginBottom: 12 },
  warn:      { fontSize: FONT.sm, color: '#EF4444', marginTop: 8, fontWeight: '600' },
  examBadge: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12, borderRadius: RADIUS.md },
  examName:  { fontSize: FONT.md, fontWeight: '700' },
  examSub:   { fontSize: FONT.xs, color: NEU.text.muted, marginTop: 2 },
  feeAmt:    { fontSize: FONT.xl, fontWeight: '800', color: '#EF4444', marginBottom: 4 },
  feeSub:    { fontSize: FONT.sm, color: NEU.text.secondary },
  busRow:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  busDot:    { width: 10, height: 10, borderRadius: 5 },
  busText:   { fontSize: FONT.sm, color: NEU.text.secondary },
});
