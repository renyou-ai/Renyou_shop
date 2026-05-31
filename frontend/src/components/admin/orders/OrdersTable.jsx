import OrderStatusBadge from "./OrderStatusBadge";

export default function OrdersTable({

  loading,
  orders,
  onViewDetails,
  onStatusChange,
}) {

  if (loading) {

    return (

      <div
        className="bg-white rounded-3xl
                   shadow-sm p-10
                   text-center text-gray-400"
      >
        Loading orders...
      </div>
    );
  }

  if (!orders.length) {

    return (

      <div
        className="bg-white rounded-3xl
                   shadow-sm p-10
                   text-center text-gray-400"
      >
        No orders found
      </div>
    );
  }

  return (

    <div
      className="bg-white rounded-3xl
                 shadow-sm overflow-hidden"
    >

      {/* SCROLL AREA */}
      <div
        className="overflow-x-auto
                   overflow-y-auto
                   max-h-[650px]"
      >

        <table className="w-full text-sm min-w-[1100px]">

          <thead
            className="sticky top-0
                       bg-white z-10"
          >

            <tr
              className="border-b border-gray-100
                         text-left text-xs
                         uppercase text-gray-400"
            >

              <th className="px-6 py-4">
                Order
              </th>

              <th className="px-6 py-4">
                Customer
              </th>

              <th className="px-6 py-4">
                Products
              </th>

              <th className="px-6 py-4">
                Total
              </th>

              <th className="px-6 py-4">
                Payment
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4">
                Date
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-50">

            {orders.map((order) => {

              const firstItem =
                order.items?.[0];

              return (

                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition"
                >

                  {/* ORDER */}
                  <td className="px-6 py-5">

                    <div className="font-semibold text-[#0B2545]">
                      #{order._id.slice(-6)}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {order.items?.length || 0}
                      {" "}
                      item(s)
                    </div>

                  </td>

                  {/* CUSTOMER */}
                  <td className="px-6 py-5">

                    <div className="font-medium text-gray-800">
                      {order.shippingAddress?.fullName ||
                        order.user?.name ||
                        "Unknown"}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {order.user?.email || "No email"}
                    </div>

                  </td>

                  {/* PRODUCTS */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <img
                        src={
                          firstItem?.image ||
                          firstItem?.product?.images?.[0] ||
                          "https://placehold.co/60x60?text=?"
                        }
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                      />

                      <div>

                        <p className="font-medium text-gray-800 line-clamp-1">
                          {firstItem?.name ||
                            firstItem?.product?.name ||
                            "Unknown product"}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {order.items?.length > 1
                            ? `+${order.items.length - 1} more item(s)`
                            : `${firstItem?.qty || 0} qty`}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* TOTAL */}
                  <td className="px-6 py-5">

                    <div className="font-semibold text-gray-800">
                      $
                      {Number(
                        order.totalPrice || 0
                      ).toFixed(2)}
                    </div>

                  </td>

                  {/* PAYMENT */}
                  <td className="px-6 py-5">

                    <span
                      className={`px-3 py-1 rounded-full
                        text-xs font-medium capitalize
                        ${
                          order.paymentMethod === "cash"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                      {order.paymentMethod}
                    </span>

                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">

                    <div className="space-y-3">

                      <OrderStatusBadge
                        status={order.orderStatus}
                      />

                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          onStatusChange(
                            order._id,
                            e.target.value
                          )
                        }
                        className="border border-gray-200
                                   rounded-lg px-2 py-1.5
                                   text-xs bg-white w-full
                                   outline-none focus:ring-2
                                   focus:ring-indigo-200"
                      >

                        <option value="pending">
                          Pending
                        </option>

                        <option value="processing">
                          Processing
                        </option>

                        <option value="shipped">
                          Shipped
                        </option>

                        <option value="delivered">
                          Delivered
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>

                      </select>

                    </div>

                  </td>

                  {/* DATE */}
                  <td className="px-6 py-5 text-gray-500">

                    <div>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(
                        order.createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5 text-right">

                    <button
                      onClick={() =>
                        onViewDetails(order)
                      }
                      className="bg-[#4a46a0]/10
                                 text-[#4a46a0]
                                 hover:bg-[#4a46a0]
                                 hover:text-white
                                 transition
                                 px-4 py-2
                                 rounded-xl
                                 text-sm font-medium"
                    >
                      View Details
                    </button>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}