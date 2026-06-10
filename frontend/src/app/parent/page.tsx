"use client";
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Topbar } from '@/components/layout/Topbar';
import { NeuCard } from '@/components/neu/NeuCard';
import { NeuKpiCard } from '@/components/neu/NeuKpiCard';
import { NeuBadge } from '@/components/neu/NeuBadge';
import { NeuButton } from '@/components/neu/NeuButton';
import { NeuProgress } from '@/components/neu/NeuProgress';
import { useAuthStore } from '@/lib/store/auth.store';

const CHILDREN = [
  { id:'1', name:'Kavya Reddy', cls:'Class 10-A', roll:'03', att:97, rank:1, feeStatus:'paid' },
  { id:'2', name:'Arun Reddy', cls:'Class 7-B', roll:'11', att:82, rank:14, feeStatus:'due' },
];

export default function ParentDashboard() {
  const { user } = useAuthStore();
  const [child, setChild] = useState(CHILDREN[0]);

  return (
    <DashboardLayout allowedRoles={['parent']}>
      <Topbar title={`Good Morning, ${user?.fullName?.split(' ')[0] ?? 'Parent'}! 👋`} subtitle="2 children enrolled" />

      {/* Child selector */}
      <div className="flex gap-4 mb-6">
        {CHILDREN.map(c => (
          <button key={c.id} onClick={() => setChild(c)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${child.id===c.id ? 'shadow-neu-sink-sm' : 'bg-sur shadow-neu-raise-sm'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${c.id==='1'?'bg-emerald-500':'bg-blue-500'}`}>{c.name[0]}</div>
            <div className="text-left">
              <div className="text-sm font-bold text-gray-800">{c.name}</div>
              <div className="text-xs text-gray-400">{c.cls} · Roll {c.roll}</div>
            </div>
            <NeuBadge variant={c.feeStatus==='paid'?'success':'warning'}>{c.feeStatus==='paid'?'All Good':'Fee Due'}</NeuBadge>
          </button>
        ))}
      </div>

      {/* KPIs for selected child */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <NeuKpiCard icon="✅" label={`${child.name.split(' ')[0]}'s Attendance`} value={`${child.att}%`} badge={child.att>=90?'Excellent':'Below Target'} badgeVariant={child.att>=90?'success':'warning'} />
        <NeuKpiCard icon="🏆" label="Class Rank" value={`#${child.rank}`} badge="Unit Test 1" badgeVariant="info" />
        <NeuKpiCard icon="💳" label="Fee Due" value={child.feeStatus==='paid'?'₹0':'₹18,500'} badge={child.feeStatus==='paid'?'All Paid':'Due 15 Jun'} badgeVariant={child.feeStatus==='paid'?'success':'danger'} />
        <NeuKpiCard icon="📅" label="Next Exam" value="15 Jun" badge="Term 1" badgeVariant="info" />
      </div>

      {/* Alerts + Bus */}
      <div className="grid grid-cols-2 gap-5">
        <NeuCard className="p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Alerts & Notifications</h3>
          {[
            {t:'grn',icon:'🏆',title:`${child.name.split(' ')[0]} scored 97.4% in Unit Test 1!`,sub:'Ranked 1st in class. Outstanding!'},
            {t:'blue',icon:'📅',title:'Term 1 Exams Start 15 June',sub:'Download hall ticket from portal.'},
            child.feeStatus==='due' && {t:'red',icon:'⚠️',title:'Term 1 Fee Due — ₹18,500',sub:'Due 15 June. Late fee applies after.'},
          ].filter(Boolean).map((a:any,i) => (
            <div key={i} className={`flex gap-3 p-3 rounded-xl mb-3 border-l-4 bg-sur shadow-neu-raise-sm ${a.t==='grn'?'border-emerald-400':a.t==='red'?'border-red-400':'border-sky-400'}`}>
              <span className="text-xl">{a.icon}</span>
              <div><div className="text-sm font-semibold text-gray-800">{a.title}</div><div className="text-xs text-gray-400 mt-0.5">{a.sub}</div></div>
            </div>
          ))}
          {child.feeStatus==='due' && <NeuButton variant="primary" className="w-full">💳 Pay Fee Now</NeuButton>}
        </NeuCard>

        <NeuCard className="p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">🚌 Live Bus Tracking — Route RT-03</h3>
          <div className="p-4 rounded-xl bg-sur shadow-neu-sink-sm text-center mb-4">
            <div className="text-3xl mb-2">🚌</div>
            <div className="text-sm font-bold text-emerald-600">● On Route — On Time</div>
            <div className="text-xs text-gray-400 mt-1">Next stop: Gandhi Nagar · ETA: ~8 min</div>
            <div className="text-xs text-gray-400 mt-1">Driver: Ramesh Kumar · 📱 9876543210</div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-clay/10"><span className="text-gray-500">Morning Pickup</span><span className="font-semibold">7:15 AM · Stop 4</span></div>
            <div className="flex justify-between py-1.5 border-b border-clay/10"><span className="text-gray-500">Picked Up</span><NeuBadge variant="success">7:17 AM ✓</NeuBadge></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-500">Expected Drop</span><span className="font-semibold">4:30 PM</span></div>
          </div>
        </NeuCard>
      </div>
    </DashboardLayout>
  );
}
