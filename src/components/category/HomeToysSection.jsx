// src/components/HomeToysSection.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button, Badge } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

// 🎨 DEFINE CONSTANTS FOR AESTHETIC CONSISTENCY
const PRIMARY_TEXT_COLOR = "#101010";
const ACCENT_COLOR = "#198754"; // ✅ same green tone as Accessories
const SALE_COLOR = "#dc3545";
const WHITE_COLOR = "#FFFFFF";

// 🎨 STYLING SYSTEM (Same as HomeAccessoriesSection)
const customStyles = {
  sectionContainer: {
    backgroundColor: WHITE_COLOR,
    borderRadius: "25px",
    padding: "5.5rem 2rem",
    boxShadow: "0 15px 50px rgba(0, 0, 0, 0.08)",
  },
  productCard: {
    border: "1px solid #e9ecef",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
    backgroundColor: WHITE_COLOR,
    cursor: "pointer",
    height: "100%",
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: "300px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
  productImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    transition: "transform 0.4s ease-in-out",
    padding: "5px",
  },
  discountBadge: {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: SALE_COLOR,
    color: WHITE_COLOR,
    padding: "0.4rem 0.8rem",
    borderRadius: "50px",
    fontSize: "1rem",
    fontWeight: "900",
    zIndex: 10,
    boxShadow: "0 4px 10px rgba(220, 53, 69, 0.4)",
    letterSpacing: "0.5px",
  },
  brandText: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: ACCENT_COLOR,
    marginBottom: "2px",
    letterSpacing: "0.5px",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: PRIMARY_TEXT_COLOR,
    marginBottom: "8px",
  },
  price: {
    fontSize: "1.8rem",
    fontWeight: "900",
    color: SALE_COLOR,
    letterSpacing: "-0.5px",
  },
  originalPrice: {
    fontSize: "1rem",
    color: "#adb5bd",
  },
  header: {
    fontSize: "3.5rem",
    fontWeight: "900",
    color: PRIMARY_TEXT_COLOR,
    letterSpacing: "-1.8px",
    display: "inline-block",
    position: "relative",
    paddingBottom: "18px",
  },
  headerUnderline: {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "120px",
    height: "4px",
    backgroundColor: ACCENT_COLOR,
    borderRadius: "2px",
  },
  viewDealButton: {
    transition: "all 0.3s ease",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
    padding: "0.6rem 1rem",
  },
  viewDealButtonHover: {
    backgroundColor: "#218838",
    borderColor: "#218838",
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(33, 136, 56, 0.5)",
  },
  exploreButton: {
    backgroundColor: PRIMARY_TEXT_COLOR,
    color: "white",
    borderColor: PRIMARY_TEXT_COLOR,
    transition: "all 0.3s ease-in-out",
    borderRadius: "50px",
    fontSize: "1.3rem",
    padding: "0.8rem 4rem",
    boxShadow: `0 8px 25px ${PRIMARY_TEXT_COLOR}40`,
  },
  exploreButtonHover: {
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
    transform: "scale(1.05)",
    boxShadow: `0 8px 25px ${ACCENT_COLOR}60`,
  },
};

// 🌟 Hover Effects Logic
const handleCardMouseEnter = (e) => {
  e.currentTarget.style.transform = "translateY(-12px)";
  e.currentTarget.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.2)";
  e.currentTarget.querySelector("img").style.transform = "scale(1.05)";
};
const handleCardMouseLeave = (e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = customStyles.productCard.boxShadow;
  e.currentTarget.querySelector("img").style.transform = "scale(1)";
};
const handleViewDealMouseEnter = (e) => {
  Object.assign(e.currentTarget.style, customStyles.viewDealButtonHover);
};
const handleViewDealMouseLeave = (e) => {
  Object.assign(e.currentTarget.style, customStyles.viewDealButton);
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = "none";
};
const handleExploreMouseEnter = (e) => {
  Object.assign(e.currentTarget.style, customStyles.exploreButtonHover);
};
const handleExploreMouseLeave = (e) => {
  Object.assign(e.currentTarget.style, customStyles.exploreButton);
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = customStyles.exploreButton.boxShadow;
};

// 🖼️ Helper Functions
const getProductImageSource = (product) => {
  if (typeof product.image === "string" && product.image.trim() !== "") {
    return product.image;
  }
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }
  return "https://placehold.co/300x380/e0e0e0/555?text=NO+IMAGE";
};

const calculateDiscount = (price, originalPrice) => {
  if (originalPrice > price) {
    const discount = ((originalPrice - price) / originalPrice) * 100;
    return Math.round(discount);
  }
  return 0;
};

