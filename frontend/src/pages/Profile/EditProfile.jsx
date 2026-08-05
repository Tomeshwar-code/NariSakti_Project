import { useEffect, useState } from 'react';
import { updateProfile, getMe } from '../../services/authServices';

function EditProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMe();
        const user = data.user;
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
          country: user.address?.country || ''
        });
      } catch {
        setStatus('Unable to load profile');
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Updating profile...');

    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country
        }
      });
      setStatus('Profile updated successfully');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to update profile');
    }
  };

  return (
    <div className="profile-page">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          name="street"
          placeholder="Street Address"
          value={formData.street}
          onChange={handleChange}
        />
        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />
        <input
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
        />
        <input
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
        />
        <input
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
        />
        <button type="submit">Save Changes</button>
      </form>
      {status && <p className="auth-status">{status}</p>}
    </div>
  );
}

export default EditProfile;
