const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true, default: 0 },
  discount: { type: Number, required: false, default: 0 }
});

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  orderId: { type: String },
  invoicePath: { type: String },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  customer: {
    name: String,
    address: String,
    phone: String,
    email: String
  },
  items: [InvoiceItemSchema],
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  paymentMethod: { type: String },
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  seller: {
    name: String,
    address: String,
    phone: String,
    email: String
  },
  type: { type: String, enum: ['tax_invoice','proforma','credit_note','debit_note','refund'], default: 'tax_invoice' },
  status: { type: String, enum: ['active','cancelled'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
