import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  }, []);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map(item => (
            <li key={item.product}>{item.name} x {item.quantity} - ₹{item.price}</li>
          ))}
        </ul>
      )}
      <button onClick={handleCheckout} disabled={cart.length === 0}>Proceed to Checkout</button>
    </div>
  );
};

export default CartPage;
