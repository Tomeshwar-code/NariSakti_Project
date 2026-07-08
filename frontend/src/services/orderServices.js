import axios from '../api/axios';

export const getOrders = () => {
  return axios.get('/orders');
};

export const getOrder = (id) => {
  return axios.get(`/orders/${id}`);
};

export const createOrder = (orderData) => {
  return axios.post('/orders', orderData);
};

export const updateOrder = (id, data) => {
  return axios.put(`/orders/${id}`, data);
};

export const cancelOrder = (id) => {
  return axios.post(`/orders/${id}/cancel`);
};

export const requestReturn = (id, data) => {
  return axios.post(`/orders/${id}/return`, data);
};
