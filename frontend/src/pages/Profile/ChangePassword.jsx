import { useState } from 'react';
import { changePassword } from '../../services/authServices';

function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus('New passwords do not match');
      return;
    }

    try {
      await changePassword(formData);
      setStatus('Password changed successfully');
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to change password');
    }
  };

  return (
    <div className="profile-page">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="oldPassword"
          type="password"
          placeholder="Current Password"
          value={formData.oldPassword}
          onChange={handleChange}
          required
        />
        <input
          name="newPassword"
          type="password"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Update Password</button>
      </form>
      {status && <p className="auth-status">{status}</p>}
    </div>
  );
}

export default ChangePassword;
