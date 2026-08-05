import { createSlice } from '@reduxjs/toolkit';

const cartFromStorage = JSON.parse(localStorage.getItem('cart') || '[]');

const initialState = {
  items: cartFromStorage,
  totalQuantity: cartFromStorage.reduce((sum, item) => sum + (item.quantity || 1), 0),
  totalAmount: cartFromStorage.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
  shippingAddress: null,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const product = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity = Math.min((existingItem.quantity || 1) + 1, product.stock || 99);
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      state.totalQuantity = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.totalQuantity = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find((item) => item._id === productId);
      if (existingItem) {
        existingItem.quantity = Number(quantity);
        state.totalQuantity = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        state.totalAmount = state.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem('cart');
    },
    setShippingAddress(state, action) {
      state.shippingAddress = action.payload;
    },
    setCartError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, setShippingAddress, setCartError } = cartSlice.actions;
export default cartSlice.reducer;
