// src/components/category/Stationary.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Spinner, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

// ✏️ Extract color from description if missing
const extractColorFromDescription = (description) => {
  if (!description || typeof description !== "string") return "N/A";
  const match = description.match(/color:\s*([a-zA-Z]+)/i);
  return match ? match[1] : "N/A";
};

// 🎨 Product Card
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const productColor = product.color || extractColorFromDescription(product.description);

  const cardStyle = {
    transition: "transform 0.3s ease-in-out, boxShadow 0.3s ease-in-out",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
    boxShadow: isHovered
      ? "0 10px 20px rgba(0, 0, 0, 0.25)"
      : "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
    zIndex: isHovered ? 10 : 1,
    cursor: "pointer",
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
              {product.name || "Untitled Stationery Item"}
            </Card.Title>
            <Card.Text className="text-secondary small">
              Color: <strong style={{ color: productColor !== "N/A" ? "black" : "grey" }}>{productColor}</strong>
            </Card.Text>
            <Card.Text className="text-success fw-bold fs-5 mt-2">
              ₹{product.price || "N/A"}
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};

// 📝 Stationary Page with Infinite Scroll
function Stationary() {
  const categoryName = "Stationery";
  const [products, setProducts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // 🔹 Initial fetch
  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, "products");
        const q = query(
          productsRef,
          where("category", "==", categoryName),
          orderBy("name"),
          limit(6)
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(fetched);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        if (snapshot.docs.length < 6) setHasMore(false);
      } catch (err) {
        console.error(`🔥 Error fetching ${categoryName}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialProducts();
  }, []);

  // 🔹 Load more products
  const loadMore = useCallback(async () => {
    if (!lastVisible || loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const productsRef = collection(db, "products");
      const nextQuery = query(
        productsRef,
        where("category", "==", categoryName),
        orderBy("name"),
        startAfter(lastVisible),
        limit(6)
      );
      const snapshot = await getDocs(nextQuery);
      const newProducts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (newProducts.length === 0) {
        setHasMore(false);
        return;
      }
      setProducts((prev) => [...prev, ...newProducts]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      if (snapshot.docs.length < 6) setHasMore(false);
    } catch (err) {
      console.error(`Error loading more ${categoryName}:`, err);
    } finally {
      setLoadingMore(false);
    }
  }, [lastVisible, loadingMore, hasMore]);

  // 🔹 Intersection Observer for infinite scroll
  const lastProductRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadMore, hasMore, loadingMore]
  );

  return (
    <Container className="my-5 text-center">
      <h2 className="fw-bold text-dark mb-4">{categoryName} ✏️</h2>
      <p className="text-muted mb-5">
        Explore our complete <strong>{categoryName.toLowerCase()}</strong> collection!
      </p>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="success" />
          <p>Loading {categoryName}...</p>
        </div>
      ) : products.length > 0 ? (
        <>
          <Row xs={1} md={2} lg={4} className="g-4">
            {products.map((product, index) => {
              if (index === products.length - 1) {
                return (
                  <div ref={lastProductRef} key={product.id}>
                    <ProductCard product={product} />
                  </div>
                );
              } else {
                return <ProductCard key={product.id} product={product} />;
              }
            })}
          </Row>

          {loadingMore && (
            <div className="text-center my-4">
              <Spinner animation="grow" variant="secondary" />
              <p>Loading more...</p>
            </div>
          )}
          {!hasMore && <p className="text-muted mt-4">🎉 You’ve reached the end!</p>}
        </>
      ) : (
        <div className="p-4 bg-primary bg-opacity-10 rounded">
          <p className="text-primary fw-bold mb-0">No products found in {categoryName}.</p>
        </div>
      )}
    </Container>
  );
}

export default Stationary;
