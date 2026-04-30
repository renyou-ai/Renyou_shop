import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";

import { getProductById } from "@/api/products.api";
import { useCart } from "@/context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  // 🔥 FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);

        if (!data) return;

        setProduct(data);
        setSelectedImage(data.image || "/images/placeholder.png");
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🟢 ADD TO CART AVEC QTY
  const handleAddToCart = async () => {
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product);
      }
    } catch (err) {
      console.error("Cart error:", err);
    }
  };

  // 🔄 LOADING STATE
  if (loading) {
    return (
      <div className="text-center py-20">
        Loading product...
      </div>
    );
  }

  // ❌ NOT FOUND
  if (!product) {
    return (
      <div className="text-center py-20">
        Product not found
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5FF] min-h-screen flex flex-col">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <p className="text-sm text-gray-500 mb-6">
          Home / Skincare / Treatments /
          <span className="text-blue-500 ml-2">
            {product?.name || "Product"}
          </span>
        </p>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-12">

          <ProductGallery
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          <ProductInfo
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart} // 🔥 ajouté
          />

        </div>

        {/* TABS */}
        <ProductTabs
          product={product}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* RELATED */}
        <RelatedProducts category={product.category} />

      </div>

      <Footer />

    </div>
  );
}

export default ProductDetails;