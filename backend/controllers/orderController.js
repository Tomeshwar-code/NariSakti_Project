const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');

const calculateOrderTotals = ({ items, shippingCharge = 0, discount = 0, tax = 0 }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + Number(shippingCharge || 0) - Number(discount || 0) + Number(tax || 0);
  return { subtotal, total, shippingCharge, discount, tax };
};

exports.getOrders = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({ path: 'items.product', select: 'name price images' });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      shippingCharge = 0,
      discount = 0,
      tax = 0,
      paymentMethod = 'cod',
      notes,
      couponCode
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required to create an order' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    const orderItems = [];

    for (const item of items) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ success: false, message: 'Each item must include a product and quantity' });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        seller: product.seller
      });

      product.stock -= item.quantity;
      product.totalSold += item.quantity;
      await product.save();
    }

    const totals = calculateOrderTotals({ items: orderItems, shippingCharge, discount, tax });

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      shippingCharge: totals.shippingCharge,
      discount: totals.discount,
      tax: totals.tax,
      subtotal: totals.subtotal,
      total: totals.total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'processing',
      orderStatus: 'pending',
      notes,
      couponCode
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalOrders: 1, totalSpent: totals.total }
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    if (['cancelled', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Cannot update this order at its current status' });
    }

    const updates = {};
    if (req.body.shippingAddress) updates.shippingAddress = req.body.shippingAddress;
    if (req.body.billingAddress) updates.billingAddress = req.body.billingAddress;
    if (req.body.notes) updates.notes = req.body.notes;
    if (req.user.role === 'admin' && req.body.orderStatus) updates.orderStatus = req.body.orderStatus;
    if (req.user.role === 'admin' && req.body.paymentStatus) updates.paymentStatus = req.body.paymentStatus;

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (['cancelled', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }

    order.orderStatus = 'cancelled';
    order.cancellationDate = new Date();
    if (order.paymentStatus === 'completed') {
      order.paymentStatus = 'refunded';
    }

    await Promise.all(order.items.map(async item => {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        product.totalSold = Math.max(product.totalSold - item.quantity, 0);
        await product.save();
      }
    }));

    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.requestReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to request a return for this order' });
    }

    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({ success: false, message: 'Return requests are only allowed for delivered orders' });
    }

    order.returnRequest = {
      status: 'requested',
      reason: req.body.reason || 'No reason provided',
      requestDate: new Date()
    };
    order.returnRequested = true;
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
