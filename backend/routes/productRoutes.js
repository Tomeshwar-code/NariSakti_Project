const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Product routes will be implemented here
// GET    /api/products - Get all products
// GET    /api/products/:id - Get single product
// POST   /api/products - Create product (seller only)
// PUT    /api/products/:id - Update product (seller only)
// DELETE /api/products/:id - Delete product (seller only)
// GET    /api/products/search - Search products
// POST   /api/products/:id/like - Add to wishlist

router.get('/', (req, res) => {
  res.json({ message: 'Product routes coming soon' });
});

module.exports = router;
