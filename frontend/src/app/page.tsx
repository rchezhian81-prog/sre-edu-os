"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';

export default function RootPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    const role = user?.role ?? 'student';
    router.replace(['owner','admin','teacher','student','parent','accountant','librarian','transport_officer'].includes(role) ? `/${role}` : '/student');
  }, [isAuthenticated, user, router]);
  return <div className="min-h-screen bg-sur flex items-center justify-center"><div className="animate-spin text-3xl">⟳</div></div>;
}
