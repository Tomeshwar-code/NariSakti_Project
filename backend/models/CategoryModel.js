const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot be more than 50 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    image: {
      public_id: String,
      url: String
    },
    parentCategory: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    totalProducts: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Create slug before saving
CategorySchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Category', CategorySchema);
