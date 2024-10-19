import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async () => {
    // Remplacez ceci par votre véritable appel API
    const response = await fetch('/api/products');
    const data = await response.json();
    return data;
  }
);

const initialState = {
  products: [],
  favorites: [],
  pins: [],
  cart: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    toggleFavorite: (state, action) => {
      const productId = action.payload;
      const index = state.favorites.indexOf(productId);
      if (index !== -1) {
        state.favorites = state.favorites.filter(id => id !== productId);
      } else {
        state.favorites.push(productId);
      }
    },
    togglePin: (state, action) => {
      const productId = action.payload;
      const index = state.pins.indexOf(productId);
      if (index !== -1) {
        state.pins = state.pins.filter(id => id !== productId);
      } else {
        state.pins.push(productId);
      }
    },
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
    updateCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find(item => item.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { 
  setProducts, 
  toggleFavorite, 
  togglePin, 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity,
  clearCart
} = productSlice.actions;

export default productSlice.reducer;