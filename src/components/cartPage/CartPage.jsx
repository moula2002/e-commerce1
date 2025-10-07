import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/cartSlice";
import CartItems from "./CartItems";
import EmptyCart from "./EmptyCart";
import "./CartPage.css";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || []);

  const handleIncrease = (item) => dispatch(addToCart({ ...item, quantity: 1 }));
  const handleDecrease = (item) => dispatch(removeFromCart({ id: item.id, quantity: 1 }));
  const handleRemove = (item) => dispatch(removeFromCart({ id: item.id }));

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

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
        <h3>Total: {formatPrice(totalPrice)}</h3>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;
