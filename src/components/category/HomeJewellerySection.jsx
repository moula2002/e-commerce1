// src/components/HomeJewellerySection.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button, Badge } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

// 🎨 DEFINE CONSTANTS FOR MODERN AESTHETICS (Consistent with Accessories)
const PRIMARY_TEXT_COLOR = "#101010"; // Near-Black
const ACCENT_COLOR = "#198754"; // Green accent
const SALE_COLOR = "#dc3545";       // Bootstrap Red
const WHITE_COLOR = "#FFFFFF";

// 🎨 Custom CSS for this component (ADJUSTED TO MATCH ACCESSORIES SECTION)
const customStyles = {
  // --- SECTION CONTAINER STYLE ---
  sectionContainer: {
    backgroundColor: WHITE_COLOR,
    borderRadius: "25px",
    padding: "3rem 1rem", // ⬇️ HEIGHT REDUCTION: Reduced to match Accessories (was 5.5rem 2rem)
    boxShadow: "0 15px 50px rgba(0, 0, 0, 0.08)",
  },

  // --- CARD & IMAGE STYLES ---
  productCard: {
    border: "1px solid #e9ecef",
    borderRadius: "15px", // ⬇️ REDUCED: Reduced border radius (was 18px)
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)", // ⬇️ REDUCED: Reduced shadow (was 0.08)
    transition: "all 0.3s ease", // ⬇️ FASTER TRANSITION (was 0.4s cubic-bezier)
    backgroundColor: WHITE_COLOR,
    cursor: "pointer",
    height: "100%",
    position: "relative",
  },
  // 🖼️ FIXED: IMAGE CONTAINER STYLE (HEIGHT REDUCED)
  imageContainer: (isMobile) => ({ // Using dynamic height function from Accessories
    width: "100%",
    height: isMobile ? "180px" : "220px", // ⬇️ HEIGHT REDUCTION: Desktop 220px (was 300px), Mobile 180px
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  }),
  // 🖼️ FIXED: IMAGE PADDING REDUCED
  productImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    transition: "transform 0.3s ease-in-out", // ⬇️ FASTER TRANSITION
    padding: "3px", // ⬇️ PADDING REDUCED (was 5px)
  },

  // 🔥 DISCOUNT BADGE STYLE
  discountBadge: {
    position: "absolute",
    top: "8px",   // ⬇️ HEIGHT REDUCTION: Adjusted position (was 15px)
    right: "8px", // ⬇️ HEIGHT REDUCTION: Adjusted position (was 15px)
    backgroundColor: SALE_COLOR,
    color: WHITE_COLOR,
    padding: "0.2rem 0.5rem", // ⬇️ HEIGHT REDUCTION: Reduced padding (was 0.4rem 0.8rem)
    borderRadius: "50px",
    fontSize: "0.75rem", // ⬇️ HEIGHT REDUCTION: Reduced font size (was 1rem)
    fontWeight: "900",
    zIndex: 10,
    boxShadow: "0 2px 5px rgba(220, 53, 69, 0.3)", // ⬇️ REDUCED SHADOW (was 0.4)
    letterSpacing: "0.5px",
  },

  // --- TEXT & PRICE STYLES ---
  brandText: {
    fontSize: "0.75rem", // ⬇️ HEIGHT REDUCTION: Reduced font size (was 0.85rem)
    fontWeight: "600",
    color: ACCENT_COLOR,
    marginBottom: "1px", // ⬇️ HEIGHT REDUCTION: Reduced margin (was 2px)
    letterSpacing: "0.5px",
  },
  title: {
    fontSize: "1rem", // ⬇️ HEIGHT REDUCTION: Reduced font size (was 1.2rem)
    fontWeight: "700",
    color: PRIMARY_TEXT_COLOR,
    marginBottom: "4px", // ⬇️ HEIGHT REDUCTION: Reduced margin (was 8px)
  },
  price: {
    fontSize: "1.4rem", // ⬇️ HEIGHT REDUCTION: Reduced font size (was 1.8rem)
    fontWeight: "900",
    color: SALE_COLOR,
    letterSpacing: "-0.5px",
  },
  originalPrice: {
    fontSize: "0.8rem", // ⬇️ HEIGHT REDUCTION: Reduced font size (was 1rem)
    color: "#adb5bd",
  },
  header: {
    fontSize: "2.5rem", // ⬇️ HEIGHT REDUCTION: Reduced font size (was 3.5rem)
    fontWeight: "900",
    color: PRIMARY_TEXT_COLOR,
    letterSpacing: "-1.5px", // ⬇️ REDUCED: (was -1.8px)
    display: "inline-block",
    position: "relative",
    paddingBottom: "12px", // ⬇️ REDUCED: (was 18px)
  },
  headerUnderline: {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100px", // ⬇️ REDUCED: (was 120px)
    height: "3px", // ⬇️ REDUCED: (was 4px)
    backgroundColor: ACCENT_COLOR,
    borderRadius: "2px",
  },
  viewDealButton: {
    transition: "all 0.3s ease",
    borderRadius: "6px", // ⬇️ REDUCED: (was 8px)
    fontSize: "0.9rem", // ⬇️ HEIGHT REDUCTION: Reduced font size (was 1rem)
    fontWeight: "700",
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
    padding: "0.4rem 0.8rem", // ⬇️ HEIGHT REDUCTION: Reduced padding (was 0.6rem 1rem)
  },
  viewDealButtonHover: {
    backgroundColor: SALE_COLOR, // Using SALE_COLOR for hover consistency with Accessories
    borderColor: SALE_COLOR,
    transform: "translateY(-2px)",
    boxShadow: `0 5px 15px ${SALE_COLOR}80`, // Using SALE_COLOR for consistency
  },
  exploreButton: {
    backgroundColor: PRIMARY_TEXT_COLOR,
    color: "white",
    borderColor: PRIMARY_TEXT_COLOR,
    transition: "all 0.3s ease-in-out",
    borderRadius: "50px",
    fontSize: "1.1rem", // ⬇️ HEIGHT REDUCTION: Reduced font size (was 1.3rem)
    padding: "0.6rem 3rem", // ⬇️ HEIGHT REDUCTION: Reduced padding (was 0.8rem 4rem)
    boxShadow: `0 8px 25px ${PRIMARY_TEXT_COLOR}40`,
  },
  exploreButtonHover: {
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
    transform: "scale(1.03)", // ⬇️ REDUCED SCALE (was 1.05)
    boxShadow: `0 5px 15px ${ACCENT_COLOR}60`, // ⬇️ REDUCED SHADOW (was 0 8px)
  },
};

