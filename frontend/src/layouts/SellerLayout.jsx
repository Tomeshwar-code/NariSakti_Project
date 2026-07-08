import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

function SellerLayout() {
  return (
    <div className="seller-layout" style={{ display: 'flex', minHeight: '100vh', background: '#fffaf3' }}>
      <aside style={{ width: 250, padding: '24px 20px', background: 'linear-gradient(135deg, #fff4e5 0%, #ffe0b2 100%)', borderRight: '1px solid #f1d8aa' }}>
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ margin: 0, color: '#8a4b00' }}>Seller Panel</h3>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#8d5b27' }}>Manage your store in one place</p>
        </div>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 8 }}>
              <NavLink to="/seller/dashboard" style={({ isActive }) => ({ display: 'block', padding: '10px 12px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, color: isActive ? '#fff' : '#7a4b00', background: isActive ? '#ff8c42' : 'transparent' })}>Dashboard</NavLink>
            </li>
            <li style={{ marginBottom: 8 }}>
              <NavLink to="/seller/products" style={({ isActive }) => ({ display: 'block', padding: '10px 12px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, color: isActive ? '#fff' : '#7a4b00', background: isActive ? '#ff8c42' : 'transparent' })}>My Products</NavLink>
            </li>
            <li style={{ marginBottom: 8 }}>
              <NavLink to="/seller/add-product" style={({ isActive }) => ({ display: 'block', padding: '10px 12px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, color: isActive ? '#fff' : '#7a4b00', background: isActive ? '#ff8c42' : 'transparent' })}>Add Product</NavLink>
            </li>
            <li>
              <NavLink to="/seller/orders" style={({ isActive }) => ({ display: 'block', padding: '10px 12px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, color: isActive ? '#fff' : '#7a4b00', background: isActive ? '#ff8c42' : 'transparent' })}>Orders</NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 28 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default SellerLayout;
