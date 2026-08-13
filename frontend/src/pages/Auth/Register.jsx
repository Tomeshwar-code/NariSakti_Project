// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { register } from "../../services/authServices";
// import "./Register.css";

// function Register() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     passwordConfirm: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.passwordConfirm) {
//       return alert("Passwords do not match");
//     }

//     try {
//       const data = await register(formData);

//       localStorage.setItem("accessToken", data.accessToken);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       alert("Registration Successful");
//       navigate("/");
//       window.location.reload();
//     } catch (error) {
//       alert(error.response?.data?.message || "Registration Failed");
//     }
//   };

//   const togglePassword = () => setShowPassword(!showPassword);
//   const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

//   return (
//     <div className="register-container">
//       {/* Header - Like Amazon/Flipkart */}
   

//       {/* Registration Card */}
//       <div className="register-card">
//         <div className="card-header">
//           <h2>Create Account</h2>
//           <p className="subtitle">
//             Join <span>NariSakti</span> and start shopping
//           </p>
//         </div>

//         {/* Trust Badge */}
//         <div className="trust-badge">
//           <div className="badge-item">
//             <span className="icon">✓</span> Secure Checkout
//           </div>
//           <div className="badge-item">
//             <span className="icon">✓</span> 100% Safe
//           </div>
//           <div className="badge-item">
//             <span className="icon">✓</span> Free Returns
//           </div>
//         </div>

//         <form onSubmit={handleSubmit}>
//           {/* First Name */}
//           <div className="form-group">
//             <label>
//               First Name <span className="required-star">*</span>
//             </label>
//             <div className="input-wrapper">
//               <span className="input-icon"></span>
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="Enter your first name"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           {/* Last Name */}
//           <div className="form-group">
//             <label>
//               Last Name <span className="required-star">*</span>
//             </label>
//             <div className="input-wrapper">
//               <span className="input-icon"></span>
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Enter your last name"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div className="form-group">
//             <label>
//               Email Address <span className="required-star">*</span>
//             </label>
//             <div className="input-wrapper">
//               <span className="input-icon"></span>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           {/* Phone */}
//           <div className="form-group">
//             <label>
//               Phone Number <span className="required-star">*</span>
//             </label>
//             <div className="input-wrapper">
//               <span className="input-icon"></span>
//               <input
//                 type="text"
//                 name="phone"
//                 placeholder="Enter phone number"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="help-text">
//               <span className="info-icon"></span>
//               We'll send OTP for verification
//             </div>
//           </div>

//           {/* Password */}
//           <div className="form-group">
//             <label>
//               Password <span className="required-star">*</span>
//             </label>
//             <div className="input-wrapper">
//               <span className="input-icon"></span>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Create a strong password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               <button
//                 type="button"
//                 className="password-toggle"
//                 onClick={togglePassword}
//               >
//                 {showPassword ? "" : ""}
//               </button>
//             </div>
//             <div className="help-text">
//               <span className="info-icon"></span>
//               Must be at least 8 characters
//             </div>
//           </div>

//           {/* Confirm Password */}
//           <div className="form-group">
//             <label>
//               Confirm Password <span className="required-star">*</span>
//             </label>
//             <div className="input-wrapper">
//               <span className="input-icon"></span>
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="passwordConfirm"
//                 placeholder="Re-enter password"
//                 value={formData.passwordConfirm}
//                 onChange={handleChange}
//                 required
//               />
//               <button
//                 type="button"
//                 className="password-toggle"
//                 onClick={toggleConfirmPassword}
//               >
//                 {showConfirmPassword ? "" : ""}
//               </button>
//             </div>
//           </div>

//           {/* Register Button */}
//           <button className="register-btn" type="submit">
//             Continue
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="divider">
//           <span>or</span>
//         </div>

//         {/* Social Login */}
//         <div className="social-login">
//           <button className="social-btn google">
//             <span className="social-icon">G</span> Google
//           </button>
//           <button className="social-btn facebook">
//             <span className="social-icon">f</span> Facebook
//           </button>
//         </div>

//         {/* Footer */}
//         <div className="register-footer">
//           <p>
//             Already have an account? <a href="/login">Sign in</a>
//           </p>
//           <div className="terms">
//             By creating an account, you agree to our{' '}
//             <a href="/terms">Terms of Service</a> and{' '}
//             <a href="/privacy">Privacy Policy</a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/authServices";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");

    // Check password strength
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = "";
    if (password.length >= 8) {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecial].filter(Boolean).length;
      
      if (score <= 1) strength = "weak";
      else if (score === 2) strength = "medium";
      else strength = "strong";
    }
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const data = await register(formData);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.message || "Registration Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="card-header">
          <div className="logo-icon">
            <span>🌸</span>
          </div>
          <h2>Create Account</h2>
          <p className="subtitle">
            Join <span>NariSakti</span> and start shopping
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="trust-badge">
          <div className="badge-item">
            <span className="icon">✓</span> Secure Checkout
          </div>
          <div className="badge-item">
            <span className="icon">✓</span> 100% Safe
          </div>
          <div className="badge-item">
            <span className="icon">✓</span> Free Returns
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              First Name <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Last Name <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Email Address <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Phone Number <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">📱</span>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="help-text">
              <span className="info-icon">ℹ️</span>
              We'll send OTP for verification
            </div>
          </div>

          <div className="form-group">
            <label>
              Password <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePassword}
                tabIndex="-1"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {formData.password && (
              <div className="password-strength">
                <div className={`bar ${passwordStrength === 'weak' ? 'active weak' : ''}`}></div>
                <div className={`bar ${passwordStrength === 'medium' ? 'active medium' : ''}`}></div>
                <div className={`bar ${passwordStrength === 'strong' ? 'active strong' : ''}`}></div>
              </div>
            )}
            <div className="help-text">
              <span className="info-icon">ℹ️</span>
              Must be at least 8 characters
            </div>
          </div>

          <div className="form-group">
            <label>
              Confirm Password <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="passwordConfirm"
                placeholder="Re-enter password"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPassword}
                tabIndex="-1"
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button className="register-btn" type="submit" disabled={loading}>
            <span className="btn-content">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                "🚀 Continue"
              )}
            </span>
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="social-login">
          <button className="social-btn google" disabled={loading}>
            <span className="social-icon">G</span> Google
          </button>
          <button className="social-btn facebook" disabled={loading}>
            <span className="social-icon">f</span> Facebook
          </button>
        </div>

        <div className="register-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
          <div className="terms">
            By creating an account, you agree to our{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;