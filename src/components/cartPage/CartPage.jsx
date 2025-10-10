import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, clearCart } from "../../redux/cartSlice";
import CartItems from "./CartItems";
import EmptyCart from "./EmptyCart";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items || []);

  const handleIncrease = (item) => dispatch(addToCart({ ...item, quantity: 1 }));
  const handleDecrease = (item) => dispatch(removeFromCart({ id: item.id, quantity: 1 }));
  const handleRemove = (item) => dispatch(removeFromCart({ id: item.id }));
  const handleClear = () => dispatch(clearCart());

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  if (cartItems.length === 0) return <EmptyCart />;

  return (
    <Container className="cart-container py-4">
      <h2 className="cart-heading mb-4 text-center text-dark">🛍️ Your Shopping Cart</h2>

      <CartItems
        items={cartItems}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
      />

      <Row className="justify-content-center mt-5">
        <Col xs={12} md={8} lg={6}>
          <Card className="cart-summary-card shadow-lg border-0">
            <Card.Body className="text-center">
              <h3 className="fw-bold mb-3 text-dark">
                Total: <span className="text-warning">{formatPrice(totalPrice)}</span>
              </h3>

              <div className="d-flex justify-content-center gap-3">
                {/* ✅ Go to Checkout on click */}
                <Button
                  variant="warning"
                  className="checkout-btn px-4 fw-semibold"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline-danger"
                  className="clear-btn px-4 fw-semibold"
                  onClick={handleClear}
                >
                  Clear Cart
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