// 🌟 Dummy Product Generator
const generateDummyProduct = (index) => {
  const basePrice = Math.floor(Math.random() * 1000) + 1000;
  const discountFactor = Math.random() * 0.5 + 0.3;
  const finalPrice = Math.floor(basePrice * discountFactor);
  let guaranteedOriginalPrice = basePrice;
  let guaranteedFinalPrice = finalPrice;

  if (guaranteedOriginalPrice <= guaranteedFinalPrice) {
    guaranteedOriginalPrice = guaranteedFinalPrice + Math.floor(Math.random() * 500) + 500;
  }

  return {
    id: `toy-dummy-${index}`,
    name: `Exciting Toy ${index + 1}`,
    brand: "KIDS FAVORITE",
    price: guaranteedFinalPrice,
    originalPrice: guaranteedOriginalPrice,
    image: `https://picsum.photos/seed/toy${index}/300/300`,
  };
};

// 🧸 MAIN COMPONENT
function HomeToysSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToys = async () => {
      setLoading(true);
      try {
        const categoryName = "Toys";
        const productLimit = 4;
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("category", "==", categoryName));
        const snapshot = await getDocs(q);

        let data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          price: doc.data().price ? Number(doc.data().price) : 499,
          originalPrice: doc.data().originalPrice ? Number(doc.data().originalPrice) : 999,
        }));

        while (data.length < productLimit) {
          data.push(generateDummyProduct(data.length));
        }

        // Shuffle
        for (let i = data.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [data[i], data[j]] = [data[j], data[i]];
        }
        data = data.slice(0, productLimit);

        setProducts(data);
      } catch (err) {
        console.warn("⚠️ Firebase fetch failed, using dummy products:", err);
        setProducts(Array.from({ length: 4 }, (_, i) => generateDummyProduct(i)));
      } finally {
        setLoading(false);
      }
    };

    fetchToys();
  }, []);

  return (
    <Container fluid style={{ backgroundColor: "#f8f9fa" }}>
      <Container className="py-5" style={customStyles.sectionContainer}>
        {/* 🌟 HEADER */}
        <div className="text-center mb-5">
          <h3 style={customStyles.header}>
            FUN & PLAY <span style={{ color: ACCENT_COLOR }}>ON SALE</span>
            <div style={customStyles.headerUnderline}></div>
          </h3>
          <p className="text-muted mt-3 fs-5 fw-light">
            Discover exciting toys your kids will love — fun meets learning!
          </p>
        </div>

        {/* 🧸 PRODUCT GRID */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-2 text-muted fs-6">Loading trending toys...</p>
          </div>
        ) : (
          <>
            <Row xs={2} sm={2} md={3} lg={4} className="g-4 justify-content-center">
              {products.map((product) => {
                const discountPercent = calculateDiscount(product.price, product.originalPrice);
                return (
                  <Col key={product.id}>
                    <Link to={`/product/${product.id}`} className="text-decoration-none d-block">
                      <Card
                        className="h-100 product-card"
                        style={customStyles.productCard}
                        onMouseEnter={handleCardMouseEnter}
                        onMouseLeave={handleCardMouseLeave}
                      >
                        {discountPercent > 0 && (
                          <Badge style={customStyles.discountBadge}>
                            -{discountPercent}% OFF
                          </Badge>
                        )}
                        <div style={customStyles.imageContainer}>
                          <Card.Img
                            variant="top"
                            src={getProductImageSource(product)}
                            alt={product.name}
                            style={customStyles.productImage}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/300x380/e0e0e0/555?text=Image+Error";
                            }}
                          />
                        </div>

                        <Card.Body className="text-start p-3 d-flex flex-column">
                          <p style={customStyles.brandText} className="text-uppercase">
                            {product.brand || "Toy Collection"}
                          </p>
                          <Card.Title style={customStyles.title} className="text-truncate">
                            {product.name}
                          </Card.Title>

                          <div className="d-flex align-items-baseline justify-content-between mt-auto pt-2">
                            <Card.Text style={customStyles.price} className="me-2">
                              ₹{product.price}
                            </Card.Text>
                            {product.originalPrice > product.price && (
                              <small
                                style={customStyles.originalPrice}
                                className="text-decoration-line-through"
                              >
                                ₹{product.originalPrice}
                              </small>
                            )}
                          </div>

                          <Button
                            variant="success"
                            style={customStyles.viewDealButton}
                            className="w-100 mt-3 text-uppercase"
                            onMouseEnter={handleViewDealMouseEnter}
                            onMouseLeave={handleViewDealMouseLeave}
                          >
                            View Deal
                          </Button>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>

            {/* 🚀 CTA BUTTON */}
            <div className="text-center mt-5 pt-4">
              <Link to="/toys">
                <Button
                  style={customStyles.exploreButton}
                  size="lg"
                  className="fw-bold"
                  onMouseEnter={handleExploreMouseEnter}
                  onMouseLeave={handleExploreMouseLeave}
                >
                  Explore All Toys →
                </Button>
              </Link>
            </div>
          </>
        )}
      </Container>
    </Container>
  );
}

export default HomeToysSection;
