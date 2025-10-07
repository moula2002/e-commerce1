import React from "react";
import "./Deals.css";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // ✅ import navigate

const DealCard = ({ product, discount }) => {
  const navigate = useNavigate(); // ✅ use navigate function
  const { id, image, title } = product;
  const festivalText = "Great Indian Festival";

  // ✅ Handle click to go to product detail page
  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <Card
      className="deal-card shadow-sm h-100 border-0"
      style={{ cursor: "pointer" }}
      onClick={handleClick} // ✅ click to navigate
    >
      <div
        className="text-center p-3"
        style={{
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card.Img
          variant="top"
          src={image}
          alt={title}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      <Card.Body className="p-2 pt-0 d-flex flex-column justify-content-end">
        <p className="card-text small text-truncate mb-1">
          {title.substring(0, 30)}...
        </p>

        <span
          className="badge bg-danger discount-badge align-self-start mb-1"
          style={{ fontSize: "0.7rem" }}
        >
          {discount}% off
        </span>

        <p
          className="festival-text text-success fw-bold m-0"
          style={{ fontSize: "0.75rem" }}
        >
          {festivalText}
        </p>
      </Card.Body>
    </Card>
  );
};

export default DealCard;
