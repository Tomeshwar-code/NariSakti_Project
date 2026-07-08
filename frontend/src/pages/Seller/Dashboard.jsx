import React, { useEffect, useState } from 'react';
import { getOrders } from '../../services/orderServices';
import { getProducts } from '../../services/productServices';

const SellerDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalSales: 0, products: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOrders();
        const orders = res.data.orders || [];
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const sellerId = user?._id;
        const sellerOrders = orders.filter(o => o.items.some(i => i.seller === sellerId));
        const totalOrders = sellerOrders.length;
        const totalSales = sellerOrders.reduce((s, o) => s + (o.total || 0), 0);
        // simple product count - might be improved by API
        const productsRes = await getProducts();
        const myProducts = (productsRes.data.products || []).filter(p => p.seller === sellerId);

        setStats({ totalOrders, totalSales, products: myProducts.length });
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2>Seller Dashboard</h2>
      <ul>
        <li>Total products: {stats.products}</li>
        <li>Total orders for your products: {stats.totalOrders}</li>
        <li>Total sales: ₹{stats.totalSales}</li>
      </ul>
    </div>
  );
};

export default SellerDashboard;
