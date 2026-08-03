import axios from '../api/axios';

export function generateInvoiceFromOrder(orderId) {
  return axios.post(`/api/invoices/generate-from-order/${orderId}`);
}

export function downloadInvoice(invoiceId) {
  return axios.get(`/api/invoices/${invoiceId}/download`, { responseType: 'blob' });
}

export function fetchInvoices() {
  return axios.get('/api/invoices');
}
