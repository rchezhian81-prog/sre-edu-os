import { NeuCard } from './NeuCard';
import { NeuBadge } from './NeuBadge';
import { cn } from '@/lib/utils/cn';

interface NeuKpiCardProps {
  icon: string; label: string; value: string | number;
  trend?: string; trendUp?: boolean; badge?: string; badgeVariant?: 'success'|'warning'|'danger'|'info';
  accentColor?: string;
}
export function NeuKpiCard({ icon, label, value, trend, trendUp, badge, badgeVariant='success', accentColor }: NeuKpiCardProps) {
  return (
    <NeuCard className="p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-neu-raise-sm bg-sur text-xl">{icon}</div>
        {badge && <NeuBadge variant={badgeVariant}>{badge}</NeuBadge>}
      </div>
      <div className="mt-1">
        <div className="text-2xl font-extrabold text-gray-800 tracking-tight">{value}</div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      </div>
      {trend && (
        <div className={cn('text-xs font-semibold', trendUp ? 'text-emerald-600' : 'text-red-500')}>
          {trendUp ? '▲' : '▼'} {trend}
        </div>
      )}
    </NeuCard>
  );
}
