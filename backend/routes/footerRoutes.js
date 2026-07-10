const express = require('express');
const router = express.Router();
const footerController = require('../controllers/footerController');
const { authenticate, authorize } = require('../middleware/authMiddleware'); // We'll create this

// ============== Public Routes ==============

// Newsletter
router.post('/newsletter/subscribe', footerController.subscribeNewsletter);
router.post('/newsletter/unsubscribe', footerController.unsubscribeNewsletter);

// Footer Content
router.get('/content', footerController.getFooterContent);
router.get('/content/:section', footerController.getFooterSection);

// Site Info
router.get('/site-info', footerController.getSiteInfo);
router.get('/contact', footerController.getContactInfo);
router.get('/social-media', footerController.getSocialMedia);

// ============== Protected Routes (Admin Only) ==============

router.put(
  '/newsletter/stats',
  authenticate,
  authorize('admin'),
  footerController.getNewsletterStats
);

router.put(
  '/content/:section',
  authenticate,
  authorize('admin'),
  footerController.updateFooterContent
);

router.put(
  '/site-info',
  authenticate,
  authorize('admin'),
  footerController.updateSiteInfo
);

module.exports = router;