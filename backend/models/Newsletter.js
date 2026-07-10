const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'unsubscribed'],
      default: 'active',
    },
    subscriptionDate: {
      type: Date,
      default: Date.now,
    },
    lastEmailSent: {
      type: Date,
    },
    emailCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: ['products', 'sellers', 'offers', 'all'],
      default: 'all',
    },
    source: {
      type: String,
      enum: ['footer', 'popup', 'email', 'direct'],
      default: 'footer',
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Newsletter', newsletterSchema);