import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
};

export const getActivities = async (limit = 20) => {
  const response = await api.get('/api/activities', { params: { limit } });
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get('/api/notifications');
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/api/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.put('/api/notifications/read-all');
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/api/auth/users');
  return response.data;
};
