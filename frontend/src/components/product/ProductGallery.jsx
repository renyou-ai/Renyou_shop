import PropTypes from "prop-types";

function ProductGallery({ product, selectedImage, setSelectedImage }) {

  const images = product.images?.length
    ? product.images
    : product.image
    ? [product.image]
    : ["/images/placeholder.png"];

  const formatImage = (img) => {
    if (!img) return "/images/placeholder.png";

    return img.startsWith("http")
      ? img
      : `http://localhost:5000${img}`;
  };

  return (
    <div>

      {/* IMAGE PRINCIPALE */}
      <div className="bg-white rounded-xl p-10 flex justify-center">
        <img
          src={formatImage(selectedImage)}
          alt={product.name}
          className="h-96 object-contain"
        />
      </div>

      {/* MINIATURES */}
      <div className="flex gap-4 mt-4">

        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(img)}
            className={`border rounded p-1 ${
              selectedImage === img
                ? "border-orange-500"
                : "border-gray-200"
            }`}
          >
            <img
              src={formatImage(img)}
              alt={product.name}
              className="w-24 h-24 object-cover rounded"
            />
          </button>
        ))}

      </div>

    </div>
  );
}

ProductGallery.propTypes = {
  product: PropTypes.object.isRequired,
  selectedImage: PropTypes.string,
  setSelectedImage: PropTypes.func.isRequired,
};

export default ProductGallery;