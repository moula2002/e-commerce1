import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, clearCart } from "../../redux/cartSlice";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const EmptyCart = () => (
  <Container className="text-center py-5">
    <h2 className="text-muted mb-4">Your Cart is Empty 🛒</h2>
    <p>Looks like you haven't added anything to your cart yet.</p>
    <Link to="/" className="btn btn-primary mt-3">Start Shopping</Link>
  </Container>
);

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items || []);

  // 💥 PLACEHOLDER FOR AUTHENTICATION CHECK 💥
  // In a real app, this should be fetched from Redux or Context
  const isLoggedIn = false; // <<< Set this to 'true' to skip login

  // Handlers for cart operations
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

  // --- HANDLER FOR CONDITIONAL NAVIGATION ---
  const handleCheckout = () => {
    if (isLoggedIn) {
      // If logged in, proceed to checkout
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: "/checkout" } });
    }
  };
  // ---------------------------------------------

  // ---------------------------------------------
  // ⭐ Combined Cart Items Rendering Logic ⭐
  // ---------------------------------------------
  const renderCartItems = () => (
    <Row className="g-4">
      {cartItems.map((item) => (
        <Col xs={12} key={item.id}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row className="align-items-center">
                {/* Image & Title */}
                <Col xs={12} sm={6} md={5} className="d-flex align-items-center mb-3 mb-sm-0">
                  <img
                    src={item.image || "https://via.placeholder.com/60?text=IMG"}
                    alt={item.title}
                    style={{ width: '60px', height: '60px', objectFit: 'contain', marginRight: '15px' }}
                  />
                  <div>
                    <Link to={`/product/${item.id}`} className="text-dark text-decoration-none fw-semibold">
                      {item.title}
                    </Link>
                    <p className="text-muted small mb-0 mt-1">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                </Col>

                {/* Quantity Controls */}
                <Col xs={6} sm={3} md={3} className="text-center">
                  <div className="d-flex align-items-center justify-content-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleDecrease(item)}
                      disabled={item.quantity <= 0 }
                    >
                      <i className="fas fa-minus"></i>
                    </Button>
                    <span className="mx-3 fw-bold">{item.quantity}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleIncrease(item)}
                    >
                      <i className="fas fa-plus"></i>
                    </Button>
                  </div>
                </Col>

                {/* Subtotal & Remove */}
                <Col xs={6} sm={3} md={4} className="text-end">
                  <h5 className="fw-bold text-danger mb-2">
                    {formatPrice(item.price * item.quantity)}
                  </h5>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemove(item)}
                  >
                    <i className="fas fa-trash me-1"></i> Remove
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  if (cartItems.length === 0) return <EmptyCart />;

  return (
    <Container className="cart-container py-4">
      <h2 className="cart-heading mb-4 text-center text-dark">🛍️ Your Shopping Cart</h2>

      {/* Render the combined cart items list */}
      {renderCartItems()}

      <Row className="justify-content-center mt-5">
        <Col xs={12} md={8} lg={6}>
          <Card className="cart-summary-card shadow-lg border-0">
            <Card.Body className="text-center">
              <h3 className="fw-bold mb-3 text-dark">
                Total: <span className="text-warning">{formatPrice(totalPrice)}</span>
              </h3>

              <div className="d-flex justify-content-center gap-3">
                <Button
                  variant="warning"
                  className="checkout-btn px-4 fw-semibold"
                  onClick={handleCheckout}
                >
                  Proceed to buy
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