import React from 'react';
import Banner from '../components/Banner';
import TopDealsPanel from '../components/deals/TopDealsPanel';
import MobileDealsSection from '../components/deals/MobileDealsSection';
import HomeKitchenDeals from '../components/deals/HomeKitchenDeals';
import CategoryPanel from '../components/deals/CategoryPanel';
import SmartTVDeals from '../components/deals/SmartTVDeals';
import SmallBusinessBestsellers from '../components/deals/SmallBusinessBestsellers';
import RelatedItems from '../components/deals/RelatedItems';


import { Container, Row, Col } from 'react-bootstrap';

function Home() {

  return (
    <div className="homepage-content bg-light">

      <header className="text-center py-4 bg-dark text-white">
        <h1>Welcome to the Store! 🛍️</h1>
      </header>

      <Banner/>

      <TopDealsPanel />

      <MobileDealsSection />

  
      <HomeKitchenDeals />

      <Container fluid className="my-5 px-4">
        <Row className="g-4">
          <Col lg={3} md={6} sm={12}>
            <CategoryPanel title="Up to 70% off | Women's Clothing Picks" mockCategory="clothing" />
          </Col>
          <Col lg={3} md={6} sm={12}>
            <CategoryPanel title="Up to 80% off | Festive Jewelry Picks" mockCategory="jewelery" />
          </Col>
          <Col lg={3} md={6} sm={12}>
            <CategoryPanel title="Best of Electronics & Gadgets" mockCategory="electronics" />
          </Col>
          <Col lg={3} md={6} sm={12}>
            <CategoryPanel title="Up to 60% off | Men's Style Essentials" mockCategory="men" />
          </Col>
        </Row>
      </Container>

   
      <SmartTVDeals />

 
      <SmallBusinessBestsellers />

      <RelatedItems/>




      <section className="text-center py-5 bg-light mt-5">
        <h2>End of Today's Best Deals!</h2>
        <p>Keep exploring for more incredible offers.</p>
      </section>

    </div>
  );
}

export default Home;
