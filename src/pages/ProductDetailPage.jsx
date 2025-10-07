import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";


function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const styles = {

    productDetailContainer: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        marginTop: '20px',
    },

    productImageCol: {
        padding: '20px',
        borderRight: '1px solid #eee',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailImg: {
        maxHeight: '350px',
        objectFit: 'contain',
        transition: 'transform 0.3s ease-in-out',
        
    },

    productTitle: {
        fontSize: '2.2rem',
        fontWeight: 700,
        color: '#333',
        marginBottom: '5px',
    },
    productPrice: {
        fontSize: '2.5rem',
        fontWeight: 800,
        color: '#008000', 
        marginTop: '15px',
    },

    buttonGroup: {
        display: 'flex',
        gap: '15px',
        paddingTop: '20px',
        marginTop: '20px', 
    },

    cartButton: {
        padding: '12px 25px',
        fontSize: '1.1rem',
        fontWeight: 600,
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#ff9900', 
        color: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
    },
   
    buyButton: {
        padding: '12px 25px',
        fontSize: '1.1rem',
        fontWeight: 600,
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#28a745', 
        color: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
    }
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

  const handleAddToCart = () => {
      alert(`Added ${product.title} to cart!`);
      
  };

  const handleBuyNow = () => {
      alert(`Proceeding to checkout with ${product.title}.`);
      
  };

  return (
    <Container className="py-4" style={styles.productDetailContainer}>
      <Row>
        {/* Product Image Column */}
        {/* Note: The borderRight style is complex for mobile responsiveness via inline styles. Keep border-right conditional CSS in a stylesheet if needed. */}
        <Col md={5} className="text-center" style={styles.productImageCol}>
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid"
            style={styles.detailImg}
          />
        </Col>

        {/* Product Details Column */}
        <Col md={7}>
          <h1 style={styles.productTitle}>{product.title}</h1>
          <p className="text-muted">{product.category}</p>
          
          <div className="product-rating mb-3">
              <i className="fas fa-star text-warning me-1"></i>
              <i className="fas fa-star text-warning me-1"></i>
              <i className="fas fa-star text-warning me-1"></i>
              <i className="fas fa-star-half-alt text-warning me-1"></i>
              <span className="text-secondary">(4.5 Stars | 150 Reviews)</span>
          </div>

          <hr />

          <h2 style={styles.productPrice}>
            ₹{(product.price * 83).toFixed(0)} /-
            <small className="text-muted ms-3 text-decoration-line-through">₹{(product.price * 100).toFixed(0)}</small>
          </h2>

          <p>{product.description}</p>
          
          <div style={styles.buttonGroup}>
            <button 
              style={styles.cartButton}
              onClick={handleAddToCart}
            >
              <i className="fas fa-shopping-cart me-2"></i>
              Add to Cart
            </button>
            <button 
              style={styles.buyButton}
              onClick={handleBuyNow}
            >
              <i className="fas fa-bolt me-2"></i>
              Buy Now
            </button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetailPage;