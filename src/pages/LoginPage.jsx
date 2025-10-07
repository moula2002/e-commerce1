import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function AuthPage({ onClose }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) alert(`Login submitted!\nEmail: ${email}\nPassword: ${password}`);
    else alert(`Signup submitted!\nName: ${name}\nEmail: ${email}`);
    if (onClose) onClose(); // Close modal after submit
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
  };

  const goHome = () => {
    navigate("/"); // Go to home page
    if (onClose) onClose(); // Close modal
  };

  return (
    <div className="login-container">
      {/* Single ✕ Close Button */}
      <div className="login-close-btn" onClick={onClose}>
        ✕
      </div>

      <h2 className="text-center mb-4">{isLogin ? "Login" : "Signup"}</h2>

      <Form onSubmit={handleSubmit}>
        {!isLogin && (
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mb-3">
          {isLogin ? "Login" : "Signup"}
        </Button>
      </Form>

      <div className="text-center mt-2">
        <Button variant="link" onClick={toggleForm}>
          {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
        </Button>
      </div>

      <div className="text-center mt-3">
        <Button variant="secondary" onClick={goHome}>
          Home
        </Button>
      </div>
    </div>
  );
}
