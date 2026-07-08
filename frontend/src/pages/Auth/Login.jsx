import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authServices';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(formData);

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert('Login Successful');
      navigate('/');
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
