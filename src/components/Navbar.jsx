import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, Modal, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { setLocation } from "../redux/store";
import AuthPage from "../pages/LoginPage";
import SecondHeader from "./searchBar/SecondHeader";
import "./Navbar.css";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { location } = useSelector((state) => state.header);
  const cartItems = useSelector((state) => state.cart?.items || []);
  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [search, setSearch] = useState("");

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  const changeLocation = () => {
    const newLoc = prompt("Enter new location:", location);
    if (newLoc) dispatch(setLocation(newLoc));
  };

  const goToCart = () => navigate("/cart");

  return (
    <>
      <Navbar
        expand="lg"
        sticky="top"
        className="navbar-custom shadow-sm"
        variant="dark"
      >
        <Container fluid className="px-3">
          {/* Logo + Brand */}
          <motion.div
            className="d-flex align-items-center brand-container"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Navbar.Brand
              href="/"
              className="navbar-brand-custom d-flex align-items-center"
            >
              <span className="brand-white">E-commerce</span>
              <span className="brand-orange">.in</span>
            </Navbar.Brand>
          </motion.div>

          {/* Mobile Toggle Button */}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          {/* Collapsible Navbar */}
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-auto align-items-center">
              {/* Search Bar */}
              <motion.div
                className="search-bar-container my-2 my-lg-0"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search for products"
                    className="me-2 search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button
                    variant="warning"
                    className="search-btn"
                    onClick={() => alert(`Searching for "${search}"`)}
                  >
                    🔍
                  </Button>
                </Form>
              </motion.div>
            </Nav>

            {/* Right Side Buttons */}
            <Nav className="align-items-center ms-lg-3">
              <motion.div
                className="text-white location me-3"
                whileHover={{ scale: 1.05 }}
                style={{ cursor: "pointer" }}
                onClick={changeLocation}
              >
                Deliver to <strong>{location || "Set location"}</strong>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }}>
                <Button
                  variant="outline-light"
                  className="me-2 account-button"
                  onClick={openAuthModal}
                >
                  👤 Account
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }}>
                <Button
                  variant="outline-warning"
                  className="cart-button"
                  onClick={goToCart}
                >
                  🛒 Cart <span className="cart-count">{cartCount}</span>
                </Button>
              </motion.div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <SecondHeader />

      <Modal show={showAuthModal} onHide={closeAuthModal} centered>
        <Modal.Body>
          <AuthPage onClose={closeAuthModal} />
        </Modal.Body>
      </Modal>
    </>
  );
}
