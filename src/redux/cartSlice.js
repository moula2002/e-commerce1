import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      if (!item?.id) return;

      const existingItem = state.items.find((i) => i.id === item.id);
      const quantityToAdd = item.quantity || 1;

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + quantityToAdd;
      } else {
        state.items.push({ ...item, quantity: quantityToAdd });
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload?.id || action.payload;
      const quantityToRemove = action.payload?.quantity || 1;

      const existingItem = state.items.find((i) => i.id === id);
      if (!existingItem) return;

      if (existingItem.quantity > quantityToRemove) {
        existingItem.quantity -= quantityToRemove;
      } else {
        state.items = state.items.filter((i) => i.id !== id);
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
