import axios from '../api/axios';

export const getAdminDashboard = () => axios.get('/admin/dashboard');
export const getAdminUsers = () => axios.get('/admin/users');
export const getAdminProducts = () => axios.get('/admin/products');
export const approveProduct = (id) => axios.put(`/admin/products/${id}/approve`);
export const rejectProduct = (id, reason) => axios.put(`/admin/products/${id}/reject`, { reason });
export const getAdminOrders = () => axios.get('/admin/orders');
export const verifySeller = (sellerId, approve = true) => axios.post('/admin/sellers/verify', { sellerId, approve });
