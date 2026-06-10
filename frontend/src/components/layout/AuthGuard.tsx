"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import type { Role } from '@/types/auth.types';

export function AuthGuard({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: Role[] }) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (allowedRoles && user && !allowedRoles.includes(user.role)) { router.replace('/unauthorized'); }
  }, [isAuthenticated, user, allowedRoles, router]);
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
