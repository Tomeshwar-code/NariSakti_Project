import { useState } from 'react';
import { forgotPassword } from '../../services/authServices';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending reset link...');

    try {
      await forgotPassword(email);
      setStatus('If that email exists, a reset link has been sent.');
      setEmail('');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to send reset email');
    }
  };

  return (
    <div className="auth-page">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {status && <p className="auth-status">{status}</p>}
    </div>
  );
}

export default ForgotPassword;
