"use client"
import { useEffect } from 'react';
import AOS from 'aos';
// import aos styles
import 'aos/dist/aos.css';

export default function AosProvider({ children }) {
    useEffect(() => {
        // here you can add your aos options
        AOS.init({
            offset: 100,
        });
    }, []);
    return (
        <div>
            {children}
        </div>
    )
}
