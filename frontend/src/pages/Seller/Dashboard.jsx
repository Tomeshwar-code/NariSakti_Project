import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../services/orderServices';
import { getProducts } from '../../services/productServices';

const SellerDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalSales: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([getOrders(), getProducts()]);
        const orders = ordersRes.data.orders || [];
        const products = productsRes.data.products || [];
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const sellerId = user?._id || user?.id;

        const sellerOrders = orders.filter((order) => (order.items || []).some((item) => String(item.seller) === String(sellerId)));
        const myProducts = products.filter((product) => String(product.seller) === String(sellerId) || String(product.seller?._id) === String(sellerId));
        const totalSales = sellerOrders.reduce((sum, order) => {
          const sellerItems = (order.items || []).filter((item) => String(item.seller) === String(sellerId));
          return sum + sellerItems.reduce((itemSum, item) => itemSum + (item.price || 0) * (item.quantity || 1), 0);
        }, 0);

        setStats({ totalOrders: sellerOrders.length, totalSales, products: myProducts.length });
        setRecentOrders(sellerOrders.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: '#6d3b00' }}>Seller Dashboard</h2>
          <p style={{ margin: '4px 0 0', color: '#8a5b24' }}>Track your products, sales, and incoming orders.</p>
        </div>
        <Link to="/seller/add-product" style={{ textDecoration: 'none', padding: '10px 14px', borderRadius: 10, background: '#ff8c42', color: '#fff', fontWeight: 700 }}>
          + Add Product
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ color: '#8a5b24', fontSize: 13 }}>Products</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#2f2f2f' }}>{stats.products}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ color: '#8a5b24', fontSize: 13 }}>Orders</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#2f2f2f' }}>{stats.totalOrders}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ color: '#8a5b24', fontSize: 13 }}>Sales</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#2f2f2f' }}>₹{stats.totalSales}</div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Recent Orders</h3>
          <Link to="/seller/orders" style={{ color: '#ff8c42', fontWeight: 700, textDecoration: 'none' }}>View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p style={{ color: '#7a7a7a' }}>No orders yet for your products.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {recentOrders.map((order) => (
              <div key={order._id} style={{ border: '1px solid #f0e0c2', borderRadius: 12, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{order.orderNumber}</strong>
                  <span style={{ color: '#ff8c42', fontWeight: 700 }}>₹{order.total || 0}</span>
                </div>
                <div style={{ color: '#6f6f6f', fontSize: 13, marginTop: 4 }}>Status: {order.orderStatus}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
