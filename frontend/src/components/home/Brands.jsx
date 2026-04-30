import { useState, useEffect } from "react";

import b1 from "@/asset/images/brand1.jpg";
import b2 from "@/asset/images/brand2.jpg";
import b3 from "@/asset/images/brand3.jpg";
import b4 from "@/asset/images/brand4.jpg";
import b5 from "@/asset/images/brand.jpg";

export default function Brands() {
  const brands = [b1, b2, b3, b4, b5];

  const ITEMS_PER_VIEW = 4;

  const [index, setIndex] = useState(0);

  const totalSlides = Math.ceil(brands.length / ITEMS_PER_VIEW);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const start = index * ITEMS_PER_VIEW;
  const visibleBrands = brands.slice(start, start + ITEMS_PER_VIEW);

  return (
    <section className="px-10 py-16 text-center">

      <h2 className="text-2xl font-semibold mb-12 text-[#0B2545]">
        Nos marques
      </h2>

      <div className="flex justify-center items-center gap-20">

        {visibleBrands.map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt="brand"
            className="h-16 md:h-20 object-contain opacity-80 hover:opacity-100 grayscale hover:grayscale-0 transition duration-300 hover:scale-110"
          />
        ))}

      </div>

      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full cursor-pointer transition ${
              index === i ? "bg-orange-400 scale-110" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

    </section>
  );
}