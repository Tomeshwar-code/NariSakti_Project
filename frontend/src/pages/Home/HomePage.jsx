import Navbar from "../../components/navbar/Navbar";
import "./HomePage.css";

function HomePage() {
  const categories = [
    "Handmade Crafts",
    "Traditional Art",
    "Handwoven Textiles",
    "Organic Foods",
    "Jewelry",
    "Home Decor",
  ];

  const products = [
    {
      id: 1,
      name: "Handmade Bamboo Basket",
      seller: "Sita Devi",
      village: "Sehore, MP",
      price: "₹499",
    },
    {
      id: 2,
      name: "Traditional Wall Art",
      seller: "Kamla Bai",
      village: "Bhopal, MP",
      price: "₹899",
    },
    {
      id: 3,
      name: "Handwoven Dupatta",
      seller: "Rani Devi",
      village: "Vidisha, MP",
      price: "₹699",
    },
    {
      id: 4,
      name: "Organic Pickle",
      seller: "Geeta Bai",
      village: "Raisen, MP",
      price: "₹299",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="homepage">

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Empowering Rural Women Through Digital Commerce</h1>

            <p>
              Buy authentic handmade products directly from talented rural
              women across India and support their livelihoods.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn">Shop Now</button>
              <button className="secondary-btn">Become a Seller</button>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="stats-section">
          <div className="stat-card">
            <h2>10,000+</h2>
            <p>Women Entrepreneurs</p>
          </div>

          <div className="stat-card">
            <h2>5,000+</h2>
            <p>Products Listed</p>
          </div>

          <div className="stat-card">
            <h2>500+</h2>
            <p>Villages Connected</p>
          </div>

          <div className="stat-card">
            <h2>50,000+</h2>
            <p>Happy Customers</p>
          </div>
        </section>

        {/* Categories */}
        <section className="section">
          <h2 className="section-title">Shop By Categories</h2>

          <div className="category-grid">
            {categories.map((category, index) => (
              <div className="category-card" key={index}>
                {category}
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="section">
          <h2 className="section-title">Featured Products</h2>

          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src="https://via.placeholder.com/300x220"
                  alt={product.name}
                />

                <h3>{product.name}</h3>

                <p className="seller">
                  by {product.seller}
                </p>

                <p className="village">
                  {product.village}
                </p>

                <h4>{product.price}</h4>

                <button>Add To Cart</button>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="why-section">
          <h2>Why Choose NariSakti?</h2>

          <div className="why-grid">
            <div>✓ Directly Supports Rural Women</div>
            <div>✓ Authentic Handmade Products</div>
            <div>✓ Fair Earnings For Artisans</div>
            <div>✓ Secure Online Payments</div>
            <div>✓ Nationwide Delivery</div>
            <div>✓ Quality Verified Products</div>
          </div>
        </section>

        {/* Success Story */}
        <section className="story-section">
          <h2>Success Story</h2>

          <blockquote>
            "Before NariSakti, I sold products only in my village.
            Now customers from different states buy my handmade crafts."
          </blockquote>

          <p>- Sunita Bai, Rural Artisan</p>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <h2>From Village Hands To Every Home</h2>

          <p>
            Join our mission to empower women entrepreneurs and
            promote India's rich handmade heritage.
          </p>

          <button>Explore Marketplace</button>
        </section>

      </div>
    </>
  );
}

export default HomePage;