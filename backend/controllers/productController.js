const Product = require("../models/ProductModel");

const defaultCategoryId = "000000000000000000000000";

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
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