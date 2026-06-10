import { cn } from '@/lib/utils/cn';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface NeuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default'|'primary'|'success'|'danger'|'ghost';
  size?: 'sm'|'md'|'lg';
  loading?: boolean;
}
export const NeuButton = forwardRef<HTMLButtonElement, NeuButtonProps>(
  ({ variant='default', size='md', loading, className, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 active:shadow-neu-sink-sm disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
      default:  'bg-sur shadow-neu-raise-sm text-gray-600 hover:shadow-neu-raise-md',
      primary:  'bg-gradient-to-br from-admin to-admin-dark text-white shadow-neu-acc-admin',
      success:  'bg-gradient-to-br from-student to-student-dark text-white shadow-neu-acc-student',
      danger:   'bg-gradient-to-br from-red-400 to-red-600 text-white',
      ghost:    'bg-transparent hover:bg-sur',
    };
    const sizes = { sm:'px-3 py-1.5 text-xs', md:'px-4 py-2 text-sm', lg:'px-6 py-3 text-base' };
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} disabled={disabled||loading} {...props}>
        {loading && <span className="animate-spin">↻</span>}
        {children}
      </button>
    );
  }
);
NeuButton.displayName = 'NeuButton';
