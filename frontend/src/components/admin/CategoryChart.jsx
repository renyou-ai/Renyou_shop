import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  Chart,
  registerables,
} from "chart.js";

Chart.register(...registerables);

export default function CategoryChart({
  data = [],
  selectedMonth,
  selectedYear,
}) {

  const ref = useRef(null);

  const chart = useRef(null);

  const safeData = useMemo(
    () => (
      Array.isArray(data)
        ? data
        : []
    ),
    [data]
  );

  const totalRevenue =
    safeData.reduce(
      (sum, item) =>
        sum + (item.revenue || 0),
      0
    );

  const topCategory =
    safeData.length > 0
      ? safeData.reduce(
          (prev, current) =>
            prev.revenue >
            current.revenue
              ? prev
              : current
        )
      : null;

  useEffect(() => {

    if (!ref.current) return;

    if (chart.current) {
      chart.current.destroy();
    }

    if (safeData.length === 0) {
      return;
    }

    /* =========================
       LABELS
    ========================= */
    const labels = safeData.map(
      (d) => {

        if (
          typeof d.category ===
          "object"
        ) {

          return (
            d.category?.name ||
            "Unknown"
          );
        }

        return (
          d.category ||
          "Unknown"
        );
      }
    );

    /* =========================
       VALUES
    ========================= */
    const values =
      safeData.map((d) => {

        if (!totalRevenue)
          return 0;

        return Number(
          (
            (
              d.revenue /
              totalRevenue
            ) * 100
          ).toFixed(1)
        );
      });

    const max =
      Math.max(...values);

    chart.current =
      new Chart(
        ref.current,
        {

          type: "bar",

          data: {

            labels,

            datasets: [
              {

                data: values,

                borderRadius: 14,

                borderSkipped: false,

                borderWidth: 0,

                inflateAmount: 4,

                barThickness: 32,

                maxBarThickness: 36,

                backgroundColor:
                  values.map((v) =>
                    v === max
                      ? "rgba(74,70,160,0.9)"
                      : "rgba(74,70,160,0.18)"
                  ),

                hoverBackgroundColor:
                  values.map((v) =>
                    v === max
                      ? "rgba(74,70,160,1)"
                      : "rgba(74,70,160,0.35)"
                  ),
              },
            ],
          },

          options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {

              duration: 1200,

              easing:
                "easeOutQuart",
            },

            interaction: {

              intersect: false,

              mode: "index",
            },

            plugins: {

              legend: {
                display: false,
              },

              tooltip: {

                backgroundColor:
                  "#1a1a2e",

                titleColor:
                  "rgba(255,255,255,0.7)",

                bodyColor:
                  "#fff",

                displayColors:
                  false,

                padding: 12,

                callbacks: {

                  label: (ctx) => {

                    const item =
                      safeData[
                        ctx.dataIndex
                      ];

                    return [
                      `${ctx.parsed.y}% of revenue`,
                      `$${item.revenue.toLocaleString()} sales`,
                      `${item.count || 0} items sold`,
                    ];
                  },
                },
              },
            },

            scales: {

              x: {

                grid: {
                  display: false,
                },

                border: {
                  display: false,
                },

                ticks: {

                  color:
                    "#9ca3af",

                  font: {
                    size: 11,
                  },
                },
              },

              y: {

                beginAtZero: true,

                grid: {

                  color:
                    "rgba(0,0,0,0.04)",
                },

                border: {
                  display: false,
                },

                ticks: {

                  color:
                    "#9ca3af",

                  callback: (v) =>
                    `${v}%`,

                  maxTicksLimit: 5,
                },
              },
            },
          },
        }
      );

    return () => {
      chart.current?.destroy();
    };

  }, [safeData, totalRevenue]);

  return (

    <div className="h-full flex flex-col">

      {/* TOP INFO */}
      <div
        className="flex items-center
                   justify-between
                   mb-4 flex-wrap gap-3"
      >

        <div
          className="flex items-center
                     gap-2 flex-wrap"
        >

          {topCategory && (

            <span
              className="bg-[#4a46a0]/10
                         text-[#4a46a0]
                         text-xs font-semibold
                         px-3 py-1 rounded-full"
            >

              Top Category:
              {" "}

              {typeof topCategory.category === "object"
                ? topCategory.category?.name
                : topCategory.category}

            </span>

          )}

          <span
            className="text-xs text-gray-400
                       bg-gray-100 rounded-full
                       px-3 py-1 border"
          >

            {new Date(
              selectedYear,
              selectedMonth - 1
            ).toLocaleString(
              "en-US",
              {
                month: "long",
                year: "numeric",
              }
            )}

          </span>

        </div>

        <span className="text-xs text-gray-400">

          $

          {totalRevenue.toLocaleString()}

          {" "}
          total revenue

        </span>

      </div>

      {/* EMPTY */}
      {safeData.length === 0 ? (

        <div
          className="h-52 flex flex-col
                     items-center justify-center
                     text-center"
        >

          <div className="text-4xl mb-3">
            📊
          </div>

          <p className="text-sm text-gray-500 font-medium">
            No category sales yet
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Sales analytics will appear here
          </p>

        </div>

      ) : (

        <div className="relative h-52 overflow-x-auto">

          <canvas ref={ref} />

        </div>

      )}

    </div>
  );
}