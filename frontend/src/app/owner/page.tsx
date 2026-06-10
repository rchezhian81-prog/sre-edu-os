"use client";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Topbar } from '@/components/layout/Topbar';
import { NeuCard } from '@/components/neu/NeuCard';
import { NeuKpiCard } from '@/components/neu/NeuKpiCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fmt } from '@/lib/utils/format';

const BRANCH_DATA = [
  { b:'Main', students:1240, fee:845000 }, { b:'East', students:890, fee:612000 },
  { b:'West', students:720, fee:495000 }, { b:'North', students:560, fee:388000 },
];

export default function OwnerDashboard() {
  return (
    <DashboardLayout allowedRoles={['owner']}>
      <Topbar title="Owner Dashboard" subtitle="SRE Group of Schools · 4 Branches" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <NeuKpiCard icon="🏫" label="Total Branches" value="4" badge="Active" badgeVariant="success" />
        <NeuKpiCard icon="👨‍🎓" label="Total Students" value="3,410" badge="+120 YTD" badgeVariant="success" trendUp trend="vs last year" />
        <NeuKpiCard icon="💰" label="Revenue (June)" value="₹23.4L" badge="+8%" badgeVariant="success" trendUp trend="vs last month" />
        <NeuKpiCard icon="👨‍🏫" label="Total Staff" value="182" badge="Active" badgeVariant="info" />
      </div>
      <NeuCard className="p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Fee Collection by Branch</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={BRANCH_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#A3B1C620" />
            <XAxis dataKey="b" tick={{ fontSize:11 }} />
            <YAxis tick={{ fontSize:10 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
            <Tooltip formatter={(v:any) => fmt.currency(v)} />
            <Bar dataKey="fee" fill="#F59E0B" name="Collected" radius={[5,5,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </NeuCard>
    </DashboardLayout>
  );
}
