import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authServices";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

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

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login Successful");
      navigate("/");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Welcome Back</h2>
        <p>Login to your NariSakti account</p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit">
            Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;
