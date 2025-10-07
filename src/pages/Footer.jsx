// src/components/Footer.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";


const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5">
      <div className="container">
        <div className="row">
          {/* Get to Know Us */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h5 className="text-uppercase">Get to Know Us</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">About Us</a></li>
              <li><a href="#" className="text-light text-decoration-none">Careers</a></li>
              <li><a href="#" className="text-light text-decoration-none">Press Releases</a></li>
              <li><a href="#" className="text-light text-decoration-none">Our Blog</a></li>
            </ul>
          </div>

          {/* Connect with Us */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h5 className="text-uppercase">Connect with Us</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Facebook</a></li>
              <li><a href="#" className="text-light text-decoration-none">Twitter</a></li>
              <li><a href="#" className="text-light text-decoration-none">Instagram</a></li>
            </ul>
          </div>

          {/* Make Money with Us */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h5 className="text-uppercase">Make Money with Us</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Sell on E-commerce.in</a></li>
              <li><a href="#" className="text-light text-decoration-none">Affiliate Program</a></li>
              <li><a href="#" className="text-light text-decoration-none">Advertise Your Products</a></li>
              <li><a href="#" className="text-light text-decoration-none">Business Solutions</a></li>
            </ul>
          </div>

          {/* Let Us Help You */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h5 className="text-uppercase">Let Us Help You</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Your Account</a></li>
              <li><a href="#" className="text-light text-decoration-none">Returns Centre</a></li>
              <li><a href="#" className="text-light text-decoration-none">100% Purchase Protection</a></li>
              <li><a href="#" className="text-light text-decoration-none">Help</a></li>
            </ul>
          </div>
        </div>

        <hr className="bg-light" />

        {/* Footer Bottom */}
        <div className="text-center py-3">
          <p className="mb-0" style={{ fontWeight: "bold", fontSize: "18px" }}>
            © 2025 E-commerce<span style={{color:"orange"}}>.in </span> - All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
