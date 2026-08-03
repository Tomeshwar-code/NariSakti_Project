import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProduct, getProducts } from '../../services/productServices';

function MyProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      const items = res.data.products || [];
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const sellerId = user?._id || user?.id;
      setProducts(items.filter((product) => String(product.seller) === String(sellerId) || String(product.seller?._id) === String(sellerId)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Unable to delete product');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, color: '#6d3b00' }}>My Products</h2>
          <p style={{ margin: '4px 0 0', color: '#8a5b24' }}>Keep your catalog updated and visible.</p>
        </div>
        <Link to="/seller/add-product" style={{ textDecoration: 'none', padding: '10px 14px', borderRadius: 10, background: '#ff8c42', color: '#fff', fontWeight: 700 }}>
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found for your seller account.</p>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {products.map((product) => (
            <div key={product._id} style={{ background: '#fff', border: '1px solid #f0e0c2', borderRadius: 16, padding: 16, boxShadow: '0 6px 16px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <h3 style={{ margin: '0 0 6px', color: '#333' }}>{product.name}</h3>
                  <p style={{ margin: 0, color: '#6b6b6b' }}>{product.description?.slice(0, 100) || 'No description added yet.'}</p>
                </div>
                <span style={{ padding: '6px 10px', borderRadius: 999, background: product.isVerified ? '#e7f8eb' : '#fff3de', color: product.isVerified ? '#1d7a3b' : '#a56f00', fontWeight: 700, height: 'fit-content' }}>
                  {product.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 12, color: '#555', fontSize: 14 }}>
                <span>Price: ₹{product.price}</span>
                <span>Stock: {product.stock}</span>
                <span>Category: {product.category?.name || product.category || 'General'}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <Link to={`/seller/products/edit/${product._id}`} style={{ textDecoration: 'none', padding: '8px 12px', borderRadius: 8, background: '#f8efe0', color: '#7a4b00', fontWeight: 700 }}>Edit</Link>
                <button onClick={() => handleDelete(product._id)} style={{ border: 'none', cursor: 'pointer', padding: '8px 12px', borderRadius: 8, background: '#ff6b6b', color: '#fff', fontWeight: 700 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProduct
