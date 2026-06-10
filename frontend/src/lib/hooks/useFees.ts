"use client";
import { useState, useCallback } from 'react';
import { feesApi } from '@/lib/api/fees.api';
import { ACADEMIC_YEAR } from '@/lib/utils/constants';

export function useFees() {
  const [summary, setSummary] = useState<any[]>([]);
  const [defaulters, setDefaulters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSummary = useCallback(async (year = ACADEMIC_YEAR) => {
    setLoading(true);
    const data: any = await feesApi.getSummary(year);
    setSummary(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  const fetchDefaulters = useCallback(async (year = ACADEMIC_YEAR) => {
    setLoading(true);
    const data: any = await feesApi.getDefaulters(year);
    setDefaulters(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  const collect = useCallback(async (data: any) => {
    return feesApi.collect(data);
  }, []);

  return { summary, defaulters, loading, fetchSummary, fetchDefaulters, collect };
}
