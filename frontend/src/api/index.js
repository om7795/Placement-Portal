import api from './axios.js';

/* ----------------------------- Auth ----------------------------- */
export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  updateMe: (payload) => api.put('/auth/me', payload).then((r) => r.data),
  changePassword: (payload) => api.put('/auth/password', payload).then((r) => r.data),
};

/* --------------------------- Students --------------------------- */
export const studentApi = {
  getMyProfile: () => api.get('/students/me').then((r) => r.data),
  saveMyProfile: (payload) => api.put('/students/me', payload).then((r) => r.data),
  list: (params) => api.get('/students', { params }).then((r) => r.data),
  getById: (id) => api.get(`/students/${id}`).then((r) => r.data),
};

/* ---------------------------- Alumni ---------------------------- */
export const alumniApi = {
  getMyProfile: () => api.get('/alumni/me').then((r) => r.data),
  saveMyProfile: (payload) => api.put('/alumni/me', payload).then((r) => r.data),
  list: (params) => api.get('/alumni', { params }).then((r) => r.data),
  mentors: () => api.get('/alumni/mentors').then((r) => r.data),
  pending: () => api.get('/alumni/pending').then((r) => r.data),
  approve: (userId) => api.patch(`/alumni/${userId}/approve`).then((r) => r.data),
};

/* --------------------------- Companies -------------------------- */
export const companyApi = {
  list: (params) => api.get('/companies', { params }).then((r) => r.data),
  get: (id) => api.get(`/companies/${id}`).then((r) => r.data),
  create: (payload) => api.post('/companies', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/companies/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/companies/${id}`).then((r) => r.data),
};

/* ----------------------------- Jobs ----------------------------- */
export const jobApi = {
  list: (params) => api.get('/jobs', { params }).then((r) => r.data),
  get: (id) => api.get(`/jobs/${id}`).then((r) => r.data),
  create: (payload) => api.post('/jobs', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/jobs/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/jobs/${id}`).then((r) => r.data),
  mine: () => api.get('/jobs/mine').then((r) => r.data),
};

/* ------------------------- Applications ------------------------- */
export const applicationApi = {
  apply: (payload) => api.post('/applications', payload).then((r) => r.data),
  mine: () => api.get('/applications/mine').then((r) => r.data),
  forJob: (jobId, params) =>
    api.get(`/applications/job/${jobId}`, { params }).then((r) => r.data),
  updateStatus: (id, payload) =>
    api.patch(`/applications/${id}/status`, payload).then((r) => r.data),
  withdraw: (id) => api.patch(`/applications/${id}/withdraw`).then((r) => r.data),
};

/* -------------------------- Mentorship -------------------------- */
export const mentorshipApi = {
  create: (payload) => api.post('/mentorship', payload).then((r) => r.data),
  mine: () => api.get('/mentorship/mine').then((r) => r.data),
  respond: (id, payload) =>
    api.patch(`/mentorship/${id}/respond`, payload).then((r) => r.data),
};

/* ---------------------------- Events ---------------------------- */
export const eventApi = {
  list: (params) => api.get('/events', { params }).then((r) => r.data),
  get: (id) => api.get(`/events/${id}`).then((r) => r.data),
  create: (payload) => api.post('/events', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/events/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/events/${id}`).then((r) => r.data),
  toggleRegister: (id) => api.patch(`/events/${id}/register`).then((r) => r.data),
};

/* ------------------------- Notifications ------------------------ */
export const notificationApi = {
  list: (params) => api.get('/notifications', { params }).then((r) => r.data),
  unreadCount: () => api.get('/notifications/unread-count').then((r) => r.data),
  markRead: (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.patch('/notifications/read-all').then((r) => r.data),
};

/* ----------------------------- Admin ---------------------------- */
export const adminApi = {
  stats: () => api.get('/admin/stats').then((r) => r.data),
};

/* ------------------------------ AI ------------------------------ */
export const aiApi = {
  health: () => api.get('/ai/health').then((r) => r.data),
  match: (payload) => api.post('/ai/match', payload).then((r) => r.data),
  recommend: (payload) => api.post('/ai/recommend', payload).then((r) => r.data),
};
