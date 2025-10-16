// ReturnPolicy.jsx (Complete Component)
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import './ReturnPolicy.css'; // Import custom styles for animations and global setup

function ReturnPolicy() {
    // Define main colors/styles for inline usage
    const SADHANA_ORANGE = '#ff6600';
    const LIGHT_ORANGE_BG = '#ffe8d6';

    const headerStyle = {
        backgroundColor: SADHANA_ORANGE,
        color: 'white',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    };

    const helpCardStyle = {
        backgroundColor: LIGHT_ORANGE_BG,
        border: `1px solid ${SADHANA_ORANGE}`,
        borderRadius: '12px',
    };

    return (
        <div className="return-policy-page">

            {/* 1. Header Section (Animated) */}
            <div className="policy-header py-5 mb-5 animate__header" style={headerStyle}>
                <Container className="text-center">
                    <div className="header-icon mb-3 animate__icon">
                        <i className="fas fa-undo fa-3x"></i>
                    </div>
                    <h1 className="display-4 fw-bold animate__text">Return & Refund Policy</h1>
                    <h3 className="fw-normal">Hassle-Free Returns</h3>
                </Container>
            </div>

            <Container className="py-4">
                {/* 2. Policy Introduction */}
                <h2 className="text-orange fw-bold mb-3 policy-intro-title">Return & Refund Policy</h2>
                <p className="lead mb-5 text-muted">
                    We want you to be completely satisfied with your purchase. If you are not satisfied, our return and refund policy is designed to be simple and fair.
                </p>

                {/* Policy Sections (Animated Cards) */}
                <div className="policy-sections">

                    {/* 1. Return Window */}
                    <Card className="policy-card mb-4 shadow-sm animate__fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <Card.Body>
                            <h4 className="card-title text-orange mb-3 d-flex align-items-center">
                                <span className="card-icon me-3"><i className="far fa-calendar-alt fa-fw"></i></span> 1. Return Window
                            </h4>
                            <ul className="policy-list">
                                <li>Products can be returned within **7 days of delivery**</li>
                                <li>Items must be unused and in their **original packaging**</li>
                                <li>Return shipping label must be used if provided</li>
                            </ul>
                        </Card.Body>
                    </Card>

                    {/* 2. Items Not Eligible for Return */}
                    <Card className="policy-card mb-4 shadow-sm animate__fadeInUp" style={{ borderLeft: '5px solid #f77f00', animationDelay: '0.2s' }}>
                        <Card.Body>
                            <h4 className="card-title text-red-light mb-3 d-flex align-items-center">
                                <span className="card-icon me-3 text-red-light"><i className="fas fa-ban fa-fw"></i></span> 2. Items Not Eligible for Return
                            </h4>
                            <ul className="policy-list red-bullets">
                                <li>**Perishable goods**</li>
                                <li>**Personalized/custom products**</li>
                                <li>Items marked as **"Non-returnable"**</li>
                                <li>Products without original tags or packaging</li>
                            </ul>
                        </Card.Body>
                    </Card>

                    {/* 3. How to Initiate a Return */}
                    <Card className="policy-card mb-4 shadow-sm animate__fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <Card.Body>
                            <h4 className="card-title text-orange mb-3 d-flex align-items-center">
                                <span className="card-icon me-3"><i className="fas fa-redo-alt fa-fw"></i></span> 3. How to Initiate a Return
                            </h4>
                            <ul className="policy-list">
                                <li>Go to **"My Orders"** in the app</li>
                                <li>Select the item and tap **"Request Return"**</li>
                                <li>Follow the instructions and choose pickup/drop-off option</li>
                                <li>Print return label if required</li>
                            </ul>
                        </Card.Body>
                    </Card>

                    {/* 4. Refund Process */}
                    <Card className="policy-card mb-4 shadow-sm animate__fadeInUp" style={{ animationDelay: '0.4s' }}>
                        <Card.Body>
                            <h4 className="card-title text-orange mb-3 d-flex align-items-center">
                                <span className="card-icon me-3"><i className="fas fa-wallet fa-fw"></i></span> 4. Refund Process
                            </h4>
                            <ul className="policy-list">
                                <li>Once the return is received and inspected, we will notify you</li>
                                <li>Refunds are typically processed within **5-7 business days**</li>
                                <li>The refund will be credited back to your original payment method</li>
                                <li>Shipping charges (if any) are non-refundable</li>
                            </ul>
                        </Card.Body>
                    </Card>

                    {/* 5. Exchange Policy */}
                    <Card className="policy-card mb-4 shadow-sm animate__fadeInUp" style={{ animationDelay: '0.5s' }}>
                        <Card.Body>
                            <h4 className="card-title text-orange mb-3 d-flex align-items-center">
                                <span className="card-icon me-3"><i className="fas fa-exchange-alt fa-fw"></i></span> 5. Exchange Policy
                            </h4>
                            <ul className="policy-list">
                                <li>Exchanges are allowed for **size or defective issues**</li>
                                <li>Subject to stock availability</li>
                                <li>Customer responsible for return shipping costs (unless defective)</li>
                                <li>New item will be shipped after receiving the original</li>
                            </ul>
                        </Card.Body>
                    </Card>

                    {/* 6. Damaged or Incorrect Items */}
                    <Card className="policy-card mb-4 shadow-sm animate__fadeInUp" style={{ borderLeft: '5px solid #dc3545', animationDelay: '0.6s' }}>
                        <Card.Body>
                            <h4 className="card-title text-danger mb-3 d-flex align-items-center">
                                <span className="card-icon me-3 text-danger"><i className="fas fa-exclamation-triangle fa-fw"></i></span> 6. Damaged or Incorrect Items
                            </h4>
                            <ul className="policy-list red-bullets">
                                <li>If you receive a damaged or incorrect item, contact our support **within 48 hours of delivery**</li>
                                <li>Provide photo evidence of the issue</li>
                                <li>We will arrange for return pickup at **no cost to you**</li>
                                <li>Replacement or full refund will be processed immediately</li>
                            </ul>
                        </Card.Body>
                    </Card>


                    {/* Need Help Card (Animated) */}
                    <Card
                        className="help-card my-5 text-center p-4 hover-lift"
                        style={helpCardStyle}
                    >
                        <Card.Body>
                            <h4 className="fw-bold mb-3 animate__pulse">
                                <span className="text-orange me-2"><i className="fas fa-headset fa-2x"></i></span> Need Help with a Return?
                            </h4>
                            <p className="mb-4">
                                For any return-related queries, contact our support team at:
                            </p>
                            <p className="email-link mb-3 fw-bold" style={{ color: SADHANA_ORANGE }}>
                                support@sadhanacart.com
                            </p>
                            <Button
                                className="contact-button hover-shadow"
                                style={{ backgroundColor: SADHANA_ORANGE, borderColor: SADHANA_ORANGE }}
                            >
                                Contact Support
                            </Button>
                        </Card.Body>
                    </Card>

                </div>

                {/* Animated Scroll to Top Button (Not visible in the ReturnPolicy component path unless scrolled) */}
                <a href="#" className="scroll-to-top-btn animate__bounceInRight">
                    <i className="fas fa-arrow-up"></i>
                </a>

            </Container>
        </div>
    );
}

export default ReturnPolicy;