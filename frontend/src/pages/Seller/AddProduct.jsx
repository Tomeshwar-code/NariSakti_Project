// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { createProduct } from '../../services/productServices';

// function AddProduct() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     stock: '',
//     category: '',
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setMessage('');

//     try {
//       const user = JSON.parse(localStorage.getItem('user') || 'null');
//       const payload = {
//         ...formData,
//         price: Number(formData.price),
//         stock: Number(formData.stock),
//         seller: user?._id || user?.id || '',
//         category: formData.category || '000000000000000000000000',
//       };

//       await createProduct(payload);
//       setMessage('Product added successfully.');
//       navigate('/seller/products');
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Unable to add product');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 680 }}>
//       <h2 style={{ marginTop: 0, color: '#6d3b00' }}>Add New Product</h2>
//       <p style={{ color: '#8a5b24', marginTop: -6 }}>Add your next item and make it available to customers.</p>
//       <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
//         <input style={inputStyle} type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
//         <textarea style={{ ...inputStyle, minHeight: 100 }} name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
//           <input style={inputStyle} type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
//           <input style={inputStyle} type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
//         </div>
//         <input style={inputStyle} type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
//         <button type="submit" disabled={submitting} style={{ border: 'none', cursor: 'pointer', padding: '12px 14px', borderRadius: 10, background: '#ff8c42', color: '#fff', fontWeight: 700 }}>
//           {submitting ? 'Saving...' : 'Add Product'}
//         </button>
//         {message ? <div style={{ color: message.includes('success') ? '#1d7a3b' : '#c0392b', fontWeight: 600 }}>{message}</div> : null}
//       </form>
//     </div>
//   );
// }

// const inputStyle = {
//   border: '1px solid #e8d5b0',
//   borderRadius: 10,
//   padding: '10px 12px',
//   fontSize: 14,
//   outline: 'none',
// };

// export default AddProduct;
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../services/productServices';
import './AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [images, setImages] = useState([]); // Array of { file, preview }
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [touched, setTouched] = useState({});
  const fileInputRef = useRef(null);

  // Auto-dismiss status after 4s
  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => setStatus({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    if (status.message) setStatus({ type: '', message: '' });
  };

  // Price formatter (real-time)
  const formatPrice = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  const handlePriceBlur = () => {
    if (formData.price) {
      const num = parseFloat(formData.price);
      if (!isNaN(num)) {
        setFormData(prev => ({ ...prev, price: num.toString() }));
      }
    }
  };

  // Image handling
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setStatus({ type: 'error', message: 'Maximum 5 images allowed.' });
      return;
    }
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Validation
  const isFormValid = () => {
    const { name, description, price, stock, category } = formData;
    return (
      name.trim().length >= 3 &&
      description.trim().length >= 10 &&
      price > 0 &&
      stock > 0 &&
      category.trim().length > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, description: true, price: true, stock: true, category: true });

    if (!isFormValid()) {
      setStatus({ type: 'error', message: 'Please fill all required fields correctly.' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // Prepare payload
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        seller: user?._id || user?.id || '',
        // Note: image upload to be done separately via FormData if API expects files
      };

      // If your API expects multipart/form-data with files:
      const formDataPayload = new FormData();
      Object.keys(payload).forEach(key => formDataPayload.append(key, payload[key]));
      images.forEach(img => formDataPayload.append('images', img.file));

      // If your API doesn't support file upload via FormData, use JSON:
      // await createProduct(payload);
      // Otherwise, use the FormData version (uncomment accordingly):
      await createProduct(formDataPayload); // adjust service accordingly

      setStatus({ type: 'success', message: '✅ Product added successfully!' });
      // Reset form
      setFormData({ name: '', description: '', price: '', stock: '', category: '' });
      setImages([]);
      setTouched({});
      // Navigate after short delay
      setTimeout(() => navigate('/seller/products'), 2000);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Unable to add product',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Categories (static for now – you can fetch from API)
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Beauty', 'Sports', 'Toys', 'Other'];

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <div className="card-header">
          <h2>➕ Add New Product</h2>
          <p>List your product and start selling</p>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {/* Product Name */}
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter product name (min 3 chars)"
              value={formData.name}
              onChange={handleChange}
              className={touched.name && formData.name.trim().length < 3 ? 'error' : ''}
              required
            />
            {touched.name && formData.name.trim().length < 3 && (
              <span className="hint error-hint">Name must be at least 3 characters</span>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your product (min 10 chars)"
              value={formData.description}
              onChange={handleChange}
              className={touched.description && formData.description.trim().length < 10 ? 'error' : ''}
              maxLength="500"
              required
            />
            <div className="char-counter">
              <span className={formData.description.length > 450 ? 'warning' : ''}>
                {formData.description.length}/500
              </span>
            </div>
            {touched.description && formData.description.trim().length < 10 && (
              <span className="hint error-hint">Description must be at least 10 characters</span>
            )}
          </div>

          {/* Price & Stock */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input
                id="price"
                name="price"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                onBlur={handlePriceBlur}
                className={touched.price && formData.price <= 0 ? 'error' : ''}
                required
                min="1"
                step="1"
              />
              {touched.price && formData.price <= 0 && (
                <span className="hint error-hint">Price must be greater than 0</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock Quantity *</label>
              <input
                id="stock"
                name="stock"
                type="number"
                placeholder="10"
                value={formData.stock}
                onChange={handleChange}
                className={touched.stock && formData.stock <= 0 ? 'error' : ''}
                required
                min="1"
                step="1"
              />
              {touched.stock && formData.stock <= 0 && (
                <span className="hint error-hint">Stock must be at least 1</span>
              )}
              {formData.stock > 0 && formData.stock < 10 && (
                <span className="hint warning-hint">⚠️ Low stock – consider adding more</span>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={touched.category && !formData.category ? 'error' : ''}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {touched.category && !formData.category && (
              <span className="hint error-hint">Please select a category</span>
            )}
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Product Images</label>
            <div className="image-upload-area">
              <button
                type="button"
                className="upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                📷 Upload Images
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <span className="upload-hint">Max 5 images (JPG, PNG)</span>
            </div>
            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((img, index) => (
                  <div key={index} className="preview-item">
                    <img src={img.preview} alt={`Product ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-img"
                      onClick={() => removeImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Message */}
          {status.message && (
            <div className={`status-message ${status.type}`}>
              {status.message}
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="reset-btn"
              onClick={() => {
                setFormData({ name: '', description: '', price: '', stock: '', category: '' });
                setImages([]);
                setTouched({});
                setStatus({ type: '', message: '' });
              }}
            >
              ↺ Reset
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={submitting || !isFormValid()}
            >
              {submitting ? (
                <>
                  <span className="spinner-mini"></span> Saving...
                </>
              ) : (
                '💾 Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;