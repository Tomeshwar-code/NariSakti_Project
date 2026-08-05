import { useEffect, useState } from 'react';
import { getOrders } from '../../services/orderServices';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length === 0 ? <p>No orders yet.</p> : (
        orders.map(o => (
          <div key={o._id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
            <div>Order: {o.orderNumber}</div>
            <div>Total: ₹{o.total}</div>
            <div>Status: {o.orderStatus}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
