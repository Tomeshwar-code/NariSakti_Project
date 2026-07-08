import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../services/productServices';

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        seller: user?._id || user?.id || '',
        category: formData.category || '000000000000000000000000',
      };

      await createProduct(payload);
      setMessage('Product added successfully.');
      navigate('/seller/products');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to add product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ marginTop: 0, color: '#6d3b00' }}>Add New Product</h2>
      <p style={{ color: '#8a5b24', marginTop: -6 }}>Add your next item and make it available to customers.</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
        <input style={inputStyle} type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
        <textarea style={{ ...inputStyle, minHeight: 100 }} name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <input style={inputStyle} type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
          <input style={inputStyle} type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
        </div>
        <input style={inputStyle} type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
        <button type="submit" disabled={submitting} style={{ border: 'none', cursor: 'pointer', padding: '12px 14px', borderRadius: 10, background: '#ff8c42', color: '#fff', fontWeight: 700 }}>
          {submitting ? 'Saving...' : 'Add Product'}
        </button>
        {message ? <div style={{ color: message.includes('success') ? '#1d7a3b' : '#c0392b', fontWeight: 600 }}>{message}</div> : null}
      </form>
    </div>
  );
}

const inputStyle = {
  border: '1px solid #e8d5b0',
  borderRadius: 10,
  padding: '10px 12px',
  fontSize: 14,
  outline: 'none',
};

export default AddProduct;