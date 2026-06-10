import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OfflineState {
  pendingAttendance: any[];
  cachedData: Record<string, any>;
  queueAttendance: (record: any) => Promise<void>;
  flushQueue:      () => Promise<{ success: number; failed: number }>;
  cacheSet: (key: string, value: any) => Promise<void>;
  cacheGet: (key: string) => Promise<any>;
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  pendingAttendance: [],
  cachedData: {},

  queueAttendance: async (record) => {
    const updated = [...get().pendingAttendance, { ...record, _queued: Date.now() }];
    set({ pendingAttendance: updated });
    await AsyncStorage.setItem('offline_attendance', JSON.stringify(updated));
  },

  flushQueue: async () => {
    // Called when network comes back online
    const queue = get().pendingAttendance;
    let success = 0, failed = 0;
    const remaining: any[] = [];
    for (const record of queue) {
      try {
        const { api } = await import('@/lib/api');
        await api.post('/attendance/mark-bulk', record);
        success++;
      } catch {
        remaining.push(record);
        failed++;
      }
    }
    set({ pendingAttendance: remaining });
    await AsyncStorage.setItem('offline_attendance', JSON.stringify(remaining));
    return { success, failed };
  },

  cacheSet: async (key, value) => {
    await AsyncStorage.setItem(`cache_${key}`, JSON.stringify({ value, ts: Date.now() }));
    set((s) => ({ cachedData: { ...s.cachedData, [key]: value } }));
  },

  cacheGet: async (key) => {
    const raw = await AsyncStorage.getItem(`cache_${key}`);
    if (!raw) return null;
    const { value, ts } = JSON.parse(raw);
    if (Date.now() - ts > 5 * 60 * 1000) return null; // 5-min TTL
    return value;
  },
}));
