const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    
    // Seller Info
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    
    // Category
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: true
    },
    
    // Pricing
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    
    // Product Media
    images: [
      {
        public_id: String,
        url: String,
        isMainImage: {
          type: Boolean,
          default: false
        }
      }
    ],
    video: {
      public_id: String,
      url: String
    },
    
    // Inventory
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    sku: {
      type: String,
      unique: true,
      sparse: true
    },
    
    // Product Variants
    variants: [
      {
        name: String, // e.g., "Size", "Color"
        options: [String] // e.g., ["S", "M", "L"]
      }
    ],
    
    // Specifications
    specifications: [
      {
        key: String,
        value: String
      }
    ],
    
    // Ratings & Reviews
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Map,
      of: Number,
      default: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      }
    },
    
    // Shipping
    weight: Number, // in kg
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    shippingClass: String,
    
    // Status & Visibility
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    rejectionReason: String,
    
    // Stats
    totalSold: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    wishlistCount: {
      type: Number,
      default: 0
    },
    
    // SEO
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String]
  },
  { timestamps: true }
);

// Create slug before saving
ProductSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  }
  next();
});

// Index for search
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ seller: 1 });
ProductSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', ProductSchema);
