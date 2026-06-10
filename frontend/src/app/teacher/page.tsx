"use client";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Topbar } from '@/components/layout/Topbar';
import { NeuCard } from '@/components/neu/NeuCard';
import { NeuKpiCard } from '@/components/neu/NeuKpiCard';
import { NeuBadge } from '@/components/neu/NeuBadge';
import { NeuButton } from '@/components/neu/NeuButton';
import { useAuthStore } from '@/lib/store/auth.store';

const TT = [
  { period:'1', time:'8:00-8:45', subj:'Mathematics', cls:'10-A', room:'R-101', state:'done' },
  { period:'2', time:'8:45-9:30', subj:'Mathematics', cls:'10-B', room:'R-101', state:'done' },
  { period:'3', time:'9:30-10:15', subj:'Mathematics', cls:'9-A', room:'R-101', state:'active' },
  { period:'BREAK', time:'10:15-10:30', subj:'—', cls:'', room:'', state:'break' },
  { period:'4', time:'10:30-11:15', subj:'Mathematics', cls:'8-A', room:'R-201', state:'upcoming' },
  { period:'5', time:'11:15-12:00', subj:'Free Period', cls:'—', room:'', state:'free' },
  { period:'6', time:'12:00-12:45', subj:'Mathematics', cls:'7-B', room:'R-101', state:'upcoming' },
];

export default function TeacherDashboard() {
  const { user } = useAuthStore();
  return (
    <DashboardLayout allowedRoles={['teacher','principal']}>
      <Topbar title={`Good Morning, ${user?.fullName?.split(' ')[1] ?? 'Teacher'}!`} subtitle="Mathematics · Sr. Teacher · Main Campus" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <NeuKpiCard icon="👨‍🎓" label="My Students" value="187" badge="4 classes" badgeVariant="info" />
        <NeuKpiCard icon="✅" label="Marked Today" value="3/6" badge="Periods" badgeVariant="success" />
        <NeuKpiCard icon="⚠️" label="At-Risk Students" value="9" badge="Below 75%" badgeVariant="danger" />
        <NeuKpiCard icon="📝" label="Pending Marks" value="2" badge="Exam 1" badgeVariant="warning" />
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Timetable */}
        <div className="col-span-2">
          <NeuCard className="p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Today's Timetable — Friday</h3>
            <div className="space-y-2">
              {TT.map((t,i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-all ${
                  t.state==='active' ? 'bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 shadow-neu-sink-sm' :
                  t.state==='break' ? 'bg-amber-50 border border-amber-100' :
                  t.state==='done' ? 'opacity-50' : 'bg-sur shadow-neu-raise-sm'}`}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-sur shadow-neu-raise-sm"
                       style={t.state==='active' ? {background:'#7C3AED',color:'#fff'} : {}}>
                    {t.period}
                  </div>
                  <div className="text-xs text-gray-400 w-20">{t.time}</div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800">{t.subj}</span>
                    {t.cls && <span className="text-xs text-gray-400 ml-2">Class {t.cls}</span>}
                  </div>
                  {t.state==='active' && <NeuBadge variant="info">Now Active</NeuBadge>}
                  {t.room && <span className="text-xs text-gray-400">{t.room}</span>}
                  {t.state==='upcoming' && <NeuButton size="sm">Mark Attendance</NeuButton>}
                </div>
              ))}
            </div>
          </NeuCard>
        </div>

        {/* At-risk + Notices */}
        <div className="flex flex-col gap-5">
          <NeuCard className="p-5 flex-1">
            <h3 className="text-sm font-bold text-gray-700 mb-3">At-Risk Students</h3>
            {['Arjun S. (72%)','Meera T. (68%)','Rohit K. (71%)','Pooja M. (74%)'].map(s => (
              <div key={s} className="flex items-center justify-between py-2 border-b border-clay/10 last:border-0">
                <span className="text-xs font-medium text-gray-600">{s}</span>
                <NeuButton size="sm" variant="danger" className="text-xs">Notify</NeuButton>
              </div>
            ))}
          </NeuCard>
          <NeuCard className="p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Notices</h3>
            {[{c:'blue',t:'PTM on 28 Jun'},{c:'green',t:'Sports Day - 5 Jul'},{c:'amber',t:'Report Cards Due'}].map(n => (
              <div key={n.t} className={`text-xs p-2 rounded-lg mb-2 border-l-2 ${n.c==='blue'?'border-blue-400 bg-blue-50':n.c==='green'?'border-emerald-400 bg-emerald-50':'border-amber-400 bg-amber-50'}`}>{n.t}</div>
            ))}
          </NeuCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
