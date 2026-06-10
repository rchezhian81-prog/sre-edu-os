import api from './client';
export const authApi = {
  login:          (email: string, password: string) => api.post('/auth/login', { email, password }),
  refresh:        (refreshToken: string)            => api.post('/auth/refresh', { refreshToken }),
  me:             ()                                => api.get('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};
