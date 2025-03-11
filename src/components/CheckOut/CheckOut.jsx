"use client"
import { useState } from "react";
import FinalProduct from "../FinalProduct/FinalProduct";

function CheckOut() {

  const [allInputValue, setAllInputValue] = useState({});

  // Function to handle input changes
  const handleOneChange = (e) => {
    const { name, value } = e.target;
    setAllInputValue((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div className="w-[95%] mx-auto">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 mx-auto">
          <div className="mx-auto p-3">
            <h2 className="text-2xl font-bold mb-3">Billing Address</h2>
            <form className="p-5 shadow">
              <div className="mb-4">
                <label htmlFor="emailOrPhone" className="block text-gray-700 text-sm font-bold mb-2">
                  Email or Phone
                </label>
                <input
                  type="text"
                  id="emailOrPhone"
                  name="emailOrPhone"
                  onChange={handleOneChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                  placeholder="Email or Phone"
                  required
                />
              </div>

              <div className="flex gap-4 mb-4">
                <div className="w-full">
                  <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    onChange={handleOneChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    placeholder="First Name"
                    required
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    onChange={handleOneChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="mobileNumber" className="block text-gray-700 text-sm font-bold mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  onChange={(e) =>
                    setAllInputValue((prevValues) => ({
                      ...prevValues,
                      mobileNumber: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                  placeholder="Mobile Number"
                  required
                />
              </div>

              <div className="flex gap-4 mb-4">
                <div className="w-full">
                  <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    onChange={handleOneChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    placeholder="City"
                    required
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    onChange={handleOneChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    placeholder="State"
                    required
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="zip_code" className="block text-gray-700 text-sm font-bold mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zip_code"
                    name="zip_code"
                    onChange={handleOneChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    placeholder="Zip Code"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="4"
                  onChange={handleOneChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                  placeholder="Address"
                  required
                ></textarea>
              </div>
            </form>
          </div>
          <FinalProduct allInputValue={allInputValue} />
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
