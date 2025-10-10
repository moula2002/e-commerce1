// src/components/CategoryPanel.jsx

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase"; // ✅ make sure firebase.js exports initialized `app`

/**
 * CategoryPanel Component
 * Fetches product previews from Firestore by category document ID.
 */
function CategoryPanel({ title, categoryId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const db = getFirestore(app);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Get the document for this category
        const docRef = doc(db, "category", categoryId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Assume Firestore doc contains { products: [ {id, image, title, price}, ... ] }
          const formattedItems = (data.products || []).slice(0, 2).map((product) => ({
            id: product.id,
            image: product.image,
            description:
              product.title.length > 25
                ? product.title.substring(0, 25) + "..."
                : product.title,
          }));

          setItems(formattedItems);
        } else {
          setError("No such category found.");
        }
      } catch (err) {
        console.error("Firestore fetch failed:", err);
        setError("Failed to load category deals.");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryItems();
    }
  }, [categoryId, db]);

  if (loading) {
    return (
      <Card className="shadow-sm h-100 border-0 p-4 text-center">
        <Spinner animation="border" size="sm" className="mb-2" />
        <div>Loading {title}...</div>
      </Card>
    );
  }

  if (error || items.length === 0) {
    return (
      <Card className="shadow-sm h-100 border-0 p-3 text-center">
        <h5 className="fw-bold mb-3">{title}</h5>
        <p className="text-muted small">{error || "No deals found."}</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm h-100 border-0 p-3">
      <h5 className="fw-bold mb-3">{title}</h5>

      <Row className="g-2">
        {items.map((item, index) => (
          <Col
            xs={6}
            key={index}
            className="d-flex flex-column align-items-center text-center"
          >
            <Link
              to={`/product/${item.id}`}
              className="text-decoration-none text-dark"
            >
              <img
                src={item.image}
                alt={item.description}
                className="img-fluid rounded mb-2 bg-light"
                style={{
                  height: "80px",
                  width: "auto",
                  objectFit: "contain",
                  padding: "5px",
                }}
              />
              <small
                className="text-muted d-block"
                style={{ fontSize: "0.75rem", lineHeight: "1rem" }}
              >
                {item.description}
              </small>
            </Link>
          </Col>
        ))}
      </Row>

      <div className="mt-3 text-center">
        <a href="#" className="text-decoration-none small">
          See more &raquo;
        </a>
      </div>
    </Card>
  );
}

export default CategoryPanel;
