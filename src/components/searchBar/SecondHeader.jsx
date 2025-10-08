import React, { useState } from "react";
// 💥 IMPORT LINK: Import the Link component from React Router
import { Link } from "react-router-dom"; 
import "./SecondHeader.css"; 
import { FaBars, FaTimes } from "react-icons/fa";

const SecondHeader = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

 
  const menuItems = [
    "Fresh",
    "Sell",
    "Bestsellers",
    "Today's Deals",
    "Mobiles",
    "New Releases",
    "Electronics",
    // 💥 The item we want to be clickable
    "Customer Service", 
    "Books",
    "Prime ▾"
  ];

  return (
    <div className="second-header">
      {/* Left Menu */}
      <div className="menu-left">
        <div className="menu-item all" onClick={() => setMobileMenu(!mobileMenu)}>
          <FaBars className="menu-icon" /> All
        </div>

        <ul className={`menu-list ${mobileMenu ? "active" : ""}`}>
          {menuItems.map((item, idx) => (
            // 💥 CONDITIONAL RENDERING: Check if the item is "Customer Service"
            <li key={idx} className="menu-item">
              {item === "Customer Service" ? (
                // If it is "Customer Service", render a React Router Link
                <Link to="/support" className="menu-link-custom">
                  {item}
                </Link>
              ) : (
                // Otherwise, render the plain text
                item
              )}
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