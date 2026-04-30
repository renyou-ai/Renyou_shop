import { useNavigate } from "react-router-dom";
import promoImg from "@/asset/images/promo.jpg";

export default function PromoBanner() {
  const navigate = useNavigate();

  const handleShop = () => {
    navigate("/shop");
  };

  return (
    <section className="mx-10 my-12">

      <div className="flex rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition">

        {/* LEFT */}
        <div className="w-1/2 bg-[#E2F1EF] px-12 py-14 flex flex-col justify-center">

          <h2 className="text-4xl font-semibold text-[#0B2545] mb-4">
            Get 20% Off Your First Order
          </h2>

          <p className="text-[#0B2545]/70 text-sm mb-8">
            Use code{" "}
            <span className="text-[#FF7F50] font-medium">
              HEALTH20
            </span>{" "}
            at checkout. Valid for new customers only.
          </p>

          <button
            onClick={handleShop}
            className="bg-[#FF7F50] text-white px-6 py-3 rounded-xl w-fit hover:opacity-90 transition"
          >
            Shop Now
          </button>

        </div>

        {/* RIGHT */}
        <div className="w-1/2 bg-[#BFE3DE] flex items-center justify-center overflow-hidden">

          <img
            src={promoImg}
            alt="promo"
            className="h-full w-full object-cover hover:scale-105 transition duration-500"
          />

        </div>

      </div>

    </section>
  );
}