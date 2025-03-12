"use client";

import Image from "next/image";
import Slider from "react-slick";

export default function CategoryCard({ data }) {
  const settings = {
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    dots: false,
    infinite: true,
    speed: 1200,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-11/12 mx-auto mt-10">
      <Slider {...settings}>
        {data?.data?.map((item) => (
          <div key={item._id} className="p-4">
            <div className="group relative flex flex-col items-center">
              {/* Image container with animated gradient border */}
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-transparent bg-gradient-to-r from-pink-400 to-purple-500 p-1 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2 shadow-2xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              {/* Category title with animated underline */}
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-purple-600">
                  {item.name}
                </h3>
                <div className="mt-1">
                  <span className="block h-1 bg-gradient-to-r from-pink-400 to-purple-500 w-0 transition-all duration-300 group-hover:w-full"></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
