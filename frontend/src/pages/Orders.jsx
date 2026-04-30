import { useEffect, useState } from "react";
import { getMyOrders } from "@/api/order.api";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  // 🎨 status color
  const getStatusColor = (status) => {
    if (status === "paid") return "bg-green-100 text-green-600";
    if (status === "pending") return "bg-orange-100 text-orange-500";
    return "bg-gray-100 text-gray-500";
  };

  return (
    <div className="px-6 md:px-10 py-10 bg-[#F7F5FF] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold text-[#0B2545]">
          My Orders
        </h1>

        <button
          onClick={() => navigate("/home")}
          className="bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-lg transition"
        >
          Back to Home
        </button>
      </div>

      {/* EMPTY */}
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">
          No orders yet
        </p>
      ) : (
        <div className="space-y-6">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
            >

              {/* TOP ROW */}
              <div className="flex justify-between items-center mb-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Order #{order._id.slice(-6)}
                  </p>

                  {/* 📅 DATE */}
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* STATUS */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>

              </div>

              {/* ITEMS */}
              <div className="space-y-2">

                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product.name} x {item.qty}
                    </span>

                    <span className="text-gray-600">
                      ${item.product.price}
                    </span>
                  </div>
                ))}

              </div>

              {/* TOTAL */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t">

                <span className="text-gray-500">
                  Total
                </span>

                <span className="text-lg font-semibold text-[#0B2545]">
                  ${order.totalPrice}
                </span>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}