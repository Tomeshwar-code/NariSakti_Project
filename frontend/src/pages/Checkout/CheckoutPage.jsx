import React, { useState } from 'react';
import { createOrder } from '../../services/orderServices';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const items = cart.map(i => ({ product: i.product, quantity: i.quantity }));
      const orderData = {
        items,
        shippingAddress: address,
        paymentMethod: 'cod'
      };
      const res = await createOrder(orderData);
      localStorage.removeItem('cart');
      navigate(`/orders`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Unable to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <div>
        <label>Street</label>
        <input value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
        <label>City</label>
        <input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
        <label>State</label>
        <input value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
        <label>Pincode</label>
        <input value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
      </div>
      <button onClick={handlePlaceOrder} disabled={loading}>Place Order</button>
    </div>
  );
};

export default CheckoutPage;
