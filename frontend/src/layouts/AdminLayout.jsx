import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout = () => {
	return (
		<div className="admin-layout" style={{ display: 'flex', minHeight: '100vh' }}>
			<aside style={{ width: 240, padding: 20, background: '#f6f6f6' }}>
				<h3>Admin</h3>
				<nav>
					<ul style={{ listStyle: 'none', padding: 0 }}>
						<li>
							<NavLink to="/admin" end>Dashboard</NavLink>
						</li>
						<li>
							<NavLink to="/admin/users">Users</NavLink>
						</li>
						<li>
							<NavLink to="/admin/products">Products</NavLink>
						</li>
						<li>
							<NavLink to="/admin/orders">Orders</NavLink>
						</li>
					</ul>
				</nav>
			</aside>
			<main style={{ flex: 1, padding: 24 }}>
				<Outlet />
			</main>
		</div>
	);
};

export default AdminLayout;
