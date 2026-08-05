import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, updateProduct } from '../../services/productServices';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await getProduct(id);
        const product = res.data.product;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          stock: product.stock || '',
          category: product.category?.name || product.category || ''
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProduct(id, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });
      navigate('/seller/products');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Unable to update product');
    }
  };

  if (loading) {
    return <p>Loading product...</p>;
  }

  return (
    <div>
      <h2 style={{ marginTop: 0, color: '#6d3b00' }}>Edit Product</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 560, background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
        <input style={inputStyle} name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} />
        <textarea style={{ ...inputStyle, minHeight: 100 }} name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <input style={inputStyle} name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />
          <input style={inputStyle} name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} />
        </div>
        <input style={inputStyle} name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
        <button type="submit" style={{ border: 'none', cursor: 'pointer', padding: '12px 14px', borderRadius: 10, background: '#ff8c42', color: '#fff', fontWeight: 700 }}>Save Product</button>
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

export default EditProduct
