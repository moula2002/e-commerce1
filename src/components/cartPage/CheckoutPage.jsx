// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase"; // Assumed path for firebase initialization
import "./CartPage.css"; // Assumed path for local styling

const RAZORPAY_KEY_ID = "rzp_live_RF5gE7NCdAsEIs";

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  // Retrieves cart items and calculates total price from Redux store
  const cartItems = useSelector((state) => state.cart.items || []);
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  // ⭐ STATE: State to store fetched main SKUs for ALL cart items (Map: {productId: main_sku})
  const [productSkus, setProductSkus] = useState({});
  const [billingDetails, setBillingDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  /**
   * Function to fetch the main SKU from a product document in 'products' collection.
   */
  const fetchProductMainSku = async (productId) => {
    try {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const data = productSnap.data();
        
        // Prioritize main 'sku' or 'basesku' from Firestore, otherwise use ID
        const mainSku = data.sku || data.basesku || productId;
        
        console.log(`Main SKU for Product ${productId}:`, mainSku);
        return mainSku; // Return the fetched SKU
      } else {
        console.log(`No product document found for ID: ${productId}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching product SKU:", error);
      return null;
    }
  };


  // Effect 1: Authenticate User and Fetch Existing Data & Fetch ALL SKUs
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user.uid);
        
        // ⭐ NEW LOGIC: Fetch SKUs for all unique product IDs in the cart
        const uniqueProductIds = [...new Set(cartItems.map(item => item.id))];
        
        const fetchAllSkus = async () => {
          const skuMap = {};
          for (const id of uniqueProductIds) {
            const sku = await fetchProductMainSku(id);
            if (sku) {
              skuMap[id] = sku;
            }
          }
          setProductSkus(skuMap);
        };

        fetchAllSkus();

      } else {
        setLoading(false);
        alert("Please log in to continue checkout.");
        navigate("/login");
      }
    });
    return () => unsubscribe();
  // Added cartItems to dependency array to re-fetch SKUs if cart contents change
  }, [navigate, cartItems]); 

  const fetchUserData = async (uid) => {
    setLoading(true);
    try {
      const docRef = doc(db, "users", uid); 
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBillingDetails((prev) => ({
          ...prev,
          fullName: data.name || prev.fullName,
          email: data.email || prev.email,
          phone: data.phone || prev.phone || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveBillingDetails = async (details) => {
    if (!userId) return;
    try {
      const docRef = doc(db, "users", userId);
      await setDoc(
        docRef,
        {
          name: details.fullName,
          email: details.email,
          phone: details.phone,
          shipping_address: {
            address: details.address,
            city: details.city,
            pincode: details.pincode,
          },
          lastUpdated: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving billing details:", error);
    }
  };

  /**
   * Saves a new order document to the /users/{userId}/orders subcollection.
   * Uses the fetched main SKU for the product-level sku field, and the variant SKU (item.sku) 
   * for the sizevariants-level sku field.
   */
  const saveOrderToFirestore = async (paymentMethod, status = "Pending", paymentId = null) => {
    if (!userId) return;

    try {
      const ordersRef = collection(db, "users", userId, "orders");
      const orderId = `ORD-${Date.now()}`;

      // --- START: ORDER DATA STRUCTURE ---
      const orderData = {
        // Core Order Fields
        userId: userId,
        orderId: orderId,
        orderStatus: status,
        totalAmount: totalPrice,
        paymentMethod: paymentMethod,
        phoneNumber: billingDetails.phone,
        
        // Timestamps
        createdAt: serverTimestamp(),
        orderDate: serverTimestamp(),

        // Address Details
        addressDetails: { 
          fullName: billingDetails.fullName,
          addressLine1: billingDetails.address,
          city: billingDetails.city,
          postalCode: billingDetails.pincode,
          state: "Karnataka",
        },

        // Product Array
        products: cartItems.map((item) => {
          
          // Check for size/weight variant data (excluding sku)
          const hasVariantData = item.stock || item.weight || item.width || item.height;

          // Construct sizevariants object (contains the variant SKU, which is item.sku)
          const sizevariants = hasVariantData ? {
              // Use the SKU specific to the cart item variant
              sku: item.sku || null, 
              stock: item.stock || null,
              weight: item.weight || null,
              width: item.width || null,
              height: item.height || null,
          } : undefined;
          
          const product = {
            // Product Core
            productId: item.id, 
            name: item.title,
            price: item.price, // Numerical price
            quantity: item.quantity,
            
            // ⭐ MODIFIED: Use the MAIN product SKU fetched from the 'products' collection
            sku: productSkus[item.id] || item.sku || null, 
            
            // Price Strings (as seen in screenshots)
            "Offer Price": item.price.toString(), 
            Price: (item.originalPrice || item.price).toString(),

            // Product Meta
            description: item.description || null,
            brandName: item.brandName || null,
            category: item.category || null,
            shopName: item.shopName || null,
            productSellerId: item.productSellerId || null,
            
            // Variant Fields
            color: item.color || null,
            size: item.size || null, 
            
            // Image array
            images: item.images || [], 
            
            // Shipment/Delivery Fields
            expectedDelivery: item.expectedDelivery || "08/23/2025", 
            isShowCashOnDelivery: item.isShowCashOnDelivery || null,
            shipmentId: item.shipmentId || null,
            shippingCharges: item.shippingCharges || null,
            shiprocketOrderId: item.shiprocketOrderId || 0,
            shiprocketStatus: item.shiprocketStatus || null,

            // SKU/Variant Container (Only add if variant data exists)
            ...(sizevariants && { sizevariants: sizevariants }), 

            // totalAmount/totalPrice for this specific product
            totalAmount: (item.price * item.quantity), 
          };

          return product;
        }),

        // Payment/Shipping references (Optional)
        paymentId: paymentId,
        shipmentId: null,
        shippingCharges: 0, 

        // Geo Location
        latitude: null,
        longitude: null,
        address: billingDetails.address,
      };
      // --- END: ORDER DATA STRUCTURE ---

      // Add the new order document to the subcollection
      await addDoc(ordersRef, orderData);
      console.log("✅ Order saved:", orderData);

      alert("Order placed successfully!");
      // Navigate to the orders viewing page after success
      navigate("/orders"); 
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Error saving order details. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    setBillingDetails({ ...billingDetails, [e.target.id]: e.target.value });
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  const handlePayment = async (e) => {
    e.preventDefault();

    // Basic Form Validation
    const requiredFields = ["fullName", "email", "phone", "address", "city", "pincode"];
    for (const field of requiredFields) {
      if (!billingDetails[field]) {
        alert(`Please fill in the required field: ${field}`);
        return;
      }
    }

    // Save billing details to the customer's root document first
    await saveBillingDetails(billingDetails);

    // Handle Cash on Delivery (COD) flow
    if (paymentMethod === "cod") {
      await saveOrderToFirestore("Cash on Delivery", "Pending");
      // Optionally navigate to a confirmation page for COD
      navigate("/cod", { state: { billingDetails } }); 
      return;
    }

    // Handle Razorpay (Online Payment) flow
    const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const amountInPaise = Math.round(totalPrice * 100);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: "INR",
      name: "SadhanaCart",
      description: "Purchase Checkout",
      handler: async function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        // Save order with "Paid" status upon successful payment
        await saveOrderToFirestore("Razorpay", "Paid", response.razorpay_payment_id);
      },
      prefill: {
        name: billingDetails.fullName,
        email: billingDetails.email,
        contact: billingDetails.phone,
      },
      notes: {
        address: billingDetails.address,
        pincode: billingDetails.pincode,
      },
      theme: { color: "#FFA500" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3 text-dark">Fetching billing details...</p>
      </Container>
    );
  }
  
  // Check if cart is empty before rendering checkout form
  if (cartItems.length === 0) {
      return (
          <Container className="py-5 text-center">
              <Alert variant="info">
                  Your cart is empty. <Button variant="link" onClick={() => navigate("/")}>Go shopping</Button>
              </Alert>
          </Container>
      );
  }

  return (
    <Container className="py-5 checkout-container">
      <Row>
        <Col md={7}>
          <h3 className="fw-bold mb-4 text-dark">Billing Information</h3>
          <Card className="shadow-sm border-0 p-4">
            <Form onSubmit={handlePayment}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="fullName">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter full name"
                      required
                      value={billingDetails.fullName}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="email">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      required
                      value={billingDetails.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter phone number"
                  required
                  value={billingDetails.phone}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Address *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Enter full street address"
                  required
                  value={billingDetails.address}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="city">
                    <Form.Label>City *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="City"
                      required
                      value={billingDetails.city}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="pincode">
                    <Form.Label>PIN Code *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="PIN code"
                      required
                      value={billingDetails.pincode}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Payment Method *</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    label="Razorpay (Online Payment)"
                    name="paymentMethod"
                    id="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Cash on Delivery (COD)"
                    name="paymentMethod"
                    id="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                </div>
              </Form.Group>

              <Button
                variant="btn btn-warning"
                className="w-100 mt-3 py-2 fw-semibold"
                type="submit"
              >
                🔒 Pay {formatPrice(totalPrice)}
              </Button>
            </Form>
          </Card>
        </Col>

        <Col md={5} className="mt-4 mt-md-0">
          <h3 className="fw-bold mb-4 text-dark">Order Summary</h3>
          {/* DISPLAY FETCHED SKUS FOR ALL PRODUCTS - Useful for debugging/verification */}
          {Object.keys(productSkus).length > 0 && (
            <Alert variant="success" className="p-2 mb-3">
              <strong>Fetched Product SKUs:</strong>
              <ul>
                {Object.entries(productSkus).map(([id, sku]) => (
                  <li key={id} style={{fontSize: '0.85rem'}}>
                    **ID {id}:** {sku}
                  </li>
                ))}
              </ul>
            </Alert>
          )}

          <Card className="shadow-sm border-0 p-4">
            {cartItems.map((item) => (
              <div
                key={item.id + (item.sku || '')} // Use item.sku/variant for key if available
                className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"
              >
                <div>
                  <p className="fw-semibold mb-0">{item.title}</p>
                  <small className="text-muted">Quantity: {item.quantity}</small>
                  {/* Optionally display the variant SKU from the cart item */}
                  {item.sku && <small className="d-block text-info">Variant SKU: {item.sku}</small>}
                </div>
                <span className="fw-bold text-primary">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="mt-3">
              <p className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>{formatPrice(totalPrice)}</span>
              </p>
              <p className="d-flex justify-content-between">
                <span>Shipping:</span>
                <span className="text-success fw-semibold">Free</span>
              </p>
              <hr />
              <h5 className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span className="text-success">{formatPrice(totalPrice)}</span>
              </h5>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  ); 
};

export default CheckoutPage;