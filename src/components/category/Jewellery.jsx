// src/components/category/Jewellery.jsx
import React, { useState, useEffect } from 'react';
import { Container, Spinner, Card, Row, Col } from 'react-bootstrap';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import { db } from '../../firebase';

function Jewellery() {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch category by name "Jewellery"
        const categoryRef = collection(db, 'category');
        const categoryQuery = query(categoryRef, where('name', '==', 'Jewellery'));
        const categorySnapshot = await getDocs(categoryQuery);

        if (categorySnapshot.empty) {
          throw new Error('Jewellery category not found!');
        }

        const categoryDoc = categorySnapshot.docs[0];
        const categoryData = { id: categoryDoc.id, ...categoryDoc.data() };
        setCategory(categoryData);

        // 2️⃣ Fetch products belonging to this category
        const productsRef = collection(db, 'products');
        const productsQuery = query(productsRef, where('categoryId', '==', categoryData.id));
        const productsSnapshot = await getDocs(productsQuery);

        const fetchedProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetchedProducts);

      } catch (err) {
        console.error('Error fetching Jewellery data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <Container className="text-center my-5">
      <Spinner animation="border" variant="warning" />
      <p>Loading Jewellery Category...</p>
    </Container>
  );

  if (error) return (
    <Container className="text-center my-5 text-danger">
      <p>{error}</p>
    </Container>
  );

  return (
    <Container className="my-5 text-center">
      <h2 className="fw-bold text-warning mb-4">{category?.name || "Jewellery"} Collection 💍</h2>

      {category?.image && (
        <img
          src={category.image}
          alt={category.name}
          className="img-fluid rounded shadow-sm mb-3"
          style={{ maxWidth: '400px', maxHeight: '250px', objectFit: 'cover' }}
        />
      )}

      <p className="text-dark mb-5">
        {category?.description || "Adorn yourself with elegance and sparkle from our stunning jewellery collection!"}
      </p>


      {products.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {products.map(product => (
            <Col key={product.id}>
              <Card className="h-100 shadow-lg border-0 bg-dark text-white">
                <Card.Img 
                  variant="top" 
                  src={product.image || 'placeholder.jpg'} 
                  style={{ height: '150px', objectFit: 'cover' }} 
                />
                <Card.Body>
                  <Card.Title className="fs-6 text-truncate text-warning">{product.name || 'Untitled Jewellery'}</Card.Title>
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
          <p className="text-dark fw-bold mb-0">No products found for the {category?.name || 'Jewellery'} category yet.</p>
        </div>
      )}
    </Container>
  );
}

export default Jewellery;
