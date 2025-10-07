import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation

function RelatedItems() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const scrollDistance = 300;
  const navigate = useNavigate(); // ✅ Initialize navigate

  useEffect(() => {
    const fetchRelatedItems = async () => {
      try {
        const response = await fetch(
          "https://fakestoreapi.com/products/category/electronics?limit=8"
        );
        if (!response.ok) throw new Error("Network response failed.");
        const data = await response.json();

        const mockedItems = data.slice(0, 8).map((product, index) => ({
          id: product.id,
          name: product.title,
          specs: product.description.substring(0, 50) + "...",
          price: (parseFloat(product.price) * 1000).toFixed(2),
          mrp: (parseFloat(product.price) * 1500).toFixed(2),
          discount:
            Math.floor(Math.random() * (40 - 20 + 1) + 20) + "% OFF",
          reviews:
            Math.floor(Math.random() * (10000 - 1000 + 1) + 1000),
          delivery: `Get it by ${new Date(
            Date.now() + index * 86400000
          ).toLocaleDateString("en-IN", {
            weekday: "short",
            month: "long",
            day: "numeric",
          })}`,
          image: product.image,
        }));

        setProducts(mockedItems);
      } catch (e) {
        setError("Failed to load related items.");
      } finally {
        setLoading(false);
      }
    };
    fetchRelatedItems();
  }, []);

  // Scroll logic...
  const scroll = (direction) => {
    if (scrollRef.current) {
      const newScroll =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollDistance
          : scrollRef.current.scrollLeft + scrollDistance;

      scrollRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  if (loading)
    return <Container className="my-5 text-center">Loading Related Items...</Container>;
  if (error)
    return <Container className="my-5 alert alert-danger">{error}</Container>;

  return (
    <Container fluid className="my-4 px-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h2 className="fs-4 fw-normal mb-0">
            Related to items you've viewed
          </h2>
        </Col>
        <Col xs="auto">
          <a href="#see-more" className="text-decoration-none small text-primary">
            See more
          </a>
        </Col>
      </Row>

      <div className="position-relative">
        <Button
          variant="light"
          className="position-absolute start-0 top-50 translate-middle-y z-3 p-2 shadow-sm border"
          style={{ height: "100%", minHeight: "150px" }}
          onClick={() => scroll("left")}
        >
          &lt;
        </Button>

        <div ref={scrollRef} className="d-flex overflow-x-auto py-2">
          <div className="d-flex flex-nowrap" style={{ gap: "15px" }}>
            {products.map((product) => (
              <Card
                key={product.id}
                className="shadow-sm border-light"
                style={{ minWidth: "280px", maxWidth: "300px", cursor: "pointer" }}
                onClick={() => navigate(`/product/${product.id}`)} // ✅ Navigation added
              >
                <div
                  className="d-flex justify-content-center align-items-center p-3"
                  style={{ height: "180px" }}
                >
                  <Card.Img
                    src={product.image}
                    alt={product.name}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <Card.Body className="py-2">
                  <Card.Title
                    className="fs-6 text-truncate"
                    title={product.name}
                  >
                    {product.name}
                  </Card.Title>
                  <Card.Text className="text-muted small mb-1">
                    {product.specs}
                  </Card.Text>
                  <div className="mb-2">
                    <span className="text-danger fw-bold me-2">
                      {product.discount}
                    </span>
                    <span className="text-secondary small">
                      Great Indian Festival
                    </span>
                  </div>
                  <div className="d-flex align-items-baseline mb-1">
                    <span className="text-dark fw-bold fs-5 me-2">
                      ₹{product.price}
                    </span>
                    <span className="text-muted small text-decoration-line-through">
                      M.R.P. ₹{product.mrp}
                    </span>
                  </div>
                  <Card.Text className="small text-success fw-bold mb-0">
                    {product.delivery}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>

        <Button
          variant="light"
          className="position-absolute end-0 top-50 translate-middle-y z-3 p-2 shadow-sm border"
          style={{ height: "100%", minHeight: "150px" }}
          onClick={() => scroll("right")}
        >
          &gt;
        </Button>
      </div>
    </Container>
  );
}

export default RelatedItems;
