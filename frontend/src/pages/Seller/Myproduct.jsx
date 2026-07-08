import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productServices';

function MyProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await getProducts();
        const items = res.data.products || [];
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const sellerId = user?._id;
        setProducts(items.filter(product => product.seller === sellerId || product.seller?._id === sellerId));
      } catch (err) {
        console.error(err);
      }
    };
    loadProducts();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Products</h2>
      {products.length === 0 ? (
        <p>No products found for your seller account.</p>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {products.map(product => (
            <div key={product._id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <p>Status: {product.isVerified ? 'Verified' : 'Pending'}</p>
              <Link to={`/seller/products/edit/${product._id}`}>Edit Product</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProduct