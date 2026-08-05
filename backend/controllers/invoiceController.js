const Invoice = require('../models/InvoiceModel');
const Order = require('../models/OrderModel');
const invoiceService = require('../services/invoiceService');
const { generateInvoiceNumber } = require('../utils/invoiceUtils');
const path = require('path');

async function generateInvoiceFromOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('user').populate('orderItems.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const invoiceNumber = generateInvoiceNumber();

    const items = (order.orderItems || []).map(i => ({
      product: i.product?._id,
      name: i.product?.name || i.name || 'Item',
      quantity: i.qty || i.quantity || 1,
      unitPrice: i.price || 0,
      discount: i.discount || 0
    }));

    const invoiceData = {
      invoiceNumber,
      order: order._id,
      orderId: order._id.toString(),
      issueDate: new Date(),
      customer: {
        name: order.shippingAddress?.name || order.user?.name || order.shippingAddress?.fullName || '',
        address: [order.shippingAddress?.address, order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.postalCode].filter(Boolean).join(', '),
        phone: order.shippingAddress?.phone || order.user?.phone || ''
      },
      items,
      subtotal: order.itemsPrice || 0,
      tax: order.taxPrice || 0,
      shipping: order.shippingPrice || 0,
      discount: order.discount || 0,
      total: order.totalPrice || order.itemsPrice + order.taxPrice + order.shippingPrice - (order.discount || 0),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.isPaid ? 'paid' : 'pending',
      seller: {
        name: process.env.COMPANY_NAME || 'NariSakti',
        address: process.env.COMPANY_ADDRESS || '',
        phone: process.env.COMPANY_PHONE || ''
      },
      company: {
        name: process.env.COMPANY_NAME || 'NariSakti',
        logoPath: path.join(__dirname, '..', 'uploads', 'logo.png')
      },
      footer: process.env.COMPANY_FOOTER || 'Thank you for your business'
    };

    // generate PDF
    const { filePath } = await invoiceService.createInvoicePDF(invoiceData);

    const invoice = new Invoice({
      invoiceNumber,
      order: order._id,
      orderId: order._id.toString(),
      invoicePath: filePath,
      issueDate: invoiceData.issueDate,
      customer: invoiceData.customer,
      items: invoiceData.items,
      subtotal: invoiceData.subtotal,
      tax: invoiceData.tax,
      shipping: invoiceData.shipping,
      discount: invoiceData.discount,
      total: invoiceData.total,
      paymentMethod: invoiceData.paymentMethod,
      paymentStatus: invoiceData.paymentStatus,
      seller: invoiceData.seller
    });
    await invoice.save();

    res.status(201).json({ message: 'Invoice generated', invoice });
  } catch (err) {
    next(err);
  }
}

async function getInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) { next(err); }
}

async function downloadInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    const filePath = invoice.invoicePath;
    res.download(filePath);
  } catch (err) { next(err); }
}

async function listInvoices(req, res, next) {
  try {
    const invoices = await Invoice.find({}).sort({ createdAt: -1 }).limit(100);
    res.json(invoices);
  } catch (err) { next(err); }
}

module.exports = {
  generateInvoiceFromOrder,
  getInvoice,
  downloadInvoice,
  listInvoices
};
