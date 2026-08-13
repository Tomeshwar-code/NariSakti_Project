// import { useEffect, useState } from 'react';
// import { fetchInvoices, downloadInvoice } from '../../services/invoiceServices';

// export default function InvoicePage() {
//   const [invoices, setInvoices] = useState([]);

//   useEffect(() => {
//     fetchInvoices().then(res => setInvoices(res.data)).catch(() => {});
//   }, []);

//   const onDownload = async (id, number) => {
//     try {
//       const res = await downloadInvoice(id);
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${number}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <div>
//       <h2>Invoices</h2>
//       <table>
//         <thead>
//           <tr><th>Invoice</th><th>Order</th><th>Date</th><th>Total</th><th>Actions</th></tr>
//         </thead>
//         <tbody>
//           {invoices.map(inv => (
//             <tr key={inv._id}>
//               <td>{inv.invoiceNumber}</td>
//               <td>{inv.orderId}</td>
//               <td>{new Date(inv.issueDate).toLocaleString()}</td>
//               <td>{inv.total}</td>
//               <td>
//                 <button onClick={() => onDownload(inv._id, inv.invoiceNumber)}>Download</button>
//                 <button onClick={() => window.print()}>Print</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import { useEffect, useState, useMemo } from 'react';
import { fetchInvoices, downloadInvoice } from '../../services/invoiceServices';
import './InvoicePage.css';

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchInvoicesList();
  }, []);

  // Filter, search, and sort
  useEffect(() => {
    let result = [...invoices];

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (inv) =>
          inv.invoiceNumber?.toLowerCase().includes(term) ||
          inv.orderId?.toLowerCase().includes(term) ||
          inv.customerName?.toLowerCase().includes(term) ||
          inv.customerEmail?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((inv) => inv.status === statusFilter);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.issueDate) - new Date(b.issueDate));
        break;
      case 'highest':
        result.sort((a, b) => b.total - a.total);
        break;
      case 'lowest':
        result.sort((a, b) => a.total - b.total);
        break;
      default:
        break;
    }

    setFilteredInvoices(result);
    setCurrentPage(1);
  }, [invoices, searchTerm, statusFilter, sortBy]);

  const fetchInvoicesList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchInvoices();
      setInvoices(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load invoices.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, invoiceNumber) => {
    setDownloadingId(id);
    try {
      const res = await downloadInvoice(id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoiceNumber || 'invoice'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePrint = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
    // Use setTimeout to allow modal to render before printing
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInvoice(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return 'badge-paid';
      case 'pending':
        return 'badge-pending';
      case 'overdue':
        return 'badge-overdue';
      case 'cancelled':
        return 'badge-cancelled';
      default:
        return 'badge-default';
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter((i) => i.status === 'paid').length;
    const pending = invoices.filter((i) => i.status === 'pending').length;
    const overdue = invoices.filter((i) => i.status === 'overdue').length;
    const totalRevenue = invoices.reduce((sum, i) => sum + (i.total || 0), 0);
    return { total, paid, pending, overdue, totalRevenue };
  }, [invoices]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="invoice-loading">
        <div className="spinner"></div>
        <p>Loading invoices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="invoice-error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
        <button onClick={fetchInvoicesList} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="invoice-page">
      <div className="invoice-header">
        <h2>📄 Invoices</h2>
        <button onClick={fetchInvoicesList} className="refresh-btn" title="Refresh">
          🔄
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Invoices</div>
          </div>
        </div>
        <div className="stat-card stat-paid">
          <span className="stat-icon">✅</span>
          <div>
            <div className="stat-value">{stats.paid}</div>
            <div className="stat-label">Paid</div>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-icon">⏳</span>
          <div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card stat-overdue">
          <span className="stat-icon">⚠️</span>
          <div>
            <div className="stat-value">{stats.overdue}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
        <div className="stat-card stat-revenue">
          <span className="stat-icon">💰</span>
          <div>
            <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search by invoice #, order ID, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Total</option>
            <option value="lowest">Lowest Total</option>
          </select>
        </div>
      </div>

      {/* Results info */}
      <div className="results-info">
        <span>
          Showing {paginatedInvoices.length} of {filteredInvoices.length} invoice
          {filteredInvoices.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      {paginatedInvoices.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>No invoices found</p>
          <span className="empty-sub">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Invoices will appear here once orders are placed'}
          </span>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((inv) => (
                <tr key={inv._id}>
                  <td className="invoice-number">{inv.invoiceNumber}</td>
                  <td className="order-id">{inv.orderId}</td>
                  <td className="customer-info">
                    <div className="customer-name">{inv.customerName || 'N/A'}</div>
                    <div className="customer-email">{inv.customerEmail || ''}</div>
                  </td>
                  <td>{formatDate(inv.issueDate)}</td>
                  <td className="invoice-total">{formatCurrency(inv.total)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(inv.status)}`}>
                      {inv.status || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleDownload(inv._id, inv.invoiceNumber)}
                        disabled={downloadingId === inv._id}
                        className="btn-download"
                        title="Download PDF"
                      >
                        {downloadingId === inv._id ? (
                          <span className="mini-spinner"></span>
                        ) : (
                          '⬇️'
                        )}
                      </button>
                      <button
                        onClick={() => handlePrint(inv)}
                        className="btn-print"
                        title="Print Invoice"
                      >
                        🖨️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ◀ Prev
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next ▶
          </button>
        </div>
      )}

      {/* Print Modal (Invoice Preview) */}
      {showModal && selectedInvoice && (
        <div className="print-modal-overlay" onClick={closeModal}>
          <div className="print-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="print-modal-header">
              <h3>Invoice Preview</h3>
              <button className="close-modal-btn" onClick={closeModal}>✕</button>
            </div>
            <div className="print-invoice-preview" id="printable-invoice">
              <div className="invoice-preview-header">
                <h2>INVOICE</h2>
                <div>
                  <p><strong>Invoice #:</strong> {selectedInvoice.invoiceNumber}</p>
                  <p><strong>Order ID:</strong> {selectedInvoice.orderId}</p>
                  <p><strong>Date:</strong> {formatDate(selectedInvoice.issueDate)}</p>
                </div>
              </div>
              <div className="invoice-preview-customer">
                <p><strong>Customer:</strong> {selectedInvoice.customerName || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedInvoice.customerEmail || 'N/A'}</p>
              </div>
              <div className="invoice-preview-items">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedInvoice.items || []).map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="invoice-preview-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedInvoice.subtotal || 0)}</span>
                </div>
                <div className="total-row">
                  <span>Tax:</span>
                  <span>{formatCurrency(selectedInvoice.tax || 0)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>{formatCurrency(selectedInvoice.shipping || 0)}</span>
                </div>
                <div className="total-row grand-total">
                  <span><strong>Total:</strong></span>
                  <span><strong>{formatCurrency(selectedInvoice.total || 0)}</strong></span>
                </div>
              </div>
              <div className="invoice-preview-footer">
                <p>Thank you for your business!</p>
              </div>
            </div>
            <div className="print-modal-actions">
              <button onClick={closeModal} className="modal-btn modal-close">Close</button>
              <button onClick={() => window.print()} className="modal-btn modal-print">
                🖨️ Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;