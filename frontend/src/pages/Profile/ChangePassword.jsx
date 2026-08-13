// import { useState } from 'react';
// import { changePassword } from '../../services/authServices';

// function ChangePassword() {
//   const [formData, setFormData] = useState({
//     oldPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [status, setStatus] = useState('');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.newPassword !== formData.confirmPassword) {
//       setStatus('New passwords do not match');
//       return;
//     }

//     try {
//       await changePassword(formData);
//       setStatus('Password changed successfully');
//       setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
//     } catch (error) {
//       setStatus(error.response?.data?.message || 'Unable to change password');
//     }
//   };

//   return (
//     <div className="profile-page">
//       <h2>Change Password</h2>
//       <form onSubmit={handleSubmit} className="auth-form">
//         <input
//           name="oldPassword"
//           type="password"
//           placeholder="Current Password"
//           value={formData.oldPassword}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="newPassword"
//           type="password"
//           placeholder="New Password"
//           value={formData.newPassword}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="confirmPassword"
//           type="password"
//           placeholder="Confirm Password"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Update Password</button>
//       </form>
//       {status && <p className="auth-status">{status}</p>}
//     </div>
//   );
// }

// export default ChangePassword;
import { useState, useEffect } from 'react';
import { changePassword } from '../../services/authServices';
import './ChangePassword.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [status, setStatus] = useState({ type: '', message: '' }); // type: 'success' | 'error'
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-100

  // Password strength checker
  useEffect(() => {
    const pwd = formData.newPassword;
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 25;
    if (/\d/.test(pwd)) score += 25;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 25;
    setPasswordStrength(score);
  }, [formData.newPassword]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear status when user types
    if (status.message) setStatus({ type: '', message: '' });
  };

  const toggleShow = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.oldPassword.trim()) {
      setStatus({ type: 'error', message: 'Current password is required.' });
      return;
    }
    if (formData.newPassword.length < 8) {
      setStatus({ type: 'error', message: 'New password must be at least 8 characters.' });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    if (formData.newPassword === formData.oldPassword) {
      setStatus({ type: 'error', message: 'New password cannot be same as old password.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      setStatus({ type: 'success', message: 'Password changed successfully!' });
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStrength(0);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Unable to change password.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 25) return { label: 'Weak', color: '#EF4444' };
    if (passwordStrength <= 50) return { label: 'Fair', color: '#F59E0B' };
    if (passwordStrength <= 75) return { label: 'Good', color: '#3B82F6' };
    return { label: 'Strong', color: '#10B981' };
  };

  const strength = getStrengthLabel();

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <div className="card-header">
          <h2>🔐 Change Password</h2>
          <p>Secure your account with a strong password</p>
        </div>

        <form onSubmit={handleSubmit} className="password-form">
          {/* Old Password */}
          <div className="form-group">
            <label htmlFor="oldPassword">Current Password</label>
            <div className="input-wrapper">
              <input
                id="oldPassword"
                name="oldPassword"
                type={showPassword.old ? 'text' : 'password'}
                placeholder="Enter current password"
                value={formData.oldPassword}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => toggleShow('old')}
                aria-label="Toggle password visibility"
              >
                {showPassword.old ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-wrapper">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword.new ? 'text' : 'password'}
                placeholder="Enter new password (min 8 chars)"
                value={formData.newPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => toggleShow('new')}
                aria-label="Toggle password visibility"
              >
                {showPassword.new ? '🙈' : '👁️'}
              </button>
            </div>
            {/* Password Strength Meter */}
            {formData.newPassword.length > 0 && (
              <div className="strength-meter">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${passwordStrength}%`,
                      backgroundColor: strength.color
                    }}
                  />
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
            {/* Password requirements */}
            <ul className="requirements">
              <li className={formData.newPassword.length >= 8 ? 'met' : ''}>
                {formData.newPassword.length >= 8 ? '✅' : '❌'} At least 8 characters
              </li>
              <li className={/[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) ? 'met' : ''}>
                {/[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) ? '✅' : '❌'} Contains uppercase & lowercase
              </li>
              <li className={/\d/.test(formData.newPassword) ? 'met' : ''}>
                {/\d/.test(formData.newPassword) ? '✅' : '❌'} Contains a number
              </li>
              <li className={/[^a-zA-Z0-9]/.test(formData.newPassword) ? 'met' : ''}>
                {/[^a-zA-Z0-9]/.test(formData.newPassword) ? '✅' : '❌'} Contains a special character
              </li>
            </ul>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword.confirm ? 'text' : 'password'}
                placeholder="Re-enter new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => toggleShow('confirm')}
                aria-label="Toggle password visibility"
              >
                {showPassword.confirm ? '🙈' : '👁️'}
              </button>
            </div>
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p className="error-hint">Passwords do not match</p>
            )}
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
              <p className="success-hint">✅ Passwords match</p>
            )}
          </div>

          {/* Status Message */}
          {status.message && (
            <div className={`status-message ${status.type}`}>
              {status.type === 'success' ? '✅' : '❌'} {status.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !formData.oldPassword || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword || formData.newPassword.length < 8}
          >
            {loading ? (
              <>
                <span className="spinner-mini"></span> Updating...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;