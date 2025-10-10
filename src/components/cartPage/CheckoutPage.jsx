import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./CartPage.css";

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.items || []);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <Container className="py-5 checkout-container">
      <Row>
        {/* Billing Info */}
        <Col md={7}>
          <h3 className="fw-bold mb-4 text-dark">Billing Information</h3>
          <Card className="shadow-sm border-0 p-4">
            <Form>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="fullName">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control type="text" placeholder="Enter full name" required />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="email">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" required />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control type="tel" placeholder="Enter phone number" required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Address *</Form.Label>
                <Form.Control as="textarea" rows={2} placeholder="Enter address" required />
              </Form.Group>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="city">
                    <Form.Label>City *</Form.Label>
                    <Form.Control type="text" placeholder="City" required />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="pincode">
                    <Form.Label>PIN Code *</Form.Label>
                    <Form.Control type="text" placeholder="PIN code" required />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col md={5} className="mt-4 mt-md-0">
          <h3 className="fw-bold mb-4 text-dark">Order Summary</h3>
          <Card className="shadow-sm border-0 p-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"
              >
                <div>
                  <p className="fw-semibold mb-0">{item.title}</p>
                  <small className="text-muted">Quantity: {item.quantity}</small>
                </div>
                <span className="fw-bold text-primary">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}

            <div className="mt-3">
              <p className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>{formatPrice(totalPrice)}</span>
              </p>
              <p className="d-flex justify-content-between">
                <span>Shipping:</span>
                <span className="text-success fw-semibold">Free</span>
              </p>
              <hr />
              <h5 className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span className="text-success">{formatPrice(totalPrice)}</span>
              </h5>

              <Button variant="btn btn-warning" className="w-100 mt-3 py-2 fw-semibold">
                🔒 Pay with Razorpay
              </Button>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Secure payment powered by Razorpay
                </small>
                <div className="mt-2">
                  <span className="badge bg-light text-dark mx-1">Cards</span>
                  <span className="badge bg-light text-success mx-1">UPI</span>
                  <span className="badge bg-light text-info mx-1">Wallets</span>
                  <span className="badge bg-light text-warning mx-1">Net Banking</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
