// src/components/HomeStationarySection.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button, Badge } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

// 🎨 DEFINE CONSTANTS FOR AESTHETIC CONSISTENCY
const PRIMARY_TEXT_COLOR = "#101010";
const ACCENT_COLOR = "#198754"; // Green accent
const SALE_COLOR = "#dc3545";   // Bootstrap red
const WHITE_COLOR = "#FFFFFF";
const CATEGORY_NAME = "Stationery"; // Changed for Stationary

// 🎨 STYLING SYSTEM (Base Styles - Media Queries are handled by State)
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
    position: 'relative',
  },
  imageContainer: {
    width: "100%",
    height: "300px", // Base height
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
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: SALE_COLOR,
    color: WHITE_COLOR,
    padding: '0.4rem 0.8rem',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '900',
    zIndex: 10,
    boxShadow: '0 4px 10px rgba(220, 53, 69, 0.4)',
    letterSpacing: '0.5px',
  },
  brandText: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: ACCENT_COLOR,
    marginBottom: "2px",
    letterSpacing: "0.5px",
  },
  title: {
    fontSize: "1.2rem", // Base product title size
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
    // Desktop size
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
    fontSize: "1rem", // Base font size
    fontWeight: "700",
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
    color: WHITE_COLOR,
    padding: "0.6rem 1rem",
  },
  viewDealButtonHover: {
    backgroundColor: SALE_COLOR,
    borderColor: SALE_COLOR,
    transform: 'translateY(-2px)',
    boxShadow: `0 5px 15px ${SALE_COLOR}80`,
  },
  exploreButton: {
    backgroundColor: PRIMARY_TEXT_COLOR,
    color: WHITE_COLOR,
    borderColor: PRIMARY_TEXT_COLOR,
    transition: 'all 0.3s ease-in-out',
    borderRadius: '50px',
    fontSize: '1.3rem', // Base font size
    padding: '0.8rem 4rem',
    boxShadow: `0 8px 25px ${PRIMARY_TEXT_COLOR}40`,
  },
  exploreButtonHover: {
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
    transform: 'scale(1.05)',
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
  Object.assign(e.currentTarget.style, {
    ...customStyles.viewDealButton,
    transform: 'none',
    boxShadow: 'none',
  });
};

const handleExploreMouseEnter = (e) => {
  Object.assign(e.currentTarget.style, customStyles.exploreButtonHover);
};

const handleExploreMouseLeave = (e) => {
  Object.assign(e.currentTarget.style, {
    ...customStyles.exploreButton,
    transform: 'none',
    boxShadow: customStyles.exploreButton.boxShadow,
  });
};

