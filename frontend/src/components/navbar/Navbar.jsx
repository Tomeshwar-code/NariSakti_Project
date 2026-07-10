import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      setUser(storedUser);
    } catch (error) {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      {/* =======================
            TOP HEADER
      ======================= */}

      <header className="top-header">

        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <h2>NariSakti</h2>
          </Link>
        </div>

        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search handmade products..."
          />
        </div>

        {/* Right Menu */}
        <div className="header-right">

          {!user ? (
            <>
              <Link to="/login" className="nav-btn">
                Login
              </Link>

              <Link
                to="/register"
                className="nav-btn register-btn"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="nav-btn profile-btn"
              >
                Profile
              </Link>

              <Link
                to="/cart"
                className="nav-btn"
              >
                Cart
              </Link>

              {user.role === "seller" && (
                <Link
                  to="/seller/add-product"
                  className="nav-btn seller-btn"
                >
                  Add Product
                </Link>
              )}

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="nav-btn admin-btn"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="nav-btn logout-btn"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </header>

      {/* =======================
          CATEGORY NAVIGATION
      ======================= */}

      <nav className="category-nav">

        <Link to="/category/handmade-crafts">
          Handmade Crafts
        </Link>

        <Link to="/category/papad">
          Papad
        </Link>

        <Link to="/category/textiles">
          Textiles
        </Link>

        <Link to="/category/organic-foods">
          Organic Foods
        </Link>

        <Link to="/category/home-decor">
          Home Decor
        </Link>

        <Link to="/category/traditional-art">
          Traditional Art
        </Link>

        <Link to="/category/beauty-products">
          Beauty Products
        </Link>

        <Link to="/products">
          All Products
        </Link>

      </nav>
    </>
  );
}

export default Navbar;