"use client";
import { Button, Card } from "antd";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import img from "../../assets/bkash.png";
import { BASE_URL } from "@/utils/contant";

function BkashForm({ allInputValue, grandTotal, itemCount }) {
  const [loading, setLoading] = useState(false);
  const cart = useSelector((state) => state?.products?.cartItem);
  const userId = useSelector((state) => state?.auth?.user?.userId);
  
  const product = cart?.map((item) => ({
    product_id: item?._id,
    quantity: item?.quantity,
    price: item?.price,
    discount: item?.discount,
  }));

  const validateForm = () => {
    const requiredFields = [
      "emailOrPhone",
      "firstName",
      "lastName",
      "mobileNumber",
      "city",
      "state",
      "zip_code",
      "address",
    ];

    const missingFields = requiredFields.filter(field => !allInputValue[field]);
    
    if (missingFields.length > 0) {
      toast.warning(`Please fill in: ${missingFields.map(field => field.replace(/([A-Z])/g, ' $1').toLowerCase()).join(', ')}`);
      return false;
    }

    // Validate bKash number format
    const bkashNumber = allInputValue.mobileNumber;
    if (!/^01[0-9]{9}$/.test(bkashNumber)) {
      toast.warning("Please enter a valid bKash number (starts with 01 followed by 9 digits)");
      return false;
    }

    return true;
  };

  const pay = async () => {
    if (!validateForm()) {
      return;
    }

    if (itemCount === 0) {
      toast.warning("Your cart is empty!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${BASE_URL}/bkash/payment/create`,
        {
          user: userId,
          total_price: grandTotal,
          shipping_address: allInputValue,
          payment_method: "bkash",
          products: product,
          merchant_invoice_number: `INV${Date.now()}`,
        },
        { withCredentials: true }
      );

      if (data?.bkashURL) {
        window.location.href = data.bkashURL;
      } else {
        toast.error("Failed to initialize bKash payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error?.response?.data?.message || "Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
            <p className="text-sm text-gray-500">Pay securely with bKash</p>
          </div>
          <Image 
            src={img} 
            width={50} 
            height={50} 
            alt="bKash logo"
            className="object-contain" 
          />
        </div>

        <Button
          size="large"
          type="primary"
          onClick={pay}
          loading={loading}
          className="bg-[#E2136E] hover:bg-[#c11161] w-full flex items-center justify-center"
          disabled={loading || itemCount === 0}
        >
          {loading ? "Processing..." : `Pay ৳${grandTotal.toFixed(2)} with bKash`}
        </Button>

        <div className="text-xs text-gray-500 mt-2">
          Note: You will be redirected to bKash for secure payment processing
        </div>
      </div>
    </Card>
  );
}

export default BkashForm;
