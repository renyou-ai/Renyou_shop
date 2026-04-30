import PropTypes from "prop-types";

function ProductInfo({ product, quantity, setQuantity, onAddToCart }) {
  if (!product) return null;

  const {
    brand = "Clearskin Rx",
    name = "Product",
    price = 0,
    description = "No description available",
  } = product;

  return (
    <div>

      {/* BRAND */}
      <p className="text-sm text-gray-500 uppercase mb-2">
        {brand}
      </p>

      {/* NAME */}
      <h1 className="text-4xl font-bold text-[#0B1A2B] mb-4">
        {name}
      </h1>

      {/* RATING */}
      <div className="flex items-center gap-2 mb-4">
        <span>⭐⭐⭐⭐⭐</span>
        <span className="text-gray-500 text-sm">
          4.8 (124 Reviews)
        </span>
      </div>

      {/* PRICE */}
      <div className="flex items-center gap-4 mb-4">

        <p className="text-3xl font-bold text-[#524E8D]">
          ${Number(price).toFixed(2)}
        </p>

        <p className="line-through text-gray-400">
          ${(price * 1.3).toFixed(2)}
        </p>

      </div>

      {/* TAGS */}
      <div className="flex gap-3 mb-6">

        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
          In Stock
        </span>

        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
          Prescription Required
        </span>

      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-600 mb-8">
        {description}
      </p>

      {/* QUANTITY + CART */}
      <div className="flex items-center gap-4 mb-8">

        <div className="flex items-center border rounded-lg">

          <button
            className="px-4 py-2 hover:bg-gray-100"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>

          <span className="px-4">
            {quantity}
          </span>

          <button
            className="px-4 py-2 hover:bg-gray-100"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>

        </div>

        {/* 🔥 CONNECTED BUTTON */}
        <button
          onClick={onAddToCart}
          className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:opacity-90 transition"
        >
          Add to Cart
        </button>

      </div>

      {/* DELIVERY BOX */}
      <div className="bg-white p-6 rounded-lg shadow">

        <p className="font-semibold mb-2">
          Free Standard Delivery
        </p>

        <p className="text-gray-500 text-sm">
          Order within 2 hours to get it by tomorrow
        </p>

        <hr className="my-4" />

        <p className="font-semibold">
          100% Authentic Products
        </p>

        <p className="text-gray-500 text-sm">
          Sourced directly from licensed manufacturers
        </p>

      </div>

    </div>
  );
}

/* ✅ PROP VALIDATION */
ProductInfo.propTypes = {
  product: PropTypes.shape({
    brand: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string,
  }),
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductInfo;