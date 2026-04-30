import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/api/products.api";

export default function ProductList({ title }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts({ sort: "newest", limit: 4 });
        setProducts(data);
      } catch (err) {
        console.error("ProductList error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="px-10 py-10">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>

        <span className="text-orange-400 text-sm cursor-pointer hover:underline">
          Shop New
        </span>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

    </section>
  );
}