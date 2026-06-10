import api from './client';
export const attendanceApi = {
  mark:        (data: any)                             => api.post('/attendance/mark', data),
  byClassDate: (classId: string, date: string, sectionId?: string) =>
    api.get(`/attendance/class/${classId}`, { params: { date, sectionId } }),
  monthly:     (studentId: string, year: number, month: number) =>
    api.get(`/attendance/student/${studentId}/monthly`, { params: { year, month } }),
  atRisk:      (threshold?: number)                    => api.get('/attendance/at-risk', { params: { threshold } }),
};
