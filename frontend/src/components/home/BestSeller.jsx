import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/api/products.api";

export default function BestSeller() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts({ sort: "newest", limit: 4 });
        setProducts(data);
      } catch (err) {
        console.error("BestSeller error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="px-10 py-12">

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-[#0B2545]">
          Best Sellers
        </h2>

        <button
          onClick={() => navigate("/shop")}
          className="text-[#FF7F50] text-sm hover:underline"
        >
          View All Products
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

    </section>
  );
}