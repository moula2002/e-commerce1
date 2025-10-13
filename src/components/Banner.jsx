import React, { useEffect, useState } from "react";
// 🎯 Import necessary Firebase functions
import { collection, getDocs } from "firebase/firestore";
// 🎯 Import your initialized Firestore instance
import { db } from "../firebase"; 
import "./Banner.css";

function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Fetch all documents from the 'posters' collection
        const querySnapshot = await getDocs(collection(db, "posters"));
        const bannerList = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // 1. Filter and extract fields based on your Firestore document structure
          if (data.status === 'active') { 
            bannerList.push({
              id: doc.id,
              // Uses 'image' field for the URL
              url: data.image, 
              // Uses 'bannerName' field for the title
              title: data.bannerName || "Untitled Banner",
            });
          }
        });

        setBanners(bannerList);
      } catch (error) {
        // Log any errors (like "Permission Denied") to the browser console
        console.error("Error fetching banners:", error); 
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []); // Run only once on mount

  // --- Conditional Rendering for Loading and Empty State ---

  if (loading) {
    return (
      <div className="banner-loading text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return <p className="text-center py-5 text-muted">No active banners found.</p>;
  }

  // --- Main Carousel Rendering (Bootstrap 5) ---
  return (
    <div className="banner-container">
      <div
        id="bannerCarousel"
        className="carousel slide carousel-custom"
        data-bs-ride="carousel"
        data-bs-interval="3000"
      >
        <div className="carousel-inner">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <img
                src={banner.url}
                className="d-block w-100 banner-image"
                alt={banner.title}
              />
              <div className="carousel-caption d-none d-md-block">
                <h3>{banner.title}</h3>
                {/* Button added back from your dummy code */}
                <button className="btn btn-warning fw-bold mt-2">Shop Now</button>
              </div>
            </div>
          ))}
        </div>

        {/* Prev Button */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#bannerCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>

        {/* Next Button */}
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#bannerCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default Banner;