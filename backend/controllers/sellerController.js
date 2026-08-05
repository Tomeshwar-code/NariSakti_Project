const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');

// GET /api/sellers - list sellers
exports.getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).select('-password');
    res.status(200).json({ success: true, count: sellers.length, sellers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/sellers/:id - get seller profile
exports.getSellerById = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id).select('-password');
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });

    const products = await Product.find({ seller: seller._id }).limit(50);

    res.status(200).json({ success: true, seller, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/sellers/profile - update seller profile (authenticated seller)
exports.updateSellerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = { ...req.body };

    // Do not allow role change or verification toggles from this endpoint
    delete updates.role;
    delete updates.isSellerVerified;

    const seller = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/sellers/dashboard - seller dashboard stats
exports.getDashboard = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const totalProducts = await Product.countDocuments({ seller: sellerId });

    // Orders containing seller's products
    const orders = await Order.find({ 'items.seller': sellerId });

    const totalOrders = orders.length;

    let totalSales = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        if (String(item.seller) === String(sellerId)) {
          totalSales += (item.price || 0) * (item.quantity || 1);
        }
      });
    });

    res.status(200).json({ success: true, stats: { totalProducts, totalOrders, totalSales } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/sellers/sales - detailed sales list for seller
exports.getSales = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const orders = await Order.find({ 'items.seller': sellerId }).sort({ createdAt: -1 });

    // Map orders to only include seller's items
    const sellerOrders = orders.map(o => {
      const items = o.items.filter(i => String(i.seller) === String(sellerId));
      return {
        _id: o._id,
        orderNumber: o.orderNumber,
        total: items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0),
        items,
        orderStatus: o.orderStatus,
        createdAt: o.createdAt
      };
    });

    res.status(200).json({ success: true, count: sellerOrders.length, orders: sellerOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSellers: exports.getSellers,
  getSellerById: exports.getSellerById,
  updateSellerProfile: exports.updateSellerProfile,
  getDashboard: exports.getDashboard,
  getSales: exports.getSales
};
