// src/components/MobileDealsSection.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import DealCard from './DealCard'; 
import { useNavigate } from 'react-router-dom';

const getRandomDiscount = () => Math.floor(Math.random() * (70 - 10 + 1)) + 10;

function MobileDealsSection() {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // ✅ For navigating to ProductDetailPage

  useEffect(() => {
    const fetchAndFilterMobiles = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products?limit=10'); 
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json();

        const excludedKeywords = ['jewelry', 'clothing', 'jacket', 'ring', 'chain', 'silver'];
        
        const filteredMobiles = data
          .filter(product => 
            !excludedKeywords.some(keyword => product.category.toLowerCase().includes(keyword))
          )
          .map(product => ({
            ...product,
            title: product.title.length > 25 ? `OPPO K13X 5G ${product.id}` : product.title, 
            discount: getRandomDiscount() 
          }))
          .slice(0, 5); // Limit to 5 products

        setMobiles(filteredMobiles);
      } catch (e) {
        console.error("Failed to fetch products:", e);
        setError("Oops! Could not load the mobile deals.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterMobiles();
  }, []);

  if (loading) {
    return <Container className="my-5 text-center">Loading best deals on smartphones...</Container>;
  }

  if (error) {
    return <Container className="my-5 alert alert-danger">{error}</Container>;
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Best deals on smartphones 📱</h3>
      </div>
      
      <Row className="g-3">
        {mobiles.map((product) => (
          <Col 
            key={product.id} 
            xs={6} 
            md={4} 
            lg={2} 
            className="d-flex"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/product/${product.id}`)} // ✅ Navigate on click
          >
            <DealCard product={product} discount={product.discount} />
          </Col>
        ))}
        
        {/* Dedicated Ad Placeholder */}
        <Col xs={6} md={4} lg={2} className="d-flex">
            <div className="w-100 bg-danger text-white p-3 rounded shadow-sm d-flex flex-column justify-content-center text-center ad-box h-100">
                <h4 className="h5">boat</h4>
                <p className="mb-1">35 W power on-the-go</p>
                <h5 className="fw-bold">Powerbank</h5>
                <small>Up to 75% off</small>
            </div>
        </Col>
      </Row>
    </Container>
  );
}

export default MobileDealsSection;
