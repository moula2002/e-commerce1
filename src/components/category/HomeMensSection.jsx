// src/components/category/HomeMensSection.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    transform: isHovered ? "scale(1.03)" : "scale(1)",
    boxShadow: isHovered
      ? "0 10px 20px rgba(0, 0, 0, 0.25)"
      : "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
    zIndex: isHovered ? 10 : 1,
    cursor: "pointer",
  };

  return (
    <Col>
      <Link
        to={`/product/${product.id}`}
        className="text-decoration-none text-dark d-block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="h-100 border-0" style={cardStyle}>
          <Card.Img
            variant="top"
            src={product.images || "https://via.placeholder.com/200x200.png?text=No+Image"}
            style={{ height: "200px", objectFit: "contain" }}
          />
          <Card.Body>
            <Card.Title className="fs-6 text-truncate">
              {product.name || "Untitled Product"}
            </Card.Title>
            <Card.Text className="text-success fw-bold">
              {product.price ? `₹${product.price}` : "Price N/A"}
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};

function HomeMensSection() {
  const categoryName = "Mens";
  const fetchLimit = 5;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMensProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(
          productsRef,
          where("category", "==", categoryName),
          orderBy("name"),
          limit(fetchLimit)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (err) {
        console.error("Error fetching Mens preview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMensProducts();
  }, []);

  return (
    <Container className="my-5 text-center">
      <h3 className="fw-bold text-dark mb-4">Featured Mens Clothing 👔</h3>

      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={5} className="g-4 justify-content-center">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Row>

          {/* 🔹 Show More Button */}
          <div className="mt-4">
            <Link to="/mens">
              <Button variant="success" size="lg" className="px-4 fw-bold">
                Show More →
              </Button>
            </Link>
          </div>
        </>
      )}
    </Container>
  );
}

export default HomeMensSection;
