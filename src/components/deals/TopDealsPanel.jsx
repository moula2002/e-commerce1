// src/components/TopDealsPanel.jsx

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import DealsSection from './DealsSection'; // Corrected import path

function TopDealsPanel() {
  return (
    <Container fluid className="my-5 px-4">
      
      <Row className="g-4">
        
        {/* COLUMN 1: Deals you might like (25% width on large screens) */}
        <Col lg={3} md={6} sm={12}>
          <div className="bg-white p-3 rounded shadow-sm h-100">
            <DealsSection title="Deals you might like" limit={4} />
          </div>
        </Col>

        {/* COLUMN 2: Deals picked just for you (25% width) */}
        <Col lg={3} md={6} sm={12}>
          <div className="bg-white p-3 rounded shadow-sm h-100">
            <DealsSection title="Deals picked just for you" limit={4} />
          </div>
        </Col>
        
        {/* COLUMN 3: Deals related to your views (25% width) */}
        <Col lg={3} md={6} sm={12}>
          <div className="bg-white p-3 rounded shadow-sm h-100">
            <DealsSection title="Deals related to your views" limit={4} />
          </div>
        </Col>

        {/* COLUMN 4: Sign-in and Ad Panel (25% width) */}
        <Col lg={3} md={6} sm={12}>
          <div className="d-flex flex-column gap-4 h-100">
            
            {/* Sign-in Panel */}
            <Card className="shadow-sm border-0 bg-secondary-subtle">
              <Card.Body className="p-3 text-center">
                <h5 className="mb-3">Sign in for your best experience</h5>
                <Button variant="warning" className="fw-bold w-100">
                  Sign in securely
                </Button>
              </Card.Body>
            </Card>

            {/* Ad Panel */}
            <Card className="shadow-sm border-0 flex-grow-1">
              <Card.Body className="p-3 text-center">
                <h6 className="text-muted">SONY</h6>
                <div className="text-center my-3">
                    {/* Placeholder image */}
                    <img 
                        src="https://via.placeholder.com/150x150?text=AD+Image" 
                        alt="Ad product" 
                        className="img-fluid"
                        style={{ maxWidth: '70%', height: 'auto' }}
                    />
                </div>
                <p className="fw-bold text-dark mb-1">THE BEST NOISE CANCELLING</p>
                <small className="text-primary">WH-1000XM6</small>
                <div className="text-end mt-2">
                    <small className="text-muted">Sponsored</small>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>

      </Row>
    </Container>
  );
}

export default TopDealsPanel;