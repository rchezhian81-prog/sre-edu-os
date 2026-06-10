"use client";
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Topbar } from '@/components/layout/Topbar';
import { NeuCard } from '@/components/neu/NeuCard';
import { NeuButton } from '@/components/neu/NeuButton';
import { NeuBadge } from '@/components/neu/NeuBadge';
import { toast } from 'sonner';
import type { AttendanceStatus } from '@/types/attendance.types';

const STUDENTS = [
  {id:'1',roll:'01',name:'Aarav Sharma'},{id:'2',roll:'02',name:'Anjali Gupta'},{id:'3',roll:'03',name:'Kavya Reddy'},
  {id:'4',roll:'04',name:'Rohit Kumar'},{id:'5',roll:'05',name:'Priya Nair'},{id:'6',roll:'06',name:'Arjun Singh'},
];
type State = Record<string, AttendanceStatus>;

export default function TeacherAttendancePage() {
  const [attState, setAttState] = useState<State>({});
  const [submitting, setSubmitting] = useState(false);

  const setAtt = (id: string, val: AttendanceStatus) =>
    setAttState(s => ({ ...s, [id]: s[id]===val ? undefined as any : val }));
  const markAll = (val: AttendanceStatus) =>
    setAttState(STUDENTS.reduce((a,s) => ({ ...a, [s.id]: val }), {}));

  const counts = { P:0, A:0, L:0 };
  Object.values(attState).forEach(v => { if(v==='present') counts.P++; else if(v==='absent') counts.A++; else if(v==='leave') counts.L++; });

  const submit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success(`Attendance submitted: ${counts.P}P / ${counts.A}A / ${counts.L}L`);
    setSubmitting(false);
  };

  return (
    <DashboardLayout allowedRoles={['teacher','admin','principal']}>
      <Topbar title="Mark Attendance" subtitle="Class 10-A · Mathematics · Period 3" />

      <NeuCard className="p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-3">
            <span className="text-xs font-bold text-emerald-600">{counts.P} Present</span>
            <span className="text-xs font-bold text-red-500">{counts.A} Absent</span>
            <span className="text-xs font-bold text-amber-500">{counts.L} Leave</span>
          </div>
          <div className="flex gap-2">
            <NeuButton size="sm" onClick={()=>markAll('present')}>✅ All Present</NeuButton>
            <NeuButton size="sm" onClick={()=>markAll('absent')}>❌ All Absent</NeuButton>
          </div>
        </div>

        <div className="space-y-2">
          {STUDENTS.map(s => {
            const state = attState[s.id];
            return (
              <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl bg-sur shadow-neu-raise-sm">
                <div className="w-8 h-8 rounded-lg bg-sur shadow-neu-raise-sm flex items-center justify-center text-xs font-bold text-gray-500">{s.roll}</div>
                <div className="flex-1 font-semibold text-sm text-gray-800">{s.name}</div>
                {(['present','absent','leave'] as AttendanceStatus[]).map(v => (
                  <button key={v} onClick={() => setAtt(s.id, v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${state===v
                      ? v==='present' ? 'bg-emerald-500 text-white shadow-none'
                        : v==='absent' ? 'bg-red-500 text-white shadow-none'
                        : 'bg-amber-500 text-white shadow-none'
                      : 'bg-sur shadow-neu-raise-sm text-gray-500 hover:shadow-neu-sink-sm'}`}>
                    {v==='present'?'P':v==='absent'?'A':'L'}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        <NeuButton variant="primary" className="w-full mt-5" loading={submitting} onClick={submit}>
          Submit Attendance
        </NeuButton>
      </NeuCard>
    </DashboardLayout>
  );
}
