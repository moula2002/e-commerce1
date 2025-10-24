import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert, Card, Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 🔥 Firebase Imports
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, query, where, limit } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import ProductSuggestions from "../pages/ProductSuggestions";

const EXCHANGE_RATE = 1;
const auth = getAuth();

function ProductDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Auth
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Product states
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [catLoading, setCatLoading] = useState(true);
    const [catError, setCatError] = useState(null);

    // Image gallery
    const [mainImage, setMainImage] = useState(null);
    const [productImages, setProductImages] = useState([]);

    // Filter/sort
    const [sortBy, setSortBy] = useState("rating");
    const [filterPrice, setFilterPrice] = useState(50000);

    // Pincode input
    const [pincodeInput, setPincodeInput] = useState('');

    const styles = {
        productDetailContainer: { borderRadius: "12px", boxShadow: "0 8px 25px rgba(0,0,0,0.15)", marginTop: "25px" },
        detailImg: { maxHeight: "350px", objectFit: "contain", transition: "transform 0.3s ease-in-out" },
        productImageCol: { borderRight: "1px solid #eee", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
        productPrice: { fontSize: "2.2rem", fontWeight: 800, color: "#dc3545", marginTop: "15px", marginBottom: "15px" },
        thumbnail: { width: '60px', height: '60px', objectFit: 'contain', cursor: 'pointer', border: '1px solid #ddd', margin: '0 5px', padding: '3px', transition: 'border-color 0.2s' },
        activeThumbnail: { borderColor: '#dc3545', boxShadow: '0 0 5px rgba(220, 53, 69, 0.5)' }
    };

    // --- Auth Listener ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, []);

    // --- Fetch Product ---
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const productRef = doc(db, "products", id);
                const productSnap = await getDoc(productRef);

                if (!productSnap.exists()) throw new Error(`Product with ID ${id} not found.`);

                const data = { id: productSnap.id, ...productSnap.data() };
                setProduct(data);

                let images = [];
                if (Array.isArray(data.images) && data.images.length > 0) images = data.images;
                else if (data.image) images = [data.image];
                else images = ["https://via.placeholder.com/350?text=No+Image"];

                setProductImages(images);
                setMainImage(images[0]);
            } catch (err) {
                console.error("🔥 Error fetching product details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // --- Fetch Similar Products ---
    useEffect(() => {
        if (!product?.category) return;
        const fetchCategoryProducts = async () => {
            try {
                setCatLoading(true);
                const q = query(collection(db, "products"), where("category", "==", product.category), limit(10));
                const querySnapshot = await getDocs(q);
                const fetched = querySnapshot.docs.map(d => {
                    const data = d.data();
                    const priceValue = (data.price || 0) * EXCHANGE_RATE;
                    return {
                        id: d.id,
                        ...data,
                        priceINR: priceValue.toFixed(0),
                        priceValue,
                        rating: data.rating || { rate: 4.0, count: 100 }
                    };
                });
                setCategoryProducts(fetched.filter(p => p.id !== product.id));
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
            toast.info(`Checking Pincode ${pincodeInput}...`, { position: "bottom-left" });
            setTimeout(() => {
                toast.success(`Delivery available for ${pincodeInput}`, { position: "bottom-left", autoClose: 3000 });
            }, 600);
        } else {
            toast.error('Please enter a valid 6-digit Pincode.', { position: "bottom-left" });
        }
    };

    // 🚀 UPDATED: Now performs add to cart + immediate navigation (same as Buy Now)
    const handleAddToCart = () => {
        if (!product) return;
        const priceINR = (product.price || 0) * EXCHANGE_RATE;

        // 1. Add to cart
        dispatch(addToCart({
            id: product.id,
            title: product.name || product.title || "Product",
            price: priceINR,
            image: mainImage || product.image || "https://via.placeholder.com/150",
            quantity: 1
        }));

        // 2. Display success toast
        toast.success(`Added "${product.name || product.title}" to cart!`, {
            position: "top-right",
            autoClose: 2500,
            theme: "colored"
        });

        // 3. Navigate to checkout/login
        if (isLoggedIn) {
            navigate("/checkout", { state: { paymentMethod: "online" } });
        } else {
            navigate("/login", { state: { from: "/checkout", paymentMethod: "online" } });
        }
    };

    // 🚀 BUY NOW: Already performs add to cart + immediate navigation
    const handleBuyNow = () => {
        if (!product) return;
        const priceINR = (product.price || 0) * EXCHANGE_RATE;

        dispatch(addToCart({
            id: product.id,
            title: product.name || product.title || "Product",
            price: priceINR,
            image: mainImage || product.image || "https://via.placeholder.com/150",
            quantity: 1
        }));

        if (isLoggedIn) {
            navigate("/checkout", { state: { paymentMethod: "online" } });
        } else {
            navigate("/login", { state: { from: "/checkout", paymentMethod: "online" } });
        }
    };

    // --- Sorting/Filtering ---
    const filteredAndSortedCategory = useMemo(() => {
        let list = [...categoryProducts];
        list = list.filter(p => p.priceValue <= filterPrice);

        switch (sortBy) {
            case "price-asc": list.sort((a, b) => a.priceValue - b.priceValue); break;
            case "price-desc": list.sort((a, b) => b.priceValue - a.priceValue); break;
            case "name-asc": list.sort((a, b) => (a.name || "").localeCompare(b.name || "")); break;
            default: list.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        }
        return list;
    }, [categoryProducts, sortBy, filterPrice]);

    if (loading || !isAuthReady) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
    if (error) return <Alert variant="danger" className="mt-4 text-center">{error}</Alert>;
    if (!product) return <p className="text-center py-5">No product found.</p>;

    const productPriceINR = ((product.price || 0) * EXCHANGE_RATE).toFixed(0);
    const originalPriceINR = ((product.price * 1.5) * EXCHANGE_RATE).toFixed(0);
    const discountPercentage = (((originalPriceINR - productPriceINR) / originalPriceINR) * 100).toFixed(0);
    const rating = product.rating || { rate: 4.0, count: 100 };

    return (
        <Container className="py-4">
            <ToastContainer />

            <Card style={styles.productDetailContainer} className="p-4 mb-5">
                <Row>
                    <Col md={5} style={styles.productImageCol}>
                        <img src={mainImage} alt={product.name} className="img-fluid mb-3" style={styles.detailImg} />
                        <div className="d-flex justify-content-center flex-wrap mt-3 mb-3">
                            {productImages.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`Thumbnail ${i + 1}`}
                                    onClick={() => setMainImage(img)}
                                    style={{
                                        ...styles.thumbnail,
                                        ...(mainImage === img ? styles.activeThumbnail : {})
                                    }}
                                />
                            ))}
                        </div>
                    </Col>

                    <Col md={7}>
                        <h2 className="fw-bold">{product.name || product.title}</h2>
                        <p className="text-primary fw-semibold text-uppercase">{product.category}</p>
                        <div className="product-rating mb-3">
                            <span className="text-warning fw-bold me-2">{rating.rate.toFixed(1)} <i className="fas fa-star small"></i></span>
                            <span className="text-muted small">({rating.count} reviews)</span>
                        </div>
                        <hr />
                        <h2 style={styles.productPrice}>
                            ₹{productPriceINR} /-
                            <small className="text-muted ms-3 fs-6 text-decoration-line-through">₹{originalPriceINR}</small>
                        </h2>
                        <span className="badge bg-danger fs-6 mb-3">{discountPercentage}% OFF!</span>
                        <p className="text-muted small">{product.description || "No description available."}</p>

                        {/* Pincode */}
                        <div className="mb-3 pt-3 border-top">
                            <InputGroup className="w-75 w-md-50">
                                <InputGroup.Text><i className="fas fa-map-marker-alt text-muted small"></i></InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter pincode"
                                    value={pincodeInput}
                                    onChange={(e) => setPincodeInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                    maxLength={6}
                                />
                                <Button variant="outline-secondary" onClick={handlePincodeCheck} className="fw-semibold">
                                    Check
                                </Button>
                            </InputGroup>
                        </div>

                        <div className="mb-3">
                            <i className="fas fa-truck text-success me-2 small"></i>
                            <span className="text-success small">Delivery <b>2–5 Business Days</b></span>
                        </div>

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

            {/* Similar Products */}
            <h3 className="mb-4 fw-bold">More from the {product.category} category</h3>

            <Row className="mb-3 align-items-end">
                <Col md={4}>
                    <Form.Label>Max Price (₹): ₹{filterPrice.toLocaleString()}</Form.Label>
                    <Form.Range min={0} max={100000} step={100} value={filterPrice} onChange={e => setFilterPrice(Number(e.target.value))} />
                </Col>
                <Col md={4}>
                    <Form.Label>Sort By:</Form.Label>
                    <Form.Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="rating">Top Rated</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Name A-Z</option>
                    </Form.Select>
                </Col>
            </Row>

            {catLoading ? (
                <div className="text-center py-3"><Spinner animation="border" size="sm" /></div>
            ) : catError ? (
                <Alert variant="warning">{catError}</Alert>
            ) : filteredAndSortedCategory.length === 0 ? (
                <Alert variant="info">No products found in this category.</Alert>
            ) : (
                <Row xs={1} sm={2} lg={4} className="g-4">
                    {filteredAndSortedCategory.map(p => (
                        <Col key={p.id}>
                            <Card className="h-100 shadow-sm border-0">
                                <Link to={`/product/${p.id}`} className="text-decoration-none text-dark">
                                    <div className="d-flex justify-content-center align-items-center p-3" style={{ height: '150px' }}>
                                        <Card.Img src={p.images || p.image || "https://via.placeholder.com/120"} style={{ height: '120px', objectFit: 'contain' }} />
                                    </div>
                                    <Card.Body>
                                        <Card.Title className="fs-6 fw-bold text-truncate">{p.name || p.title}</Card.Title>
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

            {product && (
                <ProductSuggestions currentProductId={product.id} category={product.category} />
            )}
        </Container>
    );
}

export default ProductDetailPage;