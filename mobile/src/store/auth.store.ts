import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'student';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const { data } = await authApi.login(email, password);
    const { accessToken, refreshToken, user } = data.data;
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    set({ user: null, isAuthenticated: false });
  },

  restore: async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        const { data } = await authApi.me();
        set({ user: data.data, isAuthenticated: true });
      }
    } catch {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    } finally {
      set({ isLoading: false });
    }
  },
}));
