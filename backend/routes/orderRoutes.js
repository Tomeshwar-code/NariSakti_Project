const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  cancelOrder,
  requestReturn
} = require('../controllers/orderController');

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.post('/', protect, createOrder);
router.put('/:id', protect, updateOrder);
router.post('/:id/cancel', protect, cancelOrder);
router.post('/:id/return', protect, requestReturn);

module.exports = router;
