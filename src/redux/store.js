import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import footerReducer from "./footerSlice";
import productReducer from "./productSlice"; 

// 🧩 Header slice (your existing one)
const initialHeader = { location: "Bengaluru", cartCount: 0 };

const headerSlice = {
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
};

// Export header actions
export const { setLocation, setCartCount } = headerSlice.reducers;

// 🏪 Configure the store — combine everything here
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    footer: footerReducer,
    products: productReducer, // 👈 new
    header: (state = initialHeader, action) => {
      switch (action.type) {
        case "header/setLocation":
          return { ...state, location: action.payload };
        case "header/setCartCount":
          return { ...state, cartCount: action.payload };
        default:
          return state;
      }
    },
  },
});

export default store;
