import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, Modal, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { setLocation } from "../redux/store";
import AuthPage from "../pages/LoginPage";
import SecondHeader from "./searchBar/SecondHeader";
import "./Navbar.css";
// தேவையான அனைத்து Firebase ஃபங்ஷன்களும் இறக்குமதி செய்யப்பட்டுள்ளன
import { db } from "../firebase";
import { collection, query, getDocs } from "firebase/firestore";
// ✅ Firebase Auth imports
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; 

const auth = getAuth(); // Initialize Firebase Auth

// ⭐ மாற்றப்பட்ட ஃபங்ஷன்: எந்த Category-க்கான வடிகட்டியும் இல்லாமல், அனைத்து தயாரிப்புகளின் searchkeywords-ஐ மீட்டெடுக்க
const fetchSuggestions = async (searchText) => {
    if (!searchText || searchText.trim().length < 2) return [];

    const lowerCaseSearch = searchText.trim().toLowerCase();
    const productsRef = collection(db, "products");
    
    // 🔥 No `where` clause means it fetches ALL products (less efficient for large data)
    const q = query(productsRef); 

    try {
        const snapshot = await getDocs(q);
        let suggestionsMap = new Map(); // தனித்துவமான product பெயர்கள் மற்றும் அவற்றின் IDs-ஐ சேமிக்க

        snapshot.docs.forEach(doc => {
            const productData = doc.data();
            const productId = doc.id;
            
            const productName = productData.name;
            if (!productName) return; 

            // 1. தயாரிப்பின் பெயரைக் கொண்டே தேடல் ஆரம்பிக்கிறதா என்று பார்ப்பது (Direct Name Match)
            if (productName.toLowerCase().startsWith(lowerCaseSearch)) {
                 suggestionsMap.set(productName, productId);
            }

            // 2. searchkeywords-ஐப் பயன்படுத்தி தேடுதல் (Keyword Match)
            if (productData.searchkeywords && Array.isArray(productData.searchkeywords)) {
                productData.searchkeywords.forEach(keyword => {
                    // தேடல் வார்த்தை keyword-இல் ஆரம்பித்தால், அந்தப் பொருளை ஆலோசனையாகச் சேர்க்கவும்
                    if (keyword && keyword.toLowerCase().startsWith(lowerCaseSearch)) {
                        // ஒரே தயாரிப்பு பல keywords மூலம் வந்தாலும், அதை ஒரே ஒரு ஆலோசனையாகவே சேர்க்கிறோம்
                        suggestionsMap.set(productName, productId); 
                    }
                });
            }
        });

        // Map-ஐ ஆலோசனைகள் array-ஆக மாற்றுகிறோம்
        return Array.from(suggestionsMap).map(([name, id]) => ({
            id: id,
            name: name // ஆலோசனையாக, பொருளின் முழுப் பெயரை வழங்குகிறோம்
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

    // ✅ New state to track logged-in user
    const [currentUser, setCurrentUser] = useState(null); 
    
    // ------------------------------------------------------------------
    // ✅ Auth State Listener (Runs once on component mount)
    // ------------------------------------------------------------------
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // ------------------------------------------------------------------
    // ✅ Logout Handler for Navbar Button
    // ------------------------------------------------------------------
    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Firebase listener will automatically update `currentUser` to null
            setShowAuthModal(false); // Close the modal if it was open
            navigate("/"); // Navigate to home or another appropriate page
            alert("You have been successfully logged out!");
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Failed to log out. Please try again.");
        }
    };

    const openAuthModal = () => setShowAuthModal(true);
    const closeAuthModal = () => setShowAuthModal(false);

    const openLocationModal = () => {
        setNewLocation(location || ""); // Reset input on open
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
    
    // Debounced Search Suggestions (unchanged)
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
    
    // Suggestion Click Handler (unchanged)
    const handleSuggestionClick = (product) => {
        setSearch(product.name); 
        setShowSuggestions(false);
        navigate(`/product/${product.id}`); 
    };
    
    // Search Submit Handler (unchanged)
    const handleSearchSubmit = () => {
        if (search.trim()) {
            setShowSuggestions(false);
            // Navigate to the general search results page
            navigate(`/search-results?q=${encodeURIComponent(search.trim())}`);
        }
    };

    // Enter Key Handler (unchanged)
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            handleSearchSubmit();
        }
    };

    // Hide suggestions on outside click (unchanged)
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
            <Navbar
                expand="lg"
                className="navbar-custom shadow-sm sticky-top"
                variant="dark"
            >
                <Container fluid className="px-3">
                    {/* Logo */}
                    <motion.div
                        className="d-flex align-items-center brand-container"
                        initial={{ opacity: 0, x: -50 }} 
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Navbar.Brand
                            href="/"
                            className="navbar-brand-custom d-flex align-items-center"
                        >
                            <div><img src="/Sadhanacart1.png" alt="SadhanaCart Logo" className="footer-logo-img me-2" /></div>
                            <span className="brand-white">Sadhana</span>
                            <span className="brand-orange">Cart</span>
                        </Navbar.Brand>
                    </motion.div>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                    <Navbar.Collapse id="responsive-navbar-nav">
                        {/* Search Bar is centered and prominent (unchanged) */}
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
                                        placeholder="Search for products, brands, and more..."
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
                                            <i className="fas fa-search"></i>
                                        </Button>
                                    </motion.div>
                                </Form>
                                
                                {/* Search Suggestions Dropdown (unchanged) */}
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
                        <Nav className="align-items-center ms-lg-3">
                            {/* Location (Animated) */}
                            <motion.div
                                className="text-white location me-3"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ cursor: "pointer" }}
                                onClick={openLocationModal}
                            >
                                Deliver to <strong>{location || "Set location"}</strong>
                            </motion.div>

                            {/* --- Account/Logout Conditional Rendering --- */}
                            {currentUser ? (
                                // ✅ Logged In: Show Logout Button
                                <>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="d-none d-lg-block">
                                        <Button variant="outline-danger" className="me-2 account-button" onClick={handleLogout}>
                                            <i className="fas fa-sign-out-alt"></i> Logout
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="d-lg-none">
                                        <Button variant="outline-danger" className="me-2 account-button" onClick={handleLogout} title="Logout">
                                            <i className="fas fa-sign-out-alt"></i>
                                        </Button>
                                    </motion.div>
                                </>
                            ) : (
                                // ❌ Logged Out: Show Account/Login Button
                                <>
                                    {/* Account (Desktop Animated) */}
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="d-none d-lg-block">
                                        <Button variant="outline-light" className="me-2 account-button" onClick={openAuthModal}>
                                            <i className="fas fa-user"></i> Account
                                        </Button>
                                    </motion.div>
        
                                    {/* Account (Mobile Animated) */}
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="d-lg-none">
                                        <Button variant="outline-light" className="me-2 account-button" onClick={openAuthModal}>
                                            <i className="fas fa-user"></i>
                                        </Button>
                                    </motion.div>
                                </>
                            )}
                            {/* ------------------------------------------------ */}

                            {/* Cart (Animated) (unchanged) */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline-warning" className="cart-button" onClick={goToCart}>
                                    <i className="fas fa-shopping-cart"></i> Cart <span className="cart-count">{cartCount}</span>
                                </Button>
                            </motion.div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <SecondHeader />

            {/* Auth Modal (unchanged) */}
            <Modal show={showAuthModal} onHide={closeAuthModal} centered>
                <Modal.Body>
                    <AuthPage onClose={closeAuthModal} />
                </Modal.Body>
            </Modal>
            
            {/* Location Modal (unchanged) */}
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