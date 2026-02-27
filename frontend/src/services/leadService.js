import api from './api';

export const getLeads = async (params = {}) => {
  const response = await api.get('/api/leads', { params });
  return response.data;
};

export const getLead = async (id) => {
  const response = await api.get(`/api/leads/${id}`);
  return response.data;
};

export const createLead = async (data) => {
  const response = await api.post('/api/leads', data);
  return response.data;
};

export const updateLead = async (id, data) => {
  const response = await api.put(`/api/leads/${id}`, data);
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await api.delete(`/api/leads/${id}`);
  return response.data;
};

export const addLeadNote = async (id, content) => {
  const response = await api.post(`/api/leads/${id}/notes`, { content });
  return response.data;
};
