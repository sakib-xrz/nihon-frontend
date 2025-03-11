"use client";

import { clearCart } from "@/redux/feathers/Product/ProductSlice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import confetti from "canvas-confetti"; // Import the confetti library

export default function Page() {
  const products = useSelector((state) => state?.cart?.cartItem); 
  const dispatch = useDispatch();
  const pathname = usePathname();
  const pageName = pathname.replace("/", ""); 
  const router = useRouter()

  useEffect(() => {
    if (pageName === "success") {
      dispatch(clearCart());
      startConfetti(); // Trigger confetti after the success page is loaded
    }
  }, [pageName, dispatch]);

  const startConfetti = () => { 
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.6 }, // Adjust the starting position
      });
    }, 1000); // Delay of 1 second
  };

  setTimeout(()=>{
    router.push(`/`)
  },3000)

  return (
    <div className="h-screen text-center flex justify-center items-center flex-col">
      <h1 className="text-4xl text-green-500">Congratulations!</h1>
      <h1 className="text-2xl font-bold">Your product has been purchased successfully!</h1>
    </div>
  );
}
