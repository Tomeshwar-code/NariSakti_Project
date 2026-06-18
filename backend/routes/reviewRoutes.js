const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Review routes will be implemented here
// GET    /api/reviews/product/:id - Get product reviews
// POST   /api/reviews - Create review
// PUT    /api/reviews/:id - Update review
// DELETE /api/reviews/:id - Delete review
// POST   /api/reviews/:id/helpful - Mark as helpful

router.get('/', (req, res) => {
  res.json({ message: 'Review routes coming soon' });
});

module.exports = router;
