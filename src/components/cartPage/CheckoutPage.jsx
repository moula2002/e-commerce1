import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

const RAZORPAY_KEY_ID = "rzp_live_RF5gE7NCdAsEIs";

// Load Razorpay script dynamically
const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items || []);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const [billingDetails, setBillingDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // default

  const handleInputChange = (e) => {
    setBillingDetails({ ...billingDetails, [e.target.id]: e.target.value });
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  const handlePayment = async (e) => {
    e.preventDefault();

    const requiredFields = ["fullName", "email", "phone", "address", "city", "pincode"];
    for (const field of requiredFields) {
      if (!billingDetails[field]) {
        alert(`Please fill in the required field: ${field}`);
        return;
      }
    }

    if (paymentMethod === "cod") {
      // Navigate to COD page with billingDetails
      navigate("/cod", { state: { billingDetails } });
      return;
    }

    // Razorpay flow
    const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay SDK failed to load. Are you connected to the internet?");
      return;
    }

    const amountInPaise = Math.round(totalPrice * 100);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: "INR",
      name: "SadhanaCart",
      description: "Purchase Checkout",
      handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        // Here you can dispatch an action to clear cart or save order
      },
      prefill: {
        name: billingDetails.fullName,
        email: billingDetails.email,
        contact: billingDetails.phone,
      },
      notes: {
        address: billingDetails.address,
        pincode: billingDetails.pincode,
      },
      theme: { color: "#FFA500" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <Container className="py-5 checkout-container">
      <Row>
        {/* Billing Info */}
        <Col md={7}>
          <h3 className="fw-bold mb-4 text-dark">Billing Information</h3>
          <Card className="shadow-sm border-0 p-4">
            <Form onSubmit={handlePayment}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="fullName">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter full name"
                      required
                      value={billingDetails.fullName}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="email">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      required
                      value={billingDetails.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter phone number"
                  required
                  value={billingDetails.phone}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Address *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Enter address"
                  required
                  value={billingDetails.address}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="city">
                    <Form.Label>City *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="City"
                      required
                      value={billingDetails.city}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="pincode">
                    <Form.Label>PIN Code *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="PIN code"
                      required
                      value={billingDetails.pincode}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Payment Method */}
              <Form.Group className="mb-3">
                <Form.Label>Payment Method *</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    label="Razorpay"
                    name="paymentMethod"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Cash on Delivery"
                    name="paymentMethod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                </div>
              </Form.Group>

              <Button
                variant="btn btn-warning"
                className="w-100 mt-3 py-2 fw-semibold d-md-none"
                type="submit"
              >
                🔒 Pay {formatPrice(totalPrice)}
              </Button>
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

              <Button
                variant="btn btn-warning"
                className="w-100 mt-3 py-2 fw-semibold d-none d-md-block"
                onClick={handlePayment}
              >
                🔒 Pay {formatPrice(totalPrice)}
              </Button>

              <div className="text-center mt-3">
                <small className="text-muted">Secure payment powered by Razorpay</small>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
