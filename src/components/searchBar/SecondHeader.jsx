import React, { useState } from "react";
import "./SecondHeader.css"; // Ensure this is the correct path to your CSS file
import { FaBars, FaTimes } from "react-icons/fa";

const SecondHeader = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  // Added "Customer Service" and "Books" to be more Amazon-like
  const menuItems = [
    "Fresh",
    "MX Player", // Keeping this as you had it, though Amazon would have something else
    "Sell",
    "Bestsellers",
    "Today's Deals",
    "Mobiles",
    "New Releases",
    "Electronics",
    "Customer Service",
    "Books",
    "Prime ▾"
  ];

  return (
    // Changed class to 'second-header' to match your CSS block
    <div className="second-header">
      {/* Left Menu */}
      <div className="menu-left">
        {/* Toggle button for ALL and mobile menu */}
        <div className="menu-item all" onClick={() => setMobileMenu(!mobileMenu)}>
          <FaBars className="menu-icon" /> All
        </div>

        {/* Horizontal Menu List (Desktop) / Dropdown Menu (Mobile) */}
        <ul className={`menu-list ${mobileMenu ? "active" : ""}`}>
          {menuItems.map((item, idx) => (
            <li key={idx} className="menu-item">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side Festival Offer */}
      <div className="festival-offer">
        <span role="img" aria-label="lamp">🪔</span>
       <span className="live-now">Live now</span>
      </div>

      {/* Close Button for Mobile Menu (appears when mobileMenu is true) */}
      {mobileMenu && (
        <FaTimes className="close-icon" onClick={() => setMobileMenu(false)} />
      )}
    </div>
  );
};

export default SecondHeader;