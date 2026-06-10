"use client";
import { useState, useEffect, useCallback } from 'react';
import { studentsApi } from '@/lib/api/students.api';
import type { Student, StudentStats } from '@/types/student.types';

export function useStudents(params?: any) {
  const [students, setStudents] = useState<Student[]>([]);
  const [meta, setMeta] = useState({ total:0, page:1, limit:20, totalPages:1 });
  const [stats, setStats] = useState<StudentStats|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res: any = await studentsApi.getAll(params);
      setStudents(res?.data ?? res ?? []);
      if (res?.meta) setMeta(res.meta);
    } catch (e: any) { setError(e?.message ?? 'Failed to load students'); }
    finally { setLoading(false); }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  const fetchStats = useCallback(async () => {
    const s: any = await studentsApi.getStats();
    setStats(s);
  }, []);

  return { students, meta, stats, loading, error, refetch: fetch, fetchStats };
}
