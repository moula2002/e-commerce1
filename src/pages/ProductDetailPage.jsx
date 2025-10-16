import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert, Card, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

// 🚨 FIREBASE IMPORTS
// Adjust the path to 'db' based on your file structure (e.g., "../firebase")
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, query, where, limit } from "firebase/firestore";

const EXCHANGE_RATE = 1;

function ProductDetailPage() {
    // Get product ID from URL params
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for Similar Products
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [catLoading, setCatLoading] = useState(true);
    const [catError, setCatError] = useState(null);
    const [sortBy, setSortBy] = useState("rating");
    const [filterPrice, setFilterPrice] = useState(50000);

    const styles = {
        productDetailContainer: { borderRadius: "12px", boxShadow: "0 8px 25px rgba(0,0,0,0.15)", marginTop: "25px" },
        detailImg: { maxHeight: "350px", objectFit: "contain", transition: "transform 0.3s ease-in-out" },
        productImageCol: { borderRight: "1px solid #eee", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
        productPrice: { fontSize: "2.2rem", fontWeight: 800, color: "#dc3545", marginTop: "15px", marginBottom: "15px" },
    };

    // --- 1. Fetch Main Product Details (Runs on ID change) ---
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top when product ID changes
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

            } catch (err) {
                console.error("🔥 Error fetching product details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // --- 2. Fetch Similar Category Products (Runs after main product is loaded) ---
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
                    limit(10) // Fetch maximum 10 similar products
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

                // Filter out the current product
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
    const handleAddToCart = () => {
        if (!product) return;
        const priceINR = (product.price || 0) * EXCHANGE_RATE;

        dispatch(addToCart({
            id: product.id,
            title: product.name || product.title || "Product",
            price: priceINR,
            image: product.images || product.image || "https://via.placeholder.com/150",
            quantity: 1
        }));

        alert(`Added "${product.name || product.title}" to cart! (₹${priceINR.toFixed(0)})`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate("/checkout");
    };

    // --- Filtering and Sorting Logic for Similar Products ---
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

    // --- Render Loading / Error States ---
    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
    if (error) return <Alert variant="danger" className="mt-4 text-center">{error}</Alert>;
    if (!product) return <p className="text-center py-5">No product found for this ID.</p>;

    // --- Data Preparation for Display ---
    const productPriceINR = ((product.price || 0) * EXCHANGE_RATE).toFixed(0);
    const originalPriceINR = ((product.price * 1.5) * EXCHANGE_RATE).toFixed(0);
    const discountPercentage = (((originalPriceINR - productPriceINR) / originalPriceINR) * 100).toFixed(0);
    const rating = product.rating || { rate: 4.0, count: 100 };

    // --- Main Render ---
    return (
        <Container className="py-4">

            {/* Main Product Detail Card */}
            <Card style={styles.productDetailContainer} className="p-4 mb-5">
                <Row>
                    <Col md={5} style={styles.productImageCol} className="text-center">
                        <img
                            src={product.images || product.image || "https://via.placeholder.com/350"}
                            alt={product.name || product.title || "Product Image"}
                            className="img-fluid"
                            style={styles.detailImg}
                        />
                    </Col>
                    <Col md={7}>
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

                        <div className="d-grid gap-3 d-md-block pt-3 border-top mt-4">
                            <Button variant="warning" className="fw-bold me-3" onClick={handleAddToCart}>
                                <i className="fas fa-shopping-cart me-2"></i> Add to Cart
                            </Button>
                            <Button variant="success" className="fw-bold" onClick={handleBuyNow}>
                                <i className="fas fa-bolt me-2"></i> Buy Now
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card>

            <h3 className="mb-4 fw-bold">More from the {product.category || 'Same'} category</h3>

            {/* Sorting & Filtering for Similar Products */}
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
                                {/* Clicking this link will reload the component with the new product ID */}
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

                                        {/* This Add to Cart button prevents navigation */}
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="mt-2"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                dispatch(addToCart({ id: p.id, title: p.name || p.title, price: p.priceValue, image: p.images || p.image, quantity: 1 }));
                                                alert(`Added "${p.name || p.title}" to cart!`);
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

        </Container>
    );
}

export default ProductDetailPage;