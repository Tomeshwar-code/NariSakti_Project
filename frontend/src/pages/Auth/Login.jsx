// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { login } from "../../services/authServices";
// import "./Login.css";

// function Login() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = await login(formData);

//       localStorage.setItem("accessToken", data.accessToken);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       alert("Login Successful");
//       navigate("/");
//       window.location.reload();
//     } catch (error) {
//       alert(error.response?.data?.message || "Login Failed");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">

//         <h2>Welcome Back</h2>
//         <p>Login to your NariSakti account</p>

//         <form onSubmit={handleSubmit}>

//           <div className="form-group">
//             <label>Email Address</label>
//             <input
//               name="email"
//               type="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               name="password"
//               type="password"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//             />
//           </div>

//           <button type="submit">
//             Login
//           </button>

//         </form>

//       </div>
//     </div>
//   );
// }

// export default Login;
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authServices";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const navigate = useNavigate();

  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDark(false);
      document.body.classList.add("light-theme");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle("light-theme");
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(formData);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      navigate("/");
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.message || "Login Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${isDark ? "dark" : "light"}`}>
      {/* Theme Toggle */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDark ? "☀️" : "🌙"}
      </button>

      <div className="login-card">
        {/* Logo */}
        <div className="logo-icon">
          <span>🌸</span>
        </div>

        <h2>Welcome Back</h2>
        <p className="subtitle">Login to your NariSakti account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <button type="button" className="forgot-password">
              Forgot password?
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            <span className="btn-content">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </span>
          </button>
        </form>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="social-buttons">
          <button className="social-btn google">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button className="social-btn github">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register now</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;