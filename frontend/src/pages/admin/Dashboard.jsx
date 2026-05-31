import { useState } from "react";

import {
  Wallet,
  ShoppingBasket,
  ClipboardList,
  Users,
  RefreshCw,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import KpiCard from "@/components/admin/KpiCard";
import RevenueChart from "@/components/admin/RevenueChart";
import CategoryChart from "@/components/admin/CategoryChart";
import OrdersTable from "@/components/admin/OrdersTable";
import StockAlerts from "@/components/admin/StockAlerts";

import { useAdminStats } from "@/hooks/useAdminStats";

function Skeleton({
  className = "",
}) {
  return (
    <div
      className={`animate-pulse bg-gray-100 rounded-xl ${className}`}
    />
  );
}

export default function AdminDashboard() {

  const now = new Date();

  const [collapsed, setCollapsed] =
    useState(false);

  const [selectedMonth, setSelectedMonth] =
    useState(now.getMonth() + 1);

  const [selectedYear, setSelectedYear] =
    useState(now.getFullYear());

  const {
    stats,
    trend,
    categories,
    orders,
    stockAlerts,
    loading,
    refreshing,
    error,
    refetch,
  } = useAdminStats(
    selectedMonth,
    selectedYear
  );

  const fmt = (n) =>
    n?.toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 0,
      }
    ) ?? "0";

  const lastUpdated =
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (error) {

    return (

      <div className="flex items-center justify-center h-screen flex-col gap-3">

        <p className="text-red-500 font-medium">
          {error}
        </p>

        <button
          onClick={refetch}
          className="text-sm text-[#4a46a0] underline"
        >
          Try again
        </button>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#f2f2f6] flex">

      <AdminSidebar
        collapsed={collapsed}
        onToggle={() =>
          setCollapsed((p) => !p)
        }
      />

      <div className="flex-1 flex flex-col min-w-0">

        <AdminTopbar
          onToggle={() =>
            setCollapsed((p) => !p)
          }
        />

        <main className="p-6 flex flex-col gap-5">

          {/* HEADER */}
          <div className="flex items-center justify-between flex-wrap gap-3">

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Dashboard Overview
              </h1>

              <p className="text-sm text-gray-400 mt-0.5">
                Welcome back, here's what's happening with Renyou Shop today.
              </p>

              {/* LIVE STATUS */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">

                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Live Dashboard
                </span>

                <span className="text-xs text-gray-400">
                  Last update:
                  {" "}
                  {lastUpdated}
                </span>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">

              {/* MONTH */}
              <select
                value={selectedMonth}
                onChange={(e) =>
                  setSelectedMonth(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="text-xs border rounded-lg px-3 py-1.5 bg-white"
              >

                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map(
                  (
                    month,
                    index
                  ) => (

                    <option
                      key={month}
                      value={
                        index + 1
                      }
                    >
                      {month}
                    </option>
                  )
                )}

              </select>

              {/* YEAR */}
              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="text-xs border rounded-lg px-3 py-1.5 bg-white"
              >

                {Array.from(
                  { length: 5 },
                  (_, i) =>
                    now.getFullYear() - i
                ).map((year) => (

                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>

                ))}

              </select>

              {/* REFRESH */}
              <button
                onClick={refetch}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                           bg-white border rounded-lg hover:bg-gray-50"
              >

                <RefreshCw
                  size={12}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh

              </button>

            </div>

          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            {loading ? (

              Array.from({
                length: 4,
              }).map((_, i) => (

                <Skeleton
                  key={i}
                  className="h-32"
                />

              ))

            ) : (

              <>

                <KpiCard
                  label="Total Revenue"
                  value={`$${fmt(
                    stats?.revenue
                      ?.value
                  )}`}
                  change={
                    stats?.revenue
                      ?.change ?? 0
                  }
                  icon={Wallet}
                />

                <KpiCard
                  label="Total Orders"
                  value={fmt(
                    stats?.orders
                      ?.value
                  )}
                  change={
                    stats?.orders
                      ?.change ?? 0
                  }
                  icon={
                    ShoppingBasket
                  }
                />

                <KpiCard
                  label="Active Products"
                  value={fmt(
                    stats?.products
                      ?.value
                  )}
                  change={
                    stats?.products
                      ?.change ?? 0
                  }
                  icon={
                    ClipboardList
                  }
                />

                <KpiCard
                  label="Total Customers"
                  value={fmt(
                    stats?.users
                      ?.value
                  )}
                  change={
                    stats?.users
                      ?.change ?? 0
                  }
                  icon={Users}
                />

              </>

            )}

          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">

            {/* REVENUE */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/[0.07]">

              <div className="flex items-center justify-between mb-5">

                <div>

                  <h2 className="font-bold text-gray-900">
                    Revenue Trends
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">
                    Daily revenue performance overview
                  </p>

                </div>

                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1 border">

                  {
                    new Date(
                      selectedYear,
                      selectedMonth - 1
                    ).toLocaleString(
                      "en-US",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )
                  }

                </span>

              </div>

              {loading ? (

                <Skeleton className="h-52" />

              ) : trend?.length === 0 ? (

                <div className="h-52 flex flex-col items-center justify-center text-center">

                  <div className="text-5xl mb-3">
                    📈
                  </div>

                  <h3 className="font-semibold text-gray-800">
                    No revenue data
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    No orders were recorded during this period.
                  </p>

                  <button
                    onClick={refetch}
                    className="mt-4 text-sm text-[#4a46a0] font-medium"
                  >
                    Refresh Data
                  </button>

                </div>

              ) : (

                <RevenueChart
                  data={trend}
                />

              )}

            </div>

            {/* CATEGORY */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/[0.07]">

              <div className="flex items-center justify-between mb-5">

                <div>

                  <h2 className="font-bold text-gray-900">
                    Sales by Category
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">
                    Revenue distribution overview
                  </p>

                </div>

                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1 border">

                  {
                    new Date(
                      selectedYear,
                      selectedMonth - 1
                    ).toLocaleString(
                      "en-US",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )
                  }

                </span>

              </div>

              {loading ? (

                <Skeleton className="h-52" />

              ) : categories?.length === 0 ? (

                <div className="h-52 flex flex-col items-center justify-center text-center">

                  <div className="text-5xl mb-3">
                    🛍️
                  </div>

                  <h3 className="font-semibold text-gray-800">
                    No category analytics
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Revenue categories will appear here.
                  </p>

                </div>

              ) : (

                <CategoryChart
                  data={categories}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />

              )}

            </div>

          </div>

          {/* SECTION TITLE */}
          <div>

            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Operations Overview
            </h2>

            <p className="text-sm text-gray-400">
              Monitor orders and inventory in real time.
            </p>

          </div>

          {/* ORDERS + STOCK */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">

            {/* ORDERS */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/[0.07]">

              {loading ? (

                <>

                  <Skeleton className="h-6 w-40 mb-4" />

                  <Skeleton className="h-48" />

                </>

              ) : (

                <OrdersTable
                  orders={orders}
                  onRefetch={refetch}
                />

              )}

            </div>

            {/* STOCK */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/[0.07]">

              {loading ? (

                <>

                  <Skeleton className="h-6 w-32 mb-4" />

                  <Skeleton className="h-64" />

                </>

              ) : (

                <StockAlerts
                  products={stockAlerts}
                  onRefetch={refetch}
                />

              )}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}