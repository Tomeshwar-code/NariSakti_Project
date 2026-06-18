const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      trim: true,
      maxlength: [30, 'Name cannot be more than 30 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      trim: true,
      maxlength: [30, 'Name cannot be more than 30 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      match: [/^\d{10}$/, 'Phone number must be 10 digits']
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'seller', 'admin'],
      default: 'user'
    },
    
    // User Profile
    profileImage: {
      public_id: String,
      url: String
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },
    
    // Email Verification
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationTokenExpire: Date,
    
    // Account Status
    isActive: {
      type: Boolean,
      default: true
    },
    blockedReason: String,
    
    // Seller Specific
    shopName: String,
    shopDescription: String,
    shopImage: {
      public_id: String,
      url: String
    },
    isSellerVerified: {
      type: Boolean,
      default: false
    },
    sellerVerificationDocuments: [
      {
        type: String,
        public_id: String,
        url: String
      }
    ],
    sellerRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalSales: {
      type: Number,
      default: 0
    },
    
    // Reset Password
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    
    // Wishlist
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      }
    ],
    
    // Stats
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    
    lastLogin: Date
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get public profile
UserSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordTokenExpire;
  delete userObject.emailVerificationToken;
  return userObject;
};

module.exports = mongoose.model('User', UserSchema);
