import { TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

/* 🔥 Hook animation */
function useCountUp(target) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!target) return;

    let start = 0;
    const duration = 400; // ms
    const steps = 20;
    const increment = target / steps;

    const interval = setInterval(() => {
      start += increment;

      if (start >= target) {
        setValue(target);
        clearInterval(interval);
      } else {
        setValue(Math.floor(start));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [target]);

  return value;
}

export default function KpiCard({ label, value, change, icon: Icon }) {
  const isUp = change >= 0;

  // 🔥 extraire nombre (ex: "$1200" → 1200)
  const numericValue = Number(String(value).replace(/[^0-9]/g, "")) || 0;

  const animatedValue = useCountUp(numericValue);

  // 🔥 recompose affichage
  const displayValue =
    typeof value === "string" && value.includes("$")
      ? `$${animatedValue.toLocaleString()}`
      : animatedValue.toLocaleString();

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/[0.07]
                    hover:shadow-md hover:-translate-y-px transition-all duration-150">
      
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#4a46a0]/10 flex items-center
                        justify-center text-[#4a46a0]">
          {Icon && <Icon size={18} />}
        </div>

        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5
          rounded-full ${
            isUp
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {isUp ? "+" : ""}
          {change}%
        </span>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
        {label}
      </p>

      <p className="text-2xl font-bold tracking-tight text-gray-900 tabular-nums">
        {displayValue}
      </p>
    </div>
  );
}