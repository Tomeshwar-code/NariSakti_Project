// Categories.jsx
import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/adminServices';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });
  const [status, setStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data.categories || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description || '', isActive: category.isActive });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', isActive: true });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', isActive: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, formData);
        setStatus({ message: 'Category updated successfully!', type: 'success' });
      } else {
        await createCategory(formData);
        setStatus({ message: 'Category created successfully!', type: 'success' });
      }
      fetchCategories();
      handleCloseModal();
    } catch (err) {
      setStatus({ message: err.response?.data?.message || 'Operation failed.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      setStatus({ message: 'Category deleted successfully.', type: 'success' });
      fetchCategories();
    } catch (err) {
      setStatus({ message: err.response?.data?.message || 'Delete failed.', type: 'error' });
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await updateCategory(id, { isActive: !currentStatus });
      setStatus({ message: 'Status updated successfully.', type: 'success' });
      fetchCategories();
    } catch (err) {
      setStatus({ message: 'Failed to update status.', type: 'error' });
    }
  };

  if (loading) return <div className="loading-spinner-full">Loading...</div>;
  if (error) return <div className="error-state">{error} <button onClick={fetchCategories}>Retry</button></div>;

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2>📂 Categories</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()}>+ Add New</button>
      </div>

      {status.message && (
        <div className={`status-toast status-${status.type}`}>
          {status.message}
          <span className="status-close" onClick={() => setStatus({ message: '', type: '' })}>✕</span>
        </div>
      )}

      <div className="categories-grid">
        {categories.length === 0 ? (
          <p className="empty-state">No categories found. Create your first category!</p>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="category-card">
              <div className="category-card-header">
                <span className="category-name">{cat.name}</span>
                <span className={`status-badge ${cat.isActive ? 'badge-active' : 'badge-inactive'}`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {cat.description && <p className="category-desc">{cat.description}</p>}
              <div className="category-card-actions">
                <button className="btn-toggle" onClick={() => toggleStatus(cat._id, cat.isActive)}>
                  {cat.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button className="btn-edit" onClick={() => handleOpenModal(cat)}>✏️ Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(cat._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingCategory ? 'Edit Category' : 'Create Category'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Electronics"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Active (Visible to users)
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-submit">{editingCategory ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;