"use client";
import { useState, useCallback } from 'react';
import { attendanceApi } from '@/lib/api/attendance.api';

export function useAttendance() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchByClass = useCallback(async (classId: string, date: string, sectionId?: string) => {
    setLoading(true);
    const data: any = await attendanceApi.byClassDate(classId, date, sectionId);
    setRecords(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  const mark = useCallback(async (payload: any) => {
    setLoading(true);
    try { return await attendanceApi.mark(payload); } finally { setLoading(false); }
  }, []);

  return { records, loading, fetchByClass, mark };
}
