import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProducts } from '../../services/productServices';
import { getOrders } from '../../services/orderServices';

const initialState = {
  products: [],
  orders: [],
  dashboardStats: {
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
  },
  status: 'idle',
  error: null,
};

export const fetchSellerProducts = createAsyncThunk(
  'seller/fetchSellerProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProducts();
      return response.data.products || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSellerOrders = createAsyncThunk(
  'seller/fetchSellerOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrders();
      return response.data.orders || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    clearSellerState(state) {
      state.products = [];
      state.orders = [];
      state.dashboardStats = { totalSales: 0, totalOrders: 0, totalProducts: 0 };
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchSellerOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearSellerState } = sellerSlice.actions;
export default sellerSlice.reducer;
