import api from './client';
import type { Student } from '@/types/student.types';
export const studentsApi = {
  getAll:    (params?: any)          => api.get('/students', { params }),
  getById:   (id: string)            => api.get(`/students/${id}`),
  getStats:  ()                      => api.get('/students/stats'),
  byClass:   (classId: string, sectionId?: string) => api.get(`/students/by-class/${classId}`, { params: { sectionId } }),
  create:    (data: Partial<Student>) => api.post('/students', data),
  update:    (id: string, data: Partial<Student>) => api.put(`/students/${id}`, data),
  remove:    (id: string)             => api.delete(`/students/${id}`),
};
