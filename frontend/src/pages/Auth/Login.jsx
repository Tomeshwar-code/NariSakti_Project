import React, { useState } from 'react';
import { login } from '../../services/authServices';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(formData);

      localStorage.setItem(
        'accessToken',
        data.accessToken
      );

      alert('Login Successful');
      console.log(data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Login Failed'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <button type="submit">
        Login
      </button>
    </form>
  );
  localStorage.setItem(
  'accessToken',
  data.accessToken
);
}

export default Login;
