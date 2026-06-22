import React, { useState } from 'react';
import { register } from '../../services/authServices';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
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
      const data = await register(formData);

      localStorage.setItem(
        'accessToken',
        data.accessToken
      );

      alert('Registration Successful');
      console.log(data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Registration Failed'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        placeholder="First Name"
        onChange={handleChange}
      />

      <input
        name="lastName"
        placeholder="Last Name"
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <input
        name="passwordConfirm"
        type="password"
        placeholder="Confirm Password"
        onChange={handleChange}
      />

      <button type="submit">
        Register
      </button>
    </form>
  );
}

export default Register;