import React from "react";
import "./CartPage.css";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        <p>{formatPrice(item.price)}</p>
        <div className="cart-item-quantity">
          <button onClick={() => onDecrease(item)} disabled={item.quantity <= 1}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => onIncrease(item)}>+</button>
        </div>
      </div>
      <button className="cart-item-remove" onClick={() => onRemove(item)}>Remove</button>
    </div>
  );
};

export default CartItem;
