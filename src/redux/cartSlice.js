// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

// 🧠 Load from localStorage when app starts
const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

const initialState = {
  items: savedCart, // Restore cart from storage
};

// 🛒 Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.items.push({ ...newItem, quantity: newItem.quantity || 1 });
      }

      // 💾 Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        if (quantity && existingItem.quantity > 1) {
          existingItem.quantity -= quantity;
        } else {
          state.items = state.items.filter((item) => item.id !== id);
        }
      }

      // 💾 Save updated cart
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
