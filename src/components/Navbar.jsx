import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// Bootstrap components
import { Navbar, Nav, Container, Button, Modal, Form } from "react-bootstrap";
// Animation library
import { motion } from "framer-motion";
// Redux actions
import { setLocation } from "../redux/store";
// Components
import AuthPage from "../pages/LoginPage";
import SecondHeader from "./searchBar/SecondHeader"; // SecondHeader component is imported here
import "./Navbar.css"; // Main Navbar styles

// Firebase imports for search and auth
import { db } from "../firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const auth = getAuth(); // Initialize Firebase Auth

// ⭐ Function to fetch search suggestions (Unchanged from your logic)
const fetchSuggestions = async (searchText) => {
    if (!searchText || searchText.trim().length < 2) return [];

    const lowerCaseSearch = searchText.trim().toLowerCase();
    const productsRef = collection(db, "products");
    
    // Query ALL products (inefficient for very large data, but matches current implementation)
    const q = query(productsRef); 

    try {
        const snapshot = await getDocs(q);
        let suggestionsMap = new Map();

        snapshot.docs.forEach(doc => {
            const productData = doc.data();
            const productId = doc.id;
            
            const productName = productData.name;
            if (!productName) return; 

            // 1. Direct Name Match
            if (productName.toLowerCase().startsWith(lowerCaseSearch)) {
                 suggestionsMap.set(productName, productId);
            }

            // 2. Keyword Match
            if (productData.searchkeywords && Array.isArray(productData.searchkeywords)) {
                productData.searchkeywords.forEach(keyword => {
                    if (keyword && keyword.toLowerCase().startsWith(lowerCaseSearch)) {
                        suggestionsMap.set(productName, productId); 
                    }
                });
            }
        });

        // Convert Map to an array of suggestions
        return Array.from(suggestionsMap).map(([name, id]) => ({
            id: id,
            name: name
        }));

    } catch (error) {
        console.error("Error fetching search suggestions:", error);
        return [];
    }
};


