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
      // quantity is taken from the item payload, defaulting to 1 if not present
      const quantityToAdd = item.quantity || 1; 

      if (existingItem) {
        // Increment quantity of existing item
        existingItem.quantity = (existingItem.quantity || 1) + quantityToAdd;
      } else {
        // Add new item to the cart
        state.items.push({ ...item, quantity: quantityToAdd });
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload?.id || action.payload;
      const quantityToRemove = action.payload?.quantity || 1;

      const existingItem = state.items.find((i) => i.id === id);
      if (!existingItem) return;

      if (existingItem.quantity > quantityToRemove) {
        // Decrement quantity
        existingItem.quantity -= quantityToRemove;
      } else {
        // Remove item entirely if quantity is less than or equal to quantityToRemove
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