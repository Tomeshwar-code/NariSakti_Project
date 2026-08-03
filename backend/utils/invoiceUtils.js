const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

function generateInvoiceNumber() {
  // Format: INV-YYYYMMDD-<short-uuid>
  const date = moment().format('YYYYMMDD');
  const short = uuidv4().split('-')[0].toUpperCase();
  return `INV-${date}-${short}`;
}

module.exports = {
  generateInvoiceNumber
};
