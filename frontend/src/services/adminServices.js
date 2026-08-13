// import axios from '../api/axios';

// export const getAdminDashboard = () => axios.get('/admin/dashboard');
// export const getAdminUsers = () => axios.get('/admin/users');
// export const updateUserRole = (userId, role) => axios.put(`/admin/users/${userId}/role`, { role });
// export const getAdminProducts = () => axios.get('/admin/products');
// export const approveProduct = (id) => axios.put(`/admin/products/${id}/approve`);
// export const rejectProduct = (id, reason) => axios.put(`/admin/products/${id}/reject`, { reason });
// export const getAdminOrders = () => axios.get('/admin/orders');
// export const verifySeller = (sellerId, approve = true) => axios.post('/admin/sellers/verify', { sellerId, approve });
import axios from '../api/axios';

// ─── Dashboard ──────────────────────────────────────
export const getAdminDashboard = () => axios.get('/admin/dashboard');

// ─── Users ──────────────────────────────────────────
export const getAdminUsers = () => axios.get('/admin/users');
export const updateUserRole = (userId, role) =>
  axios.put(`/admin/users/${userId}/role`, { role });
export const verifySeller = (sellerId, approve = true) =>
  axios.post('/admin/sellers/verify', { sellerId, approve });

// ─── Products ──────────────────────────────────────
export const getAdminProducts = () => axios.get('/admin/products');
export const approveProduct = (id) =>
  axios.put(`/admin/products/${id}/approve`);
export const rejectProduct = (id, reason) =>
  axios.put(`/admin/products/${id}/reject`, { reason });

// ─── Orders ─────────────────────────────────────────
export const getAdminOrders = () => axios.get('/admin/orders');
export const updateOrderStatus = (orderId, data) =>
  axios.put(`/admin/orders/${orderId}/status`, data);
export const deleteProduct = (id) => axios.delete(`/admin/products/${id}`);
export const getOrderDetails = (orderId) => axios.get(`/admin/orders/${orderId}`);
// ─── Categories ─────────────────────────────────────
export const getCategories = () => axios.get('/admin/categories');
export const createCategory = (data) => axios.post('/admin/categories', data);
export const updateCategory = (id, data) => axios.put(`/admin/categories/${id}`, data);
export const deleteCategory = (id) => axios.delete(`/admin/categories/${id}`);
// ─── Coupons ────────────────────────────────────────
export const getCoupons = () => axios.get('/admin/coupons');
export const createCoupon = (data) => axios.post('/admin/coupons', data);
export const updateCoupon = (id, data) => axios.put(`/admin/coupons/${id}`, data);
export const deleteCoupon = (id) => axios.delete(`/admin/coupons/${id}`);

// ─── Banners ────────────────────────────────────────
export const getBanners = () => axios.get('/admin/banners');
export const createBanner = (data) => axios.post('/admin/banners', data); // data will be FormData
export const updateBanner = (id, data) => axios.put(`/admin/banners/${id}`, data);
export const deleteBanner = (id) => axios.delete(`/admin/banners/${id}`);