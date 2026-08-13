// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const CartPage = () => {
//   const [cart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
//   const navigate = useNavigate();

//   const handleCheckout = () => {
//     navigate('/checkout');
//   };

//   return (
//     <div>
//       <h2>Your Cart</h2>
//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <ul>
//           {cart.map(item => (
//             <li key={item.product}>{item.name} x {item.quantity} - ₹{item.price}</li>
//           ))}
//         </ul>
//       )}
//       <button onClick={handleCheckout} disabled={cart.length === 0}>Proceed to Checkout</button>
//     </div>
//   );
// };

// export default CartPage;
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ---------- Cart Operations ----------
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return removeItem(productId);
    setCart(prev =>
      prev.map(item =>
        item.product === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeItem = (productId) => {
    setCart(prev => prev.filter(item => item.product !== productId));
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCart([]);
      setDiscount(0);
      setCouponCode('');
    }
  };

  // ---------- Coupon Logic (Demo) ----------
  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'SAVE10') {
      setDiscount(0.1); // 10% off
      setCouponError('');
    } else if (couponCode.trim() === '') {
      setCouponError('Please enter a coupon code.');
    } else {
      setCouponError('Invalid coupon code. Try "SAVE10".');
      setDiscount(0);
    }
  };

  // ---------- Totals ----------
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const tax = useMemo(() => subtotal * 0.12, [subtotal]); // 12% GST
  const shipping = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0; // Free shipping above ₹500
  const discountAmount = discount * subtotal;
  const total = subtotal + tax + shipping - discountAmount;

  // ---------- Checkout ----------
  const handleCheckout = () => {
    navigate('/checkout', { state: { cart, total } });
  };

  // ---------- Render ----------
  return (
    <div className="cart-page">
      <div className="cart-header">
        <h2>🛒 Your Cart</h2>
        {cart.length > 0 && (
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <span className="empty-icon">🛍️</span>
          <p>Your cart is empty.</p>
          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          {/* Left: Items */}
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.product}>
                <img
                  src={item.image || 'https://via.placeholder.com/80x80?text=Product'}
                  alt={item.name}
                  className="item-image"
                />
                <div className="item-details">
                  <Link to={`/product/${item.product}`} className="item-name">
                    {item.name}
                  </Link>
                  <div className="item-price">₹{item.price.toFixed(2)}</div>
                </div>
                <div className="item-actions">
                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="item-subtotal">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.product)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (12%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Discount (10%)</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            {/* Coupon Section */}
            <div className="coupon-section">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={applyCoupon}>Apply</button>
              {couponError && <div className="coupon-error">{couponError}</div>}
              {discount > 0 && (
                <div className="coupon-success">✅ Coupon applied!</div>
              )}
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;