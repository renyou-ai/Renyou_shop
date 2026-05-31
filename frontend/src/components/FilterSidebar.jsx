import {
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  getCategories,
} from "@/api/categories.api";

function FilterSidebar({
  filters,
  setFilters,
}) {

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH CATEGORIES
  ========================= */
  useEffect(() => {

    const fetchCategories =
      async () => {

        try {

          const data =
            await getCategories();

          setCategories(
            Array.isArray(data)
              ? data
              : []
          );

        } catch (err) {

          console.error(
            "❌ fetchCategories:",
            err
          );

          setCategories([]);

        } finally {

          setLoading(false);
        }
      };

    fetchCategories();

  }, []);

  /* =========================
     TOGGLE FILTER
  ========================= */
  const toggleFilter = (
    key,
    value
  ) => {

    const current =
      Array.isArray(filters[key])
        ? filters[key]
        : [];

    let updated;

    if (
      current.includes(value)
    ) {

      updated =
        current.filter(
          (v) => v !== value
        );

    } else {

      updated = [
        ...current,
        value,
      ];
    }

    setFilters((prev) => ({
      ...prev,
      [key]: updated,
    }));
  };

  /* =========================
     RESET FILTERS
  ========================= */
  const resetFilters = () => {

    setFilters({});
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {

    return (

      <div
        className="w-72 shrink-0
                   border-r border-gray-100
                   pr-8"
      >

        <div className="animate-pulse space-y-5">

          <div className="h-6 w-24 bg-gray-100 rounded" />

          {[...Array(6)].map((_, i) => (

            <div
              key={i}
              className="flex items-center gap-3"
            >

              <div className="w-4 h-4 rounded bg-gray-100" />

              <div className="h-4 w-24 bg-gray-100 rounded" />

            </div>

          ))}

        </div>

      </div>
    );
  }

  return (

    <div
      className="w-72 shrink-0
                 border-r border-gray-100
                 pr-8"
    >

      {/* HEADER */}
      <div
        className="flex items-center
                   justify-between mb-8"
      >

        <h2 className="text-2xl font-semibold text-[#0B1A2B]">
          Filters
        </h2>

        <button
          onClick={resetFilters}
          className="text-sm text-red-500 hover:underline"
        >
          Clear
        </button>

      </div>

      {/* CATEGORY */}
      <div className="mb-10">

        <h3 className="font-semibold mb-5 text-[#0B1A2B]">
          Category
        </h3>

        <div className="space-y-4">

          {categories.length === 0 && (

            <p className="text-sm text-gray-400">
              No categories found
            </p>

          )}

          {categories.map(
            (category) => (

              <label
                key={category._id}
                className="flex items-center gap-3
                           cursor-pointer text-gray-700"
              >

                <input
                  type="checkbox"

                  checked={
                    Array.isArray(
                      filters.category
                    ) &&
                    filters.category.includes(
                      category.name
                    )
                  }

                  onChange={() =>
                    toggleFilter(
                      "category",
                      category.name
                    )
                  }

                  className="w-4 h-4 accent-[#524E8D]"
                />

                <span className="text-sm">
                  {category.name}
                </span>

              </label>
            )
          )}

        </div>

      </div>

    </div>
  );
}

FilterSidebar.propTypes = {

  filters:
    PropTypes.object.isRequired,

  setFilters:
    PropTypes.func.isRequired,
};

export default FilterSidebar;