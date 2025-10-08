import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../pages/LoginPage.css"

// 💥 FAKE CREDENTIALS FOR TESTING
const FAKE_EMAIL = "test@example.com";
const FAKE_PASSWORD = "password123";

// 💥 Inline Styles for the Login Modal Appearance
const styles = {
    loginContainer: {
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        // Modal component provides the shadow and centering
        position: 'relative', 
    },
    loginCloseBtn: {
        position: 'absolute',
        top: '10px',
        right: '15px',
        fontSize: '28px',
        cursor: 'pointer',
        color: '#6c757d',
        border: 'none',
        backgroundColor: 'transparent',
        lineHeight: '1',
    }
};

export default function AuthPage({ onClose }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State to handle login error messages

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (isLogin) {
      // --- FAKE LOGIN LOGIC ---
      if (email === FAKE_EMAIL && password === FAKE_PASSWORD) {
        // Success: Use alert() as requested by user
        alert(`Login Successful! Welcome back.`); 
        
        // 💥 Perform actions upon successful login (e.g., redirect or close modal)
        if (onClose) onClose();
        
      } else {
        // Failure: Show error message using React Bootstrap Alert
        setError("Invalid email or password. Please use: test@example.com / password123");
      }
    } else {
      // --- SIGNUP LOGIC (Fake) ---
      alert(`Signup submitted! Successfully registered ${name} with email ${email}.`);
      if (onClose) onClose(); 
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
    setError(null); // Clear error on form switch
  };

  const goHome = () => {
    navigate("/"); // Go to home page
    if (onClose) onClose(); // Close modal
  };

  return (
    <div style={styles.loginContainer}>
      {/* Single ✕ Close Button */}
      {/* CSS பிழையைத் தவிர்க்க div-க்கு பதிலாக button பயன்படுத்தப்பட்டுள்ளது, மேலும் style நேரடியாக கொடுக்கப்பட்டுள்ளது */}
      <button style={styles.loginCloseBtn} onClick={onClose} aria-label="Close">
        ✕
      </button>

      <h2 className="text-center mb-4">{isLogin ? "Login" : "Signup"}</h2>

      <Form onSubmit={handleSubmit}>
        
        {/* Display Error Message if login failed */}
        {isLogin && error && <Alert variant="danger">{error}</Alert>}

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
