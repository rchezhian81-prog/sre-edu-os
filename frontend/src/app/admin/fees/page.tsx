"use client";
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Topbar } from '@/components/layout/Topbar';
import { NeuCard } from '@/components/neu/NeuCard';
import { NeuKpiCard } from '@/components/neu/NeuKpiCard';
import { NeuButton } from '@/components/neu/NeuButton';
import { NeuBadge } from '@/components/neu/NeuBadge';
import { NeuProgress } from '@/components/neu/NeuProgress';
import { NeuTable } from '@/components/neu/NeuTable';
import { useFees } from '@/lib/hooks/useFees';
import { fmt } from '@/lib/utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CHART = [{term:'Term 1',due:850000,collected:697000},{term:'Term 2',due:850000,collected:0},{term:'Annual',due:150000,collected:0}];

export default function AdminFeesPage() {
  const { defaulters, fetchDefaulters } = useFees();
  useEffect(() => { fetchDefaulters('2025-26'); }, []);

  const cols = [
    { key:'student_id', header:'Student ID', render:(r:any) => <span className="font-mono text-xs">{r.student_id?.slice(0,8)}…</span> },
    { key:'term', header:'Term' },
    { key:'amount_due', header:'Amount Due', render:(r:any) => <span className="font-bold text-red-600">{fmt.currency(r.amount_due ?? 18500)}</span> },
    { key:'status', header:'Status', render:(_:any) => <NeuBadge variant="danger">Pending</NeuBadge> },
    { key:'actions', header:'', render:(_:any) => <NeuButton size="sm" variant="primary">Remind</NeuButton> },
  ];

  return (
    <DashboardLayout allowedRoles={['admin','accountant','owner']}>
      <Topbar title="Fee Management" subtitle="Academic Year 2025-26" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <NeuKpiCard icon="💰" label="Total Collected" value="₹6.97L" badge="+12%" badgeVariant="success" trendUp trend="vs last month" />
        <NeuKpiCard icon="⏳" label="Pending Collection" value="₹1.53L" badge="18%" badgeVariant="warning" />
        <NeuKpiCard icon="⚠️" label="Defaulters" value="18" badge="Students" badgeVariant="danger" />
        <NeuKpiCard icon="💳" label="Today's Collection" value="₹24,500" badge="3 payments" badgeVariant="info" />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-6">
        <NeuCard className="p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Collection vs Target</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke="#A3B1C620" />
              <XAxis dataKey="term" tick={{ fontSize:11 }} />
              <YAxis tick={{ fontSize:10 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip formatter={(v:any) => fmt.currency(v)} />
              <Bar dataKey="due" fill="#A3B1C680" name="Target" radius={[4,4,0,0]} />
              <Bar dataKey="collected" fill="#1871E9" name="Collected" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </NeuCard>

        <NeuCard className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-700">Collect Fee Payment</h3>
          </div>
          <div className="space-y-3">
            <input className="w-full px-3 py-2 rounded-xl bg-sur shadow-neu-sink-sm text-sm outline-none" placeholder="Student Admission No." />
            <input className="w-full px-3 py-2 rounded-xl bg-sur shadow-neu-sink-sm text-sm outline-none" placeholder="Amount (₹)" type="number" />
            <select className="w-full px-3 py-2 rounded-xl bg-sur shadow-neu-sink-sm text-sm outline-none">
              <option>UPI</option><option>Cash</option><option>Card</option><option>Net Banking</option>
            </select>
            <NeuButton variant="primary" className="w-full">Collect & Generate Receipt</NeuButton>
          </div>
        </NeuCard>
      </div>

      <NeuCard className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-gray-700">Fee Defaulters</h3>
          <NeuButton size="sm" variant="danger">📣 Send Bulk Reminder</NeuButton>
        </div>
        <NeuTable columns={cols} data={defaulters.length ? defaulters : Array(5).fill({ student_id:'demo', term:'Term 1', amount_due:18500, status:'pending' })} />
      </NeuCard>
    </DashboardLayout>
  );
}
