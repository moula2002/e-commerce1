import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    // Add product to cart or increase quantity
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        // Increase quantity of existing item
        existingItem.quantity += newItem.quantity || 1;
      } else {
        // Add new item
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1, // Ensure quantity is set, default to 1
        });
      }
    },

    // Remove product or decrease quantity
    removeFromCart: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        if (quantity && existingItem.quantity > quantity) {
          // Decrease quantity
          existingItem.quantity -= quantity;
        } else {
          // Remove the item completely (if no quantity is specified, or quantity would drop to 0 or less)
          state.items = state.items.filter(item => item.id !== id);
        }
      }
    },

    // Optional: Clear the entire cart
    clearCart: (state) => {
      state.items = [];
    }
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;