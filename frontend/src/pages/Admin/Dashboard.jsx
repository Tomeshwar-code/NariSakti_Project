// import { useEffect, useState } from 'react';
// import { getAdminDashboard } from '../../services/adminServices';

// const Dashboard = () => {
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await getAdminDashboard();
//         setStats(res.data.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     load();
//   }, []);

//   if (!stats) return <div>Loading dashboard...</div>;

//   return (
//     <div>
//       <h2>Admin Dashboard</h2>
//       <ul>
//         <li>Total users: {stats.totalUsers}</li>
//         <li>Total products: {stats.totalProducts}</li>
//         <li>Total orders: {stats.totalOrders}</li>
//         <li>Total sales: ₹{stats.totalSales}</li>
//       </ul>
//     </div>
//   );
// };

// export default Dashboard;
import { useEffect, useState } from 'react';
import { getAdminDashboard } from '../../services/adminServices';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getAdminDashboard();
        setStats(res.data.data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card skeleton">
              <div className="skeleton-line w-30" />
              <div className="skeleton-line w-60" />
              <div className="skeleton-line w-40" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      </div>
    );
  }

  // Fallback if stats is still null (shouldn't happen after loading)
  if (!stats) return null;

  const statItems = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#4f46e5' },
    { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: '#0891b2' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '🛒', color: '#059669' },
    { label: 'Total Sales', value: `₹${(stats.totalSales || 0).toLocaleString('en-IN')}`, icon: '💰', color: '#d97706' },
  ];

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <div className="stats-grid">
        {statItems.map((item, idx) => (
          <div key={idx} className="stat-card" style={{ borderTopColor: item.color }}>
            <div className="stat-card-header">
              <span className="stat-icon" style={{ background: item.color + '20', color: item.color }}>
                {item.icon}
              </span>
              <span className="stat-label">{item.label}</span>
            </div>
            <p className="stat-value">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;