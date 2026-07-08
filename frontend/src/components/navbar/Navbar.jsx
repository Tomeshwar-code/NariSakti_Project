import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(u);
    } catch (err) {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Top Header */}
      <header className="top-header">
        <div className="logo">
          <Link to="/">
            <h2>Narisakti</h2>
          </Link>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search handmade products..."
          />
        </div>

        <div className="header-right">
          {!user && (
            <>
              <Link to="/login" className="nav-btn">Login</Link>
              <Link to="/register" className="nav-btn register-btn">Register</Link>
            </>
          )}

          {user && (
            <>
              <button className="nav-btn" onClick={handleLogout}>Logout</button>
              <Link to="/profile" className="nav-btn Profile-btn">Profile</Link>
              <Link to="/cart" className="nav-btn">Cart</Link>
              {user.role === 'seller' && (
                <Link to="/seller/add-product" className="nav-btn">AddProduct</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-btn">Admin</Link>
              )}
            </>
          )}

        </div>
      </header>

      {/* Category Navigation */}
      <nav className="category-nav">
        <Link to="/category/handmade-crafts">Handmade Crafts</Link>
        <Link to="/category/papad">papad</Link>
        <Link to="/category/textiles">Textiles</Link>
        <Link to="/category/organic-foods">Organic Foods</Link>
        <Link to="/category/home-decor">Home Decor</Link>
        <Link to="/category/traditional-art">Traditional Art</Link>
        <Link to="/category/beauty-products">Beauty Products</Link>
        <Link to="/products">All Products</Link>
      </nav>
    </>
  );
}

export default Navbar;