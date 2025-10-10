import React from "react";

import { Card, Button, Row, Col, Image, ButtonGroup } from "react-bootstrap";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const name = item.title;

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Card className="mb-3 shadow-sm border-0 cart-item-card">
      <Card.Body>
        <Row className="align-items-center">
          {/* Product Image */}
          <Col xs={4} md={2} className="text-center">
            <Image
              src={item.image}
              alt={name}
              fluid
              rounded
              className="cart-item-image"
              style={{ maxHeight: "90px", objectFit: "contain" }}
            />
          </Col>

          {/* Product Info */}
          <Col xs={8} md={4}>
            <h5 className="fw-semibold mb-1">{name}</h5>
            <p className="text-warning fw-bold mb-0">{formatPrice(item.price)}</p>
          </Col>

          {/* Quantity Controls */}
          <Col xs={12} md={3} className="mt-3 mt-md-0 text-md-center">
            <ButtonGroup aria-label="Quantity controls">
              <Button
                variant="outline-light"
                onClick={() => onDecrease(item)}
                disabled={item.quantity <= 1}
              >
                −
              </Button>
              <Button variant="dark" disabled>
                {item.quantity}
              </Button>
              <Button
                variant="outline-light"
                onClick={() => onIncrease(item)}
              >
                +
              </Button>
            </ButtonGroup>
          </Col>

          {/* Remove Button */}
          <Col xs={12} md={3} className="mt-3 mt-md-0 text-md-end text-center">
            <Button
              variant="danger"
              size="sm"
              className="rounded-pill px-3"
              onClick={() => onRemove(item)}
            >
              🗑 Remove
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CartItem;
