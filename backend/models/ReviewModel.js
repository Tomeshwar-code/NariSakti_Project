const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    order: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order'
    },
    rating: {
      type: Number,
      required: [true, 'Please provide rating'],
      min: 1,
      max: 5
    },
    title: {
      type: String,
      required: [true, 'Please provide review title'],
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    comment: {
      type: String,
      required: [true, 'Please provide review comment'],
      maxlength: [1000, 'Comment cannot be more than 1000 characters']
    },
    images: [
      {
        public_id: String,
        url: String
      }
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0
    },
    notHelpful: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved'
    },
    rejectionReason: String,
    sellerResponse: {
      comment: String,
      respondedAt: Date
    }
  },
  { timestamps: true }
);

// Index for queries
ReviewSchema.index({ product: 1, status: 1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ order: 1 });
ReviewSchema.index({ rating: -1, createdAt: -1 });

module.exports = mongoose.model('Review', ReviewSchema);
