const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");
const mongoose = require("mongoose");

const defaultCategoryId = "000000000000000000000000";

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { isActive: true };

    if (keyword) {
      const searchRegex = new RegExp(keyword.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { metaKeywords: searchRegex },
      ];
    }

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const categoryRegex = new RegExp(`^${category.trim()}$`, "i");
        const selectedCategory = await Category.findOne({
          $or: [
            { slug: categoryRegex },
            { name: categoryRegex },
          ],
          isActive: true,
        });

        if (!selectedCategory) {
          return res.status(200).json({
            success: true,
            count: 0,
            total: 0,
            products: [],
          });
        }

        query.category = selectedCategory._id;
      }
    }

    const resultLimit = Number(limit) || 20;
    const currentPage = Number(page) || 1;
    const skip = resultLimit * (currentPage - 1);
    const sortBy = sort ? sort.split(",").join(" ") : "-createdAt";

    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortBy)
      .limit(resultLimit)
      .skip(skip);
    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (!payload.seller && (req.user?.id || req.user?._id)) {
      payload.seller = req.user.id || req.user._id;
    }

    if (!payload.category) {
      payload.category = defaultCategoryId;
    }

    const product = await Product.create(payload);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (req.user && req.user.role !== "admin" && String(existing.seller) !== String(req.user.id || req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products",
      });
    }

    const payload = { ...req.body };
    delete payload.seller;

    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (req.user && req.user.role !== "admin" && String(existing.seller) !== String(req.user.id || req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own products",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
