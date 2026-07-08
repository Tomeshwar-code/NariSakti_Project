import React, { useEffect, useState } from 'react';
import { getOrders } from '../../services/orderServices';

const SellerOrders = () => {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const load = async () => {
			try {
				const res = await getOrders();
				const all = res.data.orders || [];
				const user = JSON.parse(localStorage.getItem('user') || 'null');
				const sellerId = user?._id;
				const sellerOrders = all.filter(o => o.items.some(i => i.seller === sellerId));
				setOrders(sellerOrders);
			} catch (err) {
				console.error(err);
			}
		};
		load();
	}, []);

	return (
		<div>
			<h2>Seller Orders</h2>
			{orders.length === 0 ? <p>No orders found for your products.</p> : (
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

export default SellerOrders;
