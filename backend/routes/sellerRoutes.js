const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sellerOnly } = require('../middleware/sellerMiddleware');
const sellerController = require('../controllers/sellerController');

// Public - list sellers
router.get('/', sellerController.getSellers);

// Public - seller profile and products
router.get('/:id', sellerController.getSellerById);

// Protected seller routes
router.put('/profile', protect, sellerOnly, sellerController.updateSellerProfile);
router.get('/dashboard', protect, sellerOnly, sellerController.getDashboard);
router.get('/sales', protect, sellerOnly, sellerController.getSales);

module.exports = router;
