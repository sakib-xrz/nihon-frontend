"use client";
import { Carousel } from "antd";
import Image from "next/image";
import brand from "../assets/brand1bg.jpg";
import img1 from "../assets/slider/1.jpg";
import img2 from "../assets/slider/1.jpg";
import img3 from "../assets/slider/1.jpg";
import img4 from "../assets/slider/1.jpg";

const data = [
  {
    img: img1,
    title: "Beautiful Landscape",
    description: "A breathtaking view of the mountains during sunset.",
  },
  {
    img: img2,
    title: "City Skyline",
    description: "A vibrant cityscape with towering skyscrapers.",
  },
  {
    img: img3,
    title: "Serene Beach",
    description: "A peaceful beach with crystal clear water and white sand.",
  },
  {
    img: img4,
    title: "Serene Beach",
    description: "A peaceful beach with crystal clear water and white sand.",
  },
];

const brand1 = {
  img: brand,
  title: "Unlimited Shop Pages",
  percent: "40%",
  description:
    "Time To Customize Unlimited Shop Pages, Sheena, helps to Spread your web appearance with an unlimited Shop option. It carries the latest post type and also a custom page to display all your images including features like isotope, load more, infinity scroll, etc",
};

const Banner = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Carousel Section */}
        <div className="md:col-span-8">
          <Carousel
            autoplay
            autoplaySpeed={2000}
            dots={true}
            infinite
            draggable
          >
            {data.map((item, index) => (
              <div key={index} className="relative">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={1800}
                  height={800}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </Carousel>
        </div>
        {/* Brand / Discount Section */}
        <div className="md:col-span-4">
          <div className="relative m-4 rounded-2xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-105">
            {/* Gradient Overlay with animation */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-75 z-10 flex items-center justify-center">
              <h1 className="text-2xl md:text-5xl lg:text-6xl text-white font-extrabold drop-shadow-lg animate-bounce">
                Discount {brand1.percent}
              </h1>
            </div>
            {/* Brand Image */}
            <div className="relative">
              <Image
                src={brand1.img}
                alt="brand-background"
                width={500}
                height={500}
                layout="responsive"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Brand Text with backdrop blur */}
            <div className="px-6 py-4 relative z-20 bg-white bg-opacity-90 backdrop-blur-sm">
              <h3 className="text-xl md:text-2xl lg:text-3xl text-[#663130] uppercase font-bold tracking-wide line-clamp-1">
                {brand1.title}
              </h3>
              <p className="text-sm md:text-base text-[#663130] font-medium mt-2 line-clamp-2">
                {brand1.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
