import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '@/types/auth.types';
import { authApi } from '@/lib/api/auth.api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null, accessToken: null, refreshToken: null,
      isAuthenticated: false, isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res: any = await authApi.login(email, password);
          const { accessToken, refreshToken, user } = res;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          if (user?.branchId) localStorage.setItem('branchId', user.branchId);
          set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
        } catch (err) { set({ isLoading: false }); throw err; }
      },

      logout: () => {
        localStorage.clear();
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      refresh: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;
        const res: any = await authApi.refresh(refreshToken);
        const newToken = res?.accessToken ?? res;
        localStorage.setItem('accessToken', newToken);
        set({ accessToken: newToken });
      },
    }),
    { name: 'sre-auth', partialize: s => ({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken, isAuthenticated: s.isAuthenticated }) }
  )
);
