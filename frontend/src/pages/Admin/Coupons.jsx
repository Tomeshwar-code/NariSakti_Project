import { useEffect, useState } from 'react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../services/adminServices';
import './Coupons.css';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    validFrom: '',
    validTo: '',
    usageLimit: '',
    isActive: true,
  });
  const [status, setStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await getCoupons();
      setCoupons(res.data.coupons || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load coupons.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount || '',
        maxDiscount: coupon.maxDiscount || '',
        validFrom: coupon.validFrom ? coupon.validFrom.split('T')[0] : '',
        validTo: coupon.validTo ? coupon.validTo.split('T')[0] : '',
        usageLimit: coupon.usageLimit || '',
        isActive: coupon.isActive,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        maxDiscount: '',
        validFrom: '',
        validTo: '',
        usageLimit: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscount: '',
      validFrom: '',
      validTo: '',
      usageLimit: '',
      isActive: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.code.trim() || !formData.discountValue) {
      setStatus({ message: 'Please fill in all required fields.', type: 'error' });
      return;
    }
    try {
      const payload = { ...formData };
      if (editingCoupon) {
        await updateCoupon(editingCoupon._id, payload);
        setStatus({ message: 'Coupon updated successfully!', type: 'success' });
      } else {
        await createCoupon(payload);
        setStatus({ message: 'Coupon created successfully!', type: 'success' });
      }
      fetchCoupons();
      handleCloseModal();
    } catch (err) {
      setStatus({ message: err.response?.data?.message || 'Operation failed.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon permanently?')) return;
    try {
      await deleteCoupon(id);
      setStatus({ message: 'Coupon deleted.', type: 'success' });
      fetchCoupons();
    } catch (err) {
      setStatus({ message: err.response?.data?.message || 'Delete failed.', type: 'error' });
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await updateCoupon(id, { isActive: !currentStatus });
      setStatus({ message: 'Status updated.', type: 'success' });
      fetchCoupons();
    } catch (err) {
      setStatus({ message: 'Failed to update status.', type: 'error' });
    }
  };

  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-IN') : 'N/A';

  if (loading) return <div className="loading-spinner-full">Loading coupons...</div>;
  if (error) return <div className="error-state">{error} <button onClick={fetchCoupons}>Retry</button></div>;

  return (
    <div className="coupons-container">
      <div className="coupons-header">
        <h2>🏷️ Coupons & Discounts</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()}>+ Create Coupon</button>
      </div>

      {status.message && (
        <div className={`status-toast status-${status.type}`}>
          {status.message}
          <span className="status-close" onClick={() => setStatus({ message: '', type: '' })}>✕</span>
        </div>
      )}

      {coupons.length === 0 ? (
        <p className="empty-state">No coupons yet. Create your first discount coupon!</p>
      ) : (
        <div className="coupons-grid">
          {coupons.map((c) => (
            <div key={c._id} className={`coupon-card ${c.isActive ? '' : 'inactive'}`}>
              <div className="coupon-code">{c.code}</div>
              <div className="coupon-details">
                <span className="coupon-discount">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                </span>
                {c.minOrderAmount && <span>Min Order: ₹{c.minOrderAmount}</span>}
                {c.maxDiscount && <span>Max Discount: ₹{c.maxDiscount}</span>}
                <span>Valid: {formatDate(c.validFrom)} - {formatDate(c.validTo)}</span>
                {c.usageLimit && <span>Usage Limit: {c.usageLimit}</span>}
                <span className={`status-badge ${c.isActive ? 'badge-active' : 'badge-inactive'}`}>
                  {c.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="coupon-actions">
                <button className="btn-toggle" onClick={() => toggleStatus(c._id, c.isActive)}>
                  {c.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button className="btn-edit" onClick={() => handleOpenModal(c)}>✏️ Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(c._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., SUMMER10"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Discount Type *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Discount Value *</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 150'}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Min Order Amount (optional)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="e.g., 500"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Max Discount (optional)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="e.g., 200"
                  />
                </div>
                <div className="form-group">
                  <label>Usage Limit (optional)</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Valid From</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Valid To</label>
                  <input
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Active (available for users)
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-submit">{editingCoupon ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;