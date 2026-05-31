import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useCart } from "@/context/CartContext";

export default function Success() {

  const navigate = useNavigate();

  const { clearCart } = useCart();

  useEffect(() => {

    // 🔥 clear frontend instantly
    clearCart();

    // 🔥 redirect auto
    const timer = setTimeout(() => {

      navigate("/shop");

    }, 2500);

    return () => clearTimeout(timer);

  }, []);

  return (

    <div
      className="min-h-screen bg-[#F7F5FF]
                 flex items-center justify-center px-6"
    >

      <div
        className="bg-white rounded-3xl shadow-sm
                   max-w-md w-full p-10 text-center"
      >

        <div
          className="w-20 h-20 rounded-full
                     bg-green-100 text-green-600
                     flex items-center justify-center
                     mx-auto mb-6 text-4xl"
        >
          ✓
        </div>

        <h1
          className="text-3xl font-bold
                     text-[#0B2545] mb-3"
        >
          Order Confirmed
        </h1>

        <p className="text-gray-500 leading-relaxed">

          Your order has been placed successfully.

          <br />
          <br />

          You will be redirected to the shop shortly.

        </p>

        <button
          onClick={() => navigate("/shop")}
          className="mt-8 bg-orange-400 hover:bg-orange-500
                     text-white px-6 py-3 rounded-xl
                     transition font-medium"
        >
          Continue Shopping
        </button>

      </div>

    </div>
  );
}