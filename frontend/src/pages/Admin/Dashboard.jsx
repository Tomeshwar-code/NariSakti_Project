import { useEffect, useState } from 'react';
import { getAdminDashboard } from '../../services/adminServices';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminDashboard();
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  if (!stats) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        <li>Total users: {stats.totalUsers}</li>
        <li>Total products: {stats.totalProducts}</li>
        <li>Total orders: {stats.totalOrders}</li>
        <li>Total sales: ₹{stats.totalSales}</li>
      </ul>
    </div>
  );
};

export default Dashboard;
