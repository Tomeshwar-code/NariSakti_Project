// import { useEffect, useState } from 'react';
// import { getOrders } from '../../services/orderServices';

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await getOrders();
//         setOrders(res.data.orders || []);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     load();
//   }, []);

//   return (
//     <div>
//       <h2>Your Orders</h2>
//       {orders.length === 0 ? <p>No orders yet.</p> : (
//         orders.map(o => (
//           <div key={o._id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
//             <div>Order: {o.orderNumber}</div>
//             <div>Total: ₹{o.total}</div>
//             <div>Status: {o.orderStatus}</div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default OrdersPage;
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, cancelOrder } from '../../services/orderServices';
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter, search, sort
  useEffect(() => {
    let result = [...orders];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(term) ||
          o._id?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((o) => o.orderStatus === statusFilter);
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [orders, searchTerm, statusFilter, sortBy]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    setCancellingId(orderId);
    try {
      await cancelOrder(orderId);
      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: 'cancelled' } : o
        )
      );
      setShowCancelModal(false);
      setCancelOrderId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const openCancelModal = (orderId) => {
    setCancelOrderId(orderId);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelOrderId(null);
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
      case 'delivered':
        return 'badge-delivered';
      case 'shipped':
        return 'badge-shipped';
      case 'processing':
        return 'badge-processing';
      case 'confirmed':
        return 'badge-confirmed';
      case 'pending':
        return 'badge-pending';
      case 'cancelled':
        return 'badge-cancelled';
      default:
        return 'badge-default';
    }
  };

  const canCancel = (status) => {
    return ['pending', 'confirmed', 'processing'].includes(status);
  };

  // Stats
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.orderStatus === 'pending').length;
    const processing = orders.filter((o) => o.orderStatus === 'processing').length;
    const shipped = orders.filter((o) => o.orderStatus === 'shipped').length;
    const delivered = orders.filter((o) => o.orderStatus === 'delivered').length;
    const cancelled = orders.filter((o) => o.orderStatus === 'cancelled').length;
    return { total, pending, processing, shipped, delivered, cancelled };
  }, [orders]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
        <button onClick={fetchOrders} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h2>📦 My Orders</h2>
        <button onClick={fetchOrders} className="refresh-btn" title="Refresh">
          🔄
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-icon">⏳</span>
          <div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card stat-processing">
          <span className="stat-icon">⚙️</span>
          <div>
            <div className="stat-value">{stats.processing}</div>
            <div className="stat-label">Processing</div>
          </div>
        </div>
        <div className="stat-card stat-shipped">
          <span className="stat-icon">🚚</span>
          <div>
            <div className="stat-value">{stats.shipped}</div>
            <div className="stat-label">Shipped</div>
          </div>
        </div>
        <div className="stat-card stat-delivered">
          <span className="stat-icon">✅</span>
          <div>
            <div className="stat-value">{stats.delivered}</div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>
        <div className="stat-card stat-cancelled">
          <span className="stat-icon">❌</span>
          <div>
            <div className="stat-value">{stats.cancelled}</div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search by order # or ID..."
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
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
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

      <div className="results-info">
        <span>
          Showing {paginatedOrders.length} of {filteredOrders.length} order
          {filteredOrders.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Orders List */}
      {paginatedOrders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>No orders found</p>
          <span className="empty-sub">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Your orders will appear here once you place them'}
          </span>
          <Link to="/products" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {paginatedOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <span className="order-number">#{order.orderNumber || order._id?.slice(-6)}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                  <span className={`status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                    {order.orderStatus?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
                <div className="order-actions">
                  <span className="order-total">{formatCurrency(order.total)}</span>
                  {canCancel(order.orderStatus) && (
                    <button
                      className="btn-cancel"
                      onClick={() => openCancelModal(order._id)}
                      disabled={cancellingId === order._id}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    className="btn-expand"
                    onClick={() => toggleExpand(order._id)}
                  >
                    {expandedOrderId === order._id ? '▲' : '▼'}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrderId === order._id && (
                <div className="order-details-expanded">
                  <div className="order-items">
                    <h4>Items</h4>
                    {order.items?.map((item, idx) => (
                      <div className="order-item" key={idx}>
                        <img
                          src={item.image || 'https://via.placeholder.com/50x50?text=Product'}
                          alt={item.name}
                          className="order-item-image"
                        />
                        <div className="order-item-info">
                          <span className="order-item-name">{item.name}</span>
                          <span className="order-item-qty">Qty: {item.quantity}</span>
                        </div>
                        <span className="order-item-price">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary-details">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>{formatCurrency(order.subtotal || order.total)}</span>
                    </div>
                    {order.tax && (
                      <div className="summary-row">
                        <span>Tax</span>
                        <span>{formatCurrency(order.tax)}</span>
                      </div>
                    )}
                    {order.shipping && (
                      <div className="summary-row">
                        <span>Shipping</span>
                        <span>{formatCurrency(order.shipping)}</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                    {order.paymentMethod && (
                      <div className="summary-row">
                        <span>Payment</span>
                        <span>{order.paymentMethod}</span>
                      </div>
                    )}
                    {order.shippingAddress && (
                      <div className="summary-row address">
                        <span>📍 Shipping</span>
                        <span>
                          {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                          {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
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

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={closeCancelModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Cancel Order</h3>
            <p>Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="modal-btn modal-cancel" onClick={closeCancelModal}>
                No, Go Back
              </button>
              <button
                className="modal-btn modal-confirm-cancel"
                onClick={() => handleCancelOrder(cancelOrderId)}
                disabled={cancellingId === cancelOrderId}
              >
                {cancellingId === cancelOrderId ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;