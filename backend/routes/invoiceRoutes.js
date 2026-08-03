const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Generate invoice from order
router.post('/generate-from-order/:orderId', invoiceController.generateInvoiceFromOrder);

// Get invoice record
router.get('/:id', invoiceController.getInvoice);

// Download invoice PDF
router.get('/:id/download', invoiceController.downloadInvoice);

// List invoices
router.get('/', invoiceController.listInvoices);

module.exports = router;
