// src/components/HomeToysSection.jsx (Styled like HomeAccessoriesSection)
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button, Badge } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

// 🎨 DEFINE CONSTANTS FOR MODERN AESTHETICS (COPIED FROM ACCESSORIES)
const PRIMARY_TEXT_COLOR = "#101010"; // Near-Black
const ACCENT_COLOR = "#198754"; // Green accent
const SALE_COLOR = "#dc3545";       // Bootstrap Red
const WHITE_COLOR = "#FFFFFF";
const CATEGORY_NAME = "Toys"; // Target Category

// 🎨 Custom CSS for this component (HEIGHT REDUCED & MOBILE OPTIMIZED - COPIED FROM HomeAccessoriesSection)
const customStyles = {
  // --- SECTION CONTAINER STYLE ---
  sectionContainer: {
    backgroundColor: WHITE_COLOR,
    borderRadius: "25px",
    padding: "3rem 1rem", // ⬇️ HEIGHT REDUCTION: Compact Padding
    boxShadow: "0 15px 50px rgba(0, 0, 0, 0.08)",
  },

  // --- CARD & IMAGE STYLES ---
  productCard: {
    border: "1px solid #e9ecef",
    borderRadius: "15px", // 📱 MOBILE: Reduced border radius
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)", // 📱 MOBILE: Reduced shadow
    transition: "all 0.3s ease", // ⬇️ FASTER TRANSITION
    backgroundColor: WHITE_COLOR,
    cursor: "pointer",
    height: "100%",
    position: "relative",
  },
  // 🖼️ FIXED: IMAGE CONTAINER STYLE (HEIGHT REDUCED)
  imageContainer: (isMobile) => ({
    width: "100%",
    height: isMobile ? "180px" : "220px", // ⬇️ HEIGHT REDUCTION: Desktop 220px, Mobile 180px
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
    transition: "transform 0.3s ease-in-out",
    padding: "3px", // ⬇️ PADDING REDUCED
  },

  // 🔥 DISCOUNT BADGE STYLE
  discountBadge: {
    position: "absolute",
    top: "8px",   // ⬇️ HEIGHT REDUCTION: Adjusted position
    right: "8px", // ⬇️ HEIGHT REDUCTION: Adjusted position
    backgroundColor: SALE_COLOR,
    color: WHITE_COLOR,
    padding: "0.2rem 0.5rem", // ⬇️ HEIGHT REDUCTION: Reduced padding
    borderRadius: "50px",
    fontSize: "0.75rem", // ⬇️ HEIGHT REDUCTION: Reduced font size
    fontWeight: "900",
    zIndex: 10,
    boxShadow: "0 2px 5px rgba(220, 53, 69, 0.3)",
    letterSpacing: "0.5px",
  },

  // --- TEXT & PRICE STYLES ---
  brandText: {
    fontSize: "0.75rem", // ⬇️ HEIGHT REDUCTION: Reduced font size
    fontWeight: "600",
    color: ACCENT_COLOR,
    marginBottom: "1px", // ⬇️ HEIGHT REDUCTION: Reduced margin
    letterSpacing: "0.5px",
  },
  title: {
    fontSize: "1rem", // ⬇️ HEIGHT REDUCTION: Reduced font size
    fontWeight: "700",
    color: PRIMARY_TEXT_COLOR,
    marginBottom: "4px", // ⬇️ HEIGHT REDUCTION: Reduced margin
  },
  price: {
    fontSize: "1.4rem", // ⬇️ HEIGHT REDUCTION: Reduced font size
    fontWeight: "900",
    color: SALE_COLOR,
    letterSpacing: "-0.5px",
  },
  originalPrice: {
    fontSize: "0.8rem", // ⬇️ HEIGHT REDUCTION: Reduced font size
    color: "#adb5bd",
  },
  header: {
    fontSize: "2.5rem", // ⬇️ HEIGHT REDUCTION: Reduced font size
    fontWeight: "900",
    color: PRIMARY_TEXT_COLOR,
    letterSpacing: "-1.5px",
    display: "inline-block",
    position: "relative",
    paddingBottom: "12px",
  },
  headerUnderline: {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100px",
    height: "3px",
    backgroundColor: ACCENT_COLOR,
    borderRadius: "2px",
  },
  viewDealButton: {
    transition: "all 0.3s ease",
    borderRadius: "6px", // ⬇️ HEIGHT REDUCTION: Reduced border radius
    fontSize: "0.9rem", // ⬇️ HEIGHT REDUCTION: Reduced font size
    fontWeight: "700",
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
    padding: "0.4rem 0.8rem", // ⬇️ HEIGHT REDUCTION: Reduced padding
    color: WHITE_COLOR,
  },
  viewDealButtonHover: {
    backgroundColor: SALE_COLOR,
    borderColor: SALE_COLOR,
    transform: "translateY(-2px)",
    boxShadow: `0 5px 15px ${SALE_COLOR}80`,
  },
  exploreButton: {
    backgroundColor: PRIMARY_TEXT_COLOR,
    color: "white",
    borderColor: PRIMARY_TEXT_COLOR,
    transition: "all 0.3s ease-in-out",
    borderRadius: "50px",
    fontSize: "1.1rem", // ⬇️ HEIGHT REDUCTION: Reduced font size
    padding: "0.6rem 3rem", // ⬇️ HEIGHT REDUCTION: Reduced padding
    boxShadow: `0 8px 25px ${PRIMARY_TEXT_COLOR}40`,
  },
  exploreButtonHover: {
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
    transform: "scale(1.03)", // 📱 MOBILE: Reduced scale
    boxShadow: `0 5px 15px ${ACCENT_COLOR}60`, // 📱 MOBILE: Reduced shadow
  },
};

