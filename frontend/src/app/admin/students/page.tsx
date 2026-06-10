"use client";
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Topbar } from '@/components/layout/Topbar';
import { NeuCard } from '@/components/neu/NeuCard';
import { NeuButton } from '@/components/neu/NeuButton';
import { NeuBadge } from '@/components/neu/NeuBadge';
import { NeuTable } from '@/components/neu/NeuTable';
import { NeuInput } from '@/components/neu/NeuInput';
import { useStudents } from '@/lib/hooks/useStudents';

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { students, meta, loading } = useStudents({ search, page, limit:20 });

  const cols = [
    { key:'admission_no', header:'Adm No', render:(r:any) => <span className="font-mono text-xs bg-sur rounded px-1.5 py-0.5 shadow-neu-raise-sm">{r.admission_no}</span> },
    { key:'full_name', header:'Student', render:(r:any) => <div><div className="font-semibold text-gray-800">{r.full_name}</div><div className="text-xs text-gray-400">Roll: {r.roll_no ?? '—'}</div></div> },
    { key:'gender', header:'Gender', render:(r:any) => r.gender ?? '—' },
    { key:'parent_name', header:'Parent', render:(r:any) => <div><div className="text-xs font-medium">{r.parent_name ?? '—'}</div><div className="text-xs text-gray-400">{r.parent_phone ?? ''}</div></div> },
    { key:'status', header:'Status', render:(r:any) => <NeuBadge variant={r.status==='active'?'success':r.status==='inactive'?'warning':'default'}>{r.status}</NeuBadge> },
    { key:'actions', header:'', render:(_r:any) => (
      <div className="flex gap-1">
        <NeuButton size="sm">View</NeuButton>
        <NeuButton size="sm">Edit</NeuButton>
      </div>
    )},
  ];

  return (
    <DashboardLayout allowedRoles={['admin','principal','owner']}>
      <Topbar title="Students" subtitle={`${meta.total} total students`} />
      <NeuCard className="p-5">
        <div className="flex gap-3 mb-5">
          <div className="flex-1">
            <NeuInput placeholder="Search by name, admission no..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <NeuButton variant="primary">+ Enroll Student</NeuButton>
          <NeuButton>📥 Import CSV</NeuButton>
          <NeuButton>📤 Export</NeuButton>
        </div>
        <NeuTable columns={cols} data={students} loading={loading} />
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-400">Showing {students.length} of {meta.total}</p>
          <div className="flex gap-2">
            <NeuButton size="sm" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>← Prev</NeuButton>
            <span className="text-xs text-gray-500 self-center">Page {page} / {meta.totalPages}</span>
            <NeuButton size="sm" disabled={page>=meta.totalPages} onClick={()=>setPage(p=>p+1)}>Next →</NeuButton>
          </div>
        </div>
      </NeuCard>
    </DashboardLayout>
  );
}
