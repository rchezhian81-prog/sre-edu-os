"use client";
import { Sidebar } from './Sidebar';
import { AuthGuard } from './AuthGuard';
import type { Role } from '@/types/auth.types';

export function DashboardLayout({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: Role[] }) {
  return (
    <AuthGuard allowedRoles={allowedRoles}>
      <div className="flex min-h-screen bg-sur">
        <Sidebar />
        <main className="ml-[220px] flex-1 p-6 min-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
