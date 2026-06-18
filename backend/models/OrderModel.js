const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    // Order Number
    orderNumber: {
      type: String,
      unique: true
    },
    
    // User Info
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    
    // Items
    items: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        },
        seller: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: true
        },
        status: {
          type: String,
          enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
          default: 'pending'
        },
        trackingNumber: String,
        deliveryDate: Date,
        returnRequest: {
          status: {
            type: String,
            enum: ['none', 'requested', 'approved', 'rejected', 'completed']
          },
          reason: String,
          requestDate: Date
        }
      }
    ],
    
    // Pricing
    subtotal: {
      type: Number,
      required: true
    },
    shippingCharge: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    
    // Shipping Address
    shippingAddress: {
      firstName: String,
      lastName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
      isDefault: Boolean
    },
    
    // Billing Address
    billingAddress: {
      firstName: String,
      lastName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },
    
    // Payment
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'upi', 'wallet', 'cod'],
      default: 'razorpay'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentId: String,
    transactionId: String,
    paymentDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String
    },
    
    // Order Status
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    },
    
    // Additional Info
    couponCode: String,
    notes: String,
    
    // Dates
    deliveryDate: Date,
    cancellationDate: Date,
    cancellationReason: String,
    
    // Return Info
    returnRequested: {
      type: Boolean,
      default: false
    },
    returnReason: String,
    returnRequestDate: Date,
    returnApprovedDate: Date,
    returnShippingDate: Date,
    returnReceivedDate: Date
  },
  { timestamps: true }
);

// Generate unique order number
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `NS${Date.now()}${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Index for queries
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ 'items.seller': 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ orderStatus: 1 });

module.exports = mongoose.model('Order', OrderSchema);
