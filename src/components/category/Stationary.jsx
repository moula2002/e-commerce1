// src/components/category/Stationary.jsx
import React, { useState, useEffect } from 'react';
import { Container, Spinner, Card, Row, Col } from 'react-bootstrap';
// 🎯 Link component is necessary for navigation
import { Link } from 'react-router-dom';
// Firebase Firestore இலிருந்து தேவையான செயல்பாடுகளை இறக்குமதி செய்க
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase'; // உங்கள் firebase உள்ளமைவு கோப்பை அனுமானிக்கிறது

// 🎨 Utility function to extract color from description if 'color' field is missing
// Firestor-ல் உள்ள data-வின்படி, color field இல்லாவிட்டால் description-ல் இருந்து color-ஐ எடுக்கிறது.
const extractColorFromDescription = (description) => {
  if (!description || typeof description !== 'string') return null;
  const match = description.match(/color:\s*([a-zA-Z]+)/i);
  return match ? match[1].trim() : null;
};

// -------------------------------------------------------------
// 🎯 Product Card component to display product details including color
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  // ✅ Color logic: First check 'color' field, then description, default to "N/A"
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
        <Card className="h-100 shadow-sm border-0" style={cardStyle}>
          <Card.Img
            variant="top"
            src={product.images || product.image || 'https://via.placeholder.com/150'}
            style={{ height: '180px', objectFit: 'cover' }}
          />
          <Card.Body>
            <Card.Title className="fs-6 text-truncate text-dark">{product.name || 'Untitled Stationery Item'}</Card.Title>

            {/* 🎨 Displaying the Color information */}
            <Card.Text className="text-secondary small">
              Color: <strong style={{ color: productColor !== 'N/A' ? 'black' : 'grey' }}>{productColor}</strong>
            </Card.Text>

            <Card.Text className="text-success fw-bold fs-5 mt-2">
              {product.price ? `₹${product.price}` : 'Price N/A'}
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};
// -------------------------------------------------------------


function Stationary() {
  // ✅ Category name to query in Firestore (as seen in image_48aa83.jpg)
  const categoryName = "Stationery";
  // 🎯 Set the limit for products to fetch
  const fetchLimit = 16;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRef = collection(db, 'products');

        // 🚀 Simplified Firebase Query: Filter by category and apply limit
        const productsQuery = query(
          productsRef,
          where('category', '==', categoryName),
          limit(fetchLimit)
        );

        const productsSnapshot = await getDocs(productsQuery);

        const fetchedProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetchedProducts);

      } catch (err) {
        console.error(`Error fetching ${categoryName} data:`, err);
        setError(`Failed to load ${categoryName} products. Please check console.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Reruns only if dependencies change (which is none here)

  // --- UI Logic for Loading and Error ---
  if (loading) return (
    <Container className="text-center my-5">
      <Spinner animation="border" variant="success" />
      <p className='text-dark'>Loading {categoryName} Products...</p>
    </Container>
  );

  if (error) return (
    <Container className="text-center my-5 text-danger">
      <p>Error: {error}</p>
    </Container>
  );

  return (
    <Container className="my-5 text-center">
      <h2 className="fw-bold text-dark mb-4">{categoryName} Collection ✏️</h2>
      <p className="text-muted mb-5">
        Everything you need for school and office supplies! (Showing {products.length} products)
      </p>

      {products.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Row>
      ) : (
        <div className="p-4 bg-primary bg-opacity-10 rounded">
          <p className="text-primary fw-bold mb-0">No products found in the {categoryName} category yet.</p>
        </div>
      )}
    </Container>
  );
}

export default Stationary;