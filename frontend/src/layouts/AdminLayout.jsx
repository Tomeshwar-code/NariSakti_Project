// import { Outlet, NavLink } from 'react-router-dom';

// const AdminLayout = () => {
//   return (
//     <div className="dashboard-shell">
//       <aside className="dashboard-sidebar">
//         <div className="sidebar-header">
//           <h3>Admin Panel</h3>
//           <p>Manage platform operations</p>
//         </div>
//         <nav>
//           <ul>
//             <li>
//               <NavLink to="/admin" end className={({ isActive }) => isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'}>
//                 Dashboard
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'}>
//                 Users
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'}>
//                 Products
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'}>
//                 Orders
//               </NavLink>
//             </li>
//           </ul>
//         </nav>
//       </aside>
//       <main className="dashboard-panel">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;
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
            {/* Dashboard */}
            <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'
                }
              >
                📊 Dashboard
              </NavLink>
            </li>

            {/* Users */}
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'
                }
              >
                👥 Users
              </NavLink>
            </li>

            {/* Products */}
            <li>
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'
                }
              >
                🛒 Products
              </NavLink>
            </li>

            {/* Orders */}
            <li>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'
                }
              >
                📦 Orders
              </NavLink>
            </li>

            {/* 🆕 Categories */}
            <li>
              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'
                }
              >
                📂 Categories
              </NavLink>
            </li>

            {/* 🆕 Coupons */}
            <li>
              <NavLink
                to="/admin/coupons"
                className={({ isActive }) =>
                  isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'
                }
              >
                🏷️ Coupons
              </NavLink>
            </li>

            {/* 🆕 Banners */}
            <li>
              <NavLink
                to="/admin/banners"
                className={({ isActive }) =>
                  isActive ? 'dashboard-menu-link active' : 'dashboard-menu-link'
                }
              >
                🖼️ Banners
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