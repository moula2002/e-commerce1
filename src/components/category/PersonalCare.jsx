// src/components/category/PersonalCare.jsx
import React, { useState, useEffect } from 'react';
import { Container, Spinner, Card, Row, Col } from 'react-bootstrap';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';

// 🎨 Utility function to extract color from description if 'color' field is missing
const extractColorFromDescription = (description) => {
  if (!description || typeof description !== 'string') return null;

  // Example: finding "color: Purple" in the description string
  const match = description.match(/color:\s*([a-zA-Z]+)/i);
  return match ? match[1].trim() : null;
};

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const productColor = product.color || extractColorFromDescription(product.description) || "N/A";

  const cardStyle = {
    transition: "transform 0.3s ease-in-out, boxShadow 0.3s ease-in-out",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
    boxShadow: isHovered
      ? "0 10px 20px rgba(0, 0, 0, 0.2)"
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
        <Card className="h-100 border-0" style={cardStyle}>
          <Card.Img
            variant="top"
            src={
              product.images ||
              product.image ||
              "https://via.placeholder.com/200"
            }
            style={{ height: "200px", objectFit: "initial" }}
          />
          <Card.Body>
            <Card.Title className="fs-6 text-truncate text-dark">
              {product.name || "Unnamed Product"}
            </Card.Title>

            <Card.Text className="text-secondary small">
              Color: <strong style={{ color: productColor !== 'N/A' ? 'black' : 'grey' }}>{productColor}</strong>
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

function PersonalCare() {
  const categoryName = "Personal Care";
  const fetchLimit = 20;

  const [products, setProducts] = useState([]);
  const [uniqueColors, setUniqueColors] = useState([]);
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
          setLoading(false);
          return;
        }

        const fetchedProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetchedProducts);

        const colorsSet = new Set();
        fetchedProducts.forEach(p => {
          const color = p.color || extractColorFromDescription(p.description);
          if (color) {
            const normalizedColor = color.trim().charAt(0).toUpperCase() + color.trim().slice(1).toLowerCase();
            colorsSet.add(normalizedColor);
          }
        });

        setUniqueColors(Array.from(colorsSet));

      } catch (err) {
        console.error('Error fetching Personal Care data:', err);
        setError("Failed to load Personal Care products. Please check console.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- UI Logic ---
  if (loading) return (
    <Container className="text-center my-5">
      <Spinner animation="border" variant="danger" />
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
      <h2 className="fw-bold text-dark mb-4">{categoryName} Collection 🧴</h2>

      {products.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Row>
      ) : (
        <div className="p-4 bg-danger bg-opacity-10 rounded">
          <p className="text-danger fw-bold mb-0">No products found for the {categoryName} category yet.</p>
        </div>
      )}
    </Container>
  );
}

export default PersonalCare;