import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string;
}
export const NeuInput = forwardRef<HTMLInputElement, NeuInputProps>(({ label, error, className, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
    <input
      ref={ref}
      className={cn('w-full px-4 py-2.5 rounded-xl bg-sur shadow-neu-sink-sm text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-admin/30 transition-all', error && 'ring-2 ring-red-300', className)}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));
NeuInput.displayName = 'NeuInput';
