import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ViewOrderDetails() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // 🧾 Fetch from LocalStorage
      const storedOrders = JSON.parse(localStorage.getItem("userOrders")) || [];

      // ✅ Remove duplicate order IDs (safety fix)
      const uniqueOrders = storedOrders.filter(
        (order, index, self) =>
          index === self.findIndex((o) => o.id === order.id)
      );

      setOrders(uniqueOrders);
    } catch (error) {
      console.error("Error loading orders from Local Storage:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🎴 Order Card component
  const OrderCard = ({ order }) => (
    <Card className="mb-4 shadow-sm border-0 rounded-3">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center border-0">
        <h5 className="mb-0 text-primary fw-bold">
          Order ID: <span className="text-dark">{order.id}</span>
        </h5>
        <span
          className={`fw-bold ${
            order.status === "Delivered"
              ? "text-success"
              : "text-warning"
          }`}
        >
          {order.status || "Processing"}
        </span>
      </Card.Header>

      <Card.Body className="bg-white">
        <Row>
          <Col md={6}>
            <p className="mb-1">
              <strong>Order Date:</strong> {order.date}
            </p>
            <p className="mb-1">
              <strong>Total Amount:</strong>{" "}
              <span className="text-danger fw-bold">
                ₹{order.total?.toLocaleString()}
              </span>
            </p>
            <p className="mb-0">
              <strong>Payment:</strong> {order.paymentMethod}
            </p>
          </Col>

          <Col md={6}>
            <h6 className="fw-bold mb-2">Shipping To:</h6>
            <p className="mb-1">{order.shippingAddress?.name}</p>
            <p className="mb-1 small text-muted">
              {order.shippingAddress?.address},{" "}
              {order.shippingAddress?.city} -{" "}
              {order.shippingAddress?.pincode}
            </p>
            <p className="mb-0 small text-muted">
              Ph: {order.shippingAddress?.phone}
            </p>
          </Col>
        </Row>

        {/* 🧾 Ordered Items */}
        {order.items && order.items.length > 0 && (
          <div className="mt-3 border-top pt-3">
            <h6 className="fw-bold mb-2">Items:</h6>
            {order.items.map((item, idx) => (
              <div key={idx} className="d-flex justify-content-between small mb-1">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        )}
      </Card.Body>

      <Card.Footer className="text-center bg-light border-0">
        <Button variant="info" size="sm" className="me-2">
          Track Package
        </Button>
        <Button variant="outline-dark" size="sm" onClick={() => navigate("/")}>
          Buy Again
        </Button>
      </Card.Footer>
    </Card>
  );

  // 🕒 Loading State
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your orders...</p>
      </Container>
    );
  }

  // 🧾 Main Render
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={9}>
          <h2 className="mb-4 fw-bold">
            Your Orders{" "}
            <span className="text-muted fs-6">
              ({orders.length})
            </span>
          </h2>

          {orders.length === 0 ? (
            <Alert variant="warning" className="text-center shadow-sm">
              You haven’t placed any orders yet.
              <div className="mt-2">
                <Button variant="primary" onClick={() => navigate("/")}>
                  Start Shopping
                </Button>
              </div>
            </Alert>
          ) : (
            orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ViewOrderDetails;
