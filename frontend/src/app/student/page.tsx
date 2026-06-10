"use client";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Topbar } from '@/components/layout/Topbar';
import { NeuCard } from '@/components/neu/NeuCard';
import { NeuKpiCard } from '@/components/neu/NeuKpiCard';
import { NeuBadge } from '@/components/neu/NeuBadge';
import { NeuProgress } from '@/components/neu/NeuProgress';
import { useAuthStore } from '@/lib/store/auth.store';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { fmt } from '@/lib/utils/format';

const SUBJECTS = [
  { s:'Mathematics', marks:98, max:100 }, { s:'Physics', marks:95, max:100 },
  { s:'Chemistry', marks:92, max:100 }, { s:'Biology', marks:97, max:100 }, { s:'English', marks:95, max:100 },
];
const RADAR_DATA = SUBJECTS.map(s => ({ subject:s.s.slice(0,4), score:s.marks, avg:76 }));

export default function StudentDashboard() {
  const { user } = useAuthStore();
  return (
    <DashboardLayout allowedRoles={['student']}>
      <Topbar title={`Hello, ${user?.fullName?.split(' ')[0] ?? 'Student'}! 👋`} subtitle="Class 10-A · Roll No. 03 · Main Campus" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <NeuKpiCard icon="✅" label="Attendance" value="97%" badge="Excellent" badgeVariant="success" />
        <NeuKpiCard icon="🏆" label="Class Rank" value="#1" badge="Unit Test 1" badgeVariant="success" />
        <NeuKpiCard icon="📝" label="Overall Score" value="97.4%" badge="A+ Grade" badgeVariant="success" />
        <NeuKpiCard icon="💳" label="Fee Status" value="₹0 Due" badge="All Paid" badgeVariant="success" />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-6">
        {/* Results */}
        <NeuCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-700">Unit Test 1 Results</h3>
            <NeuBadge variant="success">A+ · 97.4%</NeuBadge>
          </div>
          <div className="space-y-3">
            {SUBJECTS.map(s => (
              <div key={s.s}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-gray-600">{s.s}</span>
                  <span className="font-bold text-gray-800">{s.marks}/{s.max}</span>
                </div>
                <NeuProgress value={s.marks} max={s.max} color={s.marks>=90?'green':'blue'} />
              </div>
            ))}
          </div>
        </NeuCard>

        {/* Radar */}
        <NeuCard className="p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Performance vs Class Average</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="#A3B1C640" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize:10 }} />
              <Radar name="You" dataKey="score" stroke="#10B981" fill="#10B981" fillOpacity={0.25} strokeWidth={2} />
              <Radar name="Class Avg" dataKey="avg" stroke="#A3B1C6" fill="#A3B1C6" fillOpacity={0.15} strokeWidth={1.5} strokeDasharray="4 2" />
            </RadarChart>
          </ResponsiveContainer>
        </NeuCard>
      </div>

      {/* Upcoming exams + Badges */}
      <div className="grid grid-cols-2 gap-5">
        <NeuCard className="p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Upcoming Exams</h3>
          {[{d:'15 Jun',s:'Mathematics',t:'Theory + Practical'},{d:'16 Jun',s:'Physics',t:'Theory'},{d:'17 Jun',s:'Chemistry',t:'Theory + Lab'},{d:'18 Jun',s:'Biology',t:'Theory'},{d:'19 Jun',s:'English',t:'Theory'}].map(e => (
            <div key={e.s} className="flex items-center gap-3 py-2 border-b border-clay/10 last:border-0">
              <div className="px-2 py-1 rounded-lg bg-sur shadow-neu-raise-sm text-xs font-bold text-admin">{e.d}</div>
              <div className="flex-1"><div className="text-sm font-semibold text-gray-700">{e.s}</div><div className="text-xs text-gray-400">{e.t}</div></div>
            </div>
          ))}
        </NeuCard>

        <NeuCard className="p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Your Achievements 🏆</h3>
          <div className="flex flex-wrap gap-2">
            {['🥇 Class Topper','📐 Math Excellence','🔬 Science Star','📚 Bookworm','✅ Full Attendance','🎯 Perfect Score'].map(b => (
              <span key={b} className="px-3 py-1.5 rounded-full text-xs font-bold bg-sur shadow-neu-raise-sm text-emerald-700">{b}</span>
            ))}
          </div>
          <div className="mt-5 p-3 rounded-xl bg-sur shadow-neu-sink-sm text-center">
            <div className="text-xs text-gray-400 mb-1">Academic Year Standing</div>
            <div className="text-2xl font-extrabold text-emerald-600">🥇 Rank 1 / 62</div>
          </div>
        </NeuCard>
      </div>
    </DashboardLayout>
  );
}
