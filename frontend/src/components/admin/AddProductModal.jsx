import {
  useState,
  useEffect,
} from "react";

import PropTypes from "prop-types";

import {
  uploadImage,
} from "@/api/products.api";

import {
  getCategories,
} from "@/api/categories.api";

const EMPTY = {
  name: "",
  brand: "",
  category: "",
  description: "",
  price: "",
  salePrice: "",
  stock: "",
  images: [],
  status: "draft",
};

export default function AddProductModal({
  product,
  onClose,
  onSave,
}) {

  const [form, setForm] =
    useState(EMPTY);

  const [categories, setCategories] =
    useState([]);

  const [images, setImages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================
     LOAD CATEGORIES
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
            "fetchCategories:",
            err
          );

          setCategories([]);
        }
      };

    fetchCategories();

  }, []);

  /* =========================
     LOAD PRODUCT
  ========================= */
  useEffect(() => {

    if (product) {

      setForm({

        name:
          product.name || "",

        brand:
          product.brand || "",

        category:
        product.category?._id ||
        product.category ||
        "",

        description:
          product.description || "",

        price:
          product.price || "",

        salePrice:
          product.salePrice || "",

        stock:
          product.stock || "",

        images:
          product.images || [],

        status:
          product.status || "draft",
      });

      setImages(
        product.images || []
      );

    } else {

      setForm(EMPTY);

      setImages([]);
    }

  }, [product]);

  /* =========================
     INPUT CHANGE
  ========================= */
  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     IMAGE UPLOAD
  ========================= */
  const handleUpload =
    async (files) => {

      const fileArray =
        Array.from(files);

      setUploading(true);

      try {

        const uploaded =
          await Promise.all(

            fileArray.map(
              (file) =>
                uploadImage(file)
            )
          );

        setImages((prev) => [
          ...prev,
          ...uploaded,
        ]);

      } catch (err) {

        console.error(
          "upload error:",
          err
        );

      } finally {

        setUploading(false);
      }
    };

  const handleFileChange =
    (e) => {

      handleUpload(
        e.target.files
      );
    };

  const removeImage =
    (index) => {

      setImages(

        images.filter(
          (_, i) =>
            i !== index
        )
      );
    };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        !form.name ||
        !form.price ||
        !form.category
      ) {

        setError(
          "Name, category and price are required."
        );

        return;
      }

      setLoading(true);

      try {

        await onSave({

          ...form,

          images,

          price:
            Number(form.price),

          salePrice:
            Number(
              form.salePrice
            ) || 0,

          stock:
            Number(form.stock) || 0,
        });

        onClose();

      } catch (err) {

        setError(

          err.response?.data
            ?.message ||

          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      className="fixed inset-0 z-50
                 flex items-center justify-center
                 bg-black/40 p-4"
    >

      <div
        className="bg-white rounded-3xl
                   w-full max-w-2xl
                   max-h-[90vh]
                   overflow-y-auto shadow-2xl"
      >

        {/* HEADER */}
        <div
          className="flex items-center
                     justify-between
                     p-6 border-b"
        >

          <h2 className="text-xl font-semibold">

            {product
              ? "Edit Product"
              : "Add Product"}

          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-black"
          >
            ×
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {error && (

            <div className="text-sm text-red-500">

              {error}

            </div>
          )}

          <div className="grid grid-cols-2 gap-5">

            {/* LEFT */}
            <div className="space-y-4">

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product name"
                className="input-field"
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input-field"
              >

                <option value="">
                  Select category
                </option>

                {categories.map(
                  (category) => (

                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  )
                )}

              </select>

              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Brand"
                className="input-field"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="input-field min-h-[120px]"
              />

            </div>

            {/* RIGHT */}
            <div className="space-y-4">

              {/* UPLOAD */}
              <div
                className="border-2 border-dashed
                           rounded-2xl p-5 text-center"
              >

                {uploading ? (

                  <p className="text-gray-400">
                    Uploading...
                  </p>

                ) : (

                  <>

                    <p className="text-gray-400 mb-3">
                      Upload product images
                    </p>

                    <input
                      type="file"
                      multiple
                      onChange={
                        handleFileChange
                      }
                    />

                  </>
                )}

              </div>

              {/* PREVIEW */}
              <div className="grid grid-cols-3 gap-2">

                {images.map(
                  (img, i) => (

                    <div
                      key={i}
                      className="relative"
                    >

                      <img
                        src={img}
                        alt=""
                        className="w-full h-24 object-cover rounded-xl"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(i)
                        }
                        className="absolute top-1 right-1
                                   bg-black/60 text-white
                                   text-xs px-1 rounded"
                      >
                        ✕
                      </button>

                    </div>
                  )
                )}

              </div>

              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="input-field"
              />

              <input
                name="salePrice"
                value={form.salePrice}
                onChange={handleChange}
                placeholder="Sale price"
                className="input-field"
              />

              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="input-field"
              />

            </div>

          </div>
          <select
  name="status"
  value={form.status}
  onChange={handleChange}
  className="input-field"
>

  <option value="draft">
    Draft
  </option>

  <option value="active">
    Active
  </option>

</select>
          <button
            type="submit"
            disabled={
              loading ||
              uploading
            }
            className="bg-[#4a46a0]
                       text-white
                       px-6 py-2.5
                       rounded-xl
                       hover:opacity-90
                       transition"
          >

            {loading
              ? "Saving..."
              : "Save Product"}

          </button>

        </form>

      </div>

    </div>
  );
}

AddProductModal.propTypes = {

  product:
    PropTypes.object,

  onClose:
    PropTypes.func,

  onSave:
    PropTypes.func,
};