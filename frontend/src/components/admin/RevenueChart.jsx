import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function RevenueChart({
  data = [],
}) {

  const ref = useRef(null);

  const chart = useRef(null);

  useEffect(() => {

    if (!ref.current) return;

    if (chart.current) {
      chart.current.destroy();
    }

    const safeData =
      Array.isArray(data)
        ? data
        : [];

    /* 🔥 TOTAL DAYS OF CURRENT MONTH */
    const totalDays =
      safeData.length || 31;

    /* 🔥 FORCE ALL DAYS */
    const labels =
      Array.from(
        { length: totalDays },
        (_, i) => i + 1
      );

    /* 🔥 MAP VALUES */
    const values =
      labels.map((day) => {

        const found =
          safeData.find(
            (d) => d.day === day
          );

        return Number(
          found?.revenue || 0
        );
      });

    const maxValue =
      Math.max(...values, 0);

    /* 🔥 DYNAMIC MAX */
    const suggestedMax =
      maxValue <= 100
        ? 100
        : Math.ceil(
            maxValue * 1.2
          );

    /* 🔥 MONEY FORMAT */
    const formatMoney = (
      value
    ) => {

      if (
        value >= 1000000
      ) {

        return `$${(
          value / 1000000
        ).toFixed(1)}M`;
      }

      if (
        value >= 1000
      ) {

        return `$${(
          value / 1000
        ).toFixed(1)}K`;
      }

      return `$${Math.round(
        value
      )}`;
    };

    chart.current =
      new Chart(
        ref.current,
        {

          type: "line",

          data: {

            labels,

            datasets: [
              {

                data: values,

                borderColor:
                  "#5B55A2",

                borderWidth: 4,

                fill: true,

                cubicInterpolationMode:
                  "monotone",

                tension: 0.45,

                pointRadius: 0,

                pointHoverRadius: 7,

                pointHoverBackgroundColor:
                  "#5B55A2",

                pointHoverBorderColor:
                  "#ffffff",

                pointHoverBorderWidth: 3,

                backgroundColor:
                  (ctx) => {

                    const chart =
                      ctx.chart;

                    const {
                      ctx: context,
                      chartArea,
                    } = chart;

                    if (
                      !chartArea
                    ) {
                      return null;
                    }

                    const gradient =
                      context.createLinearGradient(
                        0,
                        chartArea.top,
                        0,
                        chartArea.bottom
                      );

                    gradient.addColorStop(
                      0,
                      "rgba(91,85,162,0.22)"
                    );

                    gradient.addColorStop(
                      1,
                      "rgba(91,85,162,0)"
                    );

                    return gradient;
                  },
              },
            ],
          },

          options: {

            responsive: true,

            maintainAspectRatio:
              false,

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
                  "#14142b",

                titleColor:
                  "rgba(255,255,255,0.7)",

                bodyColor:
                  "#fff",

                displayColors:
                  false,

                padding: 14,

                cornerRadius: 14,

                callbacks: {

                  title: (
                    items
                  ) =>
                    `Day ${items[0].label}`,

                  label: (
                    ctx
                  ) =>
                    `Revenue: ${formatMoney(
                      ctx.parsed.y
                    )}`,
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
                    "#A1A1B5",

                  font: {
                    size: 10,
                  },

                  autoSkip: false,

                  maxRotation: 0,

                  minRotation: 0,

                  callback: function (
                    value,
                    index
                  ) {

                    /* 🔥 SHOW ALL DAYS */
                    return labels[
                      index
                    ];
                  },
                },
              },

              y: {

                suggestedMax,

                border: {
                  display: false,
                },

                grid: {

                  color:
                    "rgba(0,0,0,0.04)",

                  drawTicks: false,
                },

                ticks: {

                  padding: 10,

                  color:
                    "#A1A1B5",

                  font: {
                    size: 11,
                  },

                  callback: (
                    value
                  ) =>
                    formatMoney(
                      value
                    ),
                },
              },
            },

            animation: {

              duration: 1400,

              easing:
                "easeOutQuart",
            },
          },
        }
      );

    return () => {

      chart.current?.destroy();
    };

  }, [data]);

  return (

    <div className="relative h-64">

      <canvas ref={ref} />

    </div>
  );
}