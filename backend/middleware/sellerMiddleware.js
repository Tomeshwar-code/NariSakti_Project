const User = require('../models/UserModel');
const { protect } = require('./authMiddleware');

exports.requireSeller = async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    if (res.headersSent) return;

    const user = await User.findById(req.user?.id || req.user?._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'seller' && user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only sellers can access this route' });
    }

    if (user.role === 'seller' && !user.isSellerVerified) {
      return res.status(403).json({ success: false, message: 'Your seller account is not verified yet' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message || 'Not authorized' });
  }
};

exports.sellerOnly = async (req, res, next) => {
  try {
    const user = req.user || await User.findById(req.user?.id || req.user?._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'seller' && user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only sellers can access this route' });
    }

    if (user.role === 'seller' && !user.isSellerVerified) {
      return res.status(403).json({ success: false, message: 'Your seller account is not verified yet' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
