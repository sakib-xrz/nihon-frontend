"use client"

import Image from "next/image"
import Link from "next/link"
import Slider from "react-slick"

export default function BrandCard({ data }) {


    var settings = {
        arrows: false,
        autoplay: true,
        autoplaySpeed: 1000,
        pauseOnHover: true,
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 5,
        slidesToScroll: 2,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1100,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            },

            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }
    return (
        <div className="container mx-auto">
            <div className="slider-container text-center">
                <Slider {...settings}>
                    {
                        data?.data?.map((item) => <div key={item._id} className="py-10">
                            <Link href={`/brand/${item?._id}`}>
                                <Image className="mx-auto text-center" src={item?.image} width={150} height={150} alt="brand iamge"></Image>
                                <div className="text-center font-bold text-[#F9A8D4]">{item?.name}</div>
                            </Link>
                        </div>)
                    }
                </Slider>
            </div>
        </div>

    )
}
