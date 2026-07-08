import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

function SellerLayout() {
  return (
    <div className="seller-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, padding: 20, background: '#fff7e8', borderRight: '1px solid #ddd' }}>
        <h3>Seller Menu</h3>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <NavLink to="/seller/dashboard">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/seller/products">My Products</NavLink>
            </li>
            <li>
              <NavLink to="/seller/add-product">Add Product</NavLink>
            </li>
            <li>
              <NavLink to="/seller/orders">Orders</NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default SellerLayout;
