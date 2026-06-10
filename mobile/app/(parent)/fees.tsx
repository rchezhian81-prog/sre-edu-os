import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeuCard } from '@/components/NeuCard';
import { NeuButton } from '@/components/NeuButton';
import { NEU, FONT, RADIUS, ROLES, raiseShadow } from '@/constants/theme';

const ACCENT = ROLES.parent.accent;

const FEE_DATA = [
  { term: 'Term 1', amount: 18000, paid: 18000, status: 'PAID',    dueDate: '2024-04-10' },
  { term: 'Term 2', amount: 18000, paid: 13500, status: 'PARTIAL', dueDate: '2024-08-10' },
  { term: 'Term 3', amount: 18000, paid: 0,     status: 'PENDING', dueDate: '2024-12-10' },
];

export default function FeesScreen() {
  const [modal, setModal] = useState(false);
  const [payMode, setPayMode] = useState<'UPI'|'Card'|'NetBanking'>('UPI');
  const [payLoading, setPayLoading] = useState(false);

  const totalDue = FEE_DATA.reduce((s, f) => s + (f.amount - f.paid), 0);

  const handlePay = async () => {
    setPayLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setPayLoading(false);
    setModal(false);
    Alert.alert('Payment Successful', `₹${totalDue.toLocaleString()} paid via ${payMode}. Receipt sent to your email.`);
  };

  const statusColor = (s: string) => s === 'PAID' ? '#10B981' : s === 'PARTIAL' ? '#F59E0B' : '#EF4444';

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Fee Details</Text>

        {/* Summary */}
        <NeuCard style={styles.summary}>
          <Text style={styles.summaryLabel}>Total Outstanding</Text>
          <Text style={styles.summaryAmt}>₹{totalDue.toLocaleString()}</Text>
          {totalDue > 0 && (
            <NeuButton label="Pay Now" onPress={() => setModal(true)} accent={ACCENT} style={{ marginTop: 12 }} />
          )}
        </NeuCard>

        {/* Term rows */}
        {FEE_DATA.map(f => (
          <NeuCard key={f.term} style={styles.feeCard}>
            <View style={styles.feeRow}>
              <View>
                <Text style={styles.term}>{f.term}</Text>
                <Text style={styles.due}>Due: {f.dueDate}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: statusColor(f.status) + '20' }]}>
                <Text style={[styles.badgeText, { color: statusColor(f.status) }]}>{f.status}</Text>
              </View>
            </View>
            <View style={styles.amtRow}>
              <Text style={styles.amtLabel}>Paid: ₹{f.paid.toLocaleString()}</Text>
              <Text style={[styles.amtLabel, { color: '#EF4444' }]}>
                Due: ₹{(f.amount - f.paid).toLocaleString()}
              </Text>
            </View>
          </NeuCard>
        ))}
      </ScrollView>

      {/* Payment Modal */}
      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.overlay}>
          <NeuCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>Make Payment</Text>
            <Text style={styles.modalAmt}>₹{totalDue.toLocaleString()}</Text>

            <Text style={styles.modeLabel}>Payment Mode</Text>
            <View style={styles.modeRow}>
              {(['UPI', 'Card', 'NetBanking'] as const).map(m => (
                <TouchableOpacity key={m} style={[styles.modeBtn, payMode === m && styles.modeBtnActive]}
                  onPress={() => setPayMode(m)}>
                  <Text style={[styles.modeBtnText, payMode === m && { color: ACCENT }]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <NeuButton label="Confirm Payment" onPress={handlePay} loading={payLoading}
              accent={ACCENT} style={{ marginTop: 20 }} />
            <NeuButton label="Cancel" onPress={() => setModal(false)} variant="ghost"
              accent={ACCENT} style={{ marginTop: 10 }} />
          </NeuCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: NEU.surface },
  scroll:      { padding: 20, paddingBottom: 40 },
  heading:     { fontSize: FONT.xl, fontWeight: '800', color: NEU.text.primary, marginBottom: 20 },
  summary:     { alignItems: 'center', marginBottom: 20 },
  summaryLabel:{ fontSize: FONT.md, color: NEU.text.secondary },
  summaryAmt:  { fontSize: 36, fontWeight: '900', color: '#EF4444', marginTop: 4 },
  feeCard:     { marginBottom: 14 },
  feeRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  term:        { fontSize: FONT.md, fontWeight: '700', color: NEU.text.primary },
  due:         { fontSize: FONT.xs, color: NEU.text.muted, marginTop: 2 },
  badge:       { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.sm },
  badgeText:   { fontSize: FONT.xs, fontWeight: '700' },
  amtRow:      { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  amtLabel:    { fontSize: FONT.sm, color: NEU.text.secondary, fontWeight: '600' },
  overlay:     { flex: 1, backgroundColor: '#00000060', justifyContent: 'flex-end' },
  modalCard:   { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderRadius: RADIUS.xl },
  modalTitle:  { fontSize: FONT.lg, fontWeight: '800', color: NEU.text.primary, marginBottom: 4 },
  modalAmt:    { fontSize: 32, fontWeight: '900', color: ACCENT, marginBottom: 20 },
  modeLabel:   { fontSize: FONT.sm, color: NEU.text.secondary, marginBottom: 10, fontWeight: '600' },
  modeRow:     { flexDirection: 'row', gap: 10 },
  modeBtn:     { flex: 1, padding: 12, borderRadius: RADIUS.md, backgroundColor: NEU.surface, alignItems: 'center',
                 shadowColor: NEU.shadow, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.5, shadowRadius: 4, elevation: 2 },
  modeBtnActive:{ borderWidth: 1.5, borderColor: ACCENT },
  modeBtnText: { fontSize: FONT.sm, fontWeight: '600', color: NEU.text.secondary },
});
