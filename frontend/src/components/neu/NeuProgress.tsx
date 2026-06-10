import { cn } from '@/lib/utils/cn';
export function NeuProgress({ value, max=100, color='blue', className }: { value: number; max?: number; color?: 'blue'|'green'|'amber'|'red'; className?: string }) {
  const pct = Math.min((value/max)*100, 100);
  const colors = { blue:'from-admin to-admin-dark', green:'from-student to-student-dark', amber:'from-amber-400 to-amber-600', red:'from-red-400 to-red-600' };
  return (
    <div className={cn('h-2 rounded-full bg-sur shadow-neu-sink-sm overflow-hidden', className)}>
      <div className={cn('h-full rounded-full bg-gradient-to-r', colors[color])} style={{ width:`${pct}%`, transition:'width .7s ease' }} />
    </div>
  );
}
