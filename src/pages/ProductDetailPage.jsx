import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert, Card, Button } from "react-bootstrap";
// 💥 Import useDispatch from react-redux
import { useDispatch } from "react-redux";
// 💥 Import the addToCart action
import { addToCart } from "../redux/cartSlice"; // Ensure correct path

// Note: You must ensure FontAwesome icons are globally available for the shopping-cart and bolt icons.

function ProductDetailPage() {
  const { id } = useParams();
  // 💥 Get the dispatch function
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ... (styles object remains the same)
  const styles = {
    productDetailContainer: {
      borderRadius: '12px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      marginTop: '25px',
    },
    detailImg: {
      maxHeight: '350px',
      objectFit: 'contain',
      transition: 'transform 0.3s ease-in-out',
    },
    productImageCol: {
      borderRight: '1px solid #eee',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    productPrice: {
      fontSize: '2.2rem',
      fontWeight: 800,
      color: '#dc3545',
      marginTop: '15px',
      marginBottom: '15px',
    },
  };


  useEffect(() => {
    const fetchProduct = async () => {
      try {
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

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Alert variant="danger" className="mt-4 text-center">{error}</Alert>;
  if (!product) return <p>No product found.</p>;

  // 💥 UPDATED: Use dispatch to add the product to the Redux cart state
  const handleAddToCart = () => {
    // Ensure the product object has the required fields for the cart slice
    const itemToAdd = {
      id: product.id,
      title: product.title,
      price: product.price * 83, // Use INR price for display in cart
      image: product.image,
      // Pass quantity 1, which will be used by addToCart
      quantity: 1, 
    };

    dispatch(addToCart(itemToAdd));
    alert(`Added ${product.title} to cart!`);
  };

  const handleBuyNow = () => {
    // Optional: You might also dispatch the item and then navigate to checkout
    handleAddToCart();
    alert(`Proceeding to checkout with ${product.title}.`);
  };

  // Convert USD to INR (approximate) - used for display only
  const productPriceINR = (product.price * 83).toFixed(0);
  const originalPriceINR = (product.price * 100).toFixed(0);

  return (
    <Container className="py-4">
      {/* Use Card component for a clean, contained look */}
      <Card style={styles.productDetailContainer} className="p-4">
        <Row>
          {/* Product Image Column - Enhanced with hover animation class */}
          <Col md={5} className="text-center" style={styles.productImageCol}>
            {/* The 'image-hover-zoom' class provides the attractive animation */}
            <div className="image-hover-zoom">
              <img
                src={product.image}
                alt={product.title}
                className="img-fluid"
                style={styles.detailImg}
              />
            </div>
          </Col>

          {/* Product Details Column */}
          <Col md={7}>
            {/* 💥 SIZE CHANGE: Reduced to h2 size for a more compact look */}
            <h2 className="fw-bold text-dark">{product.title}</h2>
            <p className="text-primary fw-semibold text-uppercase">{product.category}</p>

            {/* Rating Section */}
            <div className="product-rating mb-3">
              <i className="fas fa-star text-warning"></i>
              <i className="fas fa-star text-warning"></i>
              <i className="fas fa-star text-warning"></i>
              <i className="fas fa-star-half-alt text-warning"></i>
              <span className="text-secondary ms-2 small">
                ({product.rating.rate} Stars | {product.rating.count} Reviews)
              </span>
            </div>

            <hr />

            {/* Price Section */}
            <div className="price-section">
              <h2 style={styles.productPrice}>
                ₹{productPriceINR} /-
                {/* 💥 SIZE CHANGE: Reduced original price font size to fs-6 */}
                <small className="text-muted ms-3 fs-6 text-decoration-line-through">
                  ₹{originalPriceINR}
                </small>
              </h2>
              <span className="badge bg-danger text-white fs-6 mb-3">
                {((originalPriceINR - productPriceINR) / originalPriceINR * 100).toFixed(0)}% OFF!
              </span>
            </div>

            <p className="text-muted small">{product.description}</p>

            {/* Button Group - Changed size to default (no size="lg") for compactness */}
            <div className="d-grid gap-3 d-md-block pt-3 border-top mt-4">
              <Button
                variant="warning"
                // removed size="lg" 💥
                className="fw-bold px-4 shadow-sm me-3 custom-cart-button"
                onClick={handleAddToCart} // 💥 Calls Redux dispatch
              >
                <i className="fas fa-shopping-cart me-2"></i>
                Add to Cart
              </Button>
              <Button
                variant="success"
                // removed size="lg" 💥
                className="fw-bold px-4 shadow-sm custom-buy-button"
                onClick={handleBuyNow}
              >
                <i className="fas fa-bolt me-2"></i>
                Buy Now
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default ProductDetailPage;