import React, { useState } from "react";
// Import the Link component from React Router
import { Link } from "react-router-dom";
import "./SecondHeader.css";
// Importing more icons for a richer UI
import { FaBars, FaTimes, FaTags, FaStore, FaHandHoldingHeart, FaSmile, FaTools, FaLaptop, FaUser, FaChild, FaShoePrints, FaGem, FaRedo, FaBoxOpen, FaBook } from "react-icons/fa";

const SecondHeader = () => {
    const [mobileMenu, setMobileMenu] = useState(false);

    // Map menu names to their corresponding category IDs and routes
    const menuMap = [
        { name: "Home", icon: FaStore, path: "/" },
        { name: "Fashion", icon: FaTags, path: "/fashion" },
        { name: "Accessories", icon: FaGem, path: "/accessories" },
        { name: "Cosmetics", icon: FaSmile, path: "/cosmetics" },
        { name: "Toys", icon: FaBoxOpen, path: "/toys" },
        { name: "Stationary", icon: FaTools, path: "/Stationary" },
        { name: "Book", icon: FaBook, path: "/book" },
        { name: "Photo Frame", icon: FaHandHoldingHeart, path: "/photoframe" },
        { name: "Footwears", icon: FaShoePrints, path: "/footwears" },
        { name: "Jewellery", icon: FaGem, path: "/jewellery" },
        { name: "Mens", icon: FaUser, path: "/mens" },
        { name: "Kids", icon: FaChild, path: "/kids" },
        { name: "Electronics", icon: FaLaptop, path: "/electronics" },
        { name: "Personal Care", icon: FaRedo, path: "/personalcare" },
        { name: "Customer Service", icon: FaTimes, path: "/support" }
    ];

    const toggleMenu = () => {
        setMobileMenu(!mobileMenu);
    };

    return (
        <div className="second-header-wrapper">
            <div className="second-header">
                {/* Left Menu */}
                <div className="menu-left">
                    {/* "All" button/Mobile Toggle */}
                    <div className="menu-item all" onClick={toggleMenu}>
                        <FaBars className="menu-icon" /> ALL CATEGORIES
                    </div>

                    {/* Menu List */}
                    <ul className={`menu-list ${mobileMenu ? "active" : ""}`}>
                        {menuMap.map((item, idx) => (
                            <li
                                key={idx}
                                className="menu-item category-link-item"
                                // Close the mobile menu when an item is clicked
                                onClick={mobileMenu ? toggleMenu : undefined}
                            >
                                <Link to={item.path} className="menu-link-custom">
                                    {/* Optional: Add icon only for mobile dropdown */}
                                    {mobileMenu && item.icon && <item.icon className="menu-item-mobile-icon" />}
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Side Festival Offer */}
                <div className="festival-offer">
                    MEGA SALE <span className="live-now">LIVE NOW!</span>
                </div>

                {/* Close Button for Mobile Menu */}
                {mobileMenu && (
                    <FaTimes className="close-icon" onClick={toggleMenu} />
                )}
            </div>
        </div>
    );
};

export default SecondHeader;