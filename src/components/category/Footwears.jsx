import React, { useState, useEffect } from 'react';
import { Container, Spinner, Card, Row, Col } from 'react-bootstrap';
import { collection, query, where, getDocs, limit } from 'firebase/firestore'; 
import { db } from '../../firebase';

function Footwears() {
  const categoryName = "Footwear"; 
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
        console.error('Error fetching Footwears data:', err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Runs once on mount

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
      <h2 className="fw-bold text-warning mb-4">{categoryName} Collection 👟</h2>
      {products.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {products.map(product => (
            <Col key={product.id}>
              <Card className="h-100 shadow-lg border-0 bg-dark text-white">
                <Card.Img 
                  variant="top" 
                  src={product.images || 'https://via.placeholder.com/150'} 
                  style={{ height: '150px', objectFit: 'cover' }} 
                />
                <Card.Body>
                  <Card.Title className="fs-6 text-truncate text-warning">{product.name || 'Untitled Product'}</Card.Title>
                  <Card.Text className="text-light fw-bold">
                    {product.price ? `₹${product.price}` : 'Price N/A'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
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

export default Footwears;
