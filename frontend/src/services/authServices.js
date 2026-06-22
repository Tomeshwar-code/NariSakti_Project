import api from '../api/axios';
import { AUTH_ENDPOINTS } from '../api/endpoints';

export const register = async (userData) => {
  const response = await api.post(
    AUTH_ENDPOINTS.REGISTER,
    userData
  );
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post(
    AUTH_ENDPOINTS.LOGIN,
    userData
  );
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};