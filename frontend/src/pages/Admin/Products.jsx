// import { useEffect, useState } from 'react';
// import { getAdminProducts, approveProduct, rejectProduct } from '../../services/adminServices';

// const Products = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await getAdminProducts();
//       setProducts(res.data.products || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleApprove = async (id) => {
//     try {
//       await approveProduct(id);
//       fetchProducts();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleReject = async (id) => {
//     const reason = prompt('Reason for rejection (optional)');
//     try {
//       await rejectProduct(id, reason);
//       fetchProducts();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h2>Products</h2>
//       <div>
//         {products.map(p => (
//           <div key={p._id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
//             <h4>{p.name}</h4>
//             <p>Price: ₹{p.price}</p>
//             <p>Verified: {p.isVerified ? 'Yes' : 'No'}</p>
//             <button onClick={() => handleApprove(p._id)}>Approve</button>
//             <button onClick={() => handleReject(p._id)}>Reject</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Products;
// AdminProducts.jsx
import { useEffect, useState, useMemo } from 'react';
import { getAdminProducts, approveProduct, rejectProduct } from '../../services/adminServices';
import './Products.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // { productId, action: 'approve' | 'reject' }
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter, sort, and search
  useEffect(() => {
    let result = [...products];

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term) ||
          p.vendor?.name?.toLowerCase().includes(term) ||
          p.vendor?.email?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term)
      );
    }

    // Verification filter
    if (verificationFilter !== 'all') {
      if (verificationFilter === 'verified') {
        result = result.filter((p) => p.isVerified === true);
      } else if (verificationFilter === 'pending') {
        result = result.filter((p) => p.isVerified === false && p.verificationStatus !== 'rejected');
      } else if (verificationFilter === 'rejected') {
        result = result.filter((p) => p.verificationStatus === 'rejected');
      }
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, searchTerm, verificationFilter, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminProducts();
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    setModalAction({ productId, action: 'approve' });
    setRejectionReason('');
    setShowConfirmModal(true);
  };

  const handleReject = async (productId) => {
    setModalAction({ productId, action: 'reject' });
    setRejectionReason('');
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    if (!modalAction) return;
    const { productId, action } = modalAction;
    setActionInProgress(productId);
    try {
      if (action === 'approve') {
        await approveProduct(productId);
      } else {
        await rejectProduct(productId, rejectionReason.trim() || 'No reason provided');
      }
      // Refresh the list
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || `Failed to ${action} product.`);
    } finally {
      setActionInProgress(null);
      setShowConfirmModal(false);
      setModalAction(null);
      setRejectionReason('');
    }
  };

  const cancelModal = () => {
    setShowConfirmModal(false);
    setModalAction(null);
    setRejectionReason('');
  };

  const getVerificationStatus = (product) => {
    if (product.isVerified) return 'verified';
    if (product.verificationStatus === 'rejected') return 'rejected';
    return 'pending';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'verified':
        return 'badge-verified';
      case 'pending':
        return 'badge-pending';
      case 'rejected':
        return 'badge-rejected';
      default:
        return 'badge-secondary';
    }
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

  // Stats
  const stats = useMemo(() => {
    const total = products.length;
    const verified = products.filter((p) => p.isVerified).length;
    const pending = products.filter((p) => !p.isVerified && p.verificationStatus !== 'rejected').length;
    const rejected = products.filter((p) => p.verificationStatus === 'rejected').length;
    const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
    return { total, verified, pending, rejected, totalValue };
  }, [products]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="admin-products-loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-products-error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
        <button onClick={fetchProducts} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-products-container">
      <div className="admin-products-header">
        <h2>🛒 Product Management</h2>
        <button onClick={fetchProducts} className="refresh-btn" title="Refresh products">
          🔄
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>
        <div className="stat-card stat-verified">
          <span className="stat-icon">✅</span>
          <div>
            <div className="stat-value">{stats.verified}</div>
            <div className="stat-label">Verified</div>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-icon">⏳</span>
          <div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>
        <div className="stat-card stat-rejected">
          <span className="stat-icon">🚫</span>
          <div>
            <div className="stat-value">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
        <div className="stat-card stat-value">
          <span className="stat-icon">💰</span>
          <div>
            <div className="stat-value">{formatCurrency(stats.totalValue)}</div>
            <div className="stat-label">Total Inventory Value</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search by name, category, vendor..."
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
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Results info */}
      <div className="results-info">
        <span>
          Showing {paginatedProducts.length} of {filteredProducts.length} product
          {filteredProducts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Products List */}
      {paginatedProducts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>No products found</p>
          <span className="empty-sub">
            {searchTerm || verificationFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Products will appear here once vendors add them'}
          </span>
        </div>
      ) : (
        <div className="products-list">
          {paginatedProducts.map((product) => {
            const status = getVerificationStatus(product);
            return (
              <div key={product._id} className="product-card">
                <div className="product-card-header">
                  <div className="product-title-section">
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="product-thumbnail"
                      />
                    )}
                    <div className="product-name-wrapper">
                      <span className="product-name">{product.name}</span>
                      <span className="product-category">{product.category || 'Uncategorized'}</span>
                    </div>
                  </div>
                  <div className="product-status-section">
                    <span className={`status-badge ${getStatusBadgeClass(status)}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleApprove(product._id)}
                        disabled={actionInProgress === product._id || status === 'verified'}
                        className="btn-approve"
                        title="Approve product"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleReject(product._id)}
                        disabled={actionInProgress === product._id || status === 'rejected'}
                        className="btn-reject"
                        title="Reject product"
                      >
                        🚫 Reject
                      </button>
                    </div>
                  </div>
                </div>

                <div className="product-card-body">
                  <div className="product-info-grid">
                    <div className="info-item">
                      <span className="label">Price</span>
                      <span className="value">{formatCurrency(product.price)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Stock</span>
                      <span className="value">{product.stock ?? 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Brand</span>
                      <span className="value">{product.brand || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Vendor</span>
                      <span className="value">
                        {product.vendor?.name || 'Unknown'}
                        {product.vendor?.email && (
                          <span className="vendor-email"> ({product.vendor.email})</span>
                        )}
                      </span>
                    </div>
                    <div className="info-item full-width">
                      <span className="label">Description</span>
                      <span className="value description-text">
                        {product.description?.substring(0, 120)}
                        {product.description?.length > 120 ? '...' : ''}
                      </span>
                    </div>
                    <div className="info-item full-width">
                      <span className="label">Added</span>
                      <span className="value">{formatDate(product.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {actionInProgress === product._id && (
                  <div className="product-action-loading">
                    <span className="loading-spinner"></span> Updating...
                  </div>
                )}
              </div>
            );
          })}
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

      {/* Confirmation Modal */}
      {showConfirmModal && modalAction && (
        <div className="modal-overlay" onClick={cancelModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              {modalAction.action === 'approve' ? 'Approve Product' : 'Reject Product'}
            </h3>
            <p>
              Are you sure you want to <strong>{modalAction.action}</strong> this product?
            </p>
            {modalAction.action === 'reject' && (
              <div className="modal-reason">
                <label htmlFor="rejection-reason">Reason for rejection (optional):</label>
                <textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason..."
                  rows="3"
                />
              </div>
            )}
            <div className="modal-actions">
              <button onClick={cancelModal} className="modal-btn modal-cancel">
                Cancel
              </button>
              <button onClick={confirmAction} className={`modal-btn modal-confirm-${modalAction.action}`}>
                {modalAction.action === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;