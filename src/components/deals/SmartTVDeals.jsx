import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "./Deals.css"
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

function SmartTVDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // ✅ Initialize navigate

  useEffect(() => {
    const fetchTVItems = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products/category/electronics?limit=6");
        if (!response.ok) throw new Error("Network response failed.");
        const data = await response.json();

        const tvLikeItems = data.slice(0, 6).map((product, index) => ({
          ...product,
          mockTitle: [
            "32 QLED 2025 TV",
            "Redmi 4K F Series fireTV",
            "40 QLED Android TV",
            "Lumio Vision 7 4K QLED",
            "50 4K UHD Smart TV",
            "Sony Bravia 4K TV"
          ][index % 6] || product.title,
        }));

        setProducts(tvLikeItems);
      } catch (e) {
        console.error("Failed to fetch TV items:", e);
        setError("Failed to load Smart TV deals.");
      } finally {
        setLoading(false);
      }
    };
    fetchTVItems();
  }, []);

  if (loading) {
    return <Container className="my-5 text-center">Loading Smart TV Deals...</Container>;
  }
  if (error) {
    return <Container className="my-5 alert alert-danger">{error}</Container>;
  }

  return (
    <Container fluid className="my-5 px-4">
      <h3 className="mb-4 fw-bold">Up to 65% off | Deals on Smart TVs</h3>

      <Row className="g-3 justify-content-start flex-nowrap" style={{ overflowX: 'auto', paddingBottom: '15px' }}>
        {products.map((product) => (
          <Col 
            key={product.id} 
            xs={8} sm={6} md={4} lg={2} 
            style={{ flex: '0 0 auto', cursor: 'pointer' }} // ✅ Make clickable
            onClick={() => navigate(`/product/${product.id}`)} // ✅ Navigate on click
          >
            <div className="bg-white p-2 rounded shadow-sm h-100 d-flex flex-column align-items-center text-center">
              <img
                src={product.image}
                alt={product.mockTitle}
                className="img-fluid"
                style={{ maxHeight: '180px', width: 'auto', objectFit: 'contain' }}
              />
              <p className="mt-2 mb-1 fw-bold small">{product.mockTitle}</p>
              <small className="text-success">{product.price.toFixed(0)}*</small>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default SmartTVDeals;
