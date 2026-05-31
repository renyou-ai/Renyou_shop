import plusIcon from "@/asset/icons/plus.svg";

import { useCart } from "@/context/CartContext";

import { useNavigate } from "react-router-dom";

export default function ProductCard({
  product,
}) {

  const { addToCart } = useCart();

  const navigate = useNavigate();

  if (!product) return null;

  const {

    images,

    image,

    name = "Sample product",

    brand = "",

    price = 0,

    stock = 0,

  } = product;

  const mainImage =
    images?.length
      ? images[0]
      : image ||
        "/images/placeholder.png";

  const imageSrc =
    mainImage &&
    mainImage.startsWith("http")
      ? mainImage
      : mainImage?.startsWith("/")
      ? `http://localhost:5000${mainImage}`
      : "/images/placeholder.png";

  const isOutOfStock =
    stock <= 0;

  return (

    <div
      onClick={() =>
        navigate(
          `/product/${product._id}`
        )
      }
      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
    >

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

      {/* PRICE */}
      <div className="flex items-center justify-between">

        <div>

          <p className="font-semibold text-[#1e1e2f]">

            ${Number(price).toFixed(2)}

          </p>

          {isOutOfStock && (

            <p className="text-red-500 text-xs mt-1 font-medium">

              Out of stock

            </p>
          )}

        </div>

        <button

          disabled={isOutOfStock}

          onClick={(e) => {

            e.stopPropagation();

            if (
              !isOutOfStock
            ) {
              addToCart(product);
            }
          }}

          className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
            isOutOfStock
              ? "bg-gray-200 cursor-not-allowed opacity-60"
              : "bg-orange-400 hover:bg-orange-500"
          }`}
        >

          <img
            src={plusIcon}
            className="h-4 w-4"
          />

        </button>

      </div>

    </div>
  );
}