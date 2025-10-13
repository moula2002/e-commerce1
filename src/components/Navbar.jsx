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
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [newLocation, setNewLocation] = useState(location || "");
  const [search, setSearch] = useState("");

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  const openLocationModal = () => setShowLocationModal(true);
  const closeLocationModal = () => setShowLocationModal(false);

  const saveLocation = () => {
    if (newLocation.trim() !== "") {
      dispatch(setLocation(newLocation));
      closeLocationModal();
    }
  };

  const goToCart = () => navigate("/cart");

  return (
    <>
      <Navbar
        expand="lg"
        className="navbar-custom shadow-sm sticky-top"
        variant="dark"
      >
        <Container fluid className="px-3">
          {/* Logo */}
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

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-auto align-items-center">
              {/* Search Bar */}
              <motion.div
                className="search-bar-container my-2 my-lg-0"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Form className="d-flex w-100">
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

            <Nav className="align-items-center ms-lg-3">
              {/* Location */}
              <motion.div
                className="text-white location me-3"
                whileHover={{ scale: 1.05 }}
                style={{ cursor: "pointer" }}
                onClick={openLocationModal}
              >
                Deliver to <strong>{location || "Set location"}</strong>
              </motion.div>

              {/* Account (desktop) */}
              <motion.div whileHover={{ scale: 1.1 }} className="d-none d-lg-block">
                <Button
                  variant="outline-light"
                  className="me-2 account-button"
                  onClick={openAuthModal}
                >
                  👤 Account
                </Button>
              </motion.div>

              {/* Account (mobile) */}
              <motion.div whileHover={{ scale: 1.1 }} className="d-lg-none">
                <Button
                  variant="outline-light"
                  className="me-2 account-button"
                  onClick={openAuthModal}
                >
                  👤
                </Button>
              </motion.div>

              {/* Cart */}
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

      {/* Auth Modal */}
      <Modal show={showAuthModal} onHide={closeAuthModal} centered>
        <Modal.Body>
          <AuthPage onClose={closeAuthModal} />
        </Modal.Body>
      </Modal>

      {/* Location Modal */}
      <Modal
        show={showLocationModal}
        onHide={closeLocationModal}
        centered
        backdrop="static"
        className="location-modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Set Delivery Location 📍</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Enter your location:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Eg: Chennai, Tamil Nadu"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeLocationModal}>
              Cancel
            </Button>
            <Button variant="warning" onClick={saveLocation}>
              Save Location
            </Button>
          </Modal.Footer>
        </motion.div>
      </Modal>
    </>
  );
}
