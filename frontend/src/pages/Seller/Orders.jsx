import React, { useEffect, useState } from 'react';
import { getOrders } from '../../services/orderServices';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOrders();
        const all = res.data.orders || [];
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const sellerId = user?._id || user?.id;
        const sellerOrders = all.filter((order) => (order.items || []).some((item) => String(item.seller) === String(sellerId)));
        setOrders(sellerOrders);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2 style={{ marginTop: 0, color: '#6d3b00' }}>Seller Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found for your products.</p>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {orders.map((order) => {
            const sellerItems = (order.items || []).filter((item) => String(item.seller) === String(JSON.parse(localStorage.getItem('user') || 'null')?._id || JSON.parse(localStorage.getItem('user') || 'null')?.id));
            return (
              <div key={order._id} style={{ background: '#fff', border: '1px solid #f0e0c2', borderRadius: 16, padding: 16, boxShadow: '0 6px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{order.orderNumber}</div>
                    <div style={{ color: '#7a7a7a', fontSize: 13, marginTop: 4 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span style={{ padding: '6px 10px', borderRadius: 999, background: '#fff3de', color: '#a56f00', fontWeight: 700 }}>{order.orderStatus}</span>
                </div>
                <div style={{ marginTop: 10, color: '#444' }}>
                  {sellerItems.map((item) => (
                    <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #f7efde' }}>
                      <span>{item.product}</span>
                      <span>Qty {item.quantity} • ₹{item.price}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 8, fontWeight: 700, color: '#ff8c42' }}>Total: ₹{order.total || 0}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
