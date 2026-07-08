const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful
} = require('../controllers/reviewController');

router.get('/product/:id', getProductReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markReviewHelpful);

module.exports = router;
