import whatsappIcon from "@/asset/icons/whatsapp.svg";
import plusIcon from "@/asset/icons/plus.svg";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  // sécurité totale (évite undefined)
  if (!product) return null;

  const {
    image,
    name = "Sample product",
    brand = "",
    rating = 4.5,
    reviews = 0,
    price = 0,
  } = product;

  // gestion image (frontend + backend)
  const imageSrc = image
    ? image.startsWith("/images")
      ? image
      : `http://localhost:5000${image}`
    : "/images/placeholder.png";

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">

      {/* IMAGE */}
      <div className="flex justify-center mb-6">
        <img
          src={imageSrc}
          alt={name}
          className="h-[140px] object-contain"
        />
      </div>

      {/* BRAND */}
      {brand && (
        <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">
          {brand}
        </p>
      )}

      {/* NAME */}
      <h3 className="text-sm font-medium text-[#1e1e2f] mb-2 leading-snug">
        {name}
      </h3>

      {/* RATING */}
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
        <span className="text-yellow-400">★</span>
        <span>{rating}</span>
        <span>({reviews})</span>
      </div>

      {/* PRICE + ACTIONS */}
      <div className="flex items-center justify-between">
        <p className="font-semibold text-[#1e1e2f]">
          ${Number(price).toFixed(2)}
        </p>

        <div className="flex items-center gap-2">
          {/* WhatsApp (tu peux brancher plus tard) */}
          <button className="w-9 h-9 flex items-center justify-center rounded-full border border-green-500">
            <img src={whatsappIcon} className="h-4 w-4" />
          </button>

          {/* ADD TO CART */}
          <button
            onClick={() => addToCart(product)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-400 hover:bg-orange-500 transition"
          >
            <img src={plusIcon} className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}