import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// 🚨 IMPORT the necessary action from your Redux slice
import { clearCart } from "../../redux/cartSlice"; 

function CashOnDelivery() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get billing details from the state passed from the previous checkout step
  const billingDetails = location.state?.billingDetails || {}; 
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

  const handleConfirmOrder = () => {
    const confirmOrder = window.confirm(
      "Do you want to confirm your Cash on Delivery order?"
    );
    if (confirmOrder) {
      // 1. Clear the cart first
      dispatch(clearCart()); 

      // 2. Navigate to the Order Confirmation Page
      navigate("/order-confirm", { // <-- 🎯 Navigation to the Order Confirmation Page
          state: { 
              paymentMethod: "Cash on Delivery",
              total: formatPrice(totalPrice), // Pass the formatted total price
              itemsCount: cartItems.length,   // Pass the count of items
              // 🎯 PASSING THE REAL ADDRESS DATA
              billingDetails: billingDetails
          } 
      });
      
    } else {
      alert("Order not placed. You can continue shopping.");
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/checkout"); // Navigate back to CheckoutPage
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4">Cash on Delivery Order</h2>

          {/* Billing Details */}
          <Card className="mb-4 shadow-sm p-4">
            <h5 className="mb-3">Billing Information</h5>
            <p><strong>Name:</strong> {billingDetails.fullName}</p>
            <p><strong>Email:</strong> {billingDetails.email}</p>
            <p><strong>Phone:</strong> {billingDetails.phone}</p>
            <p><strong>Address:</strong> {billingDetails.address}, {billingDetails.city} - {billingDetails.pincode}</p>
          </Card>

          {/* Order Summary */}
          <Card className="mb-4 shadow-sm p-4">
            <h5 className="mb-3">Order Summary</h5>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2"
              >
                <div>
                  <p className="mb-0">{item.title}</p>
                  <small className="text-muted">Quantity: {item.quantity}</small>
                </div>
                <span className="fw-bold">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}

            <hr />
            <p className="d-flex justify-content-between">
              <span>Subtotal:</span>
              <span>{formatPrice(totalPrice)}</span>
            </p>
            <p className="d-flex justify-content-between">
              <span>Shipping:</span>
              <span className="text-success fw-semibold">Free</span>
            </p>
            <h5 className="d-flex justify-content-between fw-bold">
              <span>Total:</span>
              <span>{formatPrice(totalPrice)}</span>
            </h5>
          </Card>

          <Button
            variant="warning"
            className="w-100 py-2 fw-semibold"
            onClick={handleConfirmOrder}
          >
            Confirm Cash on Delivery Order
          </Button>

          {/* Back Button */}
          <Button
            variant="secondary"
            className="w-100 mt-3 py-2 fw-semibold"
            onClick={handleBack}
          >
            Back to Checkout
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default CashOnDelivery;