// 💅 Hover Effects Logic (ADJUSTED TO MATCH ACCESSORIES SECTION)
const handleCardMouseEnter = (e) => {
  e.currentTarget.style.transform = "translateY(-8px)"; // ⬇️ REDUCED LIFT (was -12px)
  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)"; // ⬇️ REDUCED SHADOW (was 0.2)
  e.currentTarget.querySelector("img").style.transform = "scale(1.03)"; // ⬇️ REDUCED SCALE (was 1.05)
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
    transform: "none",
    boxShadow: "none",
  });
};
const handleExploreMouseEnter = (e) => {
  Object.assign(e.currentTarget.style, customStyles.exploreButtonHover);
};
const handleExploreMouseLeave = (e) => {
  Object.assign(e.currentTarget.style, {
    ...customStyles.exploreButton,
    transform: "none",
    boxShadow: customStyles.exploreButton.boxShadow,
  });
};

// 🖼️ Helper Functions (No changes needed)
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

// 🌟 Dummy Product Generator (Adjusted to Accessories feel)
const generateDummyProduct = (index) => {
  // Adjusted to match the Accessories base price range for consistent feel
  const basePrice = Math.floor(Math.random() * 800) + 1500; 
  const discountFactor = Math.random() * 0.5 + 0.3;
  const finalPrice = Math.floor(basePrice * discountFactor);
  const originalPrice = basePrice <= finalPrice ? finalPrice + Math.floor(Math.random() * 500) + 500 : basePrice; // Ensure discount

  return {
    id: `jewel-dummy-${index}`,
    name: `Elegant Jewellery ${index + 1}`,
    brand: "TRENDY COLLECTION",
    price: finalPrice,
    originalPrice: originalPrice,
    image: `https://picsum.photos/seed/jewel${index}/300/300`,
  };
};

