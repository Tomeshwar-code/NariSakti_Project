import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrders, createOrder, getOrder, updateOrder, cancelOrder } from '../../services/orderServices';

const initialState = {
  orders: [],
  currentOrder: null,
  status: 'idle',
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrders();
      return response.data.orders || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'order/fetchOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await getOrder(orderId);
      return response.data.order || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await createOrder(orderData);
      return response.data.order || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const modifyOrder = createAsyncThunk(
  'order/modifyOrder',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateOrder(id, data);
      return response.data.order || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const cancelExistingOrder = createAsyncThunk(
  'order/cancelExistingOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await cancelOrder(orderId);
      return { orderId, message: response.data.message || response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderState(state) {
      state.currentOrder = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(modifyOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(modifyOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(modifyOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(cancelExistingOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(cancelExistingOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = state.orders.map((order) =>
          order._id === action.payload.orderId
            ? { ...order, orderStatus: 'Cancelled' }
            : order
        );
      })
      .addCase(cancelExistingOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
