"use client";

import Image from 'next/image';
import Slider from 'react-slick';
import '../style/category.css';

export default function CategoryCard({ data }) {
    const settings = {
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div style={{ width: '90%', margin: '0 auto' }}>
            <div className="slider-container text-center">
                <Slider {...settings}>
                    {data?.data?.map((item, index) => (
                        <div className="relative p-4" key={item._id}>
                            <Image
                                className="mx-auto text-center rounded-full"
                                width={200}
                                height={200}
                                src={item.image}
                                alt={item.name}
                            />
                            <div className="category">
                                <div className="categoryTitle text-center mt-4">
                                    {item.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
