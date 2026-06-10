"use client";
import { useAuthStore } from '@/lib/store/auth.store';
import { NeuButton } from '@/components/neu/NeuButton';
import { fmt } from '@/lib/utils/format';

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user } = useAuthStore();
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-xs text-gray-400">{fmt.date(new Date())}</div>
        <NeuButton size="sm">🔔</NeuButton>
      </div>
    </div>
  );
}
