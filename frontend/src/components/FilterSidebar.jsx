function FilterSidebar({ filters, setFilters }) {

  return (

    <div className="w-64 space-y-10 text-[#0B1A2B]">

      {/* CATEGORY */}

      <div>

        <h3 className="font-semibold mb-4">
          Category
        </h3>

        <ul className="space-y-2 text-gray-600">

          <li onClick={() => setFilters({ ...filters, category: "multivitamins" })} className="cursor-pointer hover:text-purple-600">
            Multivitamins
          </li>

          <li onClick={() => setFilters({ ...filters, category: "vitamin-c" })} className="cursor-pointer hover:text-purple-600">
            Vitamin C
          </li>

          <li onClick={() => setFilters({ ...filters, category: "vitamin-d" })} className="cursor-pointer hover:text-purple-600">
            Vitamin D
          </li>

          <li onClick={() => setFilters({ ...filters, category: "minerals" })} className="cursor-pointer hover:text-purple-600">
            Minerals
          </li>

        </ul>

      </div>


      {/* BRAND */}

      <div>

        <h3 className="font-semibold mb-4">
          Brand
        </h3>

        <ul className="space-y-2 text-gray-600">

          <li onClick={() => setFilters({ ...filters, brand: "centrum" })} className="cursor-pointer hover:text-purple-600">
            Centrum
          </li>

          <li onClick={() => setFilters({ ...filters, brand: "nature-made" })} className="cursor-pointer hover:text-purple-600">
            Nature Made
          </li>

          <li onClick={() => setFilters({ ...filters, brand: "solgar" })} className="cursor-pointer hover:text-purple-600">
            Solgar
          </li>

          <li onClick={() => setFilters({ ...filters, brand: "now-foods" })} className="cursor-pointer hover:text-purple-600">
            NOW Foods
          </li>

        </ul>

      </div>


      {/* PRICE RANGE */}

      <div>

        <h3 className="font-semibold mb-4">
          Price Range
        </h3>

        <input
          type="range"
          min="0"
          max="100"
          className="w-full"
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: e.target.value })
          }
        />

        <div className="flex justify-between text-sm text-gray-500 mt-2">

          <span>$0</span>
          <span>$100</span>

        </div>

      </div>


      {/* RATING */}

      <div>

        <h3 className="font-semibold mb-4">
          Rating
        </h3>

        <div className="space-y-2 text-yellow-400">

          <div onClick={() => setFilters({ ...filters, rating: 4 })} className="cursor-pointer">
            ⭐⭐⭐⭐ & up
          </div>

          <div onClick={() => setFilters({ ...filters, rating: 3 })} className="cursor-pointer">
            ⭐⭐⭐ & up
          </div>

        </div>

      </div>

    </div>

  );

}

export default FilterSidebar;