const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Generate Access Token
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  });
};

// Send Token Response
const sendTokenResponse = (user, statusCode, res, message) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.status(statusCode)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json({
      success: true,
      message: message || 'Operation successful',
      accessToken,
      refreshToken,
      user: user.getPublicProfile()
    });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  sendTokenResponse
};
