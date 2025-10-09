import React from "react";
import Banner from "../components/Banner";
import TopDealsPanel from "../components/deals/TopDealsPanel";
import MobileDealsSection from "../components/deals/MobileDealsSection";
import HomeKitchenDeals from "../components/deals/HomeKitchenDeals";
import CategoryPanel from "../components/deals/CategoryPanel";
import SmartTVDeals from "../components/deals/SmartTVDeals";
import SmallBusinessBestsellers from "../components/deals/SmallBusinessBestsellers";
import RelatedItems from "../components/deals/RelatedItems";

import { Container, Row, Col } from "react-bootstrap";
import "./Home.css";

function Home() {
  return (
    <div className="homepage-content">

      {/* 🏠 Header */}
      <header className="text-center py-5 bg-gradient shadow-lg border-bottom border-warning">
        <h1 className="display-5 fw-bold text-warning glow-text">
          Welcome to the Store! 🛍️
        </h1>
        <p className="lead text-black">
          Discover deals that make your shopping smarter and brighter!
        </p>
      </header>

      {/* 🖼️ Banner */}
      <div className="banner-fade-in">
        <Banner />
      </div>

      <main className="container-fluid px-0 text-light">
        {/* 🏷️ Top Deals */}
        <section className="deal-section-card component-slide-in">
          <TopDealsPanel />
        </section>

        {/* 📱 Mobile Deals */}
        <section className="deal-section-card component-slide-in">
          <MobileDealsSection />
        </section>

        {/* 🏡 Home & Kitchen */}
        <section className="deal-section-card component-slide-in">
          <HomeKitchenDeals />
        </section>

        {/* 🛍️ Categories */}
        <Container fluid className="my-5 px-4 category-grid">
          <h2 className="text-center mb-4 fw-bold text-dat glow-text">
            Shop by Category
          </h2>
          <Row className="g-4">
            <Col lg={3} md={6} sm={12}>
              <CategoryPanel title="Up to 70% off | Women's Clothing" mockCategory="clothing" />
            </Col>
            <Col lg={3} md={6} sm={12}>
              <CategoryPanel title="Up to 80% off | Festive Jewelry" mockCategory="jewelery" />
            </Col>
            <Col lg={3} md={6} sm={12}>
              <CategoryPanel title="Best of Electronics & Gadgets" mockCategory="electronics" />
            </Col>
            <Col lg={3} md={6} sm={12}>
              <CategoryPanel title="Up to 60% off | Men's Fashion" mockCategory="men" />
            </Col>
          </Row>
        </Container>

        {/* 📺 Smart TV Deals */}
        <section className="deal-section-card component-slide-in">
          <SmartTVDeals />
        </section>

        {/* 🏬 Small Business */}
        <section className="deal-section-card component-slide-in">
          <SmallBusinessBestsellers />
        </section>

        {/* 🔁 Related Items */}
        <section className="deal-section-card component-slide-in">
          <RelatedItems />
        </section>
      </main>

      {/* 🌈 Footer */}
      <footer className="text-center py-5 bg-dark text-white mt-5 footer-scale-up border-top border-warning">
        <h2 className="fw-bold text-warning">End of Today’s Best Deals !</h2>
        <p className="lead text-secondary">
          Keep exploring for more offers and check back tomorrow for fresh deals.
        </p>
      </footer>
    </div>
  );
}

export default Home;
