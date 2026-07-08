const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Admin routes
router.get('/dashboard', protect, authorize('admin'), adminController.getDashboard);
router.get('/users', protect, authorize('admin'), adminController.getUsers);
router.get('/products', protect, authorize('admin'), adminController.getProducts);
router.put('/products/:id/approve', protect, authorize('admin'), adminController.approveProduct);
router.put('/products/:id/reject', protect, authorize('admin'), adminController.rejectProduct);
router.get('/orders', protect, authorize('admin'), adminController.getOrders);
router.post('/sellers/verify', protect, authorize('admin'), adminController.verifySeller);

module.exports = router;
