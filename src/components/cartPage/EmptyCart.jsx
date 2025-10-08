import React from "react";
import "./CartPage.css"; 
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const EMPTY_CART_IMAGE_URL = "https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png"; 

const EmptyCart = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="back-button" onClick={handleBack}>
          <IoArrowBackOutline size={22} style={{ marginRight: '8px' }} />
          <h3 style={{color:"whitesmoke"}}>My Cart</h3>
        </button>
      </div>

      <div className="cart-empty-container">
        <div className="cart-empty-image">

          <img src={EMPTY_CART_IMAGE_URL} alt="Empty Cart" />
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
  );
};

export default EmptyCart;