import { ArrowRight, CreditCard, Banknote } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  completed: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-600",
  pending: "bg-orange-100 text-orange-600",
};

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;

  if (diff < 60) {
    return `${Math.floor(diff)}s ago`;
  }

  if (diff < 3600) {
    return `${Math.floor(diff / 60)} min ago`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h ago`;
  }

  return new Date(date).toLocaleDateString();
}

export default function OrdersTable({ orders = [] }) {

  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    currentYear
  );

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = [];

  for (let y = currentYear; y >= 2023; y--) {
    years.push(y);
  }

  const filteredOrders = useMemo(() => {

    return orders.filter((order) => {

      const date = new Date(order.createdAt);

      return (
        date.getMonth() + 1 === Number(selectedMonth) &&
        date.getFullYear() === Number(selectedYear)
      );
    });

  }, [orders, selectedMonth, selectedYear]);

  const totalRevenue = filteredOrders.reduce(
    (acc, order) => acc + (order.totalPrice || 0),
    0
  );

  return (
    <div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">

        <div>
          <h2 className="font-bold text-gray-900">
            Recent Orders
          </h2>

          <p className="text-xs text-gray-400 mt-1">
            {filteredOrders.length} orders • $
            {totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">

          {/* MONTH */}
          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(e.target.value)
            }
            className="text-xs border rounded-lg px-3 py-2 bg-white"
          >
            {months.map((month) => (
              <option
                key={month.value}
                value={month.value}
              >
                {month.label}
              </option>
            ))}
          </select>

          {/* YEAR */}
          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(e.target.value)
            }
            className="text-xs border rounded-lg px-3 py-2 bg-white"
          >
            {years.map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
          </select>

          <Link
            to="/admin/orders"
            className="flex items-center gap-1 text-xs font-semibold
                       text-[#4a46a0] hover:opacity-75 transition-opacity"
          >
            View All
            <ArrowRight size={13} />
          </Link>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-black/[0.05]">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 sticky top-0 z-10">

            <tr className="border-b border-black/[0.06]">

              {[
                "Order ID",
                "Customer",
                "Amount",
                "Payment",
                "Status",
                "Date",
              ].map((h) => (

                <th
                  key={h}
                  className="text-left text-[11px] font-semibold uppercase
                             tracking-widest text-gray-400 py-3 px-3"
                >
                  {h}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {filteredOrders.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="text-center py-14 text-gray-400 text-sm"
                >
                  No orders for this period
                </td>

              </tr>

            )}

            {filteredOrders.map((order) => {

              const status =
                order.status ||
                order.orderStatus ||
                "pending";

              return (

                <tr
                  key={order._id}
                  className="border-b border-black/[0.04]
                             hover:bg-[#fafaff]
                             transition-colors"
                >

                  {/* ORDER ID */}
                  <td className="py-4 px-3">

                    <span
                      className="font-semibold text-[#4a46a0]
                                 font-mono text-xs"
                    >
                      #
                      {String(order._id)
                        .slice(-6)
                        .toUpperCase()}
                    </span>

                  </td>

                  {/* CUSTOMER */}
                  <td className="py-4 px-3 text-gray-700">

                    <div className="flex flex-col">

                      <span className="font-medium">
                        {order.user?.name || "Guest"}
                      </span>

                      <span className="text-xs text-gray-400">
                        {order.user?.email || "No email"}
                      </span>

                    </div>

                  </td>

                  {/* AMOUNT */}
                  <td className="py-4 px-3 font-semibold tabular-nums">

                    $
                    {Number(order.totalPrice || 0).toFixed(2)}

                  </td>

                  {/* PAYMENT */}
                  <td className="py-4 px-3">

                    <div
                      className={`inline-flex items-center gap-1.5
                      px-2.5 py-1 rounded-full text-[11px]
                      font-medium ${
                        order.paymentMethod === "online"
                          ? "bg-[#ede9fe] text-[#5b46d8]"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >

                      {order.paymentMethod === "online" ? (
                        <CreditCard size={11} />
                      ) : (
                        <Banknote size={11} />
                      )}

                      {order.paymentMethod === "online"
                        ? "Online"
                        : "Cash"}

                    </div>

                  </td>

                  {/* STATUS */}
                  <td className="py-4 px-3">

                    <span
                      className={`inline-flex items-center
                      text-[11px] font-semibold
                      px-2.5 py-1 rounded-full
                      uppercase tracking-wide
                      ${
                        STATUS_STYLES[status] ||
                        STATUS_STYLES.pending
                      }`}
                    >
                      {status}
                    </span>

                  </td>

                  {/* DATE */}
                  <td className="py-4 px-3 text-xs text-gray-400 whitespace-nowrap">

                    {timeAgo(order.createdAt)}

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
