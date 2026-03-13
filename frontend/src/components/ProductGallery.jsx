function ProductGallery({ product, selectedImage, setSelectedImage }) {

  const thumbnails = [product.image, product.image, product.image, product.image];

  return (

    <div>

      <div className="bg-white rounded-xl p-10 flex justify-center">

        <img
          src={`/products/${selectedImage}`}
          alt={product.name}
          className="h-96 object-contain"
        />

      </div>

      <div className="flex gap-4 mt-4">

        {thumbnails.map((img, index) => (

          <img
            key={index}
            src={`/products/${img}`}
            onClick={() => setSelectedImage(img)}
            className={`w-24 h-24 object-cover rounded cursor-pointer border ${
              selectedImage === img
                ? "border-orange-500"
                : "border-gray-200"
            }`}
          />

        ))}

      </div>

    </div>

  );

}

export default ProductGallery;