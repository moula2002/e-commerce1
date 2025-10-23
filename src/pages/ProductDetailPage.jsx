import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert, Card, Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice"; // Adjust path as needed

// 🚨 NEW TOAST IMPORTS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Don't forget the CSS!

// 🚨 FIREBASE IMPORTS
import { db } from "../firebase"; // Adjust path as needed
import { doc, getDoc, collection, getDocs, query, where, limit } from "firebase/firestore";
// 🎯 CRITICAL: Import the listener for auth state changes
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Component for suggestions
import ProductSuggestions from "../pages/ProductSuggestions"; // Adjust path as needed

const EXCHANGE_RATE = 1;
const auth = getAuth(); // Initialize Firebase Auth

// --- MOCK COD/PAYMENT LOGIC (For demonstration) ---
// Set this to false to replicate the "COD Not Available" status in the screenshot.
const MOCK_COD_AVAILABLE = false;
// ----------------------------------------------------

function ProductDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 🎯 Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // 📦 Product Data States
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [catLoading, setCatLoading] = useState(true);
    const [catError, setCatError] = useState(null);

    // ⭐ NEW STATE FOR IMAGE GALLERY
    const [mainImage, setMainImage] = useState(null);
    const [productImages, setProductImages] = useState([]);


    // ⚙️ Filtering/Sorting States
    const [sortBy, setSortBy] = useState("rating");
    const [filterPrice, setFilterPrice] = useState(50000);

    // ✅ STATE FOR PAYMENT METHOD
    const [codIsAvailable, setCodIsAvailable] = useState(MOCK_COD_AVAILABLE);

    // Pincode state for the new input field UI
    const [pincodeInput, setPincodeInput] = useState('');

    const styles = {
        productDetailContainer: { borderRadius: "12px", boxShadow: "0 8px 25px rgba(0,0,0,0.15)", marginTop: "25px" },
        detailImg: { maxHeight: "350px", objectFit: "contain", transition: "transform 0.3s ease-in-out" },
        productImageCol: { borderRight: "1px solid #eee", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
        productPrice: { fontSize: "2.2rem", fontWeight: 800, color: "#dc3545", marginTop: "15px", marginBottom: "15px" },
        // New style for thumbnails
        thumbnail: { width: '60px', height: '60px', objectFit: 'contain', cursor: 'pointer', border: '1px solid #ddd', margin: '0 5px', padding: '3px', transition: 'border-color 0.2s' },
        activeThumbnail: { borderColor: '#dc3545', boxShadow: '0 0 5px rgba(220, 53, 69, 0.5)' }
    };

    // --- Auth State Listener ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, []);

    // --- 1. Fetch Main Product Details ---
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const productRef = doc(db, "products", id);
                const productSnap = await getDoc(productRef);

                if (!productSnap.exists()) {
                    throw new Error(`Product with ID ${id} not found.`);
                }

                const data = { id: productSnap.id, ...productSnap.data() };
                setProduct(data);

                // ⭐ LOGIC TO HANDLE PRODUCT IMAGES ARRAY
                let images = [];
                // Check if 'images' is an array in the fetched data
                if (Array.isArray(data.images) && data.images.length > 0) {
                    images = data.images;
                }
                // Fallback to a single 'image' string field
                else if (typeof data.image === 'string' && data.image) {
                    images = [data.image];
                }
                // Fallback if both are missing
                else {
                    images = ["https://via.placeholder.com/350?text=No+Image"];
                }

                setProductImages(images);
                setMainImage(images[0]); // Set the first image as the main displayed image
            } catch (err) {
                console.error("🔥 Error fetching product details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // --- 2. Fetch Similar Category Products (Unchanged) ---
    useEffect(() => {
        if (!product || !product.category) return;
        const fetchCategoryProducts = async () => {
            try {
                setCatLoading(true);
                setCatError(null);

                const productsRef = collection(db, "products");
                const q = query(
                    productsRef,
                    where("category", "==", product.category),
                    limit(10)
                );

                const querySnapshot = await getDocs(q);

                const fetchedProducts = querySnapshot.docs.map(d => {
                    const data = d.data();
                    const priceValue = (data.price || 0) * EXCHANGE_RATE;
                    return {
                        id: d.id,
                        ...data,
                        priceINR: priceValue.toFixed(0),
                        priceValue: priceValue,
                        rating: data.rating || { rate: 4.0, count: 100 }
                    };
                });
                setCategoryProducts(fetchedProducts.filter(p => p.id !== product.id));
            } catch (err) {
                console.error("🔥 Error fetching category products:", err);
                setCatError(err.message);
            } finally {
                setCatLoading(false);
            }
        };
        fetchCategoryProducts();
    }, [product]);

    // --- Handlers ---
    const handlePincodeCheck = () => {
        if (pincodeInput.length === 6) {
            // Replaced alert with a basic toast for better UX
            toast.info(`Checking Pincode ${pincodeInput}...`, { position: "bottom-left" });
            
            // This is the actual logic status from the MOCK_COD_AVAILABLE constant
            setTimeout(() => {
                const status = codIsAvailable ? 'Available' : 'Not Available';
                const toastType = codIsAvailable ? 'success' : 'error';

                toast[toastType](`COD Status: ${status} for ${pincodeInput}`, { 
                    position: "bottom-left", 
                    autoClose: 3000 
                });
            }, 500);

        } else {
            toast.error('Please enter a valid 6-digit Pincode.', { position: "bottom-left" });
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        const priceINR = (product.price || 0) * EXCHANGE_RATE;

        dispatch(addToCart({
            id: product.id,
            title: product.name || product.title || "Product",
            price: priceINR,
            image: mainImage || product.images[0] || product.image || "https://via.placeholder.com/150",
            quantity: 1
        }));

        // ✅ ATTRACTIVE UI CHANGE: Using toast.success instead of a plain alert()
        toast.success(
            <div className="d-flex align-items-center">
                <i className="fas fa-check-circle me-2 fs-5"></i>
                <div className="ms-2">
                    <div className="fw-bold">Item Added to Cart!</div>
                    <small className="d-block text-truncate">**{product.name || product.title}** (₹{priceINR})</small>
                </div>
            </div>,
            {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored", // Gives a nice green background
            }
        );
    };

    // 🌟 REFACTORED: Buy Now logic to dispatch without alert and navigate directly
    const handleBuyNow = () => {
        if (!product) return;

        const priceINR = (product.price || 0) * EXCHANGE_RATE;
        const paymentSelection = codIsAvailable ? 'cod' : 'online';

        if (paymentSelection === 'cod' && !codIsAvailable) {
            toast.warning("Cash on Delivery is currently unavailable for this item/location.", {
                position: "bottom-center",
                autoClose: 4000,
                theme: "dark",
            });
            return;
        }

        // 🚨 CRITICAL: Dispatch the product to the Redux cart state.
        dispatch(addToCart({
            id: product.id,
            title: product.name || product.title || "Product",
            price: priceINR,
            image: mainImage || product.images[0] || product.image || "https://via.placeholder.com/150",
            quantity: 1
        }));

        // Navigate directly to checkout/login
        if (isLoggedIn) {
            navigate("/checkout", { state: { paymentMethod: paymentSelection } });
        } else {
            navigate("/login", { state: { from: "/checkout", paymentMethod: paymentSelection } });
        }
    };

    // --- Filtering and Sorting Logic for Similar Products (Unchanged) ---
    const filteredAndSortedCategory = useMemo(() => {
        let list = [...categoryProducts];
        list = list.filter(p => p.priceValue <= filterPrice);

        switch (sortBy) {
            case "price-asc": list.sort((a, b) => a.priceValue - b.priceValue); break;
            case "price-desc": list.sort((a, b) => b.priceValue - a.priceValue); break;
            case "name-asc": list.sort((a, b) => (a.name || a.title || "").localeCompare(b.name || b.title || "")); break;
            case "rating": default: list.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        }

        return list;
    }, [categoryProducts, sortBy, filterPrice]);

    // --- Render Loading / Error States (Unchanged) ---
    if (loading || !isAuthReady) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
    if (error) return <Alert variant="danger" className="mt-4 text-center">{error}</Alert>;
    if (!product) return <p className="text-center py-5">No product found for this ID.</p>;

    // --- Data Preparation for Display (Unchanged) ---
    const productPriceINR = ((product.price || 0) * EXCHANGE_RATE).toFixed(0);
    const originalPriceINR = ((product.price * 1.5) * EXCHANGE_RATE).toFixed(0);
    const discountPercentage = (((originalPriceINR - productPriceINR) / originalPriceINR) * 100).toFixed(0);
    const rating = product.rating || { rate: 4.0, count: 100 };

    // --- Main Render ---
    return (
        <Container className="py-4">
            {/* 🎯 IMPORTANT: Add ToastContainer to render notifications globally */}
            <ToastContainer />

            {/* Main Product Detail Card */}
            <Card style={styles.productDetailContainer} className="p-4 mb-5">
                <Row>
                    <Col md={5} style={styles.productImageCol} className="text-center">
                        {/* Main Product Image (uses mainImage state) */}
                        <img
                            src={mainImage || "https://via.placeholder.com/350"}
                            alt={product.name || product.title || "Product Image"}
                            className="img-fluid mb-3"
                            style={styles.detailImg}
                        />

                        {/* ⭐ START: Image Gallery/Thumbnail Strip */}
                        <div className="d-flex justify-content-center flex-wrap mt-3 mb-3">
                            {productImages.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    src={imgUrl}
                                    alt={`Thumbnail ${index + 1}`}
                                    onClick={() => setMainImage(imgUrl)}
                                    style={{
                                        ...styles.thumbnail,
                                        ...(mainImage === imgUrl ? styles.activeThumbnail : {})
                                    }}
                                />
                            ))}
                        </div>
                        {/* ⭐ END: Image Gallery/Thumbnail Strip */}
                    </Col>
                    <Col md={7}>
                        {/* ... (Existing Product Info) */}
                        <h2 className="fw-bold">{product.name || product.title || "Product Name"}</h2>
                        <p className="text-primary fw-semibold text-uppercase">{product.category || "N/A"}</p>
                        <div className="product-rating mb-3">
                            <span className="text-warning fw-bold me-2">{rating.rate.toFixed(1)} <i className="fas fa-star small"></i></span>
                            <span className="text-muted small">({rating.count} reviews)</span>
                        </div>
                        <hr />
                        <div className="price-section">
                            <h2 style={styles.productPrice}>
                                ₹{productPriceINR} /-
                                <small className="text-muted ms-3 fs-6 text-decoration-line-through">₹{originalPriceINR}</small>
                            </h2>
                            <span className="badge bg-danger fs-6 mb-3">{discountPercentage}% OFF!</span>
                        </div>
                        <p className="text-muted small">{product.description || "No description available."}</p>

                        {/* Pincode Check Input */}
                        <div className="mb-3 pt-3 border-top">
                            <InputGroup className="w-75 w-md-50">
                                <InputGroup.Text>
                                    <i className="fas fa-map-marker-alt text-muted small"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter pincode for delivery"
                                    value={pincodeInput}
                                    onChange={(e) => setPincodeInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                    maxLength={6}
                                    className="border-start-0"
                                />
                                <Button variant="outline-secondary" onClick={handlePincodeCheck} className="fw-semibold">
                                    Check
                                </Button>
                            </InputGroup>
                        </div>

                        {/* Delivery & COD Status Lines */}
                        <div className="mb-4 pt-1">
                            <div className="d-flex align-items-center mb-1">
                                <i className={`fas ${codIsAvailable ? 'fa-check' : 'fa-times'} me-2 small ${codIsAvailable ? 'text-success' : 'text-danger'}`}></i>
                                <span className={codIsAvailable ? 'text-success' : 'text-danger'}>
                                    <span className="fw-bold">COD {codIsAvailable ? 'Available' : 'Not Available'}</span>
                                </span>
                            </div>
                            <div className="d-flex align-items-center mb-1">
                                <i className="fas fa-truck text-success me-2 small"></i>
                                <span className="text-success small">
                                    Delivery <span className="fw-bold">2-5 Business Days</span>
                                </span>
                            </div>
                            <div className="d-flex align-items-center mb-1">
                                <i className="fas fa-undo-alt text-muted me-2 small"></i>
                                <span className="text-muted small">Easy Replacement Only</span>
                            </div>
                            <div className="d-flex align-items-center mb-1">
                                <i className="fas fa-credit-card text-muted me-2 small"></i>
                                <span className="text-muted small">Payment Options: (Credit Card, Debit Card, Net Banking, Wallets)</span>
                            </div>
                        </div>
                        {/* END Delivery & COD Status Lines */}

                        <hr />
                        <div className="d-grid gap-3 d-md-block pt-3 border-top mt-4">
                            <Button variant="warning" className="fw-bold me-3" onClick={handleAddToCart}>
                                <i className="fas fa-shopping-cart me-2"></i> ADD TO CART
                            </Button>
                            <Button variant="danger" className="fw-bold" onClick={handleBuyNow}>
                                <i className="fas fa-bolt me-2"></i> BUY NOW
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* --- More from Category Section (Unchanged) --- */}
            <h3 className="mb-4 fw-bold">More from the {product.category || 'Same'} category (Firebase)</h3>

            {/* Sorting & Filtering */}
            <Row className="mb-3 align-items-end">
                <Col md={4} className="mb-3 mb-md-0">
                    <Form.Group>
                        <Form.Label className="small mb-0">Max Price (₹): <span className="fw-bold">₹{filterPrice.toLocaleString()}</span></Form.Label>
                        <Form.Range min={0} max={100000} step={100} value={filterPrice} onChange={e => setFilterPrice(Number(e.target.value))} />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label className="small mb-1">Sort By:</Form.Label>
                        <Form.Select size="sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="rating">Top Rated</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name A-Z</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {/* Similar Products List (Unchanged) */}
            {catLoading ? (
                <div className="text-center py-3"><Spinner animation="border" size="sm" /></div>
            ) : catError ? (
                <Alert variant="warning">{catError}</Alert>
            ) : filteredAndSortedCategory.length === 0 ? (
                <Alert variant="info">No other products in this category match your filters.</Alert>
            ) : (
                <Row xs={1} sm={2} lg={4} className="g-4">
                    {filteredAndSortedCategory.map(p => (
                        <Col key={p.id}>
                            <Card className="h-100 shadow-sm border-0">
                                <Link to={`/product/${p.id}`} className="text-decoration-none text-dark d-block" onClick={() => window.scrollTo(0, 0)}>
                                    <div className="d-flex justify-content-center align-items-center p-3" style={{ height: '150px' }}>
                                        <Card.Img
                                            src={p.images || p.image || "https://via.placeholder.com/120"}
                                            style={{ height: '120px', width: 'auto', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="fs-6 fw-bold mb-1 text-truncate">{(p.name || p.title || "Unnamed Product")}</Card.Title>
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="text-warning fw-bold me-2">{p.rating.rate.toFixed(1)} <i className="fas fa-star small"></i></span>
                                            <span className="text-muted small">({p.rating.count})</span>
                                        </div>
                                        <Card.Text className="fw-bold text-danger fs-5 mt-auto">₹{p.priceINR}</Card.Text>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="mt-2"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                dispatch(addToCart({ id: p.id, title: p.name || p.title, price: p.priceValue, image: p.images || p.image, quantity: 1 }));
                                                // Replaced internal alert with toast for consistent UX
                                                toast.success(`Added "${p.name || p.title}" to cart!`, { position: "top-right", autoClose: 2000 });
                                            }}>
                                            Add to Cart
                                        </Button>
                                    </Card.Body>
                                </Link>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Product Suggestions */}
            {product && (
                <ProductSuggestions
                    currentProductId={product.id}
                    category={product.category}
                />
            )}
        </Container>
    );
}
export default ProductDetailPage;