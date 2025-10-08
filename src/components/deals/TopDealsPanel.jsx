import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import DealsSection from './DealsSection'; 
import AuthPage from '../../pages/LoginPage';
function TopDealsPanel() {
  // State to control the visibility of the login modal
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleShow = () => setShowLoginModal(true);
  const handleClose = () => setShowLoginModal(false);

  return (
    <Container fluid className="my-5 px-4">
      
      <Row className="g-4">
        
        {/* COLUMN 1, 2, 3: Deals Sections (No change) */}
        <Col lg={3} md={6} sm={12}>
          <div className="bg-white p-3 rounded shadow-sm h-100">
            <DealsSection title="Deals you might like" limit={4} />
          </div>
        </Col>

        <Col lg={3} md={6} sm={12}>
          <div className="bg-white p-3 rounded shadow-sm h-100">
            <DealsSection title="Deals picked just for you" limit={4} />
          </div>
        </Col>
        
        <Col lg={3} md={6} sm={12}>
          <div className="bg-white p-3 rounded shadow-sm h-100">
            <DealsSection title="Deals related to your views" limit={4} />
          </div>
        </Col>

        {/* COLUMN 4: Sign-in and Ad Panel */}
        <Col lg={3} md={6} sm={12}>
          <div className="d-flex flex-column gap-4 h-100">
            
            {/* Sign-in Panel */}
            <Card className="shadow-sm border-0 bg-secondary-subtle">
              <Card.Body className="p-3 text-center">
                <h5 className="mb-3">Sign in for your best experience</h5>
                <Button 
                  variant="warning" 
                  className="fw-bold w-100"
                  onClick={handleShow} // On click, show the login modal
                >
                  Sign in securely
                </Button>
              </Card.Body>
            </Card>

            {/* Ad Panel (No change) */}
            <Card className="shadow-sm border-0 flex-grow-1">
              <Card.Body className="p-3 text-center">
                <h6 className="text-muted">SONY</h6>
                <div className="text-center my-3">
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

      {/* 💥 Login/Signup Modal */}
      <Modal show={showLoginModal} onHide={handleClose} centered>
        <Modal.Body className="p-0">
          <AuthPage onClose={handleClose} />
        </Modal.Body>
      </Modal>

    </Container>
  );
}

export default TopDealsPanel;