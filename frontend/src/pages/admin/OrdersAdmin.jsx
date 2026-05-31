import {
  useEffect,
  useState,
} from "react";

import {
  PackageCheck,
  Clock3,
  LoaderCircle,
} from "lucide-react";

import {
  getAllOrders,
  updateOrderStatus,
} from "@/api/adminOrders.api";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

import OrdersTable from "@/components/admin/orders/OrdersTable";
import OrdersFilters from "@/components/admin/orders/OrdersFilters";
import OrderDetailsDrawer from "@/components/admin/orders/OrderDetailsDrawer";

export default function OrdersAdmin() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [collapsed, setCollapsed] =
    useState(false);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [statusFilter, setStatusFilter] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pages, setPages] =
    useState(1);

  const [stats, setStats] =
    useState({

      totalOrders: 0,

      pending: 0,

      processing: 0,
    });

  /* =========================
     FETCH ORDERS
  ========================= */
  const fetchOrders =
    async () => {

      try {

        setLoading(true);

        const data =
          await getAllOrders({

            status:
              statusFilter || undefined,

            page,
          });

        setOrders(
          data.orders || []
        );

        setPages(
          data.pages || 1
        );

        setStats(
          data.stats || {}
        );

      } catch (err) {

        console.error(
          "fetchOrders:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchOrders();

  }, [statusFilter, page]);

  /* =========================
     UPDATE STATUS
  ========================= */
  const handleStatusChange =
    async (
      orderId,
      status
    ) => {

      try {

        await updateOrderStatus(
          orderId,
          status
        );

        fetchOrders();

        if (
          selectedOrder?._id ===
          orderId
        ) {

          setSelectedOrder({

            ...selectedOrder,

            orderStatus:
              status,
          });
        }

      } catch (err) {

        console.error(
          "update status:",
          err
        );
      }
    };

  return (

    <div className="flex min-h-screen bg-gray-50">

      <AdminSidebar
        collapsed={collapsed}
      />

      <div className="flex-1 flex flex-col overflow-hidden">

        <AdminTopbar
          onToggle={() =>
            setCollapsed(!collapsed)
          }
        />

        <div className="p-8 overflow-y-auto">

          {/* HEADER */}
          <div className="mb-8">

            <h1 className="text-2xl font-semibold text-[#0B2545]">
              Orders Management
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              Manage customer orders and statuses
            </p>

          </div>

          {/* STATS */}
          <div
            className="grid grid-cols-1
                       sm:grid-cols-2
                       xl:grid-cols-3
                       gap-5 mb-8"
          >

            {/* TOTAL */}
            <div
              className="bg-white rounded-2xl
                         border border-gray-100
                         p-5 shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div
                  className="w-11 h-11 rounded-xl
                             bg-indigo-50
                             flex items-center justify-center"
                >
                  <PackageCheck
                    size={22}
                    className="text-[#4a46a0]"
                  />
                </div>

                <span
                  className="text-xs font-semibold
                             bg-green-100 text-green-600
                             px-2 py-1 rounded-full"
                >
                  Orders
                </span>

              </div>

              <p className="text-sm text-gray-400 mt-4">
                Total Orders
              </p>

              <h2 className="text-3xl font-bold text-[#0B2545] mt-1">
                {stats.totalOrders || 0}
              </h2>

            </div>

            {/* PENDING */}
            <div
              className="bg-white rounded-2xl
                         border border-gray-100
                         p-5 shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div
                  className="w-11 h-11 rounded-xl
                             bg-orange-50
                             flex items-center justify-center"
                >
                  <Clock3
                    size={22}
                    className="text-orange-500"
                  />
                </div>

                <span
                  className="text-xs font-semibold
                             bg-orange-100 text-orange-500
                             px-2 py-1 rounded-full"
                >
                  Pending
                </span>

              </div>

              <p className="text-sm text-gray-400 mt-4">
                Pending Orders
              </p>

              <h2 className="text-3xl font-bold text-[#0B2545] mt-1">
                {stats.pending || 0}
              </h2>

            </div>

            {/* PROCESSING */}
            <div
              className="bg-white rounded-2xl
                         border border-gray-100
                         p-5 shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div
                  className="w-11 h-11 rounded-xl
                             bg-blue-50
                             flex items-center justify-center"
                >
                  <LoaderCircle
                    size={22}
                    className="text-blue-500"
                  />
                </div>

                <span
                  className="text-xs font-semibold
                             bg-blue-100 text-blue-500
                             px-2 py-1 rounded-full"
                >
                  Processing
                </span>

              </div>

              <p className="text-sm text-gray-400 mt-4">
                Processing Orders
              </p>

              <h2 className="text-3xl font-bold text-[#0B2545] mt-1">
                {stats.processing || 0}
              </h2>

            </div>

          </div>

          {/* FILTERS */}
          <OrdersFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          {/* TABLE */}
          <OrdersTable
            loading={loading}
            orders={orders}
            onViewDetails={setSelectedOrder}
            onStatusChange={handleStatusChange}
          />

          {/* PAGINATION */}
          <div className="flex justify-end gap-2 mt-6">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage(page - 1)
              }
              className="px-4 py-2 rounded-xl
                         border bg-white text-sm
                         disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(pages)].map(
              (_, i) => (

                <button
                  key={i}
                  onClick={() =>
                    setPage(i + 1)
                  }
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition
                    ${
                      page === i + 1
                        ? "bg-[#4a46a0] text-white"
                        : "bg-white border text-gray-600"
                    }`}
                >
                  {i + 1}
                </button>
              )
            )}

            <button
              disabled={page === pages}
              onClick={() =>
                setPage(page + 1)
              }
              className="px-4 py-2 rounded-xl
                         border bg-white text-sm
                         disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>

      </div>

      {/* DRAWER */}
      <OrderDetailsDrawer
        order={selectedOrder}
        onClose={() =>
          setSelectedOrder(null)
        }
      />

    </div>
  );
}