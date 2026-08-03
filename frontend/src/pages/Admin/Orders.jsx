import { useEffect, useState } from 'react';
import { getAdminOrders } from '../../services/adminServices';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAdminOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Orders</h2>
      {orders.map(o => (
        <div key={o._id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
          <div>Order: {o.orderNumber}</div>
          <div>User: {o.user?.firstName} {o.user?.lastName} ({o.user?.email})</div>
          <div>Total: ₹{o.total}</div>
          <div>Status: {o.orderStatus}</div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
