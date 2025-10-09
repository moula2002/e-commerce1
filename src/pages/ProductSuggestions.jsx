// src/components/ProductSuggestions.js
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

function ProductSuggestions({ currentProductId, category }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;

    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
        
        if (!response.ok) throw new Error("Failed to fetch suggestions");
        
        const data = await response.json();
        const exchangeRate = 83; // USD to INR

        const filteredSuggestions = data
          .filter((product) => product.id !== currentProductId)
          .slice(0, 4) 
          .map((product) => ({
            id: product.id,
            image: product.image,
            title: product.title.substring(0, 30) + (product.title.length > 30 ? "..." : ""),
            price: (product.price * exchangeRate).toFixed(0),
          }));

        setSuggestions(filteredSuggestions);
      } catch (err) {
        console.error(err);
        setError("Could not load related products.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [category, currentProductId]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" size="sm" />
        <p className="small text-muted mt-2">Loading suggestions...</p>
      </div>
    );
  }

  if (error || suggestions.length === 0) {
    return (
      <Alert variant="info" className="text-center small">
        No similar products found in this category.
      </Alert>
    );
  }

  return (
    <div className="mt-5 pt-3 border-top">
      <h4 className="mb-4 fw-bold">People Also Viewed</h4>
      <Row className="g-4">
        {suggestions.map((item) => (
          <Col xs={6} md={3} key={item.id}>
            <Link to={`/product/${item.id}`} className="text-decoration-none text-dark d-block h-100">
              <Card className="shadow-sm h-100 product-suggestion-card text-center">
                <div className="d-flex justify-content-center align-items-center p-3" style={{ height: '150px' }}>
                    <Card.Img 
                        variant="top" 
                        src={item.image} 
                        style={{ height: "100px", width: "auto", objectFit: "contain" }} 
                    />
                </div>
                <Card.Body className="p-2 d-flex flex-column justify-content-end">
                  <small className="text-muted d-block mb-1" style={{minHeight: '30px'}}>{item.title}</small>
                  <Card.Text className="fw-bold text-danger fs-5 mt-auto">
                    ₹{item.price}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ProductSuggestions;