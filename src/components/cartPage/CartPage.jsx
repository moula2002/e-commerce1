import React from "react";
// 💥 Import useSelector to get state and useDispatch to dispatch actions
import { useSelector, useDispatch } from "react-redux";
// 💥 Import actions from cartSlice
import { addToCart, removeFromCart } from "../redux/cartSlice"; 
import CartItems from "../components/Cart/CartItems";
import EmptyCart from "../components/Cart/EmptyCart";
import "./CartPage.css"; // Assuming CSS is correctly linked

const CartPage = () => {
  const dispatch = useDispatch();
  // 💥 Select cart items from Redux state
  const cartItems = useSelector((state) => state.cart.items || []);

  // Handlers to dispatch actions
  const handleIncrease = (item) => dispatch(addToCart({ ...item, quantity: 1 }));
  const handleDecrease = (item) => dispatch(removeFromCart({ id: item.id, quantity: 1 }));
  const handleRemove = (item) => dispatch(removeFromCart({ id: item.id }));

  // Calculate total price. Note: item.price is the INR price calculated in ProductDetailPage.
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Price formatting function
  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

  // Show EmptyCart component if no items are present
  if (!cartItems.length) return <EmptyCart />;

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      <CartItems
        items={cartItems}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
      />

      <div className="cart-summary">
        {/* Total is displayed in INR */}
        <h3>Total: {formatPrice(totalPrice)}</h3>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;