// 💍 MAIN COMPONENT
function HomeJewellerySection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State to track window width for dynamic image height/mobile adjustments
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

  useEffect(() => {
    // Logic to handle window resize and update state (Matches Accessories logic)
    const handleResize = () => setIsMobile(window.innerWidth <= 576);
    window.addEventListener('resize', handleResize);
    
    const fetchJewellery = async () => {
      setLoading(true);
      try {
        const categoryName = "Jewellery";
        const productLimit = 4;
        const productsRef = collection(db, "products");
        // Ensure the 'category' field is correctly indexed in Firestore for a 'where' query
        const q = query(productsRef, where("category", "==", categoryName));
        const snapshot = await getDocs(q);

        let data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Default prices adjusted for Jewellery feel, but Accessories default prices could also be used
          price: doc.data().price ? Number(doc.data().price) : 1499,
          originalPrice: doc.data().originalPrice ? Number(doc.data().originalPrice) : 2499,
        }));

        while (data.length < productLimit) {
          data.push(generateDummyProduct(data.length));
        }

        // Shuffle and limit
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

    fetchJewellery();
    
    // Cleanup function
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Removed dynamic style objects as Accessories used simpler inline/customStyles
  
  return (
    <Container fluid style={{ backgroundColor: "#f8f9fa" }}>
      {/* ⬇️ HEIGHT REDUCTION: py-5 changed to py-4, using customStyles.sectionContainer */}
      <Container className="py-4" style={customStyles.sectionContainer}> 
        
        {/* 🌟 HEADER - MODIFIED TO BE COMPACT */}
        <div className="text-center mb-3 mb-md-4"> {/* ⬇️ HEIGHT REDUCTION: mb-5 reduced to mb-3 */}
          <h3 style={customStyles.header}>
            ELEGANT <span style={{ color: ACCENT_COLOR }}>JEWELLERY SALE</span>
            {/* Custom Underline Element */}
            <div style={customStyles.headerUnderline}></div>
          </h3>
          {/* ⬇️ HEIGHT REDUCTION: Font size reduced, hidden on small screens (from Accessories) */}
          <p className="text-muted mt-2 fs-6 fw-light d-none d-sm-block"> 
            Discover stunning jewellery that adds sparkle to your style ✨
          </p>
        </div>

        {/* 💎 PRODUCT GRID */}
        {loading ? (
          <div className="text-center py-4"> {/* ⬇️ HEIGHT REDUCTION: py-5 changed to py-4 */}
            <Spinner animation="border" variant="success" />
            <p className="mt-2 text-muted fs-6">Loading beautiful jewellery...</p>
          </div>
        ) : (
          <>
            {/* 🎯 KEY MOBILE ADJUSTMENT: g-4 changed to g-2 g-md-3 (from Accessories) */}
            <Row xs={2} sm={2} md={3} lg={4} className="g-2 g-md-3 justify-content-center">
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
                        {/* 🖼 IMAGE CONTAINER with dynamic height */}
                        <div style={customStyles.imageContainer(isMobile)}>
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

                        {/* 🎯 MOBILE ADJUSTMENT: Reduced padding for card body */}
                        <Card.Body className="text-start p-2 p-md-3 d-flex flex-column"> {/* ⬇️ HEIGHT REDUCTION: p-3 changed to p-2 p-md-3 */}
                          <p style={customStyles.brandText} className="text-uppercase">
                            {product.brand || "Jewellery Collection"}
                          </p>
                          <Card.Title style={customStyles.title} className="text-truncate">
                            {product.name}
                          </Card.Title>

                          <div className="d-flex align-items-baseline justify-content-between mt-auto pt-1 pt-md-2"> {/* ⬇️ HEIGHT REDUCTION: pt-2 changed to pt-1 */}
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
                            className="w-100 mt-2 text-uppercase" // ⬇️ HEIGHT REDUCTION: mt-3 changed to mt-2
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

            {/* 🚀 CTA BUTTON - Uses unified customStyles */}
            <div className="text-center mt-4 pt-3"> {/* ⬇️ HEIGHT REDUCTION: mt-5 pt-4 changed to mt-4 pt-3 */}
              <Link to="/jewellery">
                <Button
                  style={customStyles.exploreButton} 
                  size="md" // ⬇️ HEIGHT REDUCTION: size="lg" changed to size="md" (custom styles control actual size)
                  className="fw-bold"
                  onMouseEnter={handleExploreMouseEnter}
                  onMouseLeave={handleExploreMouseLeave}
                >
                  Explore All Jewellery →
                </Button>
              </Link>
            </div>
          </>
        )}
      </Container>
    </Container>
  );
}

export default HomeJewellerySection;