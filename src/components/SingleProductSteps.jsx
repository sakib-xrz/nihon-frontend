"use client";
import React, { useState } from 'react';
import { Tabs, Button, message } from 'antd';
import Image from 'next/image';
import man from '../assets/male.jpg';
import woman from '../assets/woman.jpg';

const { TabPane } = Tabs;

const SingleProductTabs = ({ data }) => {
    const [currentTab, setCurrentTab] = useState('1'); // Default to Tab 1
    console.log(data);

    const onTabChange = (key) => {
        setCurrentTab(key);
    };

    const renderRatingStars = (rating) => {
        const fullStars = Math.floor(rating);  // Full stars (integer part)
        const halfStar = rating % 1 !== 0;  // If there's a decimal part, add a half star

        return (
            <>
                {[...Array(fullStars)].map((_, index) => (
                    <i key={index} className="fa-regular fa-star text-yellow-400"></i>
                ))}
                {halfStar && <i className="fa-regular fa-star-half text-yellow-400"></i>}
                {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, index) => (
                    <i key={index + fullStars + (halfStar ? 1 : 0)} className="fa-regular fa-star text-gray-400"></i>
                ))}
            </>
        );
    };

    return (
        <div className="container mx-auto">
            <Tabs activeKey={currentTab} onChange={onTabChange}>
                <TabPane tab="Description" key="1">
                    <p>{data?.desc ? data.desc : 'This product has no description.'}</p>
                </TabPane>
                <TabPane tab="Review" key="2">
                    {data?.reviews && data.reviews.length > 0 ? (
                        data.reviews.map((item, index) => (
                            <div className="bg-gray-50 mt-5 p-4" key={index}>
                                <div className="flex items-center">
                                    <Image
                                        src={item?.reviewer?.gender === 'male' ? man : woman}
                                        alt="reviewer"
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                    />
                                    <div className="ml-3">
                                        <div className="font-semibold">{item?.reviewer?.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {renderRatingStars(item?.rating)}
                                        </div>
                                        <div className="text-sm">{item?.comment}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>This product has no reviews.</p>
                    )}
                </TabPane>
            </Tabs>

        </div>
    );
};

export default SingleProductTabs;
