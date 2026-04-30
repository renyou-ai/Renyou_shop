import { useEffect, useState } from "react";
import { getMyOrders } from "@/api/order.api";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export default function Success() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const { clearCart } = useCart(); // ✅ FIX

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orders = await getMyOrders();
        if (orders.length > 0) {
          setOrder(orders[0]); // latest order
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrder();

    // 🧹 vider panier frontend
    clearCart();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5FF] px-6">

      <div className="bg-white p-10 rounded-3xl shadow-lg text-center max-w-lg w-full">

        {/* ✅ ANIMATION */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
            <span className="text-4xl text-green-600">✔</span>
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-[#0B2545] mb-3">
          Payment Successful
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Your order has been confirmed and is on its way 🚀
        </p>

        {/* 📦 ORDER DETAILS */}
        {order && (
          <div className="bg-gray-50 p-4 rounded-xl mb-6 text-left">

            <p className="text-sm mb-2">
              <span className="font-medium">Order:</span>{" "}
              #{order._id.slice(-6)}
            </p>

            <p className="text-sm mb-4">
              <span className="font-medium">Total:</span>{" "}
              ${Number(order.totalPrice).toFixed(2)}
            </p>

            {/* 🛍️ PRODUCTS */}
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product.name} x {item.qty}
                  </span>
                  <span>
                    ${Number(item.product.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* BUTTONS */}
        <button
          onClick={() => navigate("/orders")}
          className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-lg mb-3 transition"
        >
          View My Orders
        </button>

        <button
          onClick={() => navigate("/home")}
          className="w-full text-gray-500 underline"
        >
          Back to Home
        </button>

      </div>

    </div>
  );
}