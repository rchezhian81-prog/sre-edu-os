import { cn } from '@/lib/utils/cn';
type BadgeVariant = 'success'|'warning'|'danger'|'info'|'default';
const VARIANTS: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700', warning: 'bg-amber-50 text-amber-700',
  danger:  'bg-red-50 text-red-700',         info:    'bg-sky-50 text-sky-700',
  default: 'bg-gray-100 text-gray-600',
};
export function NeuBadge({ variant='default', className, children }: { variant?: BadgeVariant; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold shadow-neu-raise-sm', VARIANTS[variant], className)}>
      {children}
    </span>
  );
}
