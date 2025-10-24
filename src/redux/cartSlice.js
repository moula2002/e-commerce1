// src/redux/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

// 🧠 Helper function to load cart from localStorage
const loadCartFromStorage = () => {
    try {
        const serializedState = localStorage.getItem("cartItems");
        if (serializedState === null) {
            return []; // Return empty array if no cart is saved
        }
        return JSON.parse(serializedState);
    } catch (e) {
        console.warn("Could not load cart from storage", e);
        return [];
    }
};

// 💾 Helper function to save cart to localStorage
const saveCartToStorage = (items) => {
    try {
        const serializedState = JSON.stringify(items);
        localStorage.setItem("cartItems", serializedState);
    } catch (e) {
        console.error("Could not save cart to storage", e);
    }
};

const initialState = {
    items: loadCartFromStorage(), // Restore cart from storage
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

            saveCartToStorage(state.items); // 💾 Save updated cart
        },

        removeFromCart: (state, action) => {
            // This is typically used to remove the *entire* item regardless of quantity
            state.items = state.items.filter((item) => item.id !== action.payload.id);

            saveCartToStorage(state.items); // 💾 Save updated cart
        },
        
        increaseQuantity: (state, action, stock) => {
            if(stock <= 0){

                const item = state.items.find(item => item.id === action.payload.id);
                if (item) {
                    item.quantity++;
                }
            }
            saveCartToStorage(state.items); // 💾 Save updated cart
        },
        
        decreaseQuantity: (state, action) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item && item.quantity > 1) {
                item.quantity--;
            } else if (item && item.quantity === 1) {
                // Remove item if quantity drops to zero
                state.items = state.items.filter(i => i.id !== action.payload.id);
            }
            saveCartToStorage(state.items); // 💾 Save updated cart
        },

        // ✅ The key logic for order confirmation
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem("cartItems"); // 💾 Clear from localStorage
        },
    },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;