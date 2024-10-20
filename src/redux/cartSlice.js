import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    favorites: [],
    pinnedItems: []
  },
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleFavorite: (state, action) => {
      const index = state.favorites.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
    },
    togglePinned: (state, action) => {
      const index = state.pinnedItems.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.pinnedItems.splice(index, 1);
      } else {
        state.pinnedItems.push(action.payload);
      }
    }
  }
});

export const { addToCart, removeFromCart, clearCart, toggleFavorite, togglePinned } = cartSlice.actions;
export default cartSlice.reducer;