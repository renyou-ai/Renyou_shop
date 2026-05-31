import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import arrowLeft from "@/asset/icons/arrow-left.svg";
import arrowRight from "@/asset/icons/arrow-right.svg";
import hero1 from "@/asset/images/hero-bg.jpg";
import hero2 from "@/asset/images/image2.png";
import SkinDiagnosisModal from "../../components/questionnaire/SkinDiagnosisModal";

export default function HeroSection() {
  const navigate = useNavigate();
  const [openDiagnosis, setOpenDiagnosis] = useState(false);
  // 🎯 SLIDES DYNAMIQUES
  const slides = [
    {
      image: hero1,
      title: "AI-powered Skin Analysis",
      cta: "Start diagnosis",
    },
    {
      image: hero2,
      cta: "Shop now",
    },
  ];

  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="w-full mt-4">

      <div className="relative w-full h-[520px] overflow-hidden rounded-2xl">

        {/* SLIDER */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="relative w-full h-full flex-shrink-0">

              <img
                src={slide.image}
                alt="hero"
                className="w-full h-full object-cover"
              />

              {/* 🔥 OVERLAY CONTENT */}
              <div className="absolute inset-0 bg-black/20 flex flex-col justify-center pl-16 text-white">

                <h1 className="text-4xl md:text-5xl font-semibold mb-4 max-w-lg leading-tight">
                  {slide.title}
                </h1>

                <p className="text-lg mb-6 max-w-md opacity-90">
                  {slide.subtitle}
                </p>

                <button
                  onClick={() =>
                    slide.cta === "Start diagnosis"
                      ? setOpenDiagnosis(true)
                      : navigate("/shop")
                  }
                  className="w-fit bg-orange-400 hover:bg-orange-500 px-6 py-3 rounded-lg text-white font-medium transition"
                >
                  {slide.cta}
                </button>

              </div>

            </div>
          ))}
        </div>

        {/* LEFT */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full shadow-md hover:scale-105 transition"
        >
          <img src={arrowRight} className="w-4" />
        </button>

        {/* RIGHT */}
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full shadow-md hover:scale-105 transition"
        >
          <img src={arrowLeft} className="w-4" />
        </button>

        {/* DOTS */}
        <div className="absolute bottom-4 w-full flex justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`cursor-pointer transition-all ${
                current === index
                  ? "w-3 h-3 bg-orange-400 rounded-full"
                  : "w-2 h-2 bg-gray-300 rounded-full"
              }`}
            />
          ))}
        </div>

      </div>
      {openDiagnosis && (
        <SkinDiagnosisModal
          onClose={() =>
            setOpenDiagnosis(false)
          }
        />
      )}
    </section>
  );
}