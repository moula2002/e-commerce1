// src/components/DealsSection.jsx

import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import DealCard from './DealCard'; // Import DealCard

const getRandomDiscount = () => Math.floor(Math.random() * (70 - 10 + 1)) + 10;

function DealsSection({ title = "Featured Deals", limit = 6 }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products?limit=${limit}`);
        if (!response.ok) throw new Error("Network response failed.");
        const data = await response.json();

        const productsWithDiscount = data.map(product => ({
          ...product,
          discount: getRandomDiscount()
        }));

        setProducts(productsWithDiscount);
      } catch (e) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [limit]);

  if (loading) {
    return <div className="text-center p-4">Loading {title}...</div>;
  }
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <h5 className="mb-3 fw-bold">{title}</h5>
      
      {/* Row structure for the 2x2 grid */}
      <Row className="g-3">
        {products.map((product) => (
        
          <Col key={product.id} xs={6} className="d-flex">
            <DealCard product={product} discount={product.discount} />
          </Col>
        ))}
        {/* Ensures an even number of columns if necessary */}
        {products.length % 2 !== 0 && <Col xs={6}></Col>}
      </Row>

      <div className="mt-3">
        <a href="#" className="text-decoration-none small">See all deals &raquo;</a>
      </div>
    </>
  );
}

export default DealsSection;