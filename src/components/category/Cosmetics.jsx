// src/components/category/Cosmetics.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function Cosmetics() {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCosmeticsData = async () => {
      try {
        // 🔹 Step 1: Find category named "Cosmetics"
        const categoryRef = collection(db, "category");
        const q = query(categoryRef, where("name", "==", "Cosmetics"));
        const categorySnapshot = await getDocs(q);

        if (categorySnapshot.empty) {
          throw new Error("Cosmetics category not found in Firestore!");
        }

        const categoryData = categorySnapshot.docs[0].data();
        const categoryId = categorySnapshot.docs[0].id;

        setCategory({ id: categoryId, ...categoryData });

        // 🔹 Step 2: Fetch products that belong to this category
        const productsRef = collection(db, "products");
        const productsQuery = query(productsRef, where("categoryId", "==", categoryId));
        const productSnapshot = await getDocs(productsQuery);

        const fetchedProducts = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("🔥 Error fetching cosmetics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCosmeticsData();
  }, []);

  // 🌀 Loading UI
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="info" />
        <p>Loading Cosmetics and Products...</p>
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
      <h2 className="fw-bold text-dark mb-4">{category?.name} Collection 💄</h2>

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
        {category?.description || "Explore our exclusive range of cosmetics!"}
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
                  <Card.Text className="text-success fw-bold">
                    ₹{product.price || "N/A"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="p-4 bg-warning bg-opacity-10 rounded">
          <p className="text-warning fw-bold mb-0">
            No products found in this category.
          </p>
        </div>
      )}
    </Container>
  );
}

export default Cosmetics;
