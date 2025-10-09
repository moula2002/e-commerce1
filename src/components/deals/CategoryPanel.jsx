import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

function CategoryPanel({ title, mockCategory }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        setLoading(true);
        // API-லிருந்து எல்லா பொருட்களை fetch செய்கிறது
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) throw new Error("Network response failed");
        const data = await response.json();

        // category-ஐ பயன்படுத்தி filter செய்கிறது
        const filteredItems = data.filter((product) =>
          product.category.toLowerCase().includes(mockCategory.toLowerCase())
        );

        // முதல் 2 பொருட்களை எடுத்து, அவற்றை display செய்வதற்கு ஏற்றவாறு format செய்கிறது
        const formattedItems = filteredItems.slice(0, 2).map((product) => ({
          id: product.id,
          image: product.image,
          // title-ஐ 25 எழுத்துக்களுக்கு மேல் இருந்தால் சுருக்குகிறது
          description:
            product.title.length > 25
              ? product.title.substring(0, 25) + "..."
              : product.title,
        }));

        setItems(formattedItems);
      } catch (err) {
        console.error(err);
        setError("Failed to load category deals.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryItems();
  }, [mockCategory]); // mockCategory மாறும்போது மீண்டும் fetch செய்ய வேண்டும்

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
        {items.map((item) => (
          <Col
            xs={6}
            key={item.id}
            className="d-flex flex-column align-items-center text-center"
          >
            {/* இங்கே தான் ProductDetailPage-க்கு Routing செல்கிறது */}
            <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">
              <img
                src={item.image}
                alt={item.description}
                className="img-fluid rounded mb-2 bg-light"
                style={{ height: "80px", width: "auto", objectFit: "contain", padding: "5px" }}
              />
              <small className="text-muted d-block" style={{ fontSize: "0.75rem", lineHeight: "1rem" }}>
                {item.description}
              </small>
            </Link>
          </Col>
        ))}
      </Row>
    </Card>
  );
}

export default CategoryPanel;