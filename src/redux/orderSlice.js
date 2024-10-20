import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const submitCustomOrder = createAsyncThunk(
  'order/submitCustomOrder',
  async (formData, { rejectWithValue }) => {
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        proposedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: Math.floor(Math.random() * 50000) + 10000
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    customOrders: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitCustomOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitCustomOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customOrders.push(action.payload);
      })
      .addCase(submitCustomOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;