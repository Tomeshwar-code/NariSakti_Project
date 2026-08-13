// import React, { createContext, useState, useEffect } from 'react';
// import { STORAGE_KEYS } from '../constants/storageKeys';

// export const CartContext = createContext(null);

// export function CartProvider({ children }) {
//   const [items, setItems] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]'));

//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
//   }, [items]);

//   const addItem = (product) => {
//     setItems((prev) => {
//       const found = prev.find((p) => p._id === product._id);
//       if (found) {
//         return prev.map((p) => (p._id === product._id ? { ...p, quantity: (p.quantity || 1) + 1 } : p));
//       }
//       return [{ ...product, quantity: 1 }, ...prev];
//     });
//   };

//   const removeItem = (productId) => setItems((prev) => prev.filter((p) => p._id !== productId));

//   const clearCart = () => setItems([]);

//   return (
//     <CartContext.Provider value={{ items, setItems, addItem, removeItem, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// }
// CartContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  }, [items]);

  // ----- Item operations -----
  const addItem = useCallback((product) => {
    setItems(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [{ ...product, quantity: 1 }, ...prev];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(item => item._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    setItems(prev =>
      prev.map(item =>
        item._id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  }, []);

  const incrementItem = useCallback((productId) => {
    setItems(prev =>
      prev.map(item =>
        item._id === productId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  }, []);

  const decrementItem = useCallback((productId) => {
    setItems(prev =>
      prev
        .map(item =>
          item._id === productId
            ? { ...item, quantity: Math.max(0, (item.quantity || 1) - 1) }
            : item
        )
        .filter(item => item.quantity > 0) // remove if quantity drops to 0
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  // ----- Derived state -----
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      ),
    [items]
  );

  const value = {
    items,
    setItems,
    addItem,
    removeItem,
    updateQuantity,
    incrementItem,
    decrementItem,
    clearCart,
    totalItems,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for consuming the context safely
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};