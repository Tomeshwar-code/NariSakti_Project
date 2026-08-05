import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const navigate = useNavigate();

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
