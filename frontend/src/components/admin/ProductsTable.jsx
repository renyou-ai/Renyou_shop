import PropTypes from "prop-types";

const STATUS_STYLE = {
  active: "bg-green-100 text-green-700",
  draft: "bg-gray-100 text-gray-500",
};

export default function ProductsTable({ products, onEdit, onDelete }) {
  if (!products.length)
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-5xl mb-4">📦</p>
        <p className="font-medium">No products found</p>
        <p className="text-sm">
          Try adjusting your filters or add a new product.
        </p>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
            <th className="pb-3 pl-2">Product</th>
            <th className="pb-3">Category</th>
            <th className="pb-3">Price</th>
            <th className="pb-3">Stock</th>
            <th className="pb-3">Status</th>
            <th className="pb-3 text-right pr-2">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {products.map((p) => {
            // 🔥 priorité aux images multiples
            const mainImage =
              p.images?.[0] || p.image || "https://placehold.co/48x48?text=?";

            return (
              <tr key={p._id} className="hover:bg-gray-50 transition">

                {/* PRODUCT */}
                <td className="py-4 pl-2">
                  <div className="flex items-center gap-3">

                    {/* IMAGE + COUNT */}
                    <div className="relative">
                      <img
                        src={mainImage}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                      />

                      {/* 🔥 badge nombre images */}
                      {p.images?.length > 1 && (
                        <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          +{p.images.length}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-gray-800 line-clamp-1">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {p.brand || "—"}
                      </p>
                    </div>
                  </div>
                </td>


                {/* CATEGORY */}
<td className="py-4">
  <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
    {p.category?.name || "—"}
  </span>
</td>
                {/* PRICE */}
                <td className="py-4">
                  <p className="font-semibold text-gray-800">
                    ${Number(p.price || 0).toFixed(2)}
                  </p>

                  {p.salePrice > 0 && (
                    <p className="text-xs text-orange-400">
                      Sale: ${Number(p.salePrice).toFixed(2)}
                    </p>
                  )}
                </td>

                {/* STOCK */}
                <td className="py-4">
                  <span
                    className={`font-medium ${
                      p.stock === 0
                        ? "text-red-500"
                        : p.stock < 20
                        ? "text-orange-500"
                        : "text-gray-700"
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>

                {/* STATUS */}
                <td className="py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      STATUS_STYLE[p.status] || STATUS_STYLE.draft
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="py-4 pr-2 text-right">
                  <button
                    onClick={() => onEdit(p)}
                    className="text-indigo-500 hover:text-indigo-700 font-medium mr-3 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(p)}
                    className="text-red-400 hover:text-red-600 font-medium transition"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

ProductsTable.propTypes = {
  products: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};