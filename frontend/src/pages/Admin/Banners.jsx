import { useEffect, useState } from 'react';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../../services/adminServices';
import './Banners.css';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: null,
    link: '',
    position: 'home',
    isActive: true,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await getBanners();
      setBanners(res.data.banners || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load banners.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        image: null,
        link: banner.link || '',
        position: banner.position || 'home',
        isActive: banner.isActive,
      });
      setPreviewImage(banner.imageUrl || null);
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        image: null,
        link: '',
        position: 'home',
        isActive: true,
      });
      setPreviewImage(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      image: null,
      link: '',
      position: 'home',
      isActive: true,
    });
    setPreviewImage(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setStatus({ message: 'Title is required.', type: 'error' });
      return;
    }
    if (!editingBanner && !formData.image) {
      setStatus({ message: 'Please select an image for the banner.', type: 'error' });
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('subtitle', formData.subtitle || '');
    payload.append('link', formData.link || '');
    payload.append('position', formData.position);
    payload.append('isActive', formData.isActive);
    if (formData.image) {
      payload.append('image', formData.image);
    }

    setUploading(true);
    try {
      if (editingBanner) {
        await updateBanner(editingBanner._id, payload);
        setStatus({ message: 'Banner updated successfully!', type: 'success' });
      } else {
        await createBanner(payload);
        setStatus({ message: 'Banner created successfully!', type: 'success' });
      }
      fetchBanners();
      handleCloseModal();
    } catch (err) {
      setStatus({ message: err.response?.data?.message || 'Operation failed.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner permanently?')) return;
    try {
      await deleteBanner(id);
      setStatus({ message: 'Banner deleted.', type: 'success' });
      fetchBanners();
    } catch (err) {
      setStatus({ message: err.response?.data?.message || 'Delete failed.', type: 'error' });
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await updateBanner(id, { isActive: !currentStatus });
      setStatus({ message: 'Status updated.', type: 'success' });
      fetchBanners();
    } catch (err) {
      setStatus({ message: 'Failed to update status.', type: 'error' });
    }
  };

  if (loading) return <div className="loading-spinner-full">Loading banners...</div>;
  if (error) return <div className="error-state">{error} <button onClick={fetchBanners}>Retry</button></div>;

  return (
    <div className="banners-container">
      <div className="banners-header">
        <h2>🖼️ Banners & Sliders</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()}>+ Add Banner</button>
      </div>

      {status.message && (
        <div className={`status-toast status-${status.type}`}>
          {status.message}
          <span className="status-close" onClick={() => setStatus({ message: '', type: '' })}>✕</span>
        </div>
      )}

      {banners.length === 0 ? (
        <p className="empty-state">No banners yet. Upload your first banner!</p>
      ) : (
        <div className="banners-grid">
          {banners.map((b) => (
            <div key={b._id} className={`banner-card ${b.isActive ? '' : 'inactive'}`}>
              <div className="banner-image-wrapper">
                <img src={b.imageUrl} alt={b.title} className="banner-image" />
                <span className={`status-badge ${b.isActive ? 'badge-active' : 'badge-inactive'}`}>
                  {b.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="banner-info">
                <h4>{b.title}</h4>
                {b.subtitle && <p>{b.subtitle}</p>}
                {b.link && <a href={b.link} target="_blank" rel="noopener noreferrer">🔗 Link</a>}
                <span className="banner-position">📍 {b.position}</span>
              </div>
              <div className="banner-actions">
                <button className="btn-toggle" onClick={() => toggleStatus(b._id, b.isActive)}>
                  {b.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button className="btn-edit" onClick={() => handleOpenModal(b)}>✏️ Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(b._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Summer Sale"
                  required
                />
              </div>
              <div className="form-group">
                <label>Subtitle (optional)</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g., Up to 50% off"
                />
              </div>
              <div className="form-group">
                <label>Link (optional)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://example.com/sale"
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                >
                  <option value="home">Homepage</option>
                  <option value="category">Category Page</option>
                  <option value="product">Product Page</option>
                </select>
              </div>
              <div className="form-group">
                <label>Banner Image {!editingBanner && '*'}</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {previewImage && (
                  <div className="image-preview">
                    <img src={previewImage} alt="Preview" />
                  </div>
                )}
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Active (display on site)
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={uploading}>
                  {uploading ? 'Uploading...' : (editingBanner ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;