import React, { useState } from "react";
// Import the Link component from React Router
import { Link } from "react-router-dom";
import "./SecondHeader.css";
// Importing more icons for a richer UI
// 🎯 Import the FaBook icon for the new category
import { FaBars, FaTimes, FaTags, FaStore, FaHandHoldingHeart, FaSmile, FaTools, FaLaptop, FaUser, FaChild, FaShoePrints, FaGem, FaRedo, FaBoxOpen, FaBook } from "react-icons/fa";

const SecondHeader = () => {
    const [mobileMenu, setMobileMenu] = useState(false);

    // Map menu names to their corresponding category IDs and routes
    const menuMap = [
        { name: "Home", icon: FaStore, path: "/" },
        { name: "Fashion", icon: FaTags, id: "HeXWnBOQM2wlEkiDRnDZ", path: "/category/HeXWnBOQM2wlEkiDRnDZ" },
        { name: "Accessories", icon: FaGem, id: "tToIcw0WK8HnmXpb7xwD", path: "/category/tToIcw0WK8HnmXpb7xwD" },
        { name: "Cosmetics", icon: FaSmile, id: "uo5LVD3Yfgu974INYIIM", path: "/category/uo5LVD3Yfgu974INYIIM" },
        { name: "Toys", icon: FaBoxOpen, id: "ifKM8nTFpICFmuHaO0sV", path: "/category/ifKM8nTFpICFmuHaO0sV" },
        { name: "Stationary", icon: FaTools, id: "VeX3PrCKc7tJ4uTEIPCF", path: "/category/VeX3PrCKc7tJ4uTEIPCF" },
        
        // 📚 NEW CATEGORY: Books
        { name: "Book", icon: FaBook, id: "bookId999", path: "/category/bookId999" },
        
        // --- Placeholder IDs for remaining items ---
        { name: "Photo Frame", icon: FaHandHoldingHeart, id: "pfId123", path: "/category/pfId123" },
        { name: "Footwears", icon: FaShoePrints, id: "fwId456", path: "/category/fwId456" },
        { name: "Jewellery", icon: FaGem, id: "jwlId789", path: "/category/jwlId789" },
        { name: "Mens", icon: FaUser, id: "mensId012", path: "/category/mensId012" },
        { name: "Kids", icon: FaChild, id: "kidsId345", path: "/category/kidsId345" },
        { name: "Electronics", icon: FaLaptop, id: "elecId678", path: "/category/elecId678" },
        { name: "Personal Care", icon: FaRedo, id: "pcId901", path: "/category/pcId901" },
        
        // --- Special Links ---
        { name: "Customer Service", icon: FaTimes, path: "/support" }
    ];

    const toggleMenu = () => {
        setMobileMenu(!mobileMenu);
    };

    return (
        <div className="second-header-wrapper">
            {/* The fixed block wrapper is often rendered outside, but let's assume it's here for context */}
            <div className="second-header">
                {/* Left Menu */}
                <div className="menu-left">
                    {/* "All" button/Mobile Toggle */}
                    <div className="menu-item all" onClick={toggleMenu}>
                        <FaBars className="menu-icon" /> ALL CATEGORIES
                    </div>

                    {/* Menu List */}
                    {/* The menu is only active on mobile when the state is true */}
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