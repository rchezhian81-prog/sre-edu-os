"use client";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth.store';
import { NeuButton } from '@/components/neu/NeuButton';
import { NeuInput } from '@/components/neu/NeuInput';
import { NeuCard } from '@/components/neu/NeuCard';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
type Form = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated && user) router.replace(`/${user.role}`);
  }, [isAuthenticated, user, router]);

  const onSubmit = async (data: Form) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
    } catch (e: any) { toast.error(e?.message ?? 'Invalid credentials'); }
  };

  return (
    <div className="min-h-screen bg-sur flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-admin to-admin-dark items-center justify-center text-white text-2xl font-black mb-4"
               style={{ boxShadow:'-6px -6px 12px #FFFFFF, 6px 6px 14px rgba(24,113,233,.40)' }}>S</div>
          <h1 className="text-2xl font-extrabold text-gray-800">SRE EDU OS</h1>
          <p className="text-sm text-gray-400 mt-1">School ERP Management System</p>
        </div>

        <NeuCard className="p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-5">Sign in to your account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <NeuInput label="Email Address" type="email" placeholder="admin@school.com"
              error={errors.email?.message} {...register('email')} />
            <NeuInput label="Password" type="password" placeholder="••••••••"
              error={errors.password?.message} {...register('password')} />
            <NeuButton type="submit" variant="primary" className="w-full" loading={isLoading}>
              Sign In →
            </NeuButton>
          </form>
          <div className="mt-4 p-3 rounded-xl bg-sur shadow-neu-sink-sm text-xs text-gray-400 space-y-1">
            <p className="font-semibold text-gray-500">Demo credentials:</p>
            <p>Owner: owner@sreedos.com / Owner@123</p>
            <p>Admin: admin@sreedos.com / Admin@123</p>
            <p>Teacher: teacher@sreedos.com / Teacher@123</p>
          </div>
        </NeuCard>
      </div>
    </div>
  );
}
