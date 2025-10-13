// src/components/category/Toys.jsx
import React, { useState, useEffect } from "react";
import { Container, Spinner, Card, Row, Col } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function Toys() {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToysData = async () => {
      try {
        // 🔹 1. Find category with name "Toys"
        const categoryRef = collection(db, "category");
        const q = query(categoryRef, where("name", "==", "Toys"));
        const categorySnapshot = await getDocs(q);

        if (categorySnapshot.empty) {
          throw new Error("Toys category not found in Firestore!");
        }

        const categoryDoc = categorySnapshot.docs[0];
        const categoryData = categoryDoc.data();
        const categoryId = categoryDoc.id;

        setCategory({ id: categoryId, ...categoryData });

        // 🔹 2. Fetch products belonging to this category
        const productsRef = collection(db, "products");
        const productsQuery = query(productsRef, where("categoryId", "==", categoryId));
        const productSnapshot = await getDocs(productsQuery);

        const fetchedProducts = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("🔥 Error fetching toys:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchToysData();
  }, []);

  // 🌀 Loading UI
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p>Loading Toys Category...</p>
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
      <h2 className="fw-bold text-dark mb-4">{category?.name || "Toys"} 🧸</h2>

      {/* Category Image */}
      {category?.image && (
        <img
          src={category.image}
          alt={category.name}
          className="img-fluid rounded shadow-sm mb-3"
          style={{ maxWidth: "400px", maxHeight: "250px", objectFit: "cover" }}
        />
      )}

      <p className="text-muted mb-5">
        {category?.description || "Discover fun and educational toys for all ages!"}
      </p>

      {products.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {products.map((product) => (
            <Col key={product.id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Img
                  variant="top"
                  src={product.image || "placeholder.jpg"}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fs-6 text-truncate">
                    {product.name}
                  </Card.Title>
                  <Card.Text className="text-primary fw-bold">
                    ₹{product.price || "N/A"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="p-4 bg-success bg-opacity-10 rounded">
          <p className="text-success fw-bold mb-0">
            No products found in this category.
          </p>
        </div>
      )}
    </Container>
  );
}

export default Toys;
