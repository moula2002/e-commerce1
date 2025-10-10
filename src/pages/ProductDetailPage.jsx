// src/pages/ProductDetailPage.jsx

import React, { useEffect, useState, useMemo } from "react";
// useNavigate-a import pannavum
import { useParams, Link, useNavigate } from "react-router-dom"; 
import { Container, Row, Col, Spinner, Alert, Card, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const EXCHANGE_RATE = 83; // Assuming you have this defined

function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  // useNavigate-a initialize pannavum
  const navigate = useNavigate(); 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category products state
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

  // Fetch main product
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use a safe ID or a known product ID for quick testing if fakestoreapi is down or you need a mock.
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch category products
  useEffect(() => {
    if (!product) return;

    const fetchCategoryProducts = async () => {
      try {
        setCatLoading(true);
        setCatError(null);
        const response = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(product.category)}`);
        if (!response.ok) throw new Error("Failed to fetch category products");
        const data = await response.json();

        const formattedData = data.map(p => ({
          ...p,
          priceINR: (p.price * EXCHANGE_RATE).toFixed(0),
          priceValue: p.price * EXCHANGE_RATE
        }));

        // Exclude current product
        setCategoryProducts(formattedData.filter(p => p.id !== product.id));
      } catch (err) {
        setCatError(err.message);
      } finally {
        setCatLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [product]);

  // --- Add to Cart / Buy Now Handlers ---
  const handleAddToCart = () => {
    if (!product) return;
    const priceINR = product.price * EXCHANGE_RATE;

    // Dispatch to Redux - THIS IS THE KEY PART
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: priceINR, 
      image: product.image,
      quantity: 1
    }));

    alert(`Added "${product.title}" to cart! (₹${priceINR.toFixed(0)})`);
  };

  const handleBuyNow = () => {
    // 1. Product-a Cart-la add pannavum
    handleAddToCart();
    // 2. Checkout page-kku navigate pannavum
    navigate("/checkout"); 
  };

  // Category products filtered & sorted
  const filteredAndSortedCategory = useMemo(() => {
    let list = [...categoryProducts];
    list = list.filter(p => p.priceValue <= filterPrice);

    switch (sortBy) {
      case "price-asc": list.sort((a, b) => a.priceValue - b.priceValue); break;
      case "price-desc": list.sort((a, b) => b.priceValue - a.priceValue); break;
      case "name-asc": list.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "rating": default: list.sort((a, b) => b.rating.rate - a.rating.rate);
    }

    return list;
  }, [categoryProducts, sortBy, filterPrice]);

  // Loading / Error
  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-4 text-center">{error}</Alert>;
  if (!product) return <p>No product found.</p>;

  const productPriceINR = (product.price * EXCHANGE_RATE).toFixed(0);
  const originalPriceINR = (product.price * 100).toFixed(0);
  const discountPercentage = (((originalPriceINR - productPriceINR) / originalPriceINR) * 100).toFixed(0);

  return (
    <Container className="py-4">

      {/* Main Product */}
      <Card style={styles.productDetailContainer} className="p-4 mb-5">
        <Row>
          <Col md={5} style={styles.productImageCol} className="text-center">
            <img src={product.image} alt={product.title} className="img-fluid" style={styles.detailImg} />
          </Col>
          <Col md={7}>
            <h2 className="fw-bold">{product.title}</h2>
            <p className="text-primary fw-semibold text-uppercase">{product.category}</p>
            <div className="product-rating mb-3">
              {/* Star icons simplified for brevity */}
              <i className="fas fa-star text-warning"></i>
              <i className="fas fa-star text-warning"></i>
              <i className="fas fa-star text-warning"></i>
              <i className="fas fa-star-half-alt text-warning"></i>
              <span className="text-secondary ms-2 small">
                ({product.rating.rate} Stars | {product.rating.count} Reviews)
              </span>
            </div>
            <hr />
            <div className="price-section">
              <h2 style={styles.productPrice}>
                ₹{productPriceINR} /-
                <small className="text-muted ms-3 fs-6 text-decoration-line-through">₹{originalPriceINR}</small>
              </h2>
              <span className="badge bg-danger fs-6 mb-3">{discountPercentage}% OFF!</span>
            </div>
            <p className="text-muted small">{product.description}</p>
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

      {/* Category Products - REMAINS THE SAME */}
      <h3 className="mb-4 fw-bold">More from this category</h3>
      {/* Sorting & Filtering */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Max Price (₹): ₹{filterPrice.toLocaleString()}</Form.Label>
            <Form.Range min={0} max={100000} step={100} value={filterPrice} onChange={e => setFilterPrice(Number(e.target.value))} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Sort By:</Form.Label>
            <Form.Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name A-Z</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {catLoading ? (
        <div className="text-center py-3"><Spinner animation="border" /></div>
      ) : catError ? (
        <Alert variant="danger">{catError}</Alert>
      ) : filteredAndSortedCategory.length === 0 ? (
        <Alert variant="info">No other products in this category match your filters.</Alert>
      ) : (
        <Row xs={1} sm={2} lg={3} className="g-4">
          {filteredAndSortedCategory.map(p => (
            <Col key={p.id}>
              <Card className="h-100 shadow-sm border-0">
                <Link to={`/product/${p.id}`} className="text-decoration-none text-dark d-block">
                  <div className="d-flex justify-content-center align-items-center p-3" style={{ height: '150px' }}>
                    <Card.Img src={p.image} style={{ height: '120px', width: 'auto', objectFit: 'contain' }} />
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fs-6 fw-bold mb-1" style={{ minHeight: '40px' }}>{p.title.substring(0, 50)}...</Card.Title>
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning fw-bold me-2">{p.rating.rate} <i className="fas fa-star small"></i></span>
                      <span className="text-muted small">({p.rating.count})</span>
                    </div>
                    <Card.Text className="fw-bold text-danger fs-5 mt-auto">₹{p.priceINR}</Card.Text>
                    <Button variant="warning" size="sm" className="mt-2" onClick={(e) => {
                      e.preventDefault(); // Prevent navigating when clicking add to cart
                      dispatch(addToCart({ id: p.id, title: p.title, price: p.priceValue, image: p.image, quantity: 1 }));
                      alert(`Added "${p.title}" to cart!`);
                    }}>Add to Cart</Button>
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