// 💅 Hover Effects Logic (COPIED FROM HomeAccessoriesSection)
const handleCardMouseEnter = (e) => {
  e.currentTarget.style.transform = "translateY(-8px)"; 
  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)"; 
  e.currentTarget.querySelector("img").style.transform = "scale(1.03)"; 
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

// Helper functions (Unchanged logic)
const getProductImageSource = (product) => {
  if (typeof product.image === "string" && product.image.trim() !== "") return product.image;
  if (Array.isArray(product.images) && product.images.length > 0) return product.images[0];
  return "https://placehold.co/300x380/e0e0e0/555?text=NO+IMAGE";
};
const calculateDiscount = (price, originalPrice) => {
  if (originalPrice > price) return Math.round(((originalPrice - price) / originalPrice) * 100);
  return 0;
};
// 🌟 Dummy data generator (MODIFIED FOR Toy CONTENT)
const generateDummyProduct = (index) => {
  const basePrice = Math.floor(Math.random() * 800) + 1500;
  const discountFactor = Math.random() * 0.5 + 0.3;
  const finalPrice = Math.floor(basePrice * discountFactor);
  const originalPrice = basePrice <= finalPrice ? finalPrice + Math.floor(Math.random() * 500) + 500 : basePrice; // Ensure discount
  
  const toyNames = [
    "Interactive Robot Kit", "Giant Teddy Bear", "Wooden Building Blocks", 
    "Remote Control Racecar", "Learning Puzzle Set", "Soft Play Mat"
  ];

  return {
    id: `toy-dummy-${index}`,
    name: toyNames[index % toyNames.length],
    brand: "KIDS FAVORITE",
    price: finalPrice,
    originalPrice: originalPrice,
    image: `https://picsum.photos/seed/toy${index}/300/300`,
  };
};

// Main Component - RENAMED AND CONTENT ADJUSTED
function HomeToysSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 576);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchToys = async () => {
      setLoading(true);
      try {
        const productLimit = 4;
        const productsRef = collection(db, "products");
        // !!! TARGETING Toys CATEGORY !!!
        const q = query(productsRef, where("category", "==", CATEGORY_NAME)); 
        const snapshot = await getDocs(q);

        let data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          price: doc.data().price ? Number(doc.data().price) : 499,
          originalPrice: doc.data().originalPrice ? Number(doc.data().originalPrice) : 999,
        }));

        // Shuffle and limit to the display count
        while (data.length < productLimit) data.push(generateDummyProduct(data.length));

        for (let i = data.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [data[i], data[j]] = [data[j], data[i]];
        }
        data = data.slice(0, productLimit);

        setProducts(data);
      } catch (err) {
        console.warn("Firebase fetch failed, using dummy products:", err);
        setProducts(Array.from({ length: 4 }, (_, i) => generateDummyProduct(i)));
      } finally {
        setLoading(false);
      }
    };
    fetchToys();
  }, []);

  return (
    <Container fluid style={{ backgroundColor: "#f8f9fa" }}>
      <Container className="py-4" style={customStyles.sectionContainer}> {/* ⬇️ Using compact py-4 */}
        
        {/* 🌟 ATTRACTIVE HEADER (MODIFIED FOR TOYS) */}
        <div className="text-center mb-3 mb-md-4">
          <h3 style={customStyles.header}>
            FUN & PLAY <span style={{ color: ACCENT_COLOR }}>ON SALE</span>
            {/* Custom Underline Element */}
            <div style={customStyles.headerUnderline}></div>
          </h3>
          <p className="text-muted mt-2 fs-6 fw-light d-none d-sm-block">
            Discover exciting toys your kids will love — fun meets learning!
          </p>
        </div>

        {/* -------------------- PRODUCT CARDS -------------------- */}

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="success" />
            <p className="mt-2 text-muted fs-6">Loading trending toys...</p>
          </div>
        ) : (
          <>
            {/* 🎯 Using compact g-2 g-md-3 and responsive columns */}
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
                        {discountPercent > 0 && <Badge style={customStyles.discountBadge}>-{discountPercent}% OFF</Badge>}
                        {/* 🖼 IMAGE CONTAINER with dynamic height */}
                        <div style={customStyles.imageContainer(isMobile)}>
                          <Card.Img
                            variant="top"
                            src={getProductImageSource(product)}
                            alt={product.name}
                            style={customStyles.productImage}
                            onError={(e) => e.target.src = "https://placehold.co/300x380/e0e0e0/555?text=Image+Error"}
                          />
                        </div>
                        {/* 🎯 MOBILE ADJUSTMENT: Reduced padding for card body */}
                        <Card.Body className="text-start p-2 p-md-3 d-flex flex-column"> 
                          <p style={customStyles.brandText} className="text-uppercase">{product.brand}</p>
                          <Card.Title style={customStyles.title} className="text-truncate">{product.name}</Card.Title>
                          <div className="d-flex align-items-baseline justify-content-between mt-auto pt-1 pt-md-2"> 
                            <Card.Text style={customStyles.price}>₹{product.price}</Card.Text>
                            {product.originalPrice > product.price && (
                              <small style={customStyles.originalPrice} className="text-decoration-line-through">₹{product.originalPrice}</small>
                            )}
                          </div>
                          <Button
                            variant="success"
                            style={customStyles.viewDealButton} 
                            className="w-100 mt-2 text-uppercase" 
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

            {/* 🚀 CALL TO ACTION BUTTON */}
            <div className="text-center mt-4 pt-3">
              {/* !!! LINK MODIFIED FOR TOYS !!! */}
              <Link to="/toys"> 
                <Button
                  style={customStyles.exploreButton}
                  size="md" 
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