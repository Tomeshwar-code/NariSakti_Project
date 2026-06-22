import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <>
      {/* Top Header */}
      <header className="top-header">
        <div className="logo">
          <Link to="/">
            <h2>NariSakti</h2>
          </Link>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search handmade products..."
          />
        </div>

        <div className="header-right">
          <Link to="/login" className="nav-btn">
            Login
          </Link>

          <Link to="/register" className="nav-btn register-btn">
            Register
          </Link>

          <Link to="/profile" className="nav-btn Profile-btn">Profile</Link>

          <Link to="/cart" className="nav-btn">
            Cart
          </Link>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="category-nav">
        <Link to="/category/handmade-crafts">
          Handmade Crafts
        </Link>

        <Link to="/category/jewellery">
          Jewellery
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