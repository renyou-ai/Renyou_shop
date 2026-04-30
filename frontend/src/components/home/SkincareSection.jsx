import { useState } from "react";

import aiIcon from "@/asset/icons/ai.svg";
import bag from "@/asset/icons/bag.svg";
import box from "@/asset/icons/box.svg";
import blur from "@/asset/images/blur.svg";

export default function SkincareSection() {
  const [query, setQuery] = useState("");

  // 🔥 HANDLE AI SEARCH
  const handleAskAI = () => {
    if (!query.trim()) return;

    // envoie vers AI widget
    window.dispatchEvent(
      new CustomEvent("open-ai-chat", {
        detail: { message: query },
      })
    );

    setQuery("");
  };

  return (
    <section className="relative py-32 bg-white overflow-hidden">

      {/* BG BLUR */}
      <img
        src={blur}
        alt=""
        className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 
        w-[700px] opacity-70 pointer-events-none"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">

        {/* TITLE */}
        <h2 className="text-4xl md:text-5xl font-semibold text-[#35316F] leading-tight mb-10">
          Shop Skincare that <br />
          <span className="italic">
            actually works for you
          </span>
        </h2>

        {/* INPUT */}
        <div className="flex items-center rounded-2xl border border-[#35316F] bg-[#FFFAF8] overflow-hidden shadow-md mb-8">

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
            placeholder="I want to minimize my pores..."
            className="flex-1 px-6 py-4 bg-transparent outline-none text-sm text-gray-600"
          />

          <button
            onClick={handleAskAI}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white
            bg-gradient-to-r from-[#34306F] to-[#645CD5]
            hover:opacity-90 transition shadow-md"
          >
            Ask Renyou AI
            <img src={aiIcon} alt="" className="h-4 w-4" />
          </button>

        </div>

        {/* QUICK ACTIONS */}
        <div className="flex justify-center gap-4 flex-wrap">

          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-ai-chat", {
                  detail: { message: "Build my skincare routine" },
                })
              )
            }
            className="flex items-center gap-2 bg-[#FFF2ED] text-[#35316F] px-5 py-2 rounded-full text-sm shadow-sm hover:opacity-90 transition"
          >
            <img src={bag} alt="" className="h-4" />
            Discover your routine
            <span className="bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full ml-1">
              New
            </span>
          </button>

          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-ai-chat", {
                  detail: { message: "Find best skincare products for me" },
                })
              )
            }
            className="flex items-center gap-2 bg-[#FFF2ED] text-[#34306F] px-5 py-2 rounded-full text-sm shadow-sm hover:opacity-90 transition"
          >
            <img src={box} alt="" className="h-4" />
            Find me match-perfect products
          </button>

        </div>

        {/* FOOTNOTE */}
        <p className="text-[11px] text-gray-400 mt-6">
          AI generated responses may include mistakes. <br />
          By starting, you agree to our T&Cs
        </p>

      </div>

    </section>
  );
}