import { useState, useEffect, useCallback } from "react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/products.api";

import {
  getCategories,
  createCategory,
  deleteCategory,
} from "@/api/categories.api";

import ProductsTable from "@/components/admin/ProductsTable";
import AddProductModal from "@/components/admin/AddProductModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  const [showAdd, setShowAdd] = useState(false);

  const [editProduct, setEditProduct] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [delLoading, setDelLoading] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  /* =========================
     FETCH CATEGORIES
  ========================= */
  const fetchCategories = async () => {
    try {

      const data = await getCategories();

      setCategories(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error("❌ fetchCategories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* =========================
     ADD CATEGORY
  ========================= */
  const handleAddCategory = async () => {

    if (!newCategory.trim()) return;

    try {

      await createCategory({
        name: newCategory,
      });

      setNewCategory("");

      fetchCategories();

    } catch (err) {

      console.error("❌ createCategory:", err);
    }
  };
const handleDeleteCategory = async (id) => {

  try {

    await deleteCategory(id);

    if (filterCat !== "All") {
      setFilterCat("All");
    }

    fetchCategories();

    fetchProducts();

  } catch (err) {

    console.error(
      "❌ deleteCategory:",
      err
    );
  }
};
  /* =========================
     FETCH PRODUCTS
  ========================= */
  const fetchProducts = useCallback(async () => {

    setLoading(true);

    try {

      const params = {};
      params.admin = true;

      if (filterCat !== "All") {
        params.category = filterCat;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const data = await getProducts(params);

      setProducts(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error("❌ fetchProducts:", err);

      setProducts([]);

    } finally {

      setLoading(false);
    }

  }, [search, filterCat]);

  useEffect(() => {

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);

  }, [fetchProducts]);

  /* =========================
     CREATE / UPDATE
  ========================= */
  const handleSave = async (formData) => {

    if (editProduct) {

      await updateProduct(
        editProduct._id,
        formData
      );

    } else {

      await createProduct(formData);
    }

    setEditProduct(null);

    fetchProducts();
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async () => {

    setDelLoading(true);

    try {

      await deleteProduct(deleteTarget._id);

      setDeleteTarget(null);

      fetchProducts();

    } finally {

      setDelLoading(false);
    }
  };

  return (

    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <AdminSidebar collapsed={collapsed} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <AdminTopbar
          onToggle={() =>
            setCollapsed(!collapsed)
          }
        />

        {/* CONTENT */}
        <div className="p-8">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">

            <div>

              <h1 className="text-2xl font-semibold text-[#0B2545]">
                Product Management
              </h1>

              <p className="text-sm text-gray-400 mt-1">
                {(products?.length || 0)} product
                {products?.length !== 1 ? "s" : ""}
                {" "}found
              </p>

            </div>

            <button
              onClick={() => {
                setEditProduct(null);
                setShowAdd(true);
              }}
              className="bg-[#3D2C8D] hover:bg-[#2d1f6e]
                         text-white px-5 py-2.5 rounded-xl
                         text-sm font-medium flex items-center
                         gap-2 transition"
            >
              <span className="text-lg leading-none">
                +
              </span>

              Add Product
            </button>

          </div>

          {/* ADD CATEGORY */}
          <div className="flex gap-3 mb-5">

            <input
              value={newCategory}
              onChange={(e) =>
                setNewCategory(e.target.value)
              }
              placeholder="New category..."
              className="border border-gray-200 rounded-xl
                         px-4 py-2 text-sm bg-white"
            />

            <button
              onClick={handleAddCategory}
              className="bg-[#3D2C8D] text-white
                         px-4 rounded-xl text-sm"
            >
              Add Category
            </button>

          </div>

          {/* FILTERS */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">

            {/* SEARCH */}
            <div className="relative flex-1 max-w-sm">

              <span className="absolute left-3 top-2.5 text-gray-400 text-base">
                🔍
              </span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by name or brand..."
                className="w-full border border-gray-200
                           rounded-xl pl-9 pr-4 py-2.5
                           text-sm bg-white
                           focus:outline-none
                           focus:ring-2
                           focus:ring-indigo-300"
              />

              {search && (

                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2.5
                             text-gray-300 hover:text-gray-500
                             text-lg"
                >
                  ×
                </button>

              )}

            </div>

            {/* CATEGORY FILTERS */}
            <div className="flex gap-2 flex-wrap">

              <button
                onClick={() => setFilterCat("All")}
                className={`px-4 py-2 rounded-xl
                  text-sm font-medium transition
                  ${
                    filterCat === "All"
                      ? "bg-[#3D2C8D] text-white"
                      : "bg-white border border-gray-200 text-gray-500"
                  }`}
              >
                All
              </button>

              {categories.map((c) => (

  <div
    key={c._id}
    className="flex items-center gap-1"
  >

    <button
      onClick={() =>
        setFilterCat(c.name)
      }
      className={`px-4 py-2 rounded-xl
        text-sm font-medium transition
        ${
          filterCat === c.name
            ? "bg-[#3D2C8D] text-white"
            : "bg-white border border-gray-200 text-gray-500 hover:border-indigo-300"
        }`}
    >
      {c.name}
    </button>

    <button
      onClick={() =>
        handleDeleteCategory(c._id)
      }
      className="text-red-500 hover:text-red-700 text-sm"
    >
      ✕
    </button>

  </div>

))}
            </div>

          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl shadow-sm p-6">

            {loading ? (

              <div className="space-y-4 animate-pulse">

                {[...Array(5)].map((_, i) => (

                  <div
                    key={i}
                    className="flex items-center gap-4"
                  >

                    <div className="w-12 h-12 bg-gray-100 rounded-xl" />

                    <div className="flex-1 space-y-2">

                      <div className="h-3 bg-gray-100 rounded w-1/3" />

                      <div className="h-3 bg-gray-100 rounded w-1/5" />

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <ProductsTable
                products={products || []}
                onEdit={(p) => {
                  setEditProduct(p);
                  setShowAdd(true);
                }}
                onDelete={(p) =>
                  setDeleteTarget(p)
                }
              />

            )}

          </div>

        </div>

      </div>

      {/* MODALS */}
      {showAdd && (

        <AddProductModal
          product={editProduct}
          onClose={() => {
            setShowAdd(false);
            setEditProduct(null);
          }}
          onSave={handleSave}
        />

      )}

      {deleteTarget && (

        <DeleteConfirmModal
          product={deleteTarget}
          onClose={() =>
            setDeleteTarget(null)
          }
          onConfirm={handleDelete}
          loading={delLoading}
        />

      )}

    </div>
  );
}