// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { getOrders } from '../../services/orderServices';
// import { getProducts } from '../../services/productServices';

// const SellerDashboard = () => {
//   const [stats, setStats] = useState({ totalOrders: 0, totalSales: 0, products: 0 });
//   const [recentOrders, setRecentOrders] = useState([]);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [ordersRes, productsRes] = await Promise.all([getOrders(), getProducts()]);
//         const orders = ordersRes.data.orders || [];
//         const products = productsRes.data.products || [];
//         const user = JSON.parse(localStorage.getItem('user') || 'null');
//         const sellerId = user?._id || user?.id;

//         const sellerOrders = orders.filter((order) => (order.items || []).some((item) => String(item.seller) === String(sellerId)));
//         const myProducts = products.filter((product) => String(product.seller) === String(sellerId) || String(product.seller?._id) === String(sellerId));
//         const totalSales = sellerOrders.reduce((sum, order) => {
//           const sellerItems = (order.items || []).filter((item) => String(item.seller) === String(sellerId));
//           return sum + sellerItems.reduce((itemSum, item) => itemSum + (item.price || 0) * (item.quantity || 1), 0);
//         }, 0);

//         setStats({ totalOrders: sellerOrders.length, totalSales, products: myProducts.length });
//         setRecentOrders(sellerOrders.slice(0, 4));
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     load();
//   }, []);

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//         <div>
//           <h2 style={{ margin: 0, color: '#6d3b00' }}>Seller Dashboard</h2>
//           <p style={{ margin: '4px 0 0', color: '#8a5b24' }}>Track your products, sales, and incoming orders.</p>
//         </div>
//         <Link to="/seller/add-product" style={{ textDecoration: 'none', padding: '10px 14px', borderRadius: 10, background: '#ff8c42', color: '#fff', fontWeight: 700 }}>
//           + Add Product
//         </Link>
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
//         <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
//           <div style={{ color: '#8a5b24', fontSize: 13 }}>Products</div>
//           <div style={{ fontSize: 28, fontWeight: 800, color: '#2f2f2f' }}>{stats.products}</div>
//         </div>
//         <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
//           <div style={{ color: '#8a5b24', fontSize: 13 }}>Orders</div>
//           <div style={{ fontSize: 28, fontWeight: 800, color: '#2f2f2f' }}>{stats.totalOrders}</div>
//         </div>
//         <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
//           <div style={{ color: '#8a5b24', fontSize: 13 }}>Sales</div>
//           <div style={{ fontSize: 28, fontWeight: 800, color: '#2f2f2f' }}>₹{stats.totalSales}</div>
//         </div>
//       </div>

