import api from '../api/axios';

export const getWallet = () => {
  return api.get('/wallet');
};

export const topUpWallet = (amount) => {
  return api.post('/wallet/top-up', { amount });
};
