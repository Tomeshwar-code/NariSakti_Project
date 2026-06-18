const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin routes will be implemented here
// GET    /api/admin/dashboard - Admin dashboard
// GET    /api/admin/users - Get all users
// GET    /api/admin/products - Get all products for moderation
// PUT    /api/admin/products/:id/approve - Approve product
// PUT    /api/admin/products/:id/reject - Reject product
// GET    /api/admin/orders - Get all orders
// POST   /api/admin/sellers/verify - Verify seller

router.get('/', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin routes coming soon' });
});

module.exports = router;
