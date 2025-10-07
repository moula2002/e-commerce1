import { configureStore, createSlice } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import footerReducer from "./footerSlice"; // ✅ added footer slice

// ----------------------
// Header slice
// ----------------------
const initialHeader = { location: "Bengaluru", cartCount: 0 };

const headerSlice = createSlice({
  name: "header",
  initialState: initialHeader,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
  },
});

export const { setLocation, setCartCount } = headerSlice.actions;

// ----------------------
// Store configuration
// ----------------------
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    header: headerSlice.reducer,
    footer: footerReducer, // ✅ footer added here
  },
});

export default store;
