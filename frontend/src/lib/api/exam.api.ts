import api from './client';
export const examApi = {
  getSchedules:   ()                                  => api.get('/exams/schedules'),
  createSchedule: (data: any)                         => api.post('/exams/schedules', data),
  enterResults:   (examId: string, results: any[])    => api.post(`/exams/${examId}/results`, { results }),
  getResults:     (examId: string)                    => api.get(`/exams/${examId}/results`),
  studentResults: (studentId: string)                 => api.get(`/exams/student/${studentId}/results`),
  reportCard:     (studentId: string, examId: string) => api.get(`/exams/student/${studentId}/report-card/${examId}`),
};
