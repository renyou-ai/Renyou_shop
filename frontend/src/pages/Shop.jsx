import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import SearchHeader from "../components/SearchHeader";
import Breadcrumb from "../components/Breadcrumb";
import FilterSidebar from "../components/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";

import { getProducts } from "../api/products.api";

function Shop() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  /* NEW: filters state */
  const [filters, setFilters] = useState({});

  const productsPerPage = 9;

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setLoading(true);

        /* NEW: pass filters to backend */
        const data = await getProducts(filters);

        setProducts(data);

      } catch (error) {

        console.error("Error fetching products:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  /* NEW: refetch when filters change */
  }, [filters]);

  /* Pagination */

  const indexOfLastProduct = currentPage * productsPerPage;

  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  return (

    <div className="bg-white min-h-screen flex flex-col">

      {/* Header navigation */}
      <Navbar />

      {/* Search header */}
      <SearchHeader />

      {/* Main content */}
      <div className="max-w-7xl mx-auto w-full px-6 py-10 flex flex-col lg:flex-row gap-12 flex-1">

        {/* Sidebar filters */}

        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
        />

        {/* Products section */}
        <div className="flex-1">

          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Title + sorting */}
          <div className="flex justify-between items-center mb-6">

            <h1 className="text-3xl font-bold text-[#0B1A2B]">
              Vitamins & Supplements
            </h1>

            <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white">

              <option>
                Most Popular
              </option>

              <option>
                Price: Low to High
              </option>

              <option>
                Price: High to Low
              </option>

            </select>

          </div>

          {/* Showing results */}
          <p className="text-sm text-gray-500 mb-8">

            Showing {indexOfFirstProduct + 1} -
            {Math.min(indexOfLastProduct, products.length)} of {products.length} results

          </p>

          {/* Product grid */}
          {loading ? (

            <div className="text-center py-20 text-gray-500">
              Loading products...
            </div>

          ) : (

            <>
              <ProductGrid products={currentProducts} />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </>

          )}

        </div>

      </div>

      {/* Footer */}
      <Footer />

    </div>

  );

}

export default Shop;