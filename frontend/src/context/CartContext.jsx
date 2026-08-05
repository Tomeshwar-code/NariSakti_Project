import React, { createContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]'));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems((prev) => {
      const found = prev.find((p) => p._id === product._id);
      if (found) {
        return prev.map((p) => (p._id === product._id ? { ...p, quantity: (p.quantity || 1) + 1 } : p));
      }
      return [{ ...product, quantity: 1 }, ...prev];
    });
  };

  const removeItem = (productId) => setItems((prev) => prev.filter((p) => p._id !== productId));

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, setItems, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
