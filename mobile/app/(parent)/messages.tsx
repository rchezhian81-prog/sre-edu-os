import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeuCard } from '@/components/NeuCard';
import { NEU, FONT, RADIUS, ROLES } from '@/constants/theme';

const ACCENT = ROLES.parent.accent;

const NOTICES = [
  { id: '1', type: 'Notice',   title: 'Annual Sports Day',       body: 'Sports day on June 20. Students should wear sports uniform.', date: 'Jun 5', read: false },
  { id: '2', type: 'Circular', title: 'PTM Schedule',             body: 'Parent-Teacher Meeting on June 14 from 9 AM to 1 PM.', date: 'Jun 3', read: false },
  { id: '3', type: 'Alert',    title: 'Fee Reminder',             body: 'Term 2 fees due by June 30. Pay online to avoid late charges.', date: 'Jun 1', read: true },
  { id: '4', type: 'Notice',   title: 'Library Books Return',     body: 'All issued books must be returned before June 15.', date: 'May 30', read: true },
];

const typeColor = (t: string) =>
  t === 'Alert' ? '#EF4444' : t === 'Circular' ? '#7C3AED' : ACCENT;

export default function MessagesScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const unread = NOTICES.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Messages</Text>
          {unread > 0 && (
            <View style={[styles.badge, { backgroundColor: ACCENT }]}>
              <Text style={styles.badgeText}>{unread}</Text>
            </View>
          )}
        </View>
        {NOTICES.map(n => (
          <TouchableOpacity key={n.id} onPress={() => setExpanded(expanded === n.id ? null : n.id)}>
            <NeuCard style={[styles.card, !n.read && styles.unread]}>
              <View style={styles.row}>
                <View style={[styles.typeBadge, { backgroundColor: typeColor(n.type) + '20' }]}>
                  <Text style={[styles.typeText, { color: typeColor(n.type) }]}>{n.type}</Text>
                </View>
                <Text style={styles.date}>{n.date}</Text>
              </View>
              <Text style={[styles.title, !n.read && { color: ACCENT }]}>{n.title}</Text>
              {expanded === n.id && <Text style={styles.body}>{n.body}</Text>}
              {!n.read && <View style={styles.unreadDot} />}
            </NeuCard>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: NEU.surface },
  scroll:     { padding: 20, paddingBottom: 40 },
  headerRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  heading:    { fontSize: FONT.xl, fontWeight: '800', color: NEU.text.primary },
  badge:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  badgeText:  { color: '#fff', fontSize: FONT.xs, fontWeight: '800' },
  card:       { marginBottom: 14, position: 'relative' },
  unread:     { borderLeftWidth: 3, borderLeftColor: ACCENT },
  row:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  typeBadge:  { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm },
  typeText:   { fontSize: FONT.xs, fontWeight: '700' },
  date:       { fontSize: FONT.xs, color: NEU.text.muted },
  title:      { fontSize: FONT.md, fontWeight: '700', color: NEU.text.primary },
  body:       { fontSize: FONT.sm, color: NEU.text.secondary, marginTop: 8, lineHeight: 20 },
  unreadDot:  { position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: 4, backgroundColor: ACCENT },
});
