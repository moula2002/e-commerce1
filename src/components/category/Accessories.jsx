import React, { useState, useEffect } from "react";
import { Container, Spinner, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, query, where, limit, startAfter } from "firebase/firestore";

const extractColorFromDescription = (description) => {
  if (!description || typeof description !== 'string') return null;
  const match = description.match(/color:\s*([a-zA-Z]+)/i);
  return match ? match[1].trim() : null;
};

// -------------------------------------------------------------
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const productColor = product.color || extractColorFromDescription(product.description) || "N/A";

  const cardStyle = {
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
    boxShadow: isHovered
      ? "0 10px 20px rgba(0, 0, 0, 0.3)"
      : "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
    zIndex: isHovered ? 10 : 1,
  };

  return (
    <Col>
      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card
          className="h-100 border-0"
          style={cardStyle}
        >
          <Card.Img
            variant="top"
            
            src={product.image || product.images || "https://via.placeholder.com/180"}
            style={{ height: "200px", objectFit: "initial" }}
          />
          <Card.Body>
            <Card.Title className="fs-6 text-truncate text-dark">
              {product.name || "Untitled Product"}
            </Card.Title>
            
                  <Card.Text className="text-secondary small mb-2">
              Color: <strong style={{ color: productColor !== 'N/A' ? 'black' : 'grey' }}>{productColor}</strong>
            </Card.Text>

            <Card.Text className="text-success fw-bold">
              ₹{product.price || "N/A"}
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};
// -------------------------------------------------------------

function Accessories() {
  const categoryName = "Accessories";
  const fetchLimit = 20;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const productsRef = collection(db, "products");

  // Fetch first page...
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          productsRef,
          where("category", "==", categoryName),
          limit(fetchLimit)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const fetchedProducts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(fetchedProducts);
          setLastVisibleDoc(snapshot.docs[snapshot.docs.length - 1]);
          if (snapshot.docs.length < fetchLimit) setHasMore(false);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("🔥 Error fetching accessories:", err);
        setError("Failed to load Accessories products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Load more products (pagination)... (Remains unchanged)
  const loadMoreProducts = async () => {
    if (!lastVisibleDoc) return;
    setLoadingMore(true);

    try {
      const nextQuery = query(
        productsRef,
        where("category", "==", categoryName),
        startAfter(lastVisibleDoc),
        limit(fetchLimit)
      );

      const snapshot = await getDocs(nextQuery);
      if (!snapshot.empty) {
        const fetchedProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts((prev) => [...prev, ...fetchedProducts]);
        setLastVisibleDoc(snapshot.docs[snapshot.docs.length - 1]);

        if (snapshot.docs.length < fetchLimit) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("🔥 Error loading more products:", err);
      setError("Failed to load more products.");
    } finally {
      setLoadingMore(false);
    }
  };

  // Loading UI... (Remains unchanged)
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="info" />
        <p>Loading {categoryName}...</p>
      </Container>
    );
  }

  // Error UI... (Remains unchanged)
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
      <h2 className="fw-bold text-dark mb-4">{categoryName} 👜</h2>
      <p className="text-muted mb-5">
        Explore our stylish <strong>{categoryName.toLowerCase()}</strong> collection!
      </p>

      {products.length > 0 ? (
        <>
          <Row xs={1} md={2} lg={4} className="g-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Row>
          {/* Load More Button */}
          {hasMore && (
            <div className="mt-5">
              <Button
                onClick={loadMoreProducts}
                disabled={loadingMore}
                variant="outline-info"
              >
                {loadingMore ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Loading...
                  </>
                ) : (
                  "Load More Accessories"
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="p-4 bg-warning bg-opacity-10 rounded">
          <p className="text-warning fw-bold mb-0">
            No products found in the {categoryName} category yet.
          </p>
        </div>
      )}
    </Container>
  );
}

export default Accessories;