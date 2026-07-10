const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// @desc    Verify JWT Token
// @route   Middleware
// @access  Private
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
      
      // Get user from database
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }
      throw error;
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// @desc    Check User Role
// @route   Middleware
// @access  Private
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

// @desc    Seller Authorization
exports.sellerOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Only sellers can access this route'
      });
    }

    if (!user.isSellerVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your seller account is not verified yet'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Admin Authorization
exports.adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this route'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

