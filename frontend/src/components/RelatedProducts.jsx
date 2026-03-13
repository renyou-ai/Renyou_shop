import { useEffect, useState } from "react";
import { getProducts } from "../api/products.api";
import ProductCard from "./ProductCard";

function RelatedProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const data = await getProducts();

        setProducts(data.slice(0, 4));

      } catch (err) {

        console.error(err);
        setError("Failed to load products");

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  }, []);

  if (loading) {

    return (
      <div className="text-center py-20 text-gray-500">
        Loading related products...
      </div>
    );

  }

  if (error) {

    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );

  }

  return (

    <div className="mt-16">

      <h2 className="text-2xl font-bold mb-8">
        Frequently Bought Together
      </h2>

      <div className="grid md:grid-cols-4 gap-6">

        {products.map((product) => (

          <ProductCard
            key={product._id}
            product={product}
          />

        ))}

      </div>

    </div>

  );

}

export default RelatedProducts;