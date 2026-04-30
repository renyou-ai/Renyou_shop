import PropTypes from "prop-types";

function FilterSidebar({ filters, setFilters }) {

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return (
    <div className="w-64 space-y-10 text-[#0B1A2B]">

      {/* RESET */}
      <button
        onClick={resetFilters}
        className="text-sm text-red-500 underline"
      >
        Clear Filters
      </button>

      {/* CATEGORY */}
      <div>
        <h3 className="font-semibold mb-4">Category</h3>

        <div className="space-y-2 text-gray-600">

          {[
            { label: "Multivitamins", value: "multivitamins" },
            { label: "Vitamin C", value: "vitamin-c" },
            { label: "Vitamin D", value: "vitamin-d" },
            { label: "Minerals", value: "minerals" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => updateFilter("category", item.value)}
              className={`block text-left hover:text-purple-600 ${
                filters.category === item.value ? "text-purple-600 font-medium" : ""
              }`}
            >
              {item.label}
            </button>
          ))}

        </div>
      </div>

      {/* BRAND */}
      <div>
        <h3 className="font-semibold mb-4">Brand</h3>

        <div className="space-y-2 text-gray-600">

          {[
            { label: "Centrum", value: "centrum" },
            { label: "Nature Made", value: "nature-made" },
            { label: "Solgar", value: "solgar" },
            { label: "NOW Foods", value: "now-foods" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => updateFilter("brand", item.value)}
              className={`block text-left hover:text-purple-600 ${
                filters.brand === item.value ? "text-purple-600 font-medium" : ""
              }`}
            >
              {item.label}
            </button>
          ))}

        </div>
      </div>

      {/* PRICE */}
      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>

        <input
          type="number"
          placeholder="Min price"
          className="w-full mb-2 border p-2 rounded"
          onChange={(e) => updateFilter("minPrice", e.target.value)}
        />

        <input
          type="range"
          min="0"
          max="100"
          className="w-full"
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
        />

        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>$0</span>
          <span>$100</span>
        </div>
      </div>

      {/* RATING */}
      <div>
        <h3 className="font-semibold mb-4">Rating</h3>

        <div className="space-y-2 text-yellow-400">

          <button
            onClick={() => updateFilter("rating", 4)}
            className={`block text-left ${
              filters.rating === 4 ? "font-semibold text-yellow-500" : ""
            }`}
          >
            ⭐⭐⭐⭐ & up
          </button>

          <button
            onClick={() => updateFilter("rating", 3)}
            className={`block text-left ${
              filters.rating === 3 ? "font-semibold text-yellow-500" : ""
            }`}
          >
            ⭐⭐⭐ & up
          </button>

        </div>
      </div>

    </div>
  );
}

FilterSidebar.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
};

export default FilterSidebar;