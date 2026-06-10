"use client";
import { useRouter } from 'next/navigation';
import { NeuButton } from '@/components/neu/NeuButton';
export default function UnauthorizedPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-sur flex items-center justify-center flex-col gap-4">
      <div className="text-6xl">🔒</div>
      <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
      <p className="text-gray-400 text-sm">You don't have permission to view this page.</p>
      <NeuButton variant="primary" onClick={() => router.back()}>Go Back</NeuButton>
    </div>
  );
}