export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchBarRef = useRef(null); 

    const { location } = useSelector((state) => state.header);
    const cartItems = useSelector((state) => state.cart?.items || []);
    const cartCount = cartItems.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
    );

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [newLocation, setNewLocation] = useState(location || "");
    const [search, setSearch] = useState("");
    
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Auth state for conditional rendering
    const [currentUser, setCurrentUser] = useState(null); 
    
    // Auth State Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        
        return () => unsubscribe();
    }, []);

    // Logout Handler
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setShowAuthModal(false); 
            navigate("/"); 
            alert("You have been successfully logged out!");
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Failed to log out. Please try again.");
        }
    };

    const openAuthModal = () => setShowAuthModal(true);
    const closeAuthModal = () => setShowAuthModal(false);

    const openLocationModal = () => {
        setNewLocation(location || "");
        setShowLocationModal(true);
    };
    const closeLocationModal = () => setShowLocationModal(false);

    const saveLocation = () => {
        if (newLocation.trim() !== "") {
            dispatch(setLocation(newLocation));
            closeLocationModal();
        }
    };

    const goToCart = () => navigate("/cart");
    
    // Debounced Search Suggestions
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (search.trim().length > 1) {
                const fetchedSuggestions = await fetchSuggestions(search.trim());
                setSuggestions(fetchedSuggestions);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);
    
    // Suggestion Click Handler
    const handleSuggestionClick = (product) => {
        setSearch(product.name); 
        setShowSuggestions(false);
        navigate(`/product/${product.id}`); 
    };
    
    // Search Submit Handler
    const handleSearchSubmit = () => {
        if (search.trim()) {
            setShowSuggestions(false);
            navigate(`/search-results?q=${encodeURIComponent(search.trim())}`);
        }
    };

    // Enter Key Handler
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            handleSearchSubmit();
        }
    };

    // Hide suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <>
            {/* -------------------- MAIN NAVBAR (WHITE BACKGROUND) -------------------- */}
            <Navbar
                expand="lg"
                className="navbar-custom shadow-sm sticky-top"
                variant="light" // Changed to light for white background
            >
                <Container fluid className="px-3">
                    {/* Logo (Used 'shopclues-logo' class for the Shopclues-like look) */}
                    <motion.div
                        className="d-flex align-items-center brand-container"
                        initial={{ opacity: 0, x: -50 }} 
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Navbar.Brand
                            href="/"
                            className="shopclues-logo d-flex align-items-center"
                        >
                            {/* Original Logo (hidden by CSS) */}
                            <img src="./Sadhanacart1.png" alt="SadhanaCart Logo" className="footer-logo-img me-2" />
                            <span className="brand-text">Sadhana
                                <span style={{color:"orangered"}}>Cart</span></span> {/* Changed text for look */}
                        </Navbar.Brand>
                    </motion.div>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                    <Navbar.Collapse id="responsive-navbar-nav">
                        {/* Search Bar is centered and prominent */}
                        <Nav className="mx-auto align-items-center flex-grow-1"> 
                            <motion.div
                                ref={searchBarRef}
                                className="search-bar-container my-2 my-lg-0 position-relative w-100" 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                style={{ transformOrigin: 'center' }}
                            >
                                <Form className="d-flex search-form">
                                    <Form.Control
                                        type="search"
                                        placeholder="What is on your mind today?" // Shopclues-like placeholder
                                        className="search-input" 
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onFocus={() => {
                                            if(suggestions.length > 0 && search.trim().length > 1) setShowSuggestions(true);
                                        }}
                                        onKeyDown={handleKeyPress}
                                    />
                                    <motion.div whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="warning"
                                            className="search-btn"
                                            onClick={handleSearchSubmit}
                                        >
                                            <i className="fas fa-search d-lg-none"></i>
                                            <span className="d-none d-lg-block">Search</span>
                                        </Button>
                                    </motion.div>
                                </Form>
                                
                                {/* Search Suggestions Dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <motion.div 
                                        className="suggestions-dropdown p-0 bg-white shadow rounded-bottom border border-top-0"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <ul className="list-unstyled mb-0">
                                            {suggestions.map((product) => (
                                                <li 
                                                    key={product.id} 
                                                    className="suggestion-item" 
                                                    onClick={() => handleSuggestionClick(product)}
                                                    tabIndex={0} 
                                                >
                                                    {product.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </motion.div>
                        </Nav>
                        
                        {/* Right Side Icons/Links */}
                        <Nav className="align-items-center ms-lg-3">
                            {/* Location */}
                            <motion.div
                                className="location me-3 d-none d-lg-flex"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={openLocationModal}
                            >
                                <i className="fas fa-map-marker-alt me-1"></i>
                                Share <br/> Location
                            </motion.div>

                            {/* --- Account/Logout Conditional Rendering --- */}
                            {currentUser ? (
                                // Logged In: Show Logout Button/Icon
                                <>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="d-none d-lg-block">
                                        <Button variant="outline-dark" className="me-2 account-button" onClick={handleLogout}>
                                            <i className="fas fa-sign-out-alt"></i> Logout
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="d-lg-none">
                                        <Button variant="outline-dark" className="me-2 account-button" onClick={handleLogout} title="Logout">
                                            <i className="fas fa-sign-out-alt"></i>
                                        </Button>
                                    </motion.div>
                                </>
                            ) : (
                                // Logged Out: Show Account/Login Button/Icon
                                <>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="d-none d-lg-block">
                                        <Button variant="outline-dark" className="me-2 account-button" onClick={openAuthModal}>
                                            <i className="fas fa-user me-1"></i> Sign In
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="d-lg-none">
                                        <Button variant="outline-dark" className="me-2 account-button" onClick={openAuthModal}>
                                            <i className="fas fa-user"></i>
                                        </Button>
                                    </motion.div>
                                </>
                            )}
                            {/* ------------------------------------------------ */}

                            {/* Cart */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline-dark" className="cart-button" onClick={goToCart}>
                                    <i className="fas fa-shopping-cart"></i> 
                                    <span className="d-none d-lg-inline">Cart </span>
                                    <span className="cart-count">{cartCount}</span>
                                </Button>
                            </motion.div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* -------------------- SECOND HEADER (TEAL BACKGROUND) -------------------- */}
            <SecondHeader />

            {/* Auth Modal */}
            <Modal show={showAuthModal} onHide={closeAuthModal} centered>
                <Modal.Body>
                    <AuthPage onClose={closeAuthModal} />
                </Modal.Body>
            </Modal>
            
            {/* Location Modal */}
            <Modal
                show={showLocationModal}
                onHide={closeLocationModal}
                centered
                backdrop="static"
                className="location-modal"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Set Delivery Location 📍</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Enter your location:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Eg: Chennai, Tamil Nadu"
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeLocationModal}>
                            Cancel
                        </Button>
                        <Button variant="warning" onClick={saveLocation}>
                            Save Location
                        </Button>
                    </Modal.Footer>
                </motion.div>
            </Modal>
        </>
    );
}