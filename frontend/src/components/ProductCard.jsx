import { Star, Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {

  const navigate = useNavigate();

  const goToProduct = () => {
    navigate(`/product/${product._id}`);
  };

  return (

    <div
      onClick={goToProduct}
      className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition relative cursor-pointer"
    >

      {/* Favorite icon */}

      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 right-3 bg-white rounded-full p-1 shadow cursor-pointer"
      >

        <Heart size={18} className="text-gray-400 hover:text-red-400" />

      </div>


      {/* Image container */}

      <div className="bg-[#FCE5D9] rounded-lg p-6 mb-4 flex justify-center">

        <img
          src={`/products/${product.image}`}
          alt={product.name}
          className="h-40 object-contain"
        />

      </div>


      {/* Brand */}

      <p className="text-xs text-gray-500 uppercase mb-1">

        {product.brand || product.category || "Brand"}

      </p>


      {/* Product name */}

      <h3 className="font-semibold text-gray-800 mb-2 leading-tight">

        {product.name}

      </h3>


      {/* Rating */}

      <div className="flex items-center gap-1 text-yellow-400 text-sm mb-2">

        <Star size={14} fill="#facc15" stroke="none"/>

        <span className="text-gray-600 text-sm">
          4.8
        </span>

      </div>


      {/* Price */}

      <p className="font-bold text-gray-900 mb-4 text-lg">

        ${product.price}

      </p>


      {/* Add to cart */}

      <button
        onClick={(e) => e.stopPropagation()}
        className="w-full flex items-center justify-center gap-2 border border-[#524E8D] text-[#524E8D] py-2 rounded-lg hover:bg-purple-50 transition"
      >

        <ShoppingCart size={16} />

        Add to Cart

      </button>

    </div>

  );

}

export default ProductCard;