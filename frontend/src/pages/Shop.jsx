import { useEffect, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/ui/Pagination";
import Footer from "@/components/layout/Footer";
import { getProducts } from "../api/products.api";

function Shop() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  /* NEW: filters state */
  const [filters, setFilters] = useState({});

  // 🔥 AJOUT
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const productsPerPage = 9;

  // 🔥 AJOUT : reset page quand filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, search, sort]);

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setLoading(true);

        /* NEW: pass filters to backend */
        const data = await getProducts({
          ...filters,
          search, // 🔥 AJOUT
          sort,   // 🔥 AJOUT
        });

        setProducts(data);

      } catch (error) {

        console.error("Error fetching products:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  /* NEW: refetch when filters change */
  }, [filters, search, sort]);

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

      {/* ✅ NAVBAR AJOUTÉE ICI */}
      <Navbar setSearch={setSearch} /> {/* 🔥 AJOUT */}

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

            {/* 🔥 CONNECT SORT */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
            >
              <option value="">
                Most Popular
              </option>

              <option value="price_asc">
                Price: Low to High
              </option>

              <option value="price_desc">
                Price: High to Low
              </option>

              <option value="newest">
                Newest
              </option>

            </select>

          </div>

          {/* Showing results */}
          <p className="text-sm text-gray-500 mb-8">

            Showing {indexOfFirstProduct + 1} -
            {Math.min(indexOfLastProduct, products.length)} of {products.length} results

          </p>

          {/* 🔥 AJOUT : aucun produit */}
          {!loading && products.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No products found
            </div>
          )}

          {/* Product grid */}
          {loading ? (

            <div className="text-center py-20 text-gray-500">
              Loading products...
            </div>

          ) : (

            <>
              <ProductGrid products={currentProducts} />

              {/* 🔥 AJOUT : pagination seulement si utile */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              )}
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