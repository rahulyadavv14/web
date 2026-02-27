import api from './api';

export const getContacts = async (params = {}) => {
  const response = await api.get('/api/contacts', { params });
  return response.data;
};

export const getContact = async (id) => {
  const response = await api.get(`/api/contacts/${id}`);
  return response.data;
};

export const createContact = async (data) => {
  const response = await api.post('/api/contacts', data);
  return response.data;
};

export const updateContact = async (id, data) => {
  const response = await api.put(`/api/contacts/${id}`, data);
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await api.delete(`/api/contacts/${id}`);
  return response.data;
};

export const addContactNote = async (id, content) => {
  const response = await api.post(`/api/contacts/${id}/notes`, { content });
  return response.data;
};
