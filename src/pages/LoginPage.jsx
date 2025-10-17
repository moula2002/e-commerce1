import React, { useState } from "react";
// Removed ToastContainer, Toast from react-bootstrap import as we're using a custom approach for style
import { Button, Form, Alert, ToastContainer, Toast } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
// 🎯 Firestore functions for document operations
import { doc, getDoc, setDoc } from "firebase/firestore";
// 🎯 Firebase Auth functions
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
// 🎯 Import your initialized Firebase instances 
import { db } from "../firebase"; // Assuming you have firebase.js in the parent directory
import "../pages/LoginPage.css" // The CSS for @keyframes animation is still REQUIRED here

// Initialize Firebase Auth
const auth = getAuth();

// Inline Styles (Updated to include Toast colors/styles)
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
  },
    // Define the colors/backgrounds we will use for the Toast via inline styles
    toastBackgrounds: {
        danger: '#dc3545', // Red for Logout
        success: '#198754', // Green for Signup Success
        info: '#0dcaf0', // Blue for Login Loading
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

  // State for custom Toast/Notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success"); // Holds 'danger', 'success', 'info'

  // Function to show a custom toast notification
  const displayToast = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Helper function to get the correct background color inline
  const getToastBgStyle = () => ({
    backgroundColor: styles.toastBackgrounds[toastVariant] || styles.toastBackgrounds.success,
    color: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Inline box shadow
    border: 'none',
 });

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

      // ✅ Display custom animated toast notification on success
      displayToast("You have been successfully logged out! Redirecting...", "danger");

      // Wait for the toast animation/display duration (1500ms) before redirecting/closing
      setTimeout(() => {
        if (onClose) {
          onClose(); // Close modal if used as one
        } else {
          navigate("/", { replace: true }); // Navigate to home page
        }
      }, 1500); 

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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        displayToast(`Login Successful! Fetching profile...`, "info");

        const user = await fetchUserById(userId);

        if (user) {
          setTimeout(() => {
            if (onClose) {
              onClose();
            } else {
              navigate(from, { replace: true });
            }
          }, 500); 
        }
      } catch (authError) {
        console.error("Firebase Login Error:", authError.message);
        setError(`Login failed: Invalid email or password.`);
      }

    } else {
      // ----- SIGNUP LOGIC -----
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Create corresponding profile document in Firestore
        await setDoc(doc(db, "users", userId), {
          name: name,
          email: email,
          contactNo: "",
          gender: "",
          customerID: userId,
          profileImage: null,
          referredBy: null
        });

        displayToast(`Signup successful! Welcome ${name}. Please log in.`, "success");

        // Switch to login form after a brief delay
        setTimeout(() => {
          setIsLogin(true);
        }, 500);


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
    <>
      {/* 1. Full-page wrapper for CSS background/centering (Requires external CSS) */}
      <div className="auth-page-wrapper"> 
        {/* 2. Inner login box container */}
        <div style={styles.loginContainer} className="login-container"> 

          {onClose && (
            <button style={styles.loginCloseBtn} onClick={onClose} aria-label="Close">
              ✕
            </button>
          )}

          <h2 className="text-center mb-4">{isLogin ? "Login" : "Signup"}</h2>

          {userDetails ? (
            // --- Logged In View ---
            <div className="text-center">
              <div className="mt-3 p-3 border rounded bg-success bg-opacity-10 mb-4">
                <h5 className="text-success">You are logged in!</h5>
                <p className="mb-1"><strong>Name:</strong> {userDetails.name}</p>
                <p className="mb-1"><strong>Email:</strong> {userDetails.email}</p>
              </div>
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
      </div>

      {/* 3. Custom Toast/Notification Component */}
      <ToastContainer 
           style={{ 
               position: 'fixed', 
               top: 0, 
               right: 0, 
               padding: '1rem',
               zIndex: 1080 
           }} 
       >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={1500} 
          autohide
          className="fade-in-out" // Animation class must remain external
          style={getToastBgStyle()} // ✅ INLINE CSS for background and appearance
        >
          <Toast.Body style={{ fontWeight: 500 }}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}