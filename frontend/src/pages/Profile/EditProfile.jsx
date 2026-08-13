// import { useEffect, useState } from 'react';
// import { updateProfile, getMe } from '../../services/authServices';

// function EditProfile() {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     phone: '',
//     street: '',
//     city: '',
//     state: '',
//     pincode: '',
//     country: ''
//   });
//   const [status, setStatus] = useState('');

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const data = await getMe();
//         const user = data.user;
//         setFormData({
//           firstName: user.firstName || '',
//           lastName: user.lastName || '',
//           phone: user.phone || '',
//           street: user.address?.street || '',
//           city: user.address?.city || '',
//           state: user.address?.state || '',
//           pincode: user.address?.pincode || '',
//           country: user.address?.country || ''
//         });
//       } catch {
//         setStatus('Unable to load profile');
//       }
//     };
//     loadProfile();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus('Updating profile...');

//     try {
//       await updateProfile({
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         phone: formData.phone,
//         address: {
//           street: formData.street,
//           city: formData.city,
//           state: formData.state,
//           pincode: formData.pincode,
//           country: formData.country
//         }
//       });
//       setStatus('Profile updated successfully');
//     } catch (error) {
//       setStatus(error.response?.data?.message || 'Unable to update profile');
//     }
//   };

//   return (
//     <div className="profile-page">
//       <h2>Edit Profile</h2>
//       <form onSubmit={handleSubmit} className="auth-form">
//         <input
//           name="firstName"
//           placeholder="First Name"
//           value={formData.firstName}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="lastName"
//           placeholder="Last Name"
//           value={formData.lastName}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="phone"
//           placeholder="Phone"
//           value={formData.phone}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="street"
//           placeholder="Street Address"
//           value={formData.street}
//           onChange={handleChange}
//         />
//         <input
//           name="city"
//           placeholder="City"
//           value={formData.city}
//           onChange={handleChange}
//         />
//         <input
//           name="state"
//           placeholder="State"
//           value={formData.state}
//           onChange={handleChange}
//         />
//         <input
//           name="pincode"
//           placeholder="Pincode"
//           value={formData.pincode}
//           onChange={handleChange}
//         />
//         <input
//           name="country"
//           placeholder="Country"
//           value={formData.country}
//           onChange={handleChange}
//         />
//         <button type="submit">Save Changes</button>
//       </form>
//       {status && <p className="auth-status">{status}</p>}
//     </div>
//   );
// }

// export default EditProfile;
// EditProfile.jsx
import { useEffect, useState, useRef } from 'react';
import { updateProfile, getMe } from '../../services/authServices';
import './EditProfile.css';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef();

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMe();
        const user = data.user;
        const loaded = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
          country: user.address?.country || ''
        };
        setFormData(loaded);
        setOriginalData(loaded);
      } catch {
        setStatus({ type: 'error', message: 'Unable to load profile' });
      }
    };
    loadProfile();
  }, []);

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
    if (status.message) setStatus({ type: '', message: '' });
  };

  // Phone formatting (basic: adds space after 5 digits)
  const handlePhoneChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 10) raw = raw.slice(0, 10);
    let formatted = raw;
    if (raw.length > 5) {
      formatted = raw.slice(0, 5) + ' ' + raw.slice(5);
    }
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfileImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setFormData(originalData);
    setProfileImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setStatus({ type: 'error', message: 'First and last name are required.' });
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setStatus({ type: 'error', message: 'Valid email is required.' });
      return;
    }
    const phoneDigits = formData.phone.replace(/\s/g, '');
    if (phoneDigits && (phoneDigits.length < 10 || phoneDigits.length > 10)) {
      setStatus({ type: 'error', message: 'Phone number must be 10 digits.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country
        }
      });
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
      // Update original data to match new values
      setOriginalData({ ...formData });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Unable to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if form is unchanged
  const isUnchanged = JSON.stringify(formData) === JSON.stringify(originalData) && !profileImage;

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <div className="card-header">
          <h2>✏️ Edit Profile</h2>
          <p>Keep your personal information up to date</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Profile Picture */}
          <div className="profile-picture-section">
            <div className="avatar-wrapper">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {formData.firstName?.[0]}{formData.lastName?.[0]}
                </div>
              )}
              <button
                type="button"
                className="upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                📷
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            <p className="upload-hint">Click the camera icon to change</p>
          </div>

          {/* Personal Information - 2 columns */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="98765 43210"
                value={formData.phone}
                onChange={handlePhoneChange}
              />
            </div>
          </div>

          <div className="divider">📍 Address Details</div>

          {/* Address - 2 columns */}
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="street">Street Address</label>
              <input
                id="street"
                name="street"
                type="text"
                placeholder="123 Main Street"
                value={formData.street}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Mumbai"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                id="state"
                name="state"
                type="text"
                placeholder="Maharashtra"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pincode">Pincode</label>
              <input
                id="pincode"
                name="pincode"
                type="text"
                placeholder="400001"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                name="country"
                type="text"
                placeholder="India"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Status Message */}
          {status.message && (
            <div className={`status-message ${status.type}`}>
              {status.type === 'success' ? '✅' : '❌'} {status.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="reset-btn"
              onClick={handleReset}
              disabled={isUnchanged}
            >
              ↺ Reset
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || isUnchanged}
            >
              {loading ? (
                <>
                  <span className="spinner-mini"></span> Saving...
                </>
              ) : (
                '💾 Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;