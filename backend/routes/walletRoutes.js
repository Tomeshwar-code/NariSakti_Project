const express = require('express');
const router = express.Router();
const { getWallet, topUpWallet } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWallet);
router.post('/top-up', protect, topUpWallet);

module.exports = router;
