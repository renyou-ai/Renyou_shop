import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import api from "@/api/axiosInstance";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

function formatDate(date) {

  if (!date) return "—";

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

export default function AdminUserDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [collapsed, setCollapsed] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState(null);

  /* =========================
     FETCH USER
  ========================= */
  useEffect(() => {

    const fetchUser = async () => {

      try {

        setLoading(true);

        const { data } =
          await api.get(
            `/admin/users/${id}`
          );

        setUser(data);

      } catch (err) {

        console.error(
          "fetch user:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

    fetchUser();

  }, [id]);

  return (

    <div className="flex min-h-screen bg-[#f4f5f7]">

      <AdminSidebar
        collapsed={collapsed}
      />

      <div className="flex-1 flex flex-col">

        <AdminTopbar
          onToggle={() =>
            setCollapsed(!collapsed)
          }
        />

        <main className="p-8">

          <button
            onClick={() =>
              navigate(-1)
            }
            className="mb-6 text-sm text-[#4a46a0] hover:underline"
          >
            ← Back
          </button>

          {loading ? (

            <div className="animate-pulse space-y-4">

              <div className="h-10 w-52 bg-gray-200 rounded-xl" />

              <div className="h-40 bg-gray-200 rounded-3xl" />

            </div>

          ) : !user ? (

            <div className="bg-white rounded-3xl p-10 text-center text-gray-400">
              User not found
            </div>

          ) : (

            <div className="space-y-6">

              {/* USER CARD */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/[0.04]">

                <div className="flex items-center gap-5">

                  <div
                    className="w-20 h-20 rounded-full
                               bg-[#4a46a0]/10
                               text-[#4a46a0]
                               flex items-center justify-center
                               text-3xl font-bold"
                  >
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>

                    <h1 className="text-3xl font-bold text-gray-900">
                      {user.name}
                    </h1>

                    <p className="text-gray-500 mt-1">
                      {user.email}
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                      Joined {formatDate(user.createdAt)}
                    </p>

                  </div>

                </div>

              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-5">

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/[0.04]">

                  <p className="text-sm text-gray-400 mb-2">
                    Orders
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900">
                    {user.ordersCount || 0}
                  </h2>

                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/[0.04]">

                  <p className="text-sm text-gray-400 mb-2">
                    Total Spent
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900">
                    ${user.totalSpent?.toFixed(2)}
                  </h2>

                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/[0.04]">

                  <p className="text-sm text-gray-400 mb-2">
                    Last Order
                  </p>

                  <h2 className="text-lg font-semibold text-gray-900">
                    {formatDate(
                      user.orders?.[0]?.createdAt
                    )}
                  </h2>

                </div>

              </div>

              {/* SHIPPING */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/[0.04]">

                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Shipping Address
                </h2>

                {user.shippingAddress ? (

                  <div className="space-y-2 text-gray-600">

                    <p>
                      {user.shippingAddress.fullName}
                    </p>

                    <p>
                      {user.shippingAddress.phone}
                    </p>

                    <p>
                      {user.shippingAddress.address}
                    </p>

                    <p>
                      {user.shippingAddress.city}
                    </p>

                    <p>
                      {user.shippingAddress.country}
                    </p>

                  </div>

                ) : (

                  <p className="text-gray-400">
                    No shipping address
                  </p>

                )}

              </div>

              {/* ORDERS */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/[0.04]">

                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Orders History
                </h2>

                {user.orders?.length === 0 ? (

                  <p className="text-gray-400">
                    No orders found
                  </p>

                ) : (

                  <div className="space-y-4">

                    {user.orders.map((order) => (

                      <div
                        key={order._id}
                        className="border border-gray-100 rounded-2xl p-5"
                      >

                        <div className="flex items-center justify-between mb-3">

                          <p className="font-semibold text-gray-900">
                            #{order._id.slice(-6)}
                          </p>

                          <span
                            className="text-xs px-3 py-1 rounded-full
                                       bg-[#4a46a0]/10
                                       text-[#4a46a0]"
                          >
                            {order.orderStatus}
                          </span>

                        </div>

                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>

                        <p className="text-lg font-semibold text-gray-900 mt-2">
                          ${order.totalPrice?.toFixed(2)}
                        </p>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          )}

        </main>

      </div>

    </div>
  );
}