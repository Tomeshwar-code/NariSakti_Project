import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../../api/axios';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-container">
        <div className="footer-content">
          {/* Column 1: About */}
          <div className="footer-column">
            <div className="footer-logo">
              <h3>NariSakti</h3>
              <p className="tagline">Empowering Rural Women</p>
            </div>
            <p className="about-text">
              NariSakti is a platform dedicated to supporting rural women entrepreneurs by providing them with a marketplace to sell their handmade and home-based products to customers across the country.
            </p>
            <div className="social-links">
              <a href="https://facebook.com/narisakti" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com/narisakti" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com/narisakti" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com/company/narisakti" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://youtube.com/@narisakti" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/sellers">Our Sellers</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="footer-column">
            <h4>Customer Service</h4>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns & Exchanges</Link></li>
              <li><Link to="/track-order">Track Order</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
              <li><Link to="/gift-cards">Gift Cards</Link></li>
            </ul>
          </div>

          {/* Column 4: For Sellers */}
          <div className="footer-column">
            <h4>For Sellers</h4>
            <ul>
              <li><Link to="/seller-register">Become a Seller</Link></li>
              <li><Link to="/seller-dashboard">Seller Dashboard</Link></li>
              <li><Link to="/seller-guide">Seller Guide</Link></li>
              <li><Link to="/commission-rates">Commission Rates</Link></li>
              <li><Link to="/support">Seller Support</Link></li>
              <li><Link to="/seller-resources">Resources</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact & Legal */}
          <div className="footer-column">
            <h4>Get in Touch</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <p className="label">Address</p>
                  <p>123 Rural Lane, Delhi, India 110001</p>
                </div>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div>
                  <p className="label">Phone</p>
                  <p><a href="tel:+919876543210">+91 98765 43210</a></p>
                </div>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <div>
                  <p className="label">Email</p>
                  <p><a href="mailto:support@narisakti.com">support@narisakti.com</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h3>Subscribe to Our Newsletter</h3>
            <p>Get exclusive offers, new product launches, and seller stories delivered to your inbox.</p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => handleNewsletterSubscribe(e)}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-bottom-left">
            <p>&copy; {currentYear} NariSakti. All rights reserved.</p>
          </div>
          <div className="footer-bottom-center">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="separator">|</span>
            <Link to="/terms">Terms & Conditions</Link>
            <span className="separator">|</span>
            <Link to="/cookies">Cookie Policy</Link>
            <span className="separator">|</span>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>
          <div className="footer-bottom-right">
            <p>Made with ❤️ for Rural Women Entrepreneurs</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Handle Newsletter Subscribe
const handleNewsletterSubscribe = async (e) => {
  e.preventDefault();
  const email = e.target.querySelector('.newsletter-input').value;
  
  try {
    const response = await api.post('/footer/newsletter/subscribe', { email });
    alert(response.data?.message || 'Successfully subscribed to our newsletter!');
    e.target.reset();
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    alert(error.response?.data?.message || 'Error subscribing to newsletter');
  }
};

export default Footer;
