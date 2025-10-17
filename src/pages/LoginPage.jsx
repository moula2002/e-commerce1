import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
// 🎯 Firestore functions for document operations
import { doc, getDoc, setDoc } from "firebase/firestore";
// 🎯 Firebase Auth functions
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth"; // ✅ Added signOut
// 🎯 Import your initialized Firebase instances 
import { db } from "../firebase";
import "../pages/LoginPage.css"

// Initialize Firebase Auth
const auth = getAuth();

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
  // ✅ Reads the 'from' path sent by ProductDetailPage: /checkout
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
  // 3. Handle Logout Action 
  // ------------------------------------------------------------------
  const handleLogout = async () => {
    setError(null);
    try {
      await signOut(auth); // Sign out the user
      setUserDetails(null); // Clear local user state

      alert("You have been successfully logged out!");

      if (onClose) {
        onClose(); // Close modal if used as one
      } else {
        navigate("/"); // Navigate to home page
      }

    } catch (logoutError) {
      console.error("Firebase Logout Error:", logoutError);
      setError("Failed to log out. Please try refreshing the page.");
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
            // ✅ Navigates to the intended page (e.g., /checkout)
            navigate(from, { replace: true });
          }
        }
      } catch (authError) {
        console.error("Firebase Login Error:", authError.message);
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
          contactNo: "",
          gender: "",
          customerID: userId,
          profileImage: null,
          referredBy: null
        });

        alert(`Signup successful! Welcome ${name}. You can now log in.`);

        // Switch to login form
        setIsLogin(true);

      } catch (authError) {
        console.error("Firebase Signup Error:", authError.message);
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

      {userDetails ? (
        // --- Logged In View ---
        <div className="text-center">
          {/* Display fetched user details (optional) */}
          <div className="mt-3 p-3 border rounded bg-success bg-opacity-10 mb-4">
            <h5 className="text-success">You are logged in!</h5>
            <p className="mb-1"><strong>Name:</strong> {userDetails.name}</p>
            <p className="mb-1"><strong>Email:</strong> {userDetails.email}</p>
          </div>
          {/* ✅ Logout Button */}
          <Button
            variant="danger"
            onClick={handleLogout}
            className="w-100 mb-3"
          >
            <i className="fas fa-sign-out-alt me-2"></i> Log Out
          </Button>
        </div>

      ) : (
        // --- Login/Signup Form View ---
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
              minLength={6}
            />
          </Form.Group>

          <Button variant="bt btn-warning" type="submit" className="w-100 mb-3">
            {isLogin ? "Login" : "Signup"}
          </Button>

          <div className="text-center mt-2">
            <Button variant="link" onClick={toggleForm}>
              {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
            </Button>
          </div>
        </Form>
      )}

      <div className="text-center mt-3">
        <Button variant="secondary" onClick={goHome}>
          Home
        </Button>
      </div>
    </div>
  );
}