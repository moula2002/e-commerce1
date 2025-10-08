import React from "react";
import "./CartPage.css"; // Assuming CSS is correctly linked

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  // item.title is used as the name in ProductDetailPage, so we use it here.
  const name = item.title; 
    
  // Price formatting function
  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

  return (
    <div className="cart-item">
      <img src={item.image} alt={name} className="cart-item-image" />
      <div className="cart-item-info">
        <h4>{name}</h4>
        <p>{formatPrice(item.price)}</p>
        <div className="cart-item-quantity">
          <button onClick={() => onDecrease(item)} disabled={item.quantity <= 1}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => onIncrease(item)}>+</button>
        </div>
      </div>
      {/* Remove button logic remains the same */}
      <button className="cart-item-remove" onClick={() => onRemove(item)}>Remove</button>
    </div>
  );
};

export default CartItem;