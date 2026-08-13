// import { useEffect, useState } from 'react';
// import { getAdminOrders } from '../../services/adminServices';

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const res = await getAdminOrders();
//       setOrders(res.data.orders || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h2>Orders</h2>
//       {orders.map(o => (
//         <div key={o._id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
//           <div>Order: {o.orderNumber}</div>
//           <div>User: {o.user?.firstName} {o.user?.lastName} ({o.user?.email})</div>
//           <div>Total: ₹{o.total}</div>
//           <div>Status: {o.orderStatus}</div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AdminOrders;
// AdminOrders.jsx
import { useEffect, useState, useMemo } from 'react';
import { getAdminOrders, updateOrderStatus } from '../../services/adminServices';
import './Orders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Status options for filter and update
  const statusOptions = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ];

  // Status color mapping
  const statusColors = {
    pending: 'warning',
    confirmed: 'info',
    processing: 'primary',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
    refunded: 'secondary',
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter and sort orders whenever dependencies change
  useEffect(() => {
    let result = [...orders];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(term) ||
          o.user?.firstName?.toLowerCase().includes(term) ||
          o.user?.lastName?.toLowerCase().includes(term) ||
          o.user?.email?.toLowerCase().includes(term) ||
          o._id?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((o) => o.orderStatus === statusFilter);
    }

    // Sorting
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
    setCurrentPage(1); // Reset to first page on filter change
  }, [orders, searchTerm, statusFilter, sortBy]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: newStatus } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdatingOrderId(null);
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

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadgeClass = (status) => {
    return `status-badge status-${statusColors[status] || 'secondary'}`;
  };

  // Summary stats
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.orderStatus === 'pending').length;
    const delivered = orders.filter((o) => o.orderStatus === 'delivered').length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    return { total, pending, delivered, totalRevenue };
  }, [orders]);

  if (loading) {
    return (
      <div className="admin-orders-loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders-error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
        <button onClick={fetchOrders} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      <div className="admin-orders-header">
        <h2>📦 Orders Management</h2>
        <button onClick={fetchOrders} className="refresh-btn" title="Refresh orders">
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
        <div className="stat-card stat-delivered">
          <span className="stat-icon">✅</span>
          <div>
            <div className="stat-value">{stats.delivered}</div>
            <div className="stat-label">Delivered</div>
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
            placeholder="🔍 Search by order #, name, or email..."
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
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
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

      {/* Results count */}
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
              : 'Orders will appear here once customers place them'}
          </span>
        </div>
      ) : (
        <div className="orders-list">
          {paginatedOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div className="order-id-section">
                  <span className="order-number">#{order.orderNumber || order._id?.slice(-6)}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <div className="order-status-section">
                  <select
                    value={order.orderStatus || 'pending'}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    disabled={updatingOrderId === order._id}
                    className={`status-select ${getStatusBadgeClass(order.orderStatus)}`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  {updatingOrderId === order._id && (
                    <span className="updating-spinner">⏳</span>
                  )}
                </div>
              </div>

              <div className="order-card-body">
                <div className="order-customer">
                  <span className="customer-name">
                    {order.user?.firstName} {order.user?.lastName}
                  </span>
                  <span className="customer-email">{order.user?.email}</span>
                  {order.user?.phone && (
                    <span className="customer-phone">📞 {order.user.phone}</span>
                  )}
                </div>

                <div className="order-details">
                  <div className="order-items-count">
                    {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                  </div>
                  <div className="order-total">{formatCurrency(order.total)}</div>
                </div>

                {order.shippingAddress && (
                  <div className="order-address">
                    <span className="address-label">📍</span>
                    <span>
                      {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </span>
                  </div>
                )}

                {order.paymentMethod && (
                  <div className="order-payment">
                    💳 {order.paymentMethod}
                    {order.paymentStatus && (
                      <span className={`payment-status payment-${order.paymentStatus}`}>
                        {order.paymentStatus}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="order-card-footer">
                <button
                  className="view-details-btn"
                  onClick={() => window.location.href = `/admin/orders/${order._id}`}
                >
                  View Details →
                </button>
              </div>
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
    </div>
  );
};

export default AdminOrders;