import api from './client';
export const feesApi = {
  getStructures:  ()                  => api.get('/fees/structures'),
  createStructure:(data: any)         => api.post('/fees/structures', data),
  collect:        (data: any)         => api.post('/fees/collect', data),
  getStudent:     (studentId: string) => api.get(`/fees/student/${studentId}`),
  getDefaulters:  (year: string)      => api.get('/fees/defaulters', { params: { year } }),
  getSummary:     (year: string)      => api.get('/fees/summary', { params: { year } }),
};
