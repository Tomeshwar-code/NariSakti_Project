import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/authServices';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setStatus('Passwords do not match');
      return;
    }

    try {
      await resetPassword(token, {
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      setStatus('Password updated successfully. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to reset password');
    }
  };

  return (
    <div className="auth-page">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {status && <p className="auth-status">{status}</p>}
    </div>
  );
}

export default ResetPassword;
