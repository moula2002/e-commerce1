// src/components/HomeKitchenDeals.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

/**
 * Renders a horizontal scrollable section of Home & Kitchen related products
 * as seen in the Amazon screenshot (as simple images, not full cards).
 */
function HomeKitchenDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeKitchenItems = async () => {
      try {
        // Fetch more items to get a good selection for filtering
        const response = await fetch('https://fakestoreapi.com/products?limit=8');
        if (!response.ok) throw new Error("Network response failed.");
        const data = await response.json();

        // Filter for items that *could* be home/kitchen related, or at least not clothing/jewelry
        const homeKitchenLikeItems = data
          .filter(product => 
            !['electronics', 'jewelery', 'men\'s clothing', 'women\'s clothing']
            .some(category => product.category.toLowerCase().includes(category))
          )
          .slice(0, 5) // Get about 5 items
          .map((product, index) => ({
              ...product,
              // Custom titles to fit the screenshot's look
              mockTitle: [
                "Toothbrush Holder", 
                "Dish Soap Dispenser", 
                "Trash Bags Roll", 
                "Batman Key Holder", 
                "Egg Storage Rack"
              ][index % 5] || product.title // Cycle through mock titles
          }));

        setProducts(homeKitchenLikeItems);
      } catch (e) {
        console.error("Failed to fetch home/kitchen items:", e);
        setError("Failed to load Home & Kitchen deals.");
      } finally {
        setLoading(false);
      }
    };
    fetchHomeKitchenItems();
  }, []);

  if (loading) {
    return <Container className="my-4 text-center">Loading Home & Kitchen Deals...</Container>;
  }
  if (error) {
    return <Container className="my-4 alert alert-danger">{error}</Container>;
  }

  return (
    <Container fluid className="my-5 px-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0 fw-bold">Up to 70% off | Home & kitchen storage from stores nearby</h3>
        <a href="#" className="text-decoration-none">See more &raquo;</a>
      </div>

      <Row className="g-3 justify-content-start">
        {products.map((product, index) => (
          // Each item is a Col. lg={2} makes 6 items per row, or 5 plus space
          <Col key={product.id} xs={6} md={4} lg={2} className="d-flex flex-column align-items-center text-center">
            <div className="bg-white p-3 rounded shadow-sm h-100 w-100 d-flex flex-column justify-content-center align-items-center">
              <img 
                src={product.image} 
                alt={product.mockTitle} 
                className="img-fluid" 
                style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }}
              />
              <small className="mt-2 text-muted">{product.mockTitle}</small>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default HomeKitchenDeals;