"use client";
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Topbar } from '@/components/layout/Topbar';
import { NeuKpiCard } from '@/components/neu/NeuKpiCard';
import { NeuCard } from '@/components/neu/NeuCard';
import { NeuBadge } from '@/components/neu/NeuBadge';
import { NeuButton } from '@/components/neu/NeuButton';
import { NeuProgress } from '@/components/neu/NeuProgress';
import { NeuTable } from '@/components/neu/NeuTable';
import { useStudents } from '@/lib/hooks/useStudents';
import { useFees } from '@/lib/hooks/useFees';
import { fmt } from '@/lib/utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const ATT_DATA = [{m:'Jan',p:91},{m:'Feb',p:88},{m:'Mar',p:94},{m:'Apr',p:87},{m:'May',p:96},{m:'Jun',p:93}];
const FEE_DATA = [{cls:'Class 10',col:245000,target:280000},{cls:'Class 9',col:189000,target:210000},{cls:'Class 8',col:156000,target:180000},{cls:'Class 7',col:134000,target:160000}];

export default function AdminDashboard() {
  const { students, loading: sLoad, fetchStats, stats } = useStudents({ limit:8 });
  const { summary, fetchSummary } = useFees();

  useEffect(() => { fetchStats(); fetchSummary(); }, []);

  const kpis = [
    { icon:'👨‍🎓', label:'Total Students', value: stats?.total ?? '—', badge:'Active', badgeVariant:'success' as const },
    { icon:'✅', label:"Today's Attendance", value:'94.2%', badge:'+2.1%', badgeVariant:'success' as const, trend:'vs last week', trendUp:true },
    { icon:'💳', label:'Fee Collected (June)', value:'₹8.4L', badge:'82%', badgeVariant:'info' as const },
    { icon:'👨‍🏫', label:'Teaching Staff', value:'42', badge:'Online', badgeVariant:'success' as const },
    { icon:'⚠️', label:'Fee Defaulters', value:'18', badge:'Action Needed', badgeVariant:'danger' as const },
    { icon:'🏫', label:'Active Classes', value:'24', badge:'12 Sections', badgeVariant:'default' as const },
    { icon:'📝', label:'Exams This Month', value:'3', badge:'Term 1', badgeVariant:'info' as const },
    { icon:'📣', label:'Pending Notices', value:'5', badge:'New', badgeVariant:'warning' as const },
  ];

  const studentCols = [
    { key:'admission_no', header:'Adm No' },
    { key:'full_name', header:'Student', render:(r:any) => <span className="font-semibold">{r.full_name}</span> },
    { key:'status', header:'Status', render:(r:any) => <NeuBadge variant={r.status==='active'?'success':'warning'}>{r.status}</NeuBadge> },
    { key:'parent_phone', header:'Parent Phone' },
  ];

  return (
    <DashboardLayout allowedRoles={['admin','principal','owner']}>
      <Topbar title="Branch Admin Dashboard" subtitle="Sunrise Academy · Branch: Main Campus" />

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpis.map((k,i) => <NeuKpiCard key={i} {...k} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-5 mb-6">
        <NeuCard className="p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Attendance Trend (Monthly %)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={ATT_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#A3B1C620" />
              <XAxis dataKey="m" tick={{ fontSize:11 }} />
              <YAxis domain={[80,100]} tick={{ fontSize:11 }} />
              <Tooltip formatter={(v:any) => [`${v}%`, "Attendance"]} />
              <Line type="monotone" dataKey="p" stroke="#1871E9" strokeWidth={2.5} dot={{ fill:'#1871E9', r:3 }} />
            </LineChart>
          </ResponsiveContainer>
        </NeuCard>

        <NeuCard className="p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Fee Collection by Class</h3>
          <div className="space-y-3">
            {FEE_DATA.map(f => (
              <div key={f.cls}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-gray-600">{f.cls}</span>
                  <span className="text-gray-400">{fmt.currency(f.col)} / {fmt.currency(f.target)}</span>
                </div>
                <NeuProgress value={f.col} max={f.target} color={f.col/f.target >= 0.85 ? 'green' : 'amber'} />
              </div>
            ))}
          </div>
        </NeuCard>
      </div>

      {/* Students Table + Quick Actions */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <NeuCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-700">Recent Students</h3>
              <NeuButton size="sm" variant="primary">+ Add Student</NeuButton>
            </div>
            <NeuTable columns={studentCols} data={students} loading={sLoad} />
          </NeuCard>
        </div>

        <NeuCard className="p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              {icon:'👨‍🎓',label:'Add Student'},{icon:'💳',label:'Collect Fee'},
              {icon:'✅',label:'Mark Attendance'},{icon:'📣',label:'Send Notice'},
              {icon:'📝',label:'Enter Marks'},{icon:'📊',label:'Fee Report'},
              {icon:'🚌',label:'Transport'},{icon:'📚',label:'Library'},
            ].map(a => (
              <button key={a.label} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-sur shadow-neu-raise-sm hover:shadow-neu-sink-sm transition-all text-xs font-semibold text-gray-600">
                <span className="text-xl">{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </NeuCard>
      </div>
    </DashboardLayout>
  );
}
