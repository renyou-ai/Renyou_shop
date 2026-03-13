import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import SearchHeader from "../components/SearchHeader";
import Footer from "../components/Footer";

import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import ProductTabs from "../components/ProductTabs";
import RelatedProducts from "../components/RelatedProducts";

import { getProductById } from "../api/products.api";

function ProductDetails() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const data = await getProductById(id);

        setProduct(data);
        setSelectedImage(data.image);

      } catch (error) {

        console.error("Error fetching product:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);



  if (loading) {
    return (
      <div className="text-center py-20">
        Loading product...
      </div>
    );
  }

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
      <SearchHeader />

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Breadcrumb */}

        <p className="text-sm text-gray-500 mb-6">

          Home / Skincare / Treatments /
          <span className="text-blue-500 ml-2">
            {product.name}
          </span>

        </p>


        {/* PRODUCT MAIN GRID */}

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
          />

        </div>


        {/* TABS */}

        <ProductTabs
          product={product}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />


        {/* RELATED PRODUCTS */}

        <RelatedProducts />

      </div>

      <Footer />

    </div>

  );

}

export default ProductDetails;