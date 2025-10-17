import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, Modal, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { setLocation } from "../redux/store";
import AuthPage from "../pages/LoginPage";
import SecondHeader from "./searchBar/SecondHeader";
import "./Navbar.css";
import { db } from "../firebase";
import { collection, query, getDocs } from "firebase/firestore"; // 'limit' நீக்கப்பட்டுள்ளது

// ⭐ மாற்றப்பட்ட ஃபங்ஷன்: searchkeywords-ஐப் பயன்படுத்தி தயாரிப்புப் பெயர்களை மீட்டெடுக்க
const fetchSuggestions = async (searchText) => {
    if (!searchText || searchText.trim().length < 2) return [];

    const lowerCaseSearch = searchText.trim().toLowerCase();
    const productsRef = collection(db, "products");
    
    // NOTE: 'limit(1000)' நீக்கப்பட்டுள்ளது. இது இப்போது அனைத்து தயாரிப்புகளையும் பெறுகிறது.
    // பெரிய தரவுகளுக்கு இது சரியான தீர்வு அல்ல.
    const q = query(productsRef); // வரம்பில்லாத Query

    try {
        const snapshot = await getDocs(q);
        let suggestionsMap = new Map(); // Map to store unique product names and their IDs
        
        snapshot.docs.forEach(doc => {
            const productData = doc.data();
            const productId = doc.id;
            
            // தயாரிப்புப் பெயர் உள்ளது என்பதை உறுதிப்படுத்த
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
    
    // 👇 ஆலோசனைகளுக்கான State
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    // 👆

    const openAuthModal = () => setShowAuthModal(true);
    const closeAuthModal = () => setShowAuthModal(false);

    const openLocationModal = () => setShowLocationModal(true);
    const closeLocationModal = () => setShowLocationModal(false);

    const saveLocation = () => {
        if (newLocation.trim() !== "") {
            dispatch(setLocation(newLocation));
            closeLocationModal();
        }
    };

    const goToCart = () => navigate("/cart");
    
    // 👇 Functionality: டைப் செய்யும்போது ஆலோசனைகளைப் பெற (Debounce)
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
    
    // 👇 Functionality: ஆலோசனையைக் கிளிக் செய்தவுடன் செயல்பட
    // இப்போது product.id-ஐப் பயன்படுத்தி தயாரிப்புப் பக்கத்திற்குச் செல்கிறது
    const handleSuggestionClick = (product) => {
        setSearch(product.name); // தேடல் பெட்டியில் முழுப் பெயரை வைக்க
        setShowSuggestions(false);
        // தயாரிப்புப் பக்கத்திற்குச் செல்ல
        navigate(`/product/${product.id}`); 
    };
    
    // Functionality: Search பட்டனைக் கிளிக் செய்தவுடன் செயல்பட
    const handleSearchSubmit = () => {
        if (search.trim()) {
            setShowSuggestions(false);
            // தேடல் முடிவுகள் பக்கத்திற்குச் செல்லவும்
            navigate(`/search-results?q=${encodeURIComponent(search.trim())}`);
        }
    };

    // Functionality: Enter கீ-ஐக் கையாள
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            handleSearchSubmit();
        }
    };

    // Functionality: Search Bar-க்கு வெளியே கிளிக் செய்தால் ஆலோசனைகளை மறைக்க
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
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
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
                        <Nav className="mx-auto align-items-center">
                            {/* Search Bar Container with Suggestions */}
                            <motion.div
                                ref={searchBarRef}
                                className="search-bar-container my-2 my-lg-0 position-relative"
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Form className="d-flex w-100">
                                    <Form.Control
                                        type="search"
                                        placeholder="Search for products"
                                        className="me-2 search-input"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onFocus={() => {
                                            if(suggestions.length > 0 && search.trim().length > 1) setShowSuggestions(true);
                                        }}
                                        onKeyDown={handleKeyPress}
                                    />
                                    <Button
                                        variant="warning"
                                        className="search-btn"
                                        onClick={handleSearchSubmit}
                                    >
                                        🔍
                                    </Button>
                                </Form>
                                
                                {/* 👇 ஆலோசனைகளுக்கான Dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="suggestions-dropdown p-2 bg-white shadow rounded-bottom border border-top-0">
                                        <ul className="list-unstyled mb-0">
                                            {suggestions.map((product) => (
                                                <li 
                                                    key={product.id} // ID-ஐப் பயன்படுத்துகிறோம்
                                                    className="suggestion-item p-2 rounded"
                                                    onClick={() => handleSuggestionClick(product)}
                                                    tabIndex={0} 
                                                >
                                                    {product.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {/* 👆 */}
                            </motion.div>
                        </Nav>
                        {/* ... (Rest of the Nav/Navbar code is unchanged) ... */}
                        <Nav className="align-items-center ms-lg-3">
                            {/* Location */}
                            <motion.div
                                className="text-white location me-3"
                                whileHover={{ scale: 1.05 }}
                                style={{ cursor: "pointer" }}
                                onClick={openLocationModal}
                            >
                                Deliver to <strong>{location || "Set location"}</strong>
                            </motion.div>

                            {/* Account (desktop) */}
                            <motion.div whileHover={{ scale: 1.1 }} className="d-none d-lg-block">
                                <Button
                                    variant="outline-light"
                                    className="me-2 account-button"
                                    onClick={openAuthModal}
                                >
                                    👤 Account
                                </Button>
                            </motion.div>

                            {/* Account (mobile) */}
                            <motion.div whileHover={{ scale: 1.1 }} className="d-lg-none">
                                <Button
                                    variant="outline-light"
                                    className="me-2 account-button"
                                    onClick={openAuthModal}
                                >
                                    👤
                                </Button>
                            </motion.div>

                            {/* Cart */}
                            <motion.div whileHover={{ scale: 1.1 }}>
                                <Button
                                    variant="outline-warning"
                                    className="cart-button"
                                    onClick={goToCart}
                                >
                                    🛒 Cart <span className="cart-count">{cartCount}</span>
                                </Button>
                            </motion.div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <SecondHeader />

            {/* Modals are unchanged */}
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