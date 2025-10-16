import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
// 🎯 Firestore functions for document operations
import { doc, getDoc, setDoc } from "firebase/firestore"; 
// 🎯 Firebase Auth functions
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
// 🎯 Import your initialized Firebase instances (assuming they are exported from this path)
import { db } from "../firebase"; 
import "../pages/LoginPage.css"

// Initialize Firebase Auth
const auth = getAuth(); 

// ❌ DUMMY DATA REMOVED
// const FAKE_EMAIL = "test@example.com";
// const FAKE_PASSWORD = "password123";
// const TARGET_USER_ID = "3tSmrTzPyZfgVn1lQdG2HqYnBKt2"; 

// Inline Styles
const styles = {
    loginContainer: {
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '12px',
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
  const location = useLocation();
  const from = location.state?.from || "/";

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); 
  const [userDetails, setUserDetails] = useState(null);

  // ------------------------------------------------------------------
  // 1. Fetch user details by Document ID (UID)
  // ------------------------------------------------------------------
  const fetchUserById = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        console.warn(`User profile document not found for UID: ${userId}`);
        setError("Profile document missing. Contact support.");
        return null;
      }

      const userData = userSnapshot.data();
      const userWithId = {
          id: userSnapshot.id, // This is the user's UID
          ...userData
      };
      
      setUserDetails(userWithId);
      return userWithId;

    } catch (firebaseError) {
      console.error("🔥 Error fetching user details from Firestore:", firebaseError);
      setError(`Failed to load profile: ${firebaseError.message}`);
      return null;
    }
  };


  // ------------------------------------------------------------------
  // 2. Handle Form Submission (Login/Signup)
  // ------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setUserDetails(null);

    if (isLogin) {
      // ----- LOGIN LOGIC -----
      try {
          // 2a. Authenticate with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const userId = userCredential.user.uid;
          
          alert(`Login Successful! Fetching profile...`); 
          
          // 2b. Fetch profile data from Firestore using the UID
          const user = await fetchUserById(userId);
          
          if (user) {
              if (onClose) {
                  onClose();
              } else {
                  // Redirect to the intended page
                  navigate(from, { replace: true }); 
              }
          }
      } catch (authError) {
          console.error("Firebase Login Error:", authError.message);
          // Standard Firebase error codes can be handled here for better messages
          setError(`Login failed: Invalid email or password.`);
      }
      
    } else {
      // ----- SIGNUP LOGIC -----
      try {
          // 2a. Create user in Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const userId = userCredential.user.uid;

          // 2b. Create corresponding profile document in Firestore
          await setDoc(doc(db, "users", userId), { 
            name: name,
            email: email,
            // Add other initial fields from your schema (e.g., contactNo, gender, wallet, etc.)
            contactNo: "", 
            gender: "",
            customerID: userId, // Match your schema (customerID)
            profileImage: null,
            referredBy: null
          });
          
          alert(`Signup successful! Welcome ${name}. You can now log in.`);
          
          // Switch to login form
          setIsLogin(true); 

      } catch (authError) {
          console.error("Firebase Signup Error:", authError.message);
          // Handle specific errors like 'auth/email-already-in-use'
          setError(`Signup failed: ${authError.message.replace('Firebase: ', '')}`);
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
    setError(null); 
  };

  const goHome = () => {
    navigate("/"); 
    if (onClose) onClose(); 
  };

  return (
    <div style={styles.loginContainer}>
      
      {onClose && (
          <button style={styles.loginCloseBtn} onClick={onClose} aria-label="Close">
              ✕
          </button>
      )}
      
      <h2 className="text-center mb-4">{isLogin ? "Login" : "Signup"}</h2>

      <Form onSubmit={handleSubmit}>
        
        {/* Display Error Message */}
        {error && <Alert variant="danger">{error}</Alert>}

        {!isLogin && (
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Full Name *</Form.Label>
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
          <Form.Label>Email address *</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password *</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6} // Firebase Auth requires at least 6 characters
          />
        </Form.Group>

        <Button variant="bt btn-warning" type="submit" className="w-100 mb-3">
          {isLogin ? "Login" : "Signup"}
        </Button>
      </Form>

      {/* Display fetched user details (optional, for state verification) */}
      {userDetails && (
        <div className="mt-3 p-3 border rounded bg-success bg-opacity-10">
          <h5 className="text-success">Logged In User Profile:</h5>
          <p className="mb-1"><strong>UID:</strong> {userDetails.id}</p>
          <p className="mb-1"><strong>Name:</strong> {userDetails.name}</p>
          <p className="mb-1"><strong>Email:</strong> {userDetails.email}</p>
        </div>
      )}

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