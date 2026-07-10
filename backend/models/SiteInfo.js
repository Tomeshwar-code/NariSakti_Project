const mongoose = require('mongoose');

const siteInfoSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'NariSakti',
    },
    tagline: {
      type: String,
      default: 'Empowering Rural Women',
    },
    logo: {
      type: String,
    },
    companyDescription: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    contact: {
      phone: String,
      email: String,
      alternatePhone: String,
      whatsapp: String,
    },
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String,
      pinterest: String,
    },
    businessHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String,
    },
    policies: {
      privacy: String,
      terms: String,
      returns: String,
      shipping: String,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    copyrightYear: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteInfo', siteInfoSchema);