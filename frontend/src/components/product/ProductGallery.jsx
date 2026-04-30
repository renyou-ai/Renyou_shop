import PropTypes from "prop-types";

function ProductGallery({ product, selectedImage, setSelectedImage }) {

  const thumbnails = [
    { id: "img1", src: product.image },
    { id: "img2", src: product.image },
    { id: "img3", src: product.image },
    { id: "img4", src: product.image },
  ];

  return (

    <div>

      {/* IMAGE PRINCIPALE */}
      <div className="bg-white rounded-xl p-10 flex justify-center">

        <img
          src={`/products/${selectedImage}`}
          alt={product.name}
          className="h-96 object-contain"
        />

      </div>

      {/* MINIATURES */}
      <div className="flex gap-4 mt-4">

        {thumbnails.map((img) => (

          <button
            key={img.id}
            onClick={() => setSelectedImage(img.src)}
            className={`border rounded p-1 ${
              selectedImage === img.src
                ? "border-orange-500"
                : "border-gray-200"
            }`}
          >
            <img
              src={`/products/${img.src}`}
              alt={product.name}
              className="w-24 h-24 object-cover rounded"
            />
          </button>

        ))}

      </div>

    </div>

  );

}

/* ✅ VALIDATION DES PROPS */
ProductGallery.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  selectedImage: PropTypes.string.isRequired,
  setSelectedImage: PropTypes.func.isRequired,
};

export default ProductGallery;