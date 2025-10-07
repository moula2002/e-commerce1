import React from "react";
import "./CartPage.css";
import cartImage from "../../assets/cart/cartimage.png";
import { IoArrowBackOutline } from "react-icons/io5"; // Import back arrow icon

const EmptyCart = () => {
  const handleBack = () => {
    window.history.back(); // Go to previous page
  };

  return (
    <>
    <div className="cart-page">
     
      {/* Header */}
    
      <div className="cart-header" >
        <button className="back-button" onClick={handleBack} >
              <h3>My Cart</h3>
          <IoArrowBackOutline size={22} />
        </button>
        
      </div>

      {/* Empty Cart Content */}
      <div className="cart-empty-container">
        <div className="cart-empty-image">
          <img src={cartImage} alt="Empty Cart" />
        </div>

        <h2>Your Cart is empty</h2>
        <p className="shop-deals">Shop today’s deals</p>

        <div className="cart-empty-buttons">
          <button className="signin-btn">Sign in</button>
          <button className="signup-btn">Sign up</button>
        </div>

        <p className="cart-empty-footer">
          The price and availability of items are subject to change. The shopping
          cart is a temporary place to store a list of your items and reflects
          each item's most recent price.
        </p>
      </div>
    </div>
    </>
  );
};

export default EmptyCart;
