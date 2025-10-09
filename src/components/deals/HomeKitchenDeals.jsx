import React, { useState, useEffect } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function HomeKitchenDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const styles = {
    scrollContainer: {
      display: "flex",
      overflowX: "auto",
      gap: "1rem",
      paddingBottom: "10px",
      scrollbarWidth: "thin",
    },
    productCard: {
      flex: "0 0 auto",
      width: "180px",
      backgroundColor: "#ffffff",
      color: "black",
      borderRadius: "8px",
      textAlign: "center",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      cursor: "pointer",
    },
    productImage: {
      maxHeight: "140px",
      objectFit: "contain",
      width: "100%",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem",
      color: "black",
    },
    seeMore: {
      color: "#007bff",
      textDecoration: "none",
      fontWeight: "bold",
    },
  };

  useEffect(() => {
    const fetchHomeKitchenItems = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products?limit=8");
        if (!response.ok) throw new Error("Network response failed.");
        const data = await response.json();

        const mockTitles = [
          "Smart Dish Soap Dispenser",
          "Premium Silicone Spatula Set",
          "Ceramic Coffee Mug Collection",
          "Digital Kitchen Scale",
          "Stainless Steel Water Bottle",
          "Ergonomic Toothbrush Holder",
          "Aesthetic Wall Clock",
          "Glass Food Storage Containers",
        ];

        const items = data.map((item, index) => ({
          ...item,
          mockTitle: mockTitles[index % mockTitles.length],
          mockPrice: `$${(Math.random() * (50 - 10) + 10).toFixed(2)}`,
        }));

        setProducts(items);
      } catch (e) {
        console.error("Failed to fetch Home & Kitchen items:", e);
        setError("Failed to load Home & Kitchen deals.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeKitchenItems();
  }, []);

  if (loading) {
    return (
      <Container className="my-5 text-center text-dark">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2">Loading Home & Kitchen Deals...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="my-5 px-4">
      <div style={styles.header}>
        <h3 className="mb-0 fw-bold">Up to 70% off | Home & Kitchen Storage</h3>
        <a href="#" style={styles.seeMore}>
          See more &raquo;
        </a>
      </div>

      <div style={styles.scrollContainer}>
        {products.map((product) => (
          <div
            key={product.id}
            style={styles.productCard}
            className="shadow-sm p-2"
            onClick={() => navigate(`/product/${product.id}`)} // 👈 Navigate to ProductDetailPage
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,153,0,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
            }}
          >
            <div className="p-3">
              <img
                src={product.image}
                alt={product.mockTitle}
                style={styles.productImage}
              />
            </div>
            <div className="p-2">
              <p className="fw-bold mb-1 text-success">{product.mockPrice}</p>
              <small>{product.mockTitle}</small>
            </div>
          </div>
        ))}

        {/* Advertisement Card */}
        <div
          style={{
            ...styles.productCard,
            backgroundColor: "#dc3545",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: "white",
          }}
        >
          <h5 className="fw-bold mb-1">🔥 Limited Offer</h5>
          <p className="mb-1">Smart LED Lamp</p>
          <small>Up to 80% off</small>
        </div>
      </div>
    </Container>
  );
}

export default HomeKitchenDeals;
