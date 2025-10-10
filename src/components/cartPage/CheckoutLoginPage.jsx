

import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import './CartPage.css';

const CheckoutLoginPage = () => {
    const navigate = useNavigate();

    const handleContinue = (e) => {
        e.preventDefault();

        alert("Continuing to Delivery Address step...");

    };

    return (
        <Container className="my-5 checkout-container">
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={9}>

                    {/* Main Checkout Card */}
                    <Card className="shadow-lg border-0 checkout-flow-card">

                        {/* 1. Login or Signup Section (Active) */}
                        <div className="p-4 login-signup-section">
                            <Row>
                                {/* Left Section: Input and Button */}
                                <Col md={7} className="border-end pe-md-4">
                                    <h5 className="mb-4 step-heading">
                                        <span className="step-number active-step me-2">1</span> LOGIN OR SIGNUP
                                    </h5>
                                    <Form onSubmit={handleContinue}>
                                        <Form.Group className="mb-4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Email/Mobile number"
                                                required
                                                className="input-field"
                                            />
                                        </Form.Group>

                                        <p className="small text-muted mb-4 privacy-text">
                                            By continuing, you agree to E-commerce <a href="#terms" className="text-decoration-none">Terms of Use</a> and <a href="#privacy" className="text-decoration-none">Privacy Policy</a>.
                                        </p>

                                        <Button
                                            variant="btn btn-danger"
                                            type="submit"
                                            className="continue-btn"
                                        >
                                            CONTINUE
                                        </Button>
                                    </Form>
                                </Col>

                                {/* Right Section: Secure Login Advantages */}
                                <Col md={5} className="ps-md-4 d-none d-md-block secure-login-advantages">
                                    <p className="fw-semibold mb-2">Advantages of our secure login</p>
                                    <ul className="list-unstyled advantage-list">
                                        <li><i className="fas fa-truck-fast me-2 text-success"></i> Easily Track Orders, Hassle Free Returns</li>
                                        <li><i className="fas fa-bell me-2 text-success"></i> Get Relevant Alerts and Recommendation</li>
                                        <li><i className="fas fa-star me-2 text-success"></i> Wishlist, Reviews, Ratings and more.</li>
                                    </ul>
                                </Col>
                            </Row>
                        </div>

                        {/* 2. Delivery Address (Inactive) */}
                        <div className="p-4 step-placeholder">
                            <h5 className="text-muted"><span className="step-number">2</span> DELIVERY ADDRESS</h5>
                        </div>

                        {/* 3. Order Summary (Inactive) */}
                        <div className="p-4 step-placeholder">
                            <h5 className="text-muted"><span className="step-number">3</span> ORDER SUMMARY</h5>
                        </div>

                        {/* 4. Payment Options (Inactive) */}
                        <div className="p-4 step-placeholder">
                            <h5 className="text-muted"><span className="step-number">4</span> PAYMENT OPTIONS</h5>
                        </div>

                        {/* Secure Payment Icon (Right Side) */}
                        <div className="secure-payment-badge d-none d-lg-block">
                            <i className="fas fa-shield-alt"></i>
                            <p className="small mt-2">Safe and Secure Payments. Easy returns.<br />100% Authentic products.</p>
                        </div>
                    </Card>

                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutLoginPage;