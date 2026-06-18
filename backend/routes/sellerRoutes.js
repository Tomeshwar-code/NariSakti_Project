const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Seller routes will be implemented here
// GET    /api/sellers - Get all sellers
// GET    /api/sellers/:id - Get seller profile
// PUT    /api/sellers/profile - Update seller profile
// GET    /api/sellers/dashboard - Seller dashboard
// GET    /api/sellers/sales - Get seller sales

router.get('/', (req, res) => {
  res.json({ message: 'Seller routes coming soon' });
});

module.exports = router;