// 🖼 Helper functions
const getProductImageSource = (product) => {
  if (typeof product.image === 'string' && product.image.trim() !== '') {
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

// 🌟 Dummy Product Generator (Changed for Stationery context)
const generateDummyProduct = (index) => {
  const basePrice = Math.floor(Math.random() * 800) + 1000;
  const discountFactor = Math.random() * 0.5 + 0.3;
  const finalPrice = Math.floor(basePrice * discountFactor);
  let guaranteedOriginalPrice = basePrice;
  let guaranteedFinalPrice = finalPrice;

  if (guaranteedOriginalPrice <= guaranteedFinalPrice) {
    guaranteedOriginalPrice = guaranteedFinalPrice + Math.floor(Math.random() * 500) + 500;
  }

  const stationeryNames = [
    "Premium Notebook Set", "Ergonomic Pen Pack", "Colorful Highlighters", 
    "Art Sketchbook Pro", "Desk Organizer", "Geometric Scale Set"
  ];

  return {
    id: `stationary-dummy-${index}`,
    name: stationeryNames[index % stationeryNames.length],
    brand: "STUDY MATE",
    price: guaranteedFinalPrice,
    originalPrice: guaranteedOriginalPrice,
    image: `https://picsum.photos/seed/stationary${index}/300/300`, // Using new seed for unique images
  };
};

// ✏️ MAIN COMPONENT
function HomeStationarySection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 📱 Mobile State: Tracks if screen is small (<= 576px)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

  useEffect(() => {
    // Event listener for screen resize
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };
    window.addEventListener('resize', handleResize);

    const fetchStationaryProducts = async () => {
      setLoading(true);
      try {
        const productLimit = 4;
        const productsRef = collection(db, "products");
        // Query for "Stationery"
        const q = query(productsRef, where("category", "==", CATEGORY_NAME));
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

        // Shuffle and slice
        for (let i = data.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [data[i], data[j]] = [data[j], data[i]];
        }
        data = data.slice(0, productLimit);

        setProducts(data);
      } catch (err) {
        console.warn("⚠️ Firebase fetch failed for Stationery, using dummy products:", err);
        setProducts(Array.from({ length: 4 }, (_, i) => generateDummyProduct(i)));
      } finally {
        setLoading(false);
      }
    };

    fetchStationaryProducts();
    
    // Cleanup listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 💡 Responsive Style Overrides based on isMobile state
  const headerStyle = isMobile
    ? {
        fontSize: '2.2rem', // Reduced from 3.5rem
        letterSpacing: '-1px',
        lineHeight: '1.2',
        paddingBottom: '12px',
      }
    : {};
  
  const viewDealButtonStyle = isMobile
    ? {
        fontSize: '0.85rem', // Reduced from 1rem
        padding: '0.4rem 0.6rem', // Reduced padding
      }
    : {};

  const exploreButtonStyle = isMobile
    ? {
        fontSize: '1rem', // Reduced from 1.3rem
        padding: '0.7rem 2rem', // Reduced padding
      }
    : {};
  
  const productTitleStyle = isMobile
    ? {
        fontSize: '1.05rem', // Slightly reduced product title font
      }
    : {};

  const imageContainerStyle = isMobile
    ? {
        height: '200px' // Reduced height for mobile image container
      }
    : {};
  
  // Adjust overall section padding for mobile
  const sectionContainerStyle = isMobile
    ? {
        ...customStyles.sectionContainer,
        padding: "3rem 1rem", // Reduced vertical/horizontal padding
      }
    : customStyles.sectionContainer;


  return (
    <Container fluid style={{ backgroundColor: '#f8f9fa' }}>
      <Container className="py-5" style={sectionContainerStyle}>
        {/* 🌟 HEADER - Changed content for Stationery */}
        <div className="text-center mb-5">
          <h3 
            style={{ ...customStyles.header, ...headerStyle }}
            className={isMobile ? "px-2" : ""} 
          >
            STUDY ESSENTIALS <span style={{ color: ACCENT_COLOR }}>ON SALE</span>
            <div style={customStyles.headerUnderline}></div>
          </h3>
          <p className="text-muted mt-3 fs-5 fw-light" style={isMobile ? {fontSize: '1rem'} : {}}>
            Explore premium stationery — perfect for school, work, or creativity!
          </p>
        </div>

        {/* 👜 PRODUCT GRID */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-2 text-muted fs-6">Loading stationery products...</p>
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
                        <div style={{ ...customStyles.imageContainer, ...imageContainerStyle }}>
                          <Card.Img
                            variant="top"
                            src={getProductImageSource(product)}
                            alt={product.name}
                            style={customStyles.productImage}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/300x380/e0e0e0/555?text=Image+Error";
                            }}
                          />
                        </div>

                        <Card.Body className="text-start p-3 d-flex flex-column">
                          <p style={customStyles.brandText} className="text-uppercase">
                            {product.brand || "Study Collection"}
                          </p>
                          <Card.Title 
                            style={{ ...customStyles.title, ...productTitleStyle }} 
                            className="text-truncate"
                          >
                            {product.name}
                          </Card.Title>

                          <div className="d-flex align-items-baseline justify-content-between mt-auto pt-2">
                            <Card.Text style={{ ...customStyles.price, fontSize: isMobile ? '1.5rem' : '1.8rem' }} className="me-2">
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
                            style={{ ...customStyles.viewDealButton, ...viewDealButtonStyle }}
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

            {/* 🚀 CTA BUTTON - Changed link for Stationery */}
            <div className="text-center mt-5 pt-4">
              <Link to="/stationary">
                <Button
                  style={{ ...customStyles.exploreButton, ...exploreButtonStyle }}
                  size="lg"
                  className="fw-bold"
                  onMouseEnter={handleExploreMouseEnter}
                  onMouseLeave={handleExploreMouseLeave}
                >
                  Explore All Stationery →
                </Button>
              </Link>
            </div>
          </>
        )}
      </Container>
    </Container>
  );
}

export default HomeStationarySection;