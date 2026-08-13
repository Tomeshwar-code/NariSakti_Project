// import { useState } from 'react';
// import { createOrder } from '../../services/orderServices';
// import { useNavigate } from 'react-router-dom';

// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//   const [loading, setLoading] = useState(false);
//   const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });

//   const handlePlaceOrder = async () => {
//     if (cart.length === 0) return;
//     setLoading(true);
//     try {
//       const items = cart.map(i => ({ product: i.product, quantity: i.quantity }));
//       const orderData = {
//         items,
//         shippingAddress: address,
//         paymentMethod: 'cod'
//       };
//       await createOrder(orderData);
//       localStorage.removeItem('cart');
//       navigate(`/orders`);
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || 'Unable to create order');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Checkout</h2>
//       <div>
//         <label>Street</label>
//         <input value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
//         <label>City</label>
//         <input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
//         <label>State</label>
//         <input value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
//         <label>Pincode</label>
//         <input value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
//       </div>
//       <button onClick={handlePlaceOrder} disabled={loading}>Place Order</button>
//     </div>
//   );
// };

// export default CheckoutPage;
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../../services/orderServices';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Get cart from localStorage
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  // Address form state
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cart, navigate, orderPlaced]);

  // Calculate totals
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  }, [cart]);

  const tax = useMemo(() => subtotal * 0.12, [subtotal]);
  const shipping = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0;
  const total = subtotal + tax + shipping;

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!address.fullName.trim()) errors.fullName = 'Full name is required';
    if (!address.street.trim()) errors.street = 'Street address is required';
    if (!address.city.trim()) errors.city = 'City is required';
    if (!address.state.trim()) errors.state = 'State is required';
    if (!address.pincode.trim()) errors.pincode = 'Pincode is required';
    if (!/^[1-9][0-9]{5}$/.test(address.pincode)) errors.pincode = 'Enter a valid 6-digit pincode';
    if (!address.phone.trim()) errors.phone = 'Phone number is required';
    if (!/^[6-9]\d{9}$/.test(address.phone)) errors.phone = 'Enter a valid 10-digit phone number';
    if (!address.email.trim()) errors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) errors.email = 'Enter a valid email address';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    
    // Validate form
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.form-group.error input, .form-group.error textarea');
      if (firstError) firstError.focus();
      return;
    }

    setLoading(true);
    try {
      const items = cart.map(item => ({
        product: item.product || item._id,
        quantity: item.quantity || 1,
        price: item.price || 0,
        name: item.name,
      }));

      const orderData = {
        items,
        shippingAddress: {
          fullName: address.fullName,
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          phone: address.phone,
          email: address.email,
        },
        paymentMethod: paymentMethod,
        subtotal,
        tax,
        shipping,
        total,
        couponApplied: false,
        couponDiscount: 0,
      };

      const response = await createOrder(orderData);
      
      // Clear cart after successful order
      localStorage.removeItem('cart');
      setCart([]);
      setOrderPlaced(true);
      
      // Navigate to order confirmation / orders page
      navigate(`/orders`, { 
        state: { 
          orderId: response.data?.order?._id,
          orderSuccess: true 
        } 
      });
      
    } catch (err) {
      console.error('Order placement error:', err);
      const errorMsg = err.response?.data?.message || 'Unable to create order. Please try again.';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Render ----------
  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-empty">
        <div className="empty-container">
          <span className="empty-icon">🛒</span>
          <h3>Your cart is empty</h3>
          <p>Add some items to your cart before checking out.</p>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link to="/cart" className="back-to-cart">← Back to Cart</Link>
        <h2>🛍️ Checkout</h2>
      </div>

      <div className="checkout-grid">
        {/* Left: Shipping Address & Payment */}
        <div className="checkout-form-section">
          <div className="form-card">
            <h3>📍 Shipping Address</h3>
            <form noValidate>
              <div className={`form-group ${formErrors.fullName ? 'error' : ''}`}>
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
                {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
              </div>

              <div className={`form-group ${formErrors.street ? 'error' : ''}`}>
                <label>Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  placeholder="123 Main St, Apartment 4B"
                  required
                />
                {formErrors.street && <span className="error-text">{formErrors.street}</span>}
              </div>

              <div className="form-row">
                <div className={`form-group ${formErrors.city ? 'error' : ''}`}>
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                    required
                  />
                  {formErrors.city && <span className="error-text">{formErrors.city}</span>}
                </div>

                <div className={`form-group ${formErrors.state ? 'error' : ''}`}>
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    placeholder="Maharashtra"
                    required
                  />
                  {formErrors.state && <span className="error-text">{formErrors.state}</span>}
                </div>
              </div>

              <div className={`form-group ${formErrors.pincode ? 'error' : ''}`}>
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleInputChange}
                  placeholder="400001"
                  maxLength="6"
                  required
                />
                {formErrors.pincode && <span className="error-text">{formErrors.pincode}</span>}
              </div>

              <div className="form-row">
                <div className={`form-group ${formErrors.phone ? 'error' : ''}`}>
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    maxLength="10"
                    required
                  />
                  {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                </div>

                <div className={`form-group ${formErrors.email ? 'error' : ''}`}>
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={address.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                  />
                  {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                </div>
              </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="form-card">
            <h3>💳 Payment Method</h3>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">💵</span>
                <div className="payment-details">
                  <span className="payment-name">Cash on Delivery</span>
                  <span className="payment-desc">Pay when you receive your order</span>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">💳</span>
                <div className="payment-details">
                  <span className="payment-name">Credit / Debit Card</span>
                  <span className="payment-desc">Pay securely with your card</span>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">📱</span>
                <div className="payment-details">
                  <span className="payment-name">UPI</span>
                  <span className="payment-desc">Google Pay, PhonePe, Paytm</span>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === 'netbanking' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="netbanking"
                  checked={paymentMethod === 'netbanking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">🏦</span>
                <div className="payment-details">
                  <span className="payment-name">Net Banking</span>
                  <span className="payment-desc">All major banks supported</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="order-summary-section">
          <div className="order-summary-card">
            <h3>📋 Order Summary</h3>
            
            <div className="order-items-list">
              {cart.map((item, index) => (
                <div className="order-item" key={item.product || index}>
                  <img
                    src={item.image || 'https://via.placeholder.com/50x50?text=Product'}
                    alt={item.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-qty">Qty: {item.quantity || 1}</span>
                  </div>
                  <span className="order-item-price">
                    ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal ({cart.reduce((sum, i) => sum + (i.quantity || 1), 0)} items)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (12% GST)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <div className="summary-row shipping-note">
                <span>💡 Add ₹{Math.ceil(500 - subtotal)} more for free shipping</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading || cart.length === 0}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Placing Order...
                </>
              ) : (
                `Place Order ₹${total.toFixed(2)}`
              )}
            </button>

            <p className="secure-checkout">
              🔒 Your information is secure and will not be shared
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;