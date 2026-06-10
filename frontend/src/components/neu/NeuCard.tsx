import { cn } from '@/lib/utils/cn';
interface NeuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  sunken?: boolean; sm?: boolean; lg?: boolean;
}
export function NeuCard({ sunken, sm, lg, className, children, ...props }: NeuCardProps) {
  const shadow = sunken
    ? sm ? 'shadow-neu-sink-sm' : 'shadow-neu-sink-md'
    : sm ? 'shadow-neu-raise-sm' : lg ? 'shadow-neu-raise-lg' : 'shadow-neu-raise-md';
  return (
    <div className={cn('bg-sur rounded-neu border-t border-l border-white/85', shadow, className)} {...props}>
      {children}
    </div>
  );
}
