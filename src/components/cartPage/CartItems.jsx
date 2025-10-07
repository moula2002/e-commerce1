import React from "react";
import CartItem from "./CartItem";

const CartItems = ({ items, onIncrease, onDecrease, onRemove }) => (
  <div className="cart-items">
    {items.map((item) => (
      <CartItem
        key={item.id}
        item={item}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
      />
    ))}
  </div>
);

export default CartItems;
