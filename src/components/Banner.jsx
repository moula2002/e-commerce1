import React, { useEffect, useState } from "react";
import "./Banner.css";

function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use dummy placeholder images for banner simulation
    const dummyBanners = [
      {
        id: 1,
        url: "https://picsum.photos/id/1015/1200/400",
        title: "Discover New Arrivals for You",
      },
      {
        id: 2,
        url: "https://picsum.photos/id/1016/1200/400",
        title: "Smart Deals on Electronics",
      },
      {
        id: 3,
        url: "https://picsum.photos/id/1020/1200/400",
        title: "Home & Kitchen Essentials Sale",
      },
      {
        id: 4,
        url: "https://picsum.photos/id/1035/1200/400",
        title: "Grab Festive Offers Now",
      },
    ];

    // Simulate loading for effect
    setTimeout(() => {
      setBanners(dummyBanners);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="banner-loading text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

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
