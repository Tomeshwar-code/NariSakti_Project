import { Outlet, NavLink } from 'react-router-dom';

function SellerLayout() {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h3>Seller Panel</h3>
          <p>Manage your store in one place</p>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink to="/seller/dashboard" className={({ isActive }) => isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/seller/products" className={({ isActive }) => isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'}>
                My Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/seller/add-product" className={({ isActive }) => isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'}>
                Add Product
              </NavLink>
            </li>
            <li>
              <NavLink to="/seller/orders" className={({ isActive }) => isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'}>
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
}

export default SellerLayout;
