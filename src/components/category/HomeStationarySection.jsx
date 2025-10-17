// src/components/HomeStationarySection.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

function HomeStationarySection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStationaryProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(
          productsRef,
          where("category", "==", "Stationery"),
          orderBy("name"),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (err) {
        console.error("Error fetching stationery preview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStationaryProducts();
  }, []);

  return (
    <Container className="my-5 text-center">
      <h3 className="fw-bold text-dark mb-4">Trending Stationery ✏️</h3>

      {loading ? (
        <Spinner animation="border" variant="success" />
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={5} className="g-4 justify-content-center">
            {products.map((product) => (
              <Col key={product.id}>
                {/* 🚨 FIX: Wrap the entire card content in a Link */}
                <Link
                  to={`/product/${product.id}`}
                  className="text-decoration-none d-block h-100 text-dark"
                  onClick={() => window.scrollTo(0, 0)} // Scroll to top when navigating
                >
                  <Card className="product-card h-100 shadow-sm border-0">
                    <div className="image-container">
                      <Card.Img
                        variant="top"
                        src={
                          product.image ||
                          product.images ||
                          "https://via.placeholder.com/200x200.png?text=No+Image"
                        }
                        alt={product.name || "Unnamed Product"}
                        style={{ objectFit: "contain", height: "200px" }}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="fs-6 text-truncate">
                        {product.name || "Unnamed Product"}
                      </Card.Title>
                      <Card.Text className="text-success fw-bold">
                        ₹{product.price || "N/A"}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>

          {/* 🔹 Show More Button */}
          <div className="mt-4">
            <Link to="/stationary">
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

export default HomeStationarySection;