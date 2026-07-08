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

export const forgotPassword = async (email) => {
  const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  return response.data;
};

export const resetPassword = async (token, passwords) => {
  const response = await api.post(`${AUTH_ENDPOINTS.RESET_PASSWORD}/${token}`, passwords);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get(AUTH_ENDPOINTS.ME);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put(AUTH_ENDPOINTS.UPDATE_PROFILE, profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put(AUTH_ENDPOINTS.CHANGE_PASSWORD, passwordData);
  return response.data;
};