import {
  RefreshCw,
  AlertTriangle,
  PackageX,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function StockAlerts({
  products,
  onRefetch,
}) {

  const navigate = useNavigate();

  const safeProducts = Array.isArray(products)
    ? products
    : [];

  const criticalCount =
    safeProducts.filter(
      (p) => p.stock <= 5 && p.stock > 0
    ).length;

  const outOfStockCount =
    safeProducts.filter(
      (p) => p.stock <= 0
    ).length;

  const getStatus = (stock) => {

    if (stock <= 0) {
      return {
        label: "Out of Stock",
        color:
          "bg-red-100 text-red-600",
        bar:
          "bg-red-500",
      };
    }

    if (stock <= 5) {
      return {
        label: "Critical",
        color:
          "bg-orange-100 text-orange-600",
        bar:
          "bg-orange-500",
      };
    }

    if (stock <= 10) {
      return {
        label: "Low",
        color:
          "bg-yellow-100 text-yellow-700",
        bar:
          "bg-yellow-500",
      };
    }

    return {
      label: "Healthy",
      color:
        "bg-green-100 text-green-600",
      bar:
        "bg-green-500",
    };
  };

  return (

    <div className="h-full flex flex-col">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="font-bold text-gray-900">
            Stock Alerts
          </h2>

          <p className="text-xs text-gray-400 mt-1">
            Inventory monitoring
          </p>

        </div>

        <button
          onClick={onRefetch}
          className="w-8 h-8 rounded-xl border border-black/[0.08]
                     flex items-center justify-center
                     text-gray-500 hover:bg-[#4a46a0]
                     hover:text-white hover:border-[#4a46a0]
                     transition-all"
        >
          <RefreshCw size={13} />
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 mb-5">

        <div
          className="bg-orange-50 border border-orange-100
                     rounded-2xl p-3"
        >

          <div className="flex items-center gap-2 mb-1">

            <AlertTriangle
              size={14}
              className="text-orange-500"
            />

            <span className="text-[11px] font-semibold uppercase tracking-wide text-orange-600">
              Critical
            </span>

          </div>

          <p className="text-2xl font-bold text-orange-600">
            {criticalCount}
          </p>

        </div>

        <div
          className="bg-red-50 border border-red-100
                     rounded-2xl p-3"
        >

          <div className="flex items-center gap-2 mb-1">

            <PackageX
              size={14}
              className="text-red-500"
            />

            <span className="text-[11px] font-semibold uppercase tracking-wide text-red-600">
              Out
            </span>

          </div>

          <p className="text-2xl font-bold text-red-600">
            {outOfStockCount}
          </p>

        </div>

      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">

        {safeProducts.length === 0 && (

          <div
            className="py-10 text-center bg-green-50
                       rounded-2xl border border-green-100"
          >

            <p className="text-sm font-medium text-green-700">
              All products well stocked ✓
            </p>

          </div>

        )}

        {safeProducts.map((product) => {

          const status =
            getStatus(product.stock);

          const imageSrc =
            product.image?.startsWith("http")
              ? product.image
              : product.image
              ? `http://localhost:5000${product.image}`
              : null;

          return (

            <div
              key={product._id}
              className="group border border-black/[0.05]
                         rounded-2xl p-3 hover:bg-gray-50
                         transition-all"
            >

              <div className="flex gap-3">

                {/* IMAGE */}
                <div
                  className="w-14 h-14 rounded-2xl
                             bg-gray-100 overflow-hidden
                             flex items-center justify-center
                             flex-shrink-0"
                >

                  {imageSrc ? (

                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <span className="text-xl">
                      🧴
                    </span>

                  )}

                </div>

                {/* INFO */}
                <div className="flex-1 min-w-0">

                  <div className="flex items-start justify-between gap-2">

                    <div>

                      <p
                        className="text-sm font-semibold
                                   text-gray-900 truncate"
                      >
                        {product.name}
                      </p>

                      <p
                        className="text-xs text-gray-400 mt-0.5"
                      >
                        {product.category || "Skincare"}
                      </p>

                    </div>

                    <span
                      className={`text-[10px] px-2 py-1
                      rounded-full font-semibold whitespace-nowrap
                      ${status.color}`}
                    >
                      {status.label}
                    </span>

                  </div>

                  {/* STOCK */}
                  <div className="mt-3">

                    <div className="flex items-center justify-between mb-1">

                      <span className="text-xs text-gray-500">
                        Remaining Stock
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          product.stock <= 5
                            ? "text-red-500"
                            : product.stock <= 10
                            ? "text-orange-500"
                            : "text-green-600"
                        }`}
                      >
                        {product.stock} units
                      </span>

                    </div>

                    <div className="mt-2 flex items-center gap-2">

                      {/* BAR */}
                      <div
                        className="flex-1 h-2 rounded-full
                                   bg-gray-100 overflow-hidden"
                      >

                        <div
                          className={`h-full rounded-full ${status.bar}`}
                          style={{
                            width: `${Math.min(
                              (product.stock / 20) * 100,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                      {/* RESTOCK */}
                      <button
                        onClick={() =>
                          navigate("/admin/products")
                        }
                        className="text-[10px] font-semibold
                                   px-2.5 py-1 rounded-lg
                                   bg-[#4a46a0] text-white
                                   hover:opacity-90 transition"
                      >
                        Restock
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          );
        })}

      </div>

      {/* FOOTER */}
      <button
        className="w-full mt-5 py-3 rounded-2xl
                   border border-black/[0.08]
                   text-[11px] font-semibold uppercase
                   tracking-[0.2em] text-gray-500
                   hover:border-[#4a46a0]
                   hover:text-[#4a46a0]
                   transition-all"
      >
        Inventory Report
      </button>

    </div>
  );
}
