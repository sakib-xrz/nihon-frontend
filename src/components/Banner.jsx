import { Carousel } from 'antd';
import styles from '../style/module.banner.css';
import brand from '../assets/brand1bg.jpg';
import Image from 'next/image';
import img1 from '../assets/slider/1.jpg';
import img2 from '../assets/slider/1.jpg';
import img3 from '../assets/slider/1.jpg';
import img4 from '../assets/slider/1.jpg';

const data = [
    {
        img: img1,
        title: "Beautiful Landscape",
        description: "A breathtaking view of the mountains during sunset."
    },
    {
        img: img2,
        title: "City Skyline",
        description: "A vibrant cityscape with towering skyscrapers."
    },
    {
        img: img3,
        title: "Serene Beach",
        description: "A peaceful beach with crystal clear water and white sand."
    },
    {
        img: img4,
        title: "Serene Beach",
        description: "A peaceful beach with crystal clear water and white sand."
    }
];

const brand1 = {
    img: brand,
    title: "Unlimited Shop Pages",
    percent: '40%',
    description: "Time To Customize Unlimited Shop Pages, Sheena, helps to Spread your web appearance with an unlimited Shop option. It carries the latest post type and also a custom page to display all your images including features like isotope, load more, infinity scroll, etc"
};

const Banner = () => (
    <>
        <div className="w-full">
            <div className="grid  items-center grid-cols-12 ">
                <div className="col-span-12 md:col-span-8">
                    <Carousel
                        autoplay={true}
                        autoplaySpeed={2000}
                        dots={false}
                        arrows={true}
                        infinite={true}
                        draggable={true}
                        vertical
                    >
                        {data.map((item, index) => (
                            <div key={index}>
                                <Image src={item.img} width={1800} height={800} alt={item.title} />
                            </div>
                        ))}
                    </Carousel>
                </div>
                <div className="md:col-span-4 col-span-12">
                    <div className="relative m-4">
                        <div className='absolute top-0 left-0 w-full h-full rounded-[3%] bg-black bg-opacity-50 z-40'>
                            <h1 className="text-left absolute top-[30%] left-2 text-6xl text-white">Discount {brand1.percent}</h1>
                        </div>
                        <div className="relative w-full h-full">
                            <Image
                                src={brand1.img}
                                width={500}
                                height={500}
                                layout="responsive"
                                alt="brand-background"
                                style={{borderRadius:'5%'}}
                            />
                        </div>
                        <div className="relative px-2 z-10 mt-2">
                            <h3 className="text-[#663130] text-2xl py-3 mx-3 uppercase font-bold">{brand1.title}</h3>
                            <p className="text-[#663130] font-medium py-1">{brand1.description.slice(0, 80)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default Banner;