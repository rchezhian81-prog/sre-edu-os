import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? 'https://api.sreedos.com/api/v1';

export const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = await SecureStore.getItemAsync('refreshToken');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: refresh });
        await SecureStore.setItemAsync('accessToken', data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        // Router will handle redirect via auth guard
      }
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

export const studentApi = {
  dashboard: () => api.get('/students/me/dashboard'),
  attendance: () => api.get('/attendance/my-summary'),
  results:    () => api.get('/exam/my-results'),
  timetable:  () => api.get('/timetable/my'),
};

export const parentApi = {
  children:   () => api.get('/parents/my-children'),
  attendance: (studentId: string) => api.get(`/attendance/student/${studentId}/summary`),
  fees:       (studentId: string) => api.get(`/fees/student/${studentId}`),
  results:    (studentId: string) => api.get(`/exam/student/${studentId}/results`),
  busTracking:(studentId: string) => api.get(`/transport/student/${studentId}`),
};
