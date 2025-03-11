import { Button } from "antd";
import React from "react";
import "../style/SkinCareBanner.css";

function SkinCareBanner() {
  return (
    <div className="skncareBanner py-20 my-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center">
          <div></div>
          <div className="text-center px-4">
            <h4
              className="font-bold text-4xl md:text-5xl text-pink-400 tracking-wider mb-2"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="300"
            >
              Skincare
            </h4>
            <h2
              className="font-extrabold text-2xl sm:text-4xl md:text-6xl text-pink-500 leading-tight mb-4"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="400"
            >
              Skincare made with <br /> the world’s finest
            </h2>
            <p
              className="text-base sm:text-lg text-gray-700 mb-6"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="500"
            >
              Balance, purify, and heal your skin with Monastery. <br />
              Ingredients of the highest quality.
            </p>
            <button
              className="bg-pink-400 hover:bg-pink-500 text-white px-8 py-2 rounded-full shadow-lg transition-transform transform hover:scale-105"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="600"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkinCareBanner;
