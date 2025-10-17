// src/components/HomeJewellerySection.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

// ✏️ Extract color from description if missing
const extractColorFromDescription = (description) => {
  if (!description || typeof description !== "string") return "N/A";
  const match = description.match(/color:\s*([a-zA-Z]+)/i);
  return match ? match[1] : "N/A";
};

function HomeJewellerySection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJewelleryProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(
          productsRef,
          where("category", "==", "Jewellery"),
          orderBy("name"),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (err) {
        console.error("Error fetching Jewellery preview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJewelleryProducts();
  }, []);

  return (
    <Container className="my-5 text-center">
      <h3 className="fw-bold text-dark mb-4">Trending Jewellery 💍</h3>

      {loading ? (
        <Spinner animation="border" variant="warning" />
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={5} className="g-4 justify-content-center">
            {products.map((product) => {
              const productColor = product.color || extractColorFromDescription(product.description);
              return (
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
                          alt={product.name || "Unnamed Jewellery"}
                          style={{ objectFit: "contain", height: "200px" }}
                        />
                      </div>
                      <Card.Body>
                        <Card.Title className="fs-6 text-truncate">
                          {product.name || "Unnamed Jewellery"}
                        </Card.Title>
                        <Card.Text className="text-secondary small">
                          Color:{" "}
                          <strong style={{ color: productColor !== "N/A" ? "black" : "grey" }}>
                            {productColor}
                          </strong>
                        </Card.Text>
                        <Card.Text className="text-success fw-bold">
                          ₹{product.price || "N/A"}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>

          {/* 🔹 Show More Button */}
          <div className="mt-4">
            <Link to="/jewellery">
              <Button variant="warning" size="lg" className="px-4 fw-bold">
                Show More →
              </Button>
            </Link>
          </div>
        </>
      )}
    </Container>
  );
}

export default HomeJewellerySection;