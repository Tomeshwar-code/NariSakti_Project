const mongoose = require('mongoose');

const footerContentSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ['about', 'quickLinks', 'customerService', 'forSellers', 'contact'],
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    links: [
      {
        label: String,
        url: String,
        target: {
          type: String,
          enum: ['_self', '_blank'],
          default: '_self',
        },
      },
    ],
    contactInfo: {
      address: String,
      phone: String,
      email: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    socialLinks: [
      {
        platform: String,
        url: String,
        icon: String,
      },
    ],
    businessHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FooterContent', footerContentSchema);