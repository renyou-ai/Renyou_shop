import ProductCard from "./ProductCard";

function ProductGrid({ products }) {

  if (!products || products.length === 0) {

    return (

      <div className="text-center py-20 text-gray-400">

        No products found

      </div>

    );

  }

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

      {products.map((product) => (

        <ProductCard
          key={product._id}
          product={product}
        />

      ))}

    </div>

  );

}

export default ProductGrid;