//       <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
//           <h3 style={{ margin: 0 }}>Recent Orders</h3>
//           <Link to="/seller/orders" style={{ color: '#ff8c42', fontWeight: 700, textDecoration: 'none' }}>View all</Link>
//         </div>
//         {recentOrders.length === 0 ? (
//           <p style={{ color: '#7a7a7a' }}>No orders yet for your products.</p>
//         ) : (
//           <div style={{ display: 'grid', gap: 10 }}>
//             {recentOrders.map((order) => (
//               <div key={order._id} style={{ border: '1px solid #f0e0c2', borderRadius: 12, padding: 12 }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <strong>{order.orderNumber}</strong>
//                   <span style={{ color: '#ff8c42', fontWeight: 700 }}>₹{order.total || 0}</span>
//                 </div>
//                 <div style={{ color: '#6f6f6f', fontSize: 13, marginTop: 4 }}>Status: {order.orderStatus}</div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerDashboard;
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../services/orderServices';
import { getProducts } from '../../services/productServices';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    products: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, productsRes] = await Promise.all([getOrders(), getProducts()]);
      const orders = ordersRes.data.orders || [];
      const products = productsRes.data.products || [];

      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const sellerId = user?._id || user?.id;

      // Filter seller's orders and products
      const sellerOrders = orders.filter((order) =>
        (order.items || []).some((item) => String(item.seller) === String(sellerId))
      );
      const myProducts = products.filter(
        (product) =>
          String(product.seller) === String(sellerId) ||
          String(product.seller?._id) === String(sellerId)
      );

      // Calculate total sales
      const totalSales = sellerOrders.reduce((sum, order) => {
        const sellerItems = (order.items || []).filter(
          (item) => String(item.seller) === String(sellerId)
        );
        return (
          sum +
          sellerItems.reduce(
            (itemSum, item) => itemSum + (item.price || 0) * (item.quantity || 1),
            0
          )
        );
      }, 0);

      // Pending orders (status 'pending' or 'processing')
      const pendingOrders = sellerOrders.filter(
        (order) => order.orderStatus === 'pending' || order.orderStatus === 'processing'
      ).length;

      setStats({
        totalOrders: sellerOrders.length,
        totalSales,
        products: myProducts.length,
        pendingOrders,
      });

      setRecentOrders(sellerOrders.slice(0, 5));

      // Monthly sales breakdown (last 6 months)
      const now = new Date();
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
          month: d.toLocaleString('en-IN', { month: 'short' }),
          year: d.getFullYear(),
          total: 0,
        });
      }
      sellerOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const monthKey = orderDate.toLocaleString('en-IN', { month: 'short' });
        const yearKey = orderDate.getFullYear();
        const found = months.find(
          (m) => m.month === monthKey && m.year === yearKey
        );
        if (found) {
          // Add only seller's items total
          const sellerItems = (order.items || []).filter(
            (item) => String(item.seller) === String(sellerId)
          );
          const orderTotal = sellerItems.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
            0
          );
          found.total += orderTotal;
        }
      });
      setMonthlyData(months);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  // Helper: format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="seller-dashboard-container">
        <div className="dashboard-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-stats">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
          <div className="skeleton-orders"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="seller-dashboard-container">
        <div className="dashboard-error">
          <span>⚠️</span>
          <p>{error}</p>
          <button onClick={fetchData} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-dashboard-container">
      {/* Header with Add Product button */}
      <div className="dashboard-header">
        <div>
          <h2>📊 Seller Dashboard</h2>
          <p>Track your products, sales, and orders at a glance.</p>
        </div>
        <Link to="/seller/add-product" className="add-product-btn">
          ➕ Add Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div>
            <div className="stat-label">Total Products</div>
            <div className="stat-number">{stats.products}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div>
            <div className="stat-label">Total Orders</div>
            <div className="stat-number">{stats.totalOrders}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div>
            <div className="stat-label">Total Revenue</div>
            <div className="stat-number">{formatCurrency(stats.totalSales)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div>
            <div className="stat-label">Pending Orders</div>
            <div className="stat-number">{stats.pendingOrders}</div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart (simple bars) */}
      {monthlyData.length > 0 && (
        <div className="chart-card">
          <h4>📈 Monthly Revenue (Last 6 Months)</h4>
          <div className="chart-bars">
            {monthlyData.map((item, index) => (
              <div className="chart-bar-wrapper" key={index}>
                <div
                  className="chart-bar"
                  style={{
                    height: `${Math.min(
                      (item.total / (Math.max(...monthlyData.map((d) => d.total)) || 1)) * 100,
                      100
                    )}%`,
                  }}
                ></div>
                <span className="chart-label">{item.month}</span>
                <span className="chart-value">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/seller/products" className="action-link">📋 Manage Products</Link>
        <Link to="/seller/orders" className="action-link">📦 View All Orders</Link>
        <Link to="/profile" className="action-link">👤 Profile</Link>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders-card">
        <div className="card-header">
          <h4>🕐 Recent Orders</h4>
          <Link to="/seller/orders" className="view-all">View All →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="empty-message">No orders yet for your products.</p>
        ) : (
          <div className="orders-list">
            {recentOrders.map((order) => {
              // Get customer name (if available)
              const customerName = order.user?.name || order.user?.email || 'Customer';
              // Get total for seller items only (for display)
              const sellerItems = (order.items || []).filter(
                (item) => String(item.seller) === String(JSON.parse(localStorage.getItem('user') || 'null')?._id)
              );
              const orderTotal = sellerItems.reduce(
                (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
                0
              );
              const statusColor =
                order.orderStatus === 'delivered'
                  ? '#10B981'
                  : order.orderStatus === 'pending' || order.orderStatus === 'processing'
                  ? '#F59E0B'
                  : '#3B82F6';
              return (
                <div className="order-item" key={order._id}>
                  <div className="order-info">
                    <span className="order-id">#{order.orderNumber || order._id.slice(-6)}</span>
                    <span className="order-customer">{customerName}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <div className="order-meta">
                    <span className="order-status" style={{ backgroundColor: statusColor }}>
                      {order.orderStatus || 'Unknown'}
                    </span>
                    <span className="order-total">{formatCurrency(orderTotal)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;