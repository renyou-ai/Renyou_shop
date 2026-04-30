function ProductTabs({ product, activeTab, setActiveTab }) {

  return (

    <div className="mt-16">

      <div className="flex gap-8 border-b pb-3 mb-6">

        <button
          onClick={() => setActiveTab("description")}
          className={`pb-2 ${
            activeTab === "description"
              ? "font-semibold border-b-2 border-purple-600"
              : "text-gray-500"
          }`}
        >
          Description
        </button>

        <button onClick={() => setActiveTab("ingredients")}>
          Ingredients
        </button>

        <button onClick={() => setActiveTab("usage")}>
          How to Use
        </button>

        <button onClick={() => setActiveTab("reviews")}>
          Reviews (124)
        </button>

      </div>

      {activeTab === "description" && (
        <p className="text-gray-600">{product.description}</p>
      )}

      {activeTab === "ingredients" && (
        <p className="text-gray-600">
          Water, Glycerin, Retinol, Vitamin E, Aloe Vera
        </p>
      )}

      {activeTab === "usage" && (
        <p className="text-gray-600">
          Apply before bedtime on clean skin.
        </p>
      )}

      {activeTab === "reviews" && (
        <p className="text-gray-600">
          ⭐ 4.8 average rating from 124 customers
        </p>
      )}

    </div>

  );

}

export default ProductTabs;