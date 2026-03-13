function ProductInfo({ product, quantity, setQuantity }) {

  return (

    <div>

      <p className="text-sm text-gray-500 uppercase mb-2">
        {product.brand || "Clearskin Rx"}
      </p>

      <h1 className="text-4xl font-bold text-[#0B1A2B] mb-4">
        {product.name}
      </h1>

      <div className="flex items-center gap-2 mb-4">
        ⭐⭐⭐⭐⭐
        <span className="text-gray-500 text-sm">
          4.8 (124 Reviews)
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">

        <p className="text-3xl font-bold text-[#524E8D]">
          ${product.price}
        </p>

        <p className="line-through text-gray-400">
          $65.00
        </p>

      </div>

      <div className="flex gap-3 mb-6">

        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
          In Stock
        </span>

        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
          Prescription Required
        </span>

      </div>

      <p className="text-gray-600 mb-8">
        {product.description}
      </p>

      <div className="flex items-center gap-4 mb-8">

        <div className="flex items-center border rounded-lg">

          <button
            className="px-4 py-2"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>

          <span className="px-4">
            {quantity}
          </span>

          <button
            className="px-4 py-2"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>

        </div>

        <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:opacity-90">
          Add to Cart
        </button>

      </div>

      <div className="bg-white p-6 rounded-lg shadow">

        <p className="font-semibold mb-2">
          Free Standard Delivery
        </p>

        <p className="text-gray-500 text-sm">
          Order within 2 hours to get it by tomorrow
        </p>

        <hr className="my-4"/>

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

export default ProductInfo;