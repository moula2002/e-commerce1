// src/components/SmallBusinessBestsellers.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SmallBusinessBestsellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ For navigation

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products?limit=8");
        if (!response.ok) throw new Error("Network response failed.");
        const data = await response.json();

        const bestsellerItems = data.slice(0, 7).map((product, index) => ({
          ...product,
          mockTitle: [
            "Handmade wooden decor",
            "Printed serving trays",
            "Floral acrylic box",
            "Wall art set of 3",
            "Golden plant stands",
            "Premium wallpaper roll",
            "Modern vase set",
          ][index % 7] || product.title,
        }));
        setProducts(bestsellerItems);
      } catch (e) {
        setError("Failed to load bestsellers.");
      } finally {
        setLoading(false);
      }
    };
    fetchBestsellers();
  }, []);

  if (loading) return <Container className="my-5 text-center">Loading Bestsellers...</Container>;
  if (error) return <Container className="my-5 alert alert-danger">{error}</Container>;

  return (
    <Container fluid className="my-5 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0 fw-bold">Min. 50% off | Bestsellers from Small businesses</h3>
        <a href="#" className="text-decoration-none">See more &raquo;</a>
      </div>

      <Row
        className="g-3 justify-content-start flex-nowrap"
        style={{ overflowX: "auto", paddingBottom: "15px" }}
      >
        {products.map((product) => (
          <Col
            key={product.id}
            xs={8}
            sm={6}
            md={4}
            lg={2}
            style={{ flex: "0 0 auto", cursor: "pointer" }}
            onClick={() => navigate(`/product/${product.id}`)} // ✅ Navigate on click
          >
            <div className="bg-white p-2 rounded shadow-sm h-100 d-flex flex-column align-items-center text-center">
              <img
                src={product.image}
                alt={product.mockTitle}
                className="img-fluid"
                style={{ maxHeight: "150px", width: "auto", objectFit: "contain" }}
              />
              <small className="mt-2 text-muted">{product.mockTitle}</small>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default SmallBusinessBestsellers;
