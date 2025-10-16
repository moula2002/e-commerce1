import React from "react";
// 🚨 Container is not imported in the original code, but included for typical usage
import { Container } from "react-bootstrap";
import "./Home.css";
import Banner from "../components/Banner";
import Fashion from "../components/category/Fashion";
import Accessories from "../components/category/Accessories";
import Cosmetics from "../components/category/Cosmetics";
import Toys from "../components/category/Toys";
import Stationary from "../components/category/Stationary";
import Book from "../components/category/Book";
import PhotoFrame from "../components/category/PhotoFrame";
import Footwears from "../components/category/Footwears";
import Jewellery from "../components/category/Jewellery";
import Mens from "../components/category/Mens";
import Kids from "../components/category/Kids";
import Electronics from "../components/category/Electronics";
import PersonalCare from "../components/category/PersonalCare";


function Home() {
  return (
    <div className="homepage-content">

      {/* 🖼️ Banner */}
      <div className="banner-fade-in">
        <Banner />
      </div>

      {/* 👗 Fashion Section */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-warning">
          Featured Fashion Category 👗
        </div>
        <Fashion />
      </section>

      {/* Accessories section */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-warning">
          Featured Accessories
        </div>
        <Accessories />
      </section>

      {/* 💄 Cosmetics section */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-warning">
          Featured Cosmetics 💄
        </div>
        <Cosmetics />
      </section>

      {/* 🧸 Toys section */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-warning">
          Featured Toys 🧸
        </div>
        <Toys />
      </section>

      {/* ✏️ Stationary section */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-warning">
          Featured Stationery ✏️
        </div>
        <Stationary />
      </section>

      {/* 📚 Book section */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-warning">
          Featured Books 📚
        </div>
        <Book />
      </section>

      {/* 🖼️ Photo Frame section */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-warning">
          Featured Photo Frames 🖼️
        </div>
        <PhotoFrame />
      </section>

      {/* 👟 Footwears section */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-warning">
          Featured Footwears 👟
        </div>
        <Footwears />
      </section>

      {/* 💍 Jewellery section */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-warning">
          Featured Jewellery 💎
        </div>
        <Jewellery />
      </section>

      {/* 👔 Men's section */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-warning">
          Featured Men's Clothing 👔
        </div>
        <Mens />
      </section>

      {/* 👧 Kids section */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-warning">
          Featured Kids' Products 🎈
        </div>
        <Kids />
      </section>

      {/* 💻 Electronics section */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-warning">
          Featured Electronics 📱
        </div>
        <Electronics />
      </section>

      {/* 🧴 Personal Care section (NEW Section) */}
      <section className="mt-5">
        <div className="text-center mb-4 fw-bold text-warning">
          Featured Personal Care 🧴
        </div>
        {/* 🎯 2. Render the PersonalCare component */}
        <PersonalCare />
      </section>


      {/* 🌈 Footer */}
      <footer className="text-center py-5 bg-dark text-white mt-5 footer-scale-up border-top border-warning">
        <h2 className="fw-bold text-warning">End of Today’s Best Deals!</h2>
        <p className="lead text-secondary">
          Keep exploring for more offers and check back tomorrow for fresh deals.
        </p>
      </footer>
    </div>
  );
}

export default Home;