import { Button } from "antd";
import React from "react";
import "../style/SkinCareBanner.css";

function SkinCareBanner() {
  return (
    <div className="skncareBanner py-20 my-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center">
          <div></div>
          <div className="text-center">
            <h4
              className="font-bold text-4xl text-[#663130]"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="500"
            >
              Skincare
            </h4>
            <div
              className="text-2xl sm:text-4xl text-[#F04D2B] md:text-6xl text-center"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="500"
            >
              Skincare made with <br /> the world finest
            </div>
            <p
              className="my-4 text-[#663130]"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="500"
            >
              Balance, purify, and heal your skin with Monastery. <br />
              Ingredients of the highest quality.
            </p>
            <Button
              className="shopButton"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="500"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkinCareBanner;
