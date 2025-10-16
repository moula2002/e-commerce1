import React, { useState, useEffect } from 'react';
import { Container, Spinner, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // 👈 Import Link
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase';

const ProductCard = ({ product }) => {

  const [isHovered, setIsHovered] = useState(false);


  const cardStyle = {

    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",

    transform: isHovered ? "scale(1.03)" : "scale(1)",

    boxShadow: isHovered
      ? "0 10px 20px rgba(0, 0, 0, 0.25)"
      : "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",

    zIndex: isHovered ? 10 : 1,
    cursor: 'pointer'
  };

  return (
    <Col>
      <Link
        to={`/product/${product.id}`}
        className="text-decoration-none text-dark d-block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card
          className="h-100 border-0"
          style={cardStyle}
        >
          <Card.Img
            variant="top"
            src={product.images || 'https://via.placeholder.com/150'}
            style={{  height:"200px", objectFit :"initial" }}
          />
          <Card.Body>
            <Card.Title className="fs-6 text-truncate">{product.name || 'Untitled Product'}</Card.Title>
            <Card.Text className="text-success fw-bold">
              {product.price ? `₹${product.price}` : 'Price N/A'}
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};
// ----------------------------------------------------------------------


function Mens() {
  const categoryName = "Mens";
  const fetchLimit = 10;

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
        }

        const fetchedProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetchedProducts);

      } catch (err) {
        console.error('Error fetching Mens data:', err);
        setError("Failed to load Men's products. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <Container className="text-center my-5">
      <Spinner animation="border" variant="primary" />
      <p>Loading {categoryName}'s Products...</p>
    </Container>
  );

  if (error) return (
    <Container className="text-center my-5 text-danger">
      <p>Error: {error}</p>
    </Container>
  );

  return (
    <Container className="my-5 text-center">
      <h2 className="fw-bold text-dark mb-4">{categoryName}'s Collection 👔</h2>
      <p className="text-muted mb-5">
        Discover the latest trends and essential styles for **{categoryName.toLowerCase()}**!
      </p>

      {products.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Row>
      ) : (
        <div className="p-4 bg-primary bg-opacity-10 rounded">
          <p className="text-primary fw-bold mb-0">No products found for the {categoryName}'s category yet.</p>
        </div>
      )}
    </Container>
  );
}

export default Mens;