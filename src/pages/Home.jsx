// src/pages/Home.jsx
import React from "react";
import { Container } from "react-bootstrap";
import "./Home.css";
import Banner from "../components/Banner";

// ✅ Use the new Fashion preview component instead of full Fashion page
import HomeFashionSection from "../components/category/HomeFashionSection";
import HomeAccessoriesSection from "../components/category/HomeAccessoriesSection";
import HomeToysSection from "../components/category/HomeToysSection";
import HomeStationarySection from "../components/category/HomeStationarySection";
import HomePhotoFrameSection from "../components/category/HomePhotoFrameSection";
import HomeJewellerySection from "../components/category/HomeJewellerySection";
import HomeMensSection from "../components/category/HomeMensSection";
import HomeKidsSection from "../components/category/HomeKidsSection";
import HomePersonalCareSection from "../components/category/HomePersonalCareSection";

// Other categories (These should probably be HomePreview components as well, but kept as is for now)
import Cosmetics from "../components/category/Cosmetics";
import Book from "../components/category/Book";
import Footwears from "../components/category/Footwears";
import Electronics from "../components/category/Electronics";


function Home() {
  return (
    <div className="homepage-content">

      {/* 🖼️ Banner */}
      <div className="banner-fade-in">
        <Banner />
      </div>

      {/* 👗 Fashion Section (show 5 items + Show More button) */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-dark">
          Featured Fashion Category 
        </div>
        <Container>
          <HomeFashionSection />
        </Container>
      </section>

        {/* 💍 Accessories Section (show 5 items + Show More button) */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-dark">
          Featured Accessories Category 
        </div>
        <Container>
          <HomeAccessoriesSection />
        </Container>
      </section>

      {/* 💄 Cosmetics (Using full component) */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-dark">
          Featured Cosmetics 💄
        </div>
        <Cosmetics />
      </section>

        {/* 🧸 Toys Section (show 5 items + Show More button) */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-dark">
          Featured Toys Category 
        </div>
        <Container>
          <HomeToysSection />
        </Container>
      </section>


        {/* ✏️ Stationary Section (show 5 items + Show More button) */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-dark">
          Featured Stationary Category 
        </div>
        <Container>
          <HomeStationarySection />
        </Container>
      </section>


      {/* 📚 Books (Using full component) */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-dark">
          Featured Books 📚
        </div>
        <Book />
      </section>


        {/* 🖼️ Photo Frame Section (show 5 items + Show More button) */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-dark">
          Featured Photo Frame Category 
        </div>
        <Container>
          <HomePhotoFrameSection/>
        </Container>
      </section>


      {/* 👟 Footwears (Using full component) */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-dark">
          Featured Footwears 👟
        </div>
        <Footwears />
      </section>

        {/* ✨ Jewellery Section (show 5 items + Show More button) */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-dark">
          Featured Jewellery Category 
        </div>
        <Container>
          <HomeJewellerySection/>
        </Container>
      </section>

      
        {/* 👨 Mens Section (show 5 items + Show More button) */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-dark">
          Featured Mens Category 
        </div>
        <Container>
          <HomeMensSection/>
        </Container>
      </section>   

    
{/* 👧 Kids Section (show 5 items + Show More button) */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-dark">
          Featured Kids Category 
        </div>
        <Container>
          <HomeKidsSection/>
        </Container>
      </section>


      {/* 💻 Electronics (Using full component) */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-dark">
          Featured Electronics 📱
        </div>
        <Electronics />
      </section>

      {/* 🧴 Personal Care Section (show 5 items + Show More button) */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-dark">
          Featured Personal Care Category 
        </div>
        <Container>
          <HomePersonalCareSection/>
        </Container>
      </section>

      

      {/* 🌈 Footer */}
      <footer className="text-center py-5 bg-dark text-white mt-5 footer-scale-up border-top border-warning">
        <h2 className="fw-bold text-danger">End of Today’s Best Deals!</h2>
        <p className="lead text-secondary">
          Keep exploring for more offers and check back tomorrow for fresh deals.
        </p>
      </footer>
    </div>
  );
}

export default Home;