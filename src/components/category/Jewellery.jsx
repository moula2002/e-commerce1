// src/components/category/Jewellery.jsx
import React, { useState, useEffect } from 'react';
import { Container, Spinner, Card, Row, Col } from 'react-bootstrap';
import { collection, query, where, getDocs, limit } from 'firebase/firestore'; 
import { db } from '../../firebase';
import { Link } from 'react-router-dom'; 

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const productColor = product.color || "N/A"; 

    const cardStyle = {
      transition: "transform 0.3s ease-in-out, boxShadow 0.3s ease-in-out",
      transform: isHovered ? "scale(1.05)" : "scale(1)", 
      boxShadow: isHovered
        ? "0 10px 20px rgba(0, 0, 0, 0.3)" 
        : "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
      zIndex: isHovered ? 10 : 1, 
      cursor: 'pointer'
    };

    return (
        <Col>
            <Link
                to={`/product/${product.id}`}
                style={{ textDecoration: "none", color: "inherit" }} 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Card  className="h-100 border-0" style={cardStyle}>
                    <Card.Img
                        variant="top"
                        src={product.image || product.images || "https://via.placeholder.com/200"}
                        style={{ height: "180px", objectFit: "cover" }}
                    />
                    <Card.Body>
                        <Card.Title className="fs-6 text-truncate text-dark">
                            {product.name || "Untitled Jewellery"}
                        </Card.Title>
                        
                        <Card.Text className="text-dark small">
                            Color: <strong style={{ color: productColor === 'Silver' ? 'silver' : 'grey' }}>{productColor}</strong>
                        </Card.Text>

                        <Card.Text className="text-success fw-bold fs-5 mt-2">
                            ₹{product.price || "N/A"}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Link>
        </Col>
    );
};
// -------------------------------------------------------------

function Jewellery() {
  const categoryName = "Jewellery";
  const fetchLimit = 80; 
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRef = collection(db, 'products');
        const productsQuery = query(
            productsRef, 
            where('category', '==', categoryName),
            limit(fetchLimit) 
        );
        
        const productsSnapshot = await getDocs(productsQuery);

        if (productsSnapshot.empty) {
          console.warn(`No products found for category: ${categoryName}`);
          setProducts([]);
          setLoading(false);
          return;
        }

        const fetchedProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetchedProducts);

      } catch (err) {
        console.error('Error fetching Jewellery data:', err);
        setError("Failed to load Jewellery products. Please check console.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // [] dependency array means it runs once on mount

  // --- UI Logic ---
  if (loading) return (
    <Container className="text-center my-5">
      <Spinner animation="border" variant="warning" />
      <p>Loading {categoryName} Products...</p>
    </Container>
  );

  if (error) return (
    <Container className="text-center my-5 text-danger">
      <p>{error}</p>
    </Container>
  );

  return (
    <Container className="my-5 text-center">
      <h2 className="fw-bold text-dark mb-4">{categoryName} Collection 💍</h2>

      <p className="text-dark mb-5">
        Adorn yourself with elegance and sparkle from our stunning {categoryName} collection! 
        (Showing {products.length} products)
      </p>

      {products.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Row>
      ) : (
        <div className="p-4 bg-secondary bg-opacity-25 rounded">
          <p className="text-dark fw-bold mb-0">No products found for the {categoryName} category yet.</p>
        </div>
      )}
    </Container>
  );
}

export default Jewellery;