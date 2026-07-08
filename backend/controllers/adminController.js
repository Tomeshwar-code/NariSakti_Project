const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const salesAgg = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, totalSales: { $sum: '$total' } } }
    ]);

    const totalSales = (salesAgg[0] && salesAgg[0].totalSales) || 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalSales
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/products/:id/approve
exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.isVerified = true;
    product.rejectionReason = undefined;
    await product.save();

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/products/:id/reject
exports.rejectProduct = async (req, res) => {
  try {
    const { reason } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.isVerified = false;
    product.rejectionReason = reason || 'Rejected by admin';
    await product.save();

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'firstName lastName email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/sellers/verify
exports.verifySeller = async (req, res) => {
  try {
    const { sellerId, approve = true } = req.body;
    const seller = await User.findById(sellerId);
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });

    seller.isSellerVerified = !!approve;
    await seller.save();

    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
