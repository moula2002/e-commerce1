// src/components/category/Toys.jsx
import React, { useState, useEffect } from "react";
import { Container, Spinner, Card, Row, Col } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { Link } from "react-router-dom"; 

// -------------------------------------------------------------
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const productColor = product.color || "N/A";
  const cardStyle = {
    transition: "transform 0.3s ease-in-out, boxShadow 0.3s ease-in-out",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
    boxShadow: isHovered
      ? "0 10px 20px rgba(0, 0, 0, 0.2)"
      : "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
    zIndex: isHovered ? 10 : 1,
    cursor: 'pointer'
  };

  return (
    <Col>
      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="h-100 border-0" style={cardStyle}>
          <Card.Img
            variant="top"
            src={product.images || product.image || "https://via.placeholder.com/200"}
            style={{ height: "180px", objectFit: "cover" }}
          />
          <Card.Body>
            <Card.Title className="fs-6 text-truncate text-dark">
              {product.name || "Unnamed Toy"}
            </Card.Title>
            <Card.Text className="text-secondary small">
              Color: <strong style={{ color: productColor !== 'N/A' ? 'black' : 'grey' }}>{productColor}</strong>
            </Card.Text>
            <Card.Text className="text-primary fw-bold fs-5 mt-2">
              ₹{product.price || "N/A"}
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};
// -------------------------------------------------------------

function Toys() {
  const categoryName = "Toys";
  const fetchLimit = 10; 

  const [products, setProducts] = useState([]);
  // const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 🔹 1. Fetch products directly using the 'category' field
        const productsRef = collection(db, "products");
        const productsQuery = query(
          productsRef,
          where("category", "==", categoryName),
          limit(fetchLimit) // 🎯 Limit set to 10
        );

        const productSnapshot = await getDocs(productsQuery);

        if (productSnapshot.empty) {
          console.warn(`No products found in category: ${categoryName}`);
        }

        const fetchedProducts = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(`🧸 Limited ${categoryName} Products fetched:`, fetchedProducts);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error(`🔥 Error fetching ${categoryName} products:`, err);
        setError("Failed to load products. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🌀 Loading UI
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p>Loading {categoryName} Products...</p>
      </Container>
    );
  }

  // ⚠️ Error UI
  if (error) {
    return (
      <Container className="text-center my-5 text-danger">
        <p>{error}</p>
      </Container>
    );
  }

  // ✅ Success UI
  return (
    <Container className="my-5 text-center">
      <h2 className="fw-bold text-dark mb-4">{categoryName} Products 🧸</h2>

      {products.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Row>
      ) : (
        <div className="p-4 bg-success bg-opacity-10 rounded">
          <p className="text-success fw-bold mb-0">
            No products found in the **{categoryName}** category.
          </p>
        </div>
      )}
    </Container>
  );
}

export default Toys;