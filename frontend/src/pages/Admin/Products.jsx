import React, { useEffect, useState } from 'react';
import { getAdminProducts, approveProduct, rejectProduct } from '../../services/adminServices';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getAdminProducts();
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveProduct(id);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Reason for rejection (optional)');
    try {
      await rejectProduct(id, reason);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <div>
        {products.map(p => (
          <div key={p._id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
            <h4>{p.name}</h4>
            <p>Price: ₹{p.price}</p>
            <p>Verified: {p.isVerified ? 'Yes' : 'No'}</p>
            <button onClick={() => handleApprove(p._id)}>Approve</button>
            <button onClick={() => handleReject(p._id)}>Reject</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
