import api from './client';
export const academicsApi = {
  getClasses:     ()                   => api.get('/academics/classes'),
  createClass:    (data: any)          => api.post('/academics/classes', data),
  updateClass:    (id: string, d: any) => api.put(`/academics/classes/${id}`, d),
  deleteClass:    (id: string)         => api.delete(`/academics/classes/${id}`),
  getSections:    (classId: string)    => api.get(`/academics/classes/${classId}/sections`),
  createSection:  (data: any)          => api.post('/academics/sections', data),
  getSubjects:    ()                   => api.get('/academics/subjects'),
  createSubject:  (data: any)          => api.post('/academics/subjects', data),
};
