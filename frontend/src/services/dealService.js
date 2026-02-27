import api from './api';

export const getDeals = async (params = {}) => {
  const response = await api.get('/api/deals', { params });
  return response.data;
};

export const getDeal = async (id) => {
  const response = await api.get(`/api/deals/${id}`);
  return response.data;
};

export const createDeal = async (data) => {
  const response = await api.post('/api/deals', data);
  return response.data;
};

export const updateDeal = async (id, data) => {
  const response = await api.put(`/api/deals/${id}`, data);
  return response.data;
};

export const deleteDeal = async (id) => {
  const response = await api.delete(`/api/deals/${id}`);
  return response.data;
};

export const updateDealStage = async (id, stage) => {
  const response = await api.patch(`/api/deals/${id}/stage`, { stage });
  return response.data;
};
