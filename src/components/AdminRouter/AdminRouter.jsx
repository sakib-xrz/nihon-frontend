"use client"
import { DecodedData } from "@/utils/DecodedData";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function AdminRouter({ children }) {
  const { token } = useSelector((state) => state?.auth);
  const userToken = DecodedData(token);
  const router = useRouter();

  useEffect(() => {
    // If there's no token or the user isn't an admin, redirect to login
    if (userToken?.role !== 'admin' || !token || !userToken ) {
      router.push('/login');
    }
  }, [token, userToken, router]);

  // If no valid token or user role isn't admin, return null (or loading state)
  if (!userToken || userToken?.role !== 'admin') {
    return null; 
  }

  // If admin, render children
  return <>{children}</>;
}

