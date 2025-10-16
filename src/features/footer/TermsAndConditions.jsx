import React from 'react';
import './TermsAndConditions.css'; // Import the CSS file

function TermsAndConditions() {
  const sections = [
    {
      title: "1. User Accounts",
      points: [
        "You must register an account to make purchases or sell products",
        "You are responsible for maintaining the confidentiality of your account",
        "You must provide accurate and complete information"
      ]
    },
    {
      title: "2. Vendor Responsibilities",
      points: [
        "Vendors must ensure their products are legal, genuine, and as described",
        "Vendors are responsible for order fulfillment, returns, and refunds",
        "Vendors must comply with all applicable laws and regulations"
      ]
    },
    {
      title: "3. Purchases and Payments",
      points: [
        "All purchases made through the app are subject to availability",
        "We use secure third-party payment gateways for processing",
        "Prices are subject to change without notice"
      ]
    },
    {
      title: "4. Prohibited Activities",
      points: [
        "Posting or selling counterfeit or restricted items",
        "Attempting to hack or disrupt the platform",
        "Using automated tools to access data or manipulate listings"
      ]
    },
    {
      title: "5. Intellectual Property",
      points: [
        "All content, logos, and trademarks are owned by us or our partners",
        "Users may not copy or reproduce app content without permission",
        "Vendors retain ownership of their product listings and images"
      ]
    },
    {
      title: "6. Termination",
      points: [
        "We reserve the right to suspend or terminate accounts for violations",
        "Terminated users may lose access to their data or listings",
        "Users may appeal termination decisions through our support system"
      ]
    },
    {
      title: "7. Limitation of Liability",
      points: [
        "We are not liable for any damages arising from use of the app",
        "All transactions are between vendors and customers directly",
        "We provide the platform but do not guarantee product quality or delivery"
      ]
    }
  ];

  return (
    <div className="terms-container" id="top">
      {/* --- Orange Header Section --- */}
      <header className="terms-header-bg">
        <div className="terms-header-content">
          {/* Clipboard icon (used as a placeholder for the original icon) */}
          {/* The original screenshots didn't show the icon, but we'll use a placeholder for completeness */}
          {/* If you want the icon hidden like the last screenshot, remove the line below or hide it with CSS */}
          {/* <i className="terms-icon">📋</i> */}
          <h1>Our Terms & Conditions</h1>
        </div>
      </header>

      {/* --- Main Content Area (Centered using Bootstrap's 'container' and custom CSS) --- */}
      <div className="container">
        <main className="terms-main-content">
          
          {/* Intro */}
          <div className="terms-intro">
            <h2>Terms & Conditions</h2>
            <p>
              Please read these terms and conditions carefully before using our e-commerce multi-vendor application. By accessing or using the app, you agree to be bound by these terms.
            </p>
          </div>

          {/* Dynamic Sections */}
          {sections.map((section, index) => (
            <section key={index} className="terms-section">
              <h3 className="section-title-highlight">{section.title}</h3>
              <ul className="terms-list">
                {section.points.map((point, pIndex) => (
                  <li key={pIndex}>{point}</li>
                ))}
              </ul>
            </section>
          ))}

          {/* --- Acceptance Box --- */}
          <div className="acceptance-box">
            <h3>Acceptance of Terms</h3>
            <p>
              By using our app, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
            </p>
            {/* Using Bootstrap classes for button alignment */}
            <div className="d-flex justify-content-center gap-3 mt-3">
              <button className="btn btn-primary terms-btn-primary">I Understand</button>
              <button className="btn btn-outline-secondary terms-btn-secondary">Contact Support</button>
            </div>
          </div>
          
          {/* Animated Scroll to Top Button (Not visible in the ReturnPolicy component path unless scrolled) */}
                <a href="#" className="scroll-to-top-btn animate__bounceInRight">
                    <i className="fas fa-arrow-up"></i>
                </a>

        </main>
      </div>
    </div>
  );
}

export default TermsAndConditions;