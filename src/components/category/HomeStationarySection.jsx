// src/components/HomeStationarySection.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

function HomeStationarySection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Inline styles (same as HomeToysSection)
  const styles = {
    imageContainer: {
      width: "100%",
      height: "250px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f8f9fa",
      borderRadius: "10px 10px 0 0",
    },
    productImage: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      transition: "transform 0.3s ease",
      backgroundColor: "#fff",
      padding: "5px",
    },
    productCard: {
      border: "none",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      transition: "transform 0.3s ease",
      backgroundColor: "#ffffff",
    },
  };

  useEffect(() => {
    const fetchStationaryProducts = async () => {
      setLoading(true);
      try {
        const categoryName = "Stationery";
        const productLimit = 5;

        const productsRef = collection(db, "products");
        const q = query(productsRef, where("category", "==", categoryName));
        const snapshot = await getDocs(q);

        let data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 🔀 Shuffle products randomly
        for (let i = data.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [data[i], data[j]] = [data[j], data[i]];
        }

        // 🧩 Limit results
        data = data.slice(0, productLimit);

        setProducts(data);
      } catch (err) {
        console.error("🔥 Error fetching random stationery:", err);
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
                <Link
                  to={`/product/${product.id}`}
                  className="text-decoration-none d-block"
                >
                  <Card
                    className="h-100 shadow-sm border-0 product-card"
                    style={styles.productCard}
                    onMouseEnter={(e) =>
                      (e.currentTarget.querySelector("img").style.transform =
                        "scale(1.03)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.querySelector("img").style.transform =
                        "scale(1)")
                    }
                  >
                    {/* 🖼 Image Container */}
                    <div style={styles.imageContainer}>
                      <Card.Img
                        variant="top"
                        src={
                          product.image ||
                          product.images ||
                          "https://via.placeholder.com/250x300.png?text=No+Image"
                        }
                        alt={product.name || "Unnamed Product"}
                        style={styles.productImage}
                      />
                    </div>

                    <Card.Body>
                      <Card.Title className="fs-6 text-truncate text-dark">
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
