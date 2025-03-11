"use client";
import { Button } from "antd";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import img from "../../assets/bkash.png";
import { BASE_URL } from "@/utils/contant";

function BkashForm({ allInputValue }) {
  const [isHovered, setIsHovered] = useState(false);
  const cart = useSelector((state) => state?.products?.cartItem);
  const userId = useSelector((state) => state?.auth?.user?.userId);
  const price = cart?.reduce((acc, current) => {
    const price = Number(current.price) || 0;
    const quantity = Number(current.quantity) || 0;
    return acc + price * quantity;
  }, 0);
  const product = cart?.map((item) => ({
    product_id: item?._id,
    quantity: item?.quantity,
  }));

  // Initialize toast notifications
  const notifyWarning = (message) => toast.warning(message);

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
    for (let field of requiredFields) {
      if (!allInputValue[field]) {
        return false; // Return false if any field is missing
      }
    }
    return true; // Return true if all required fields are filled
  };

  const charge = 60;

  const pay = async () => {
    if (!validateForm()) {
      notifyWarning(
        "Please fill in all required fields before proceeding to payment!"
      );
      return;
    }

    try {
      const { data } = await axios.post(
        `${BASE_URL}/bkash/payment/create`,
        {
          user: userId,
          total_price: price + charge,
          shipping_address: allInputValue,
          payment_method: "online_payment",
          products: product,
        },
        { withCredentials: true }
      );
      console.log(data);
      window.location.href = data?.bkashURL;
    } catch (error) {
      console.log(error);
      console.log(error?.response?.data);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Button
        size="large"
        type="dashed"
        onClick={() => pay()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <b>Pay With Bkash</b>
        <Image src={img} width={35} height={35} alt="Bkash image" />
      </Button>
    </div>
  );
}

export default BkashForm;
