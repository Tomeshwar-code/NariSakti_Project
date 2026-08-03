const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');
const bwipjs = require('bwip-js');

async function createInvoicePDF(invoiceData) {
  return new Promise(async (resolve, reject) => {
    try {
      const invoicesDir = path.join(__dirname, '..', 'uploads', 'invoices');
      if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true });

      const fileName = `${invoiceData.invoiceNumber.replace(/[^a-zA-Z0-9-_]/g, '')}.pdf`;
      const filePath = path.join(invoicesDir, fileName);

      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header: Logo (if provided) and company
      if (invoiceData.company && invoiceData.company.logoPath && fs.existsSync(invoiceData.company.logoPath)) {
        try { doc.image(invoiceData.company.logoPath, 50, 45, { width: 90 }); } catch (e) { /* ignore */ }
      }
      doc.fontSize(16).text(invoiceData.company?.name || 'Company Name', 150, 50);
      doc.moveDown();

      // Invoice meta
      doc.fontSize(12).text(`Invoice: ${invoiceData.invoiceNumber}`, { align: 'right' });
      doc.text(`Order ID: ${invoiceData.orderId}`, { align: 'right' });
      doc.text(`Date: ${new Date(invoiceData.issueDate).toLocaleString()}`, { align: 'right' });

      doc.moveDown();

      // Billing info
      doc.fontSize(12).text('Bill To:', 50, 180);
      doc.fontSize(10).text(invoiceData.customer?.name || '', 50, 200);
      doc.text(invoiceData.customer?.address || '', 50, 215);
      doc.text(invoiceData.customer?.phone || '', 50, 230);

      // Seller info
      doc.fontSize(12).text('Seller:', 350, 180);
      doc.fontSize(10).text(invoiceData.seller?.name || '', 350, 200);
      doc.text(invoiceData.seller?.address || '', 350, 215);

      doc.moveDown(3);

      // Table header
      const tableTop = 280;
      doc.fontSize(10);
      doc.text('Item', 50, tableTop);
      doc.text('Qty', 300, tableTop);
      doc.text('Unit Price', 350, tableTop, { width: 90, align: 'right' });
      doc.text('Discount', 450, tableTop, { width: 90, align: 'right' });
      doc.text('Total', 520, tableTop, { width: 90, align: 'right' });

      let y = tableTop + 20;
      for (const item of invoiceData.items || []) {
        doc.text(item.name, 50, y);
        doc.text(item.quantity.toString(), 300, y);
        doc.text(item.unitPrice.toFixed(2), 350, y, { width: 90, align: 'right' });
        doc.text((item.discount || 0).toFixed(2), 450, y, { width: 90, align: 'right' });
        const lineTotal = (item.unitPrice * item.quantity) - (item.discount || 0);
        doc.text(lineTotal.toFixed(2), 520, y, { width: 90, align: 'right' });
        y += 20;
        if (y > 700) { doc.addPage(); y = 50; }
      }

      // Totals
      doc.text(`Subtotal: ${invoiceData.subtotal.toFixed(2)}`, 400, y + 20, { align: 'right' });
      doc.text(`Tax: ${invoiceData.tax.toFixed(2)}`, 400, y + 40, { align: 'right' });
      doc.text(`Shipping: ${invoiceData.shipping.toFixed(2)}`, 400, y + 60, { align: 'right' });
      doc.text(`Discount: ${invoiceData.discount.toFixed(2)}`, 400, y + 80, { align: 'right' });
      doc.fontSize(12).text(`Grand Total: ${invoiceData.total.toFixed(2)}`, 400, y + 110, { align: 'right' });

      // Payment
      doc.fontSize(10).text(`Payment Method: ${invoiceData.paymentMethod || ''}`, 50, y + 140);
      doc.text(`Payment Status: ${invoiceData.paymentStatus || ''}`, 50, y + 155);

      // QR code for invoice
      try {
        const qrData = await qrcode.toDataURL(invoiceData.invoiceNumber);
        const qrBase64 = qrData.split(',')[1];
        const qrBuffer = Buffer.from(qrBase64, 'base64');
        doc.image(qrBuffer, 50, y + 180, { width: 80 });
      } catch (e) {
        // ignore QR failures
      }

      // Barcode (code128) for invoice number
      try {
        const bw = await bwipjs.toBuffer({ bcid: 'code128', text: invoiceData.invoiceNumber, scale: 2, height: 10, includetext: false });
        doc.image(bw, 150, y + 180, { width: 300, height: 50 });
      } catch (e) {
        // ignore
      }

      // Footer
      doc.moveTo(50, 780).lineTo(560, 780).stroke();
      doc.fontSize(8).text(invoiceData.footer || 'Thank you for your business', 50, 785, { align: 'center', width: 500 });

      doc.end();

      stream.on('finish', () => resolve({ filePath, fileName }));
      stream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  createInvoicePDF
};
