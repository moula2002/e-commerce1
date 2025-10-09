// src/components/Cart/CartItems.jsx

import React from 'react';

const CartItems = ({ items, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="cart-items-list">
      {items.map((item) => (
        <div key={item.id} className="cart-item-card">
          <img src={item.image} alt={item.title} className="cart-item-image" />
          <div className="cart-item-details">
            <h4 className="cart-item-title">{item.title}</h4>
            <p className="cart-item-price">₹{item.price.toFixed(0)}</p>
          </div>
          <div className="cart-item-controls">
            <div className="quantity-controls">
              <button onClick={() => onDecrease(item)} disabled={item.quantity <= 1}>-</button>
              <span className="item-quantity">{item.quantity}</span>
              <button onClick={() => onIncrease(item)}>+</button>
            </div>
            <p className="cart-item-subtotal">Subtotal: ₹{(item.price * item.quantity).toFixed(0)}</p>
            <button className="remove-btn" onClick={() => onRemove(item)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItems;