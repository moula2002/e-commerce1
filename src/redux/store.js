import { configureStore } from "@reduxjs/toolkit";
// Assuming you have these slice reducers defined elsewhere
import cartReducer from "./cartSlice";
import footerReducer from "./footerSlice";

// 🧩 Header slice definition using plain Redux pattern (as per your original code)
const initialHeader = { location: "Bengaluru", cartCount: 0 };

const headerSlice = {
  name: "header",
  initialState: initialHeader,
  // Define simple action creators that return the action object
  reducers: {
    setLocation: (state, action) => ({
      // Redux Toolkit's createSlice usually handles immutability, 
      // but since we are manually defining the reducer below, 
      // we'll keep the action creator simple.
      type: "header/setLocation",
      payload: action.payload,
    }),
    setCartCount: (state, action) => ({
      type: "header/setCartCount",
      payload: action.payload,
    }),
  },
};

// --- Custom Header Reducer Function ---
// This manual function is required because we didn't use Redux Toolkit's createSlice
const headerReducer = (state = initialHeader, action) => {
  switch (action.type) {
    case "header/setLocation":
      return { ...state, location: action.payload };
    case "header/setCartCount":
      return { ...state, cartCount: action.payload };
    default:
      return state;
  }
};


// 🗂️ Export action creators
// We extract the functions defined in the reducers object
export const { setLocation, setCartCount } = headerSlice.reducers;

// 🏪 Configure the store — combine everything here
export const store = configureStore({
  reducer: {
    // Other reducers
    cart: cartReducer,
    footer: footerReducer,
    
    // Header reducer is now a separate function imported here
    header: headerReducer, 
  },
});

export default store;
