import { useEffect, useState } from "react";

import { getMyOrders } from "@/api/order.api";

import { useNavigate } from "react-router-dom";

export default function Orders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [openOrder, setOpenOrder] =
    useState(null);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const data =
          await getMyOrders();

        setOrders(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.error(
          "❌ orders:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

    fetchOrders();

  }, []);

  const getOrderStatusColor =
    (status) => {

      if (status === "pending") {
        return "bg-orange-100 text-orange-600";
      }

      if (status === "processing") {
        return "bg-blue-100 text-blue-600";
      }

      if (status === "shipped") {
        return "bg-purple-100 text-purple-600";
      }

      if (status === "delivered") {
        return "bg-green-100 text-green-600";
      }

      if (status === "cancelled") {
        return "bg-red-100 text-red-600";
      }

      return "bg-gray-100 text-gray-500";
    };

  return (

    <div className="min-h-screen bg-[#F7F5FF] px-6 md:px-10 py-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">

        <div>

          <h1 className="text-3xl font-semibold text-[#0B2545]">
            Orders History
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            View and track your past purchases
          </p>

        </div>

        <button
          onClick={() => navigate("/shop")}
          className="bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-xl transition"
        >
          Continue Shopping
        </button>

      </div>

      {/* LOADING */}
      {loading && (

        <div className="text-center text-gray-400 mt-24">
          Loading orders...
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        orders.length === 0 && (

        <div className="bg-white rounded-3xl p-10 text-center shadow-sm">

          <p className="text-gray-500 text-lg">
            No orders yet
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="mt-5 text-orange-500 underline"
          >
            Start shopping
          </button>

        </div>
      )}

      {/* ORDERS */}
      {!loading &&
        orders.length > 0 && (

        <div className="space-y-5">

          {orders.map((order) => {

            const isOpen =
              openOrder === order._id;

            return (

              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-sm overflow-hidden"
              >

                {/* TOP BAR */}
                <button
                  onClick={() =>
                    setOpenOrder(
                      isOpen
                        ? null
                        : order._id
                    )
                  }
                  className="w-full p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-gray-50 transition text-left"
                >

                  <div>

                    <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                      Order ID
                    </p>

                    <p className="font-semibold text-[#0B2545] mt-1">
                      #
                      {order._id
                        .slice(-6)
                        .toUpperCase()}
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  <div className="flex items-center gap-3 flex-wrap">

                    {/* PAYMENT */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentMethod ===
                        "online"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >

                      {order.paymentMethod ===
                      "online"
                        ? "Paid Online"
                        : "Cash on Delivery"}

                    </span>

                    {/* STATUS */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(
                        order.orderStatus
                      )}`}
                    >

                      {order.orderStatus}

                    </span>

                    {/* TOTAL */}
                    <span className="font-bold text-[#0B2545] text-lg">
                      $
                      {Number(
                        order.totalPrice
                      ).toFixed(2)}
                    </span>

                    {/* ARROW */}
                    <span className="text-gray-400 text-xl">
                      {isOpen
                        ? "−"
                        : "+"}
                    </span>

                  </div>

                </button>

                {/* DETAILS */}
                {isOpen && (

                  <div className="px-6 pb-6 border-t">

                    {/* ITEMS */}
                    <div className="space-y-4 mt-6">

                      {order.items.map(
                        (item, index) => {

                          const image =
                            item.image
                              ? item.image.startsWith(
                                  "/images"
                                )
                                ? item.image
                                : `http://localhost:5000${item.image}`
                              : "/images/placeholder.png";

                          return (

                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >

                              <div className="flex items-center gap-4">

                                <img
                                  src={image}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-xl object-contain bg-gray-50"
                                />

                                <div>

                                  <p className="font-medium text-[#0B2545]">
                                    {item.name}
                                  </p>

                                  <p className="text-sm text-gray-400 mt-1">
                                    Quantity:
                                    {" "}
                                    {item.qty}
                                  </p>

                                </div>

                              </div>

                              <span className="font-semibold text-gray-700">
                                $
                                {(
                                  item.price *
                                  item.qty
                                ).toFixed(2)}
                              </span>

                            </div>
                          );
                        }
                      )}

                    </div>

                    {/* SHIPPING */}
                    <div className="mt-8 pt-6 border-t">

                      <h3 className="font-semibold text-[#0B2545] mb-4">
                        Shipping Address
                      </h3>

                      <div className="text-sm text-gray-500 leading-7">

                        <p>
                          {
                            order.shippingAddress
                              ?.fullName
                          }
                        </p>

                        <p>
                          {
                            order.shippingAddress
                              ?.address
                          }
                        </p>

                        <p>
                          {
                            order.shippingAddress
                              ?.city
                          }
                          ,
                          {" "}
                          {
                            order.shippingAddress
                              ?.postalCode
                          }
                        </p>

                        <p>
                          {
                            order.shippingAddress
                              ?.country
                          }
                        </p>

                        <p>
                          {
                            order.shippingAddress
                              ?.phone
                          }
                        </p>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}