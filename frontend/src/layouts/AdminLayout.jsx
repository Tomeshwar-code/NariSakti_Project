import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
          <p>Manage platform operations</p>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink to="/admin" end className={({ isActive }) => isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'}>
                Users
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'}>
                Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'}>
                Orders
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="dashboard-panel">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
