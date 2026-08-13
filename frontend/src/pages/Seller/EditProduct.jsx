// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getProduct, updateProduct } from '../../services/productServices';

// function EditProduct() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     stock: '',
//     category: ''
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadProduct = async () => {
//       try {
//         const res = await getProduct(id);
//         const product = res.data.product;
//         setFormData({
//           name: product.name || '',
//           description: product.description || '',
//           price: product.price || '',
//           stock: product.stock || '',
//           category: product.category?.name || product.category || ''
//         });
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       loadProduct();
//     }
//   }, [id]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await updateProduct(id, {
//         ...formData,
//         price: Number(formData.price),
//         stock: Number(formData.stock),
//       });
//       navigate('/seller/products');
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || 'Unable to update product');
//     }
//   };

//   if (loading) {
//     return <p>Loading product...</p>;
//   }

//   return (
//     <div>
//       <h2 style={{ marginTop: 0, color: '#6d3b00' }}>Edit Product</h2>
//       <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 560, background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
//         <input style={inputStyle} name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} />
//         <textarea style={{ ...inputStyle, minHeight: 100 }} name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
//           <input style={inputStyle} name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />
//           <input style={inputStyle} name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} />
//         </div>
//         <input style={inputStyle} name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
//         <button type="submit" style={{ border: 'none', cursor: 'pointer', padding: '12px 14px', borderRadius: 10, background: '#ff8c42', color: '#fff', fontWeight: 700 }}>Save Product</button>
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

// export default EditProduct
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useBlocker } from 'react-router-dom';
import { getProduct, updateProduct } from '../../services/productServices';
import './EditProduct.css';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]); // new File objects
  const [existingImages, setExistingImages] = useState([]); // URLs from server
  const [isDirty, setIsDirty] = useState(false);

  // Warn on unsaved changes when navigating away
  const blocker = useBlocker(isDirty);

  useEffect(() => {
    if (blocker.state === 'blocked' && isDirty) {
      const leave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (leave) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker, isDirty]);

  // Prevent accidental browser tab close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

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
        // If product has images array
        if (product.images && product.images.length) {
          setExistingImages(product.images.map(img => img.url || img));
        }
      } catch (err) {
        console.error(err);
        alert('Failed to load product details.');
        navigate('/seller/products');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id, navigate]);

  const validate = () => {
    const newErrors = {};
    const { name, description, price, stock, category } = formData;

    if (!name.trim()) newErrors.name = 'Product name is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (!price || isNaN(price) || Number(price) <= 0) newErrors.price = 'Enter a valid price greater than 0.';
    if (stock === '' || isNaN(stock) || Number(stock) < 0) newErrors.stock = 'Stock must be 0 or more.';
    if (!category.trim()) newErrors.category = 'Category is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    // clear error on that field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      setIsDirty(true);
    }
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Build FormData to handle images
      const formPayload = new FormData();
      formPayload.append('name', formData.name.trim());
      formPayload.append('description', formData.description.trim());
      formPayload.append('price', Number(formData.price));
      formPayload.append('stock', Number(formData.stock));
      formPayload.append('category', formData.category.trim());

      // Append remaining existing images (URLs) if needed; depends on API
      // Here we assume API expects an array of URLs for existing images
      existingImages.forEach((url) => {
        formPayload.append('existingImages[]', url);
      });

      // Append new image files
      imageFiles.forEach((file) => {
        formPayload.append('images', file);
      });

      await updateProduct(id, formPayload); // service must handle FormData
      setIsDirty(false);
      navigate('/seller/products');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Unable to update product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('Discard unsaved changes?')) {
        navigate('/seller/products');
      }
    } else {
      navigate('/seller/products');
    }
  };

  if (loading) {
    return <div className="loading-message">Loading product...</div>;
  }

  return (
    <div className="edit-product-container">
      <h2 className="edit-product-title">Edit Product</h2>
      <form className="edit-product-form" onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            id="name"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            name="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            name="description"
            placeholder="Describe the product"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        {/* Price & Stock */}
        <div className="two-columns">
          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              id="price"
              className={`form-input ${errors.price ? 'input-error' : ''}`}
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock *</label>
            <input
              id="stock"
              className={`form-input ${errors.stock ? 'input-error' : ''}`}
              name="stock"
              type="number"
              min="0"
              placeholder="0"
              value={formData.stock}
              onChange={handleChange}
            />
            {errors.stock && <span className="error-text">{errors.stock}</span>}
          </div>
        </div>

        {/* Category dropdown (example) */}
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            className={`form-select ${errors.category ? 'input-error' : ''}`}
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">-- Select Category --</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Books">Books</option>
            <option value="Sports">Sports</option>
            {/* Add more or fetch dynamically */}
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        {/* Image upload */}
        <div className="form-group">
          <label>Product Images</label>
          <div className="image-upload-section" onClick={() => fileInputRef.current?.click()}>
            <p>📁 Click or drag to upload new images</p>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>

          {/* Preview of existing images */}
          {existingImages.length > 0 && (
            <div className="image-preview-list">
              {existingImages.map((url, idx) => (
                <div key={`existing-${idx}`} style={{ position: 'relative' }}>
                  <img src={url} alt={`existing-${idx}`} className="image-preview-item" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      background: '#e5534b',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Preview of new images */}
          {imageFiles.length > 0 && (
            <div className="image-preview-list">
              {imageFiles.map((file, idx) => (
                <div key={`new-${idx}`} style={{ position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`new-${idx}`}
                    className="image-preview-item"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      background: '#e5534b',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner"></span> Saving...
              </>
            ) : (
              'Save Product